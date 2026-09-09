import React, { useState, useEffect } from 'react';

export default function LiveOrders({ externalOrders, onUpdateOrderStatus }) {
  // Starts completely empty — no static or sample cards!
  const [orders, setOrders] = useState([]);

  // Use external orders if provided by props, otherwise use local state
  const activeOrders = externalOrders || orders;

  // Optional: Listen to external window events if orders are dispatched dynamically from elsewhere
  useEffect(() => {
    const handleNewOrderQueued = (event) => {
      const newOrder = event.detail;
      setOrders((prev) => [newOrder, ...prev]);
    };

    window.addEventListener('homepotNewOrderQueued', handleNewOrderQueued);
    return () => window.removeEventListener('homepotNewOrderQueued', handleNewOrderQueued);
  }, []);

  // Handle Accept Order
  const handleAccept = (orderId) => {
    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(orderId, 'PREPARING');
    } else {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId ? { ...ord, status: 'PREPARING' } : ord
        )
      );
    }

    // Dispatch custom event to notify ChefDashboard notification bell
    window.dispatchEvent(
      new CustomEvent('homepotOrderAction', {
        detail: {
          action: 'ACCEPTED',
          orderId: orderId,
          details: 'Order accepted and moved to kitchen prep.'
        }
      })
    );
  };

  // Handle Reject Order
  const handleReject = (orderId) => {
    const reason = prompt('Please enter reason for rejection (e.g. Sold out / Kitchen closing):');
    if (reason === null) return; // Cancelled prompt

    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(orderId, 'REJECTED');
    } else {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId ? { ...ord, status: 'REJECTED' } : ord
        )
      );
    }

    // Dispatch custom event to notify ChefDashboard notification bell
    window.dispatchEvent(
      new CustomEvent('homepotOrderAction', {
        detail: {
          action: 'REJECTED',
          orderId: orderId,
          details: `Reason: ${reason || 'Not specified'}`
        }
      })
    );
  };

  // Handle Status Progress (PREPARING -> READY -> COMPLETED)
  const handleUpdateStatus = (orderId, nextStatus) => {
    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(orderId, nextStatus);
    } else {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId ? { ...ord, status: nextStatus } : ord
        )
      );
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Header */}
      <div className="flex justify-between items-center mt-2 px-1">
        <div>
          <h2 className="text-lg font-bold text-stone-800">Live Orders</h2>
          <p className="text-[11px] text-stone-500">Manage incoming customer requests in real-time</p>
        </div>
        <span className="bg-orange-100 text-[#8C4A32] text-xs font-bold px-2.5 py-1 rounded-full">
          {activeOrders.filter((o) => o.status === 'PENDING' || o.status === 'PREPARING').length} Active
        </span>
      </div>

      {/* Dynamic Orders List */}
      <div className="flex flex-col gap-3">
        {activeOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 text-stone-400 text-xs mt-4 shadow-sm">
            <i className="fa-solid fa-bell text-3xl mb-2 text-stone-300 animate-bounce"></i>
            No new orders queued right now. Incoming customer orders will appear here automatically!
          </div>
        ) : (
          activeOrders.map((ord) => (
            <div 
              key={ord.id} 
              className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100 flex flex-col gap-3 transition-all animate-fadeIn"
            >
              {/* Top Row: Order ID & Status Badge */}
              <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 text-sm">#{ord.id}</span>
                  <span className="text-[10px] text-stone-400">• {ord.time || 'Just now'}</span>
                </div>

                {/* Status Badges */}
                {ord.status === 'PENDING' && (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
                    New Order
                  </span>
                )}
                {ord.status === 'PREPARING' && (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Preparing
                  </span>
                )}
                {ord.status === 'READY' && (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Ready for Pickup
                  </span>
                )}
                {ord.status === 'COMPLETED' && (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-stone-100 text-stone-600">
                    Completed
                  </span>
                )}
                {ord.status === 'REJECTED' && (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-rose-50 text-rose-600 border border-rose-200">
                    Rejected
                  </span>
                )}
              </div>

              {/* Customer & Slot Info */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <i className="fa-regular fa-user text-stone-400"></i> {ord.customerName}
                  </p>
                  <span className="font-extrabold text-stone-900 text-sm">₹{ord.total}</span>
                </div>
                {ord.slot && (
                  <p className="text-[11px] text-orange-800 bg-orange-50 px-2 py-0.5 rounded-md inline-block w-fit font-medium">
                    {ord.slot}
                  </p>
                )}
              </div>

              {/* Items ordered */}
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100 text-xs text-stone-700">
                <p className="font-semibold text-[11px] text-stone-500 mb-0.5">Dishes:</p>
                <p>{ord.items}</p>
              </div>

              {/* Action Buttons based on Order Status */}
              <div className="pt-1">
                {ord.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAccept(ord.id)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                    >
                      <i className="fa-solid fa-check mr-1"></i> Accept Order
                    </button>
                    <button 
                      onClick={() => handleReject(ord.id)}
                      className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      <i className="fa-solid fa-xmark mr-1"></i> Reject
                    </button>
                  </div>
                )}

                {ord.status === 'PREPARING' && (
                  <button 
                    onClick={() => handleUpdateStatus(ord.id, 'READY')}
                    className="w-full bg-[#8C4A32] hover:bg-[#783D29] text-white py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <i className="fa-solid fa-box-open mr-1"></i> Mark as Ready for Pickup
                  </button>
                )}

                {ord.status === 'READY' && (
                  <button 
                    onClick={() => handleUpdateStatus(ord.id, 'COMPLETED')}
                    className="w-full bg-stone-800 hover:bg-stone-900 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <i className="fa-solid fa-flag-checkered mr-1"></i> Complete Order
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}