import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = "https://atntotxztoytouvovgct.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0bnRvdHh6dG95dG91dm92Z2N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNzIyNzksImV4cCI6MjEwMzg0ODI3OX0.Wy7v0Bctjix1UGI-KRG1ElCWuzCEXkseTQsoUQHWTuA";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function LiveOrders() {
  const [isOnline, setIsOnline] = useState(true);
  const [activeSlot, setActiveSlot] = useState('Lunch');
  const [orders, setOrders] = useState([]);
  const [portionsLeft, setPortionsLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch real-time orders and inventory stock from Supabase on load and slot change
  useEffect(() => {
    fetchDashboardData();

    // Supabase Realtime Listener for instant live updates on orders & inventory
    const ordersSubscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    const inventorySubscription = supabase
      .channel('public:inventory')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersSubscription);
      supabase.removeChannel(inventorySubscription);
    };
  }, [activeSlot]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Fetch orders for the active meal slot
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('meal_slot', activeSlot.toLowerCase());

      if (ordersError) {
        console.error('Error fetching orders:', ordersError.message);
      } else {
        setOrders(ordersData || []);
      }

      // 2. Fetch live portions left for the active meal slot from your inventory table
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('inventory')
        .select('portions_left')
        .eq('meal_slot', activeSlot.toLowerCase())
        .single();

      if (inventoryError) {
        console.error('Error fetching inventory:', inventoryError.message);
      } else if (inventoryData) {
        setPortionsLeft(inventoryData.portions_left);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Order Acceptance in Supabase
  const handleAcceptOrder = async (orderId) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'Accepted' })
        .eq('id', orderId);

      if (error) {
        alert('Failed to accept order: ' + error.message);
      } else {
        // Optimistic UI state update
        setOrders(orders.map(order => order.id === orderId ? { ...order, status: 'Accepted' } : order));
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  // Dynamically compute Today's Earnings from accepted orders placed today
  const todaysEarnings = orders
    .filter(order => {
      const isToday = new Date(order.created_at).toDateString() === new Date().toDateString();
      return isToday && order.status === 'Accepted';
    })
    .reduce((sum, order) => sum + (Number(order.price) || 0), 0);

  // Count active pending orders
  const activeOrdersCount = orders.filter(o => o.status !== 'Accepted').length;

  return (
    <div className="flex flex-col gap-5 pt-2 pb-6">

      {/* Kitchen Status Toggle Bar */}
      <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-sm border border-orange-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-stone-700">Kitchen Status:</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${isOnline ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-rose-600 bg-rose-50 border-rose-200'}`}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={isOnline} 
              onChange={() => setIsOnline(!isOnline)} 
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/95 p-3 rounded-2xl shadow-sm border border-orange-100 text-center flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Active Orders</span>
          <span className="text-2xl font-extrabold text-stone-800 my-1">{activeOrdersCount}</span>
        </div>
        <div className="bg-white/95 p-3 rounded-2xl shadow-sm border border-orange-100 text-center flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Portions Left</span>
          <span className="text-2xl font-extrabold text-stone-800 my-1">{portionsLeft}</span>
        </div>
        <div className="bg-white/95 p-3 rounded-2xl shadow-sm border border-orange-100 text-center flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Today's Earnings</span>
          <span className="text-sm font-extrabold text-[#8C4A32] my-1">₹{todaysEarnings.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Meal Slots Selector */}
      <div>
        <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-2.5">Meal slots</h3>
        <div className="flex space-x-2 overflow-x-auto pb-1">
          {['Breakfast', 'Lunch', 'Dinner'].map((slot) => {
            const isActive = activeSlot === slot;
            return (
              <button
                key={slot}
                onClick={() => setActiveSlot(slot)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition ${
                  isActive 
                    ? 'bg-[#A85E45] text-white shadow-md font-bold' 
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {slot} {isActive && '(Active)'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Orders List Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-stone-800">Active Orders</h3>

        {loading ? (
          <p className="text-center text-xs text-stone-500 py-6">Connecting to live orders...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-orange-100 shadow-sm">
            <p className="text-sm font-medium text-stone-600">No active orders found for {activeSlot}.</p>
            <p className="text-xs text-stone-400 mt-1">New incoming orders will appear here automatically.</p>
          </div>
        ) : (
          orders.map((order) => {
            const isAccepted = order.status === 'Accepted';
            return (
              <div key={order.id} className="bg-white rounded-2xl p-4 shadow-md border border-orange-100 flex flex-col gap-3">
                <div className="flex items-start justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-[#8C4A32] flex items-center justify-center text-white shadow-inner overflow-hidden">
                      <i className="fa-solid fa-user text-xl mt-1 text-orange-200"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-800 text-base">{order.customer_name}</h4>
                      <p className="text-xs text-stone-400">{order.special_note || 'None'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-stone-500 font-medium bg-stone-100 px-2 py-1 rounded-md">
                      {order.created_at ? new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-stone-700 space-y-1 bg-stone-50 p-2.5 rounded-xl">
                  <p className="font-semibold text-stone-900">{order.items}</p>
                  <p className="text-xs text-stone-500 mt-1">Delivery Type: <span className="font-medium text-stone-700">{order.delivery_type}</span></p>
                </div>

                <button 
                  onClick={() => handleAcceptOrder(order.id)}
                  disabled={isAccepted}
                  className={`w-full font-bold py-3 rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-sm ${
                    isAccepted 
                      ? 'bg-stone-300 text-stone-600 cursor-not-allowed' 
                      : 'bg-[#4C8C4A] hover:bg-[#3E733D] text-white'
                  }`}
                >
                  <span>{isAccepted ? 'Order Accepted ✓' : 'Accept Order'}</span>
                </button>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}