import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Flame, Clock, Sparkles, ShoppingBag } from 'lucide-react';

export default function HomeFeed() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeals() {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching meals:', error);
      } else {
        setMeals(data || []);
      }
      setLoading(false);
    }

    fetchMeals();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 pb-20">
      {/* Top Header */}
      <header className="bg-neutral-950 border-b border-neutral-800 p-4 sticky top-0 z-20 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold text-orange-500 tracking-wide flex items-center gap-1">
            🍲 HomePot
          </h1>
          <p className="text-xs text-neutral-400">Authentic Amma Kitchens Around You</p>
        </div>
        <button className="p-2 rounded-full bg-neutral-800 text-orange-400 hover:bg-neutral-700">
          <ShoppingBag className="w-5 h-5" />
        </button>
      </header>

      {/* Main Feed Container */}
      <main className="max-w-md mx-auto p-4 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-wider text-neutral-300 uppercase flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" /> Today's Live Menus
          </h2>
          <span className="text-xs text-orange-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Limited Portions
          </span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-neutral-400 font-medium">
            Fetching home kitchens...
          </div>
        ) : meals.length === 0 ? (
          <div className="text-center py-12 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 text-neutral-400">
            No kitchens active right now. Check back shortly!
          </div>
        ) : (
          <div className="space-y-4">
            {meals.map((meal) => (
              <div 
                key={meal.id} 
                className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg hover:border-orange-500/50 transition-all duration-200"
              >
                <div className="relative">
                  <img 
                    src={meal.image_url} 
                    alt={meal.title} 
                    className="w-full h-44 object-cover" 
                  />
                  <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border border-neutral-700">
                    {meal.is_veg ? '🟢 Pure Veg' : '🔴 Non-Veg'}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-neutral-100 text-base leading-snug">{meal.title}</h3>
                    <span className="font-extrabold text-orange-500 text-lg">₹{meal.price}</span>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed">{meal.description}</p>

                  <div className="flex justify-between items-center pt-3 border-t border-neutral-800">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-orange-950/60 text-orange-400 border border-orange-900/50 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {meal.portions_left} portions left
                    </span>
                    <button className="bg-orange-600 hover:bg-orange-500 active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md">
                      Order Meal
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}