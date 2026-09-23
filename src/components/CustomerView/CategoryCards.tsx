import React from 'react';
import { Category } from '../../types';
import { Zap, Wrench, Paintbrush, Sparkles, Cog, Thermometer, Truck, Car, Utensils, Stethoscope } from 'lucide-react';

interface CategoryCardsProps {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({ categories, onSelectCategory }) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5 text-sky-500" />;
      case 'Paintbrush':
        return <Paintbrush className="w-5 h-5 text-indigo-500" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-emerald-500" />;
      case 'Cog':
        return <Cog className="w-5 h-5 text-purple-500" />;
      case 'Thermometer':
        return <Thermometer className="w-5 h-5 text-cyan-500" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-amber-600" />;
      case 'Car':
        return <Car className="w-5 h-5 text-blue-600" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-rose-500" />;
      case 'Stethoscope':
        return <Stethoscope className="w-5 h-5 text-teal-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Service Specialists
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tap any specialist to describe your issue and connect instantly
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((cat) => {
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className="group relative flex flex-col bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 hover:border-indigo-500/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden text-left cursor-pointer transform hover:-translate-y-1.5 focus:outline-hidden focus:ring-4 focus:ring-indigo-100"
            >
              {/* Character Visual Stage */}
              <div className="relative w-full aspect-4/3 bg-radial from-slate-100 via-slate-50 to-white overflow-hidden flex items-center justify-center p-2 sm:p-3">
                {cat.characterImage ? (
                  <img
                    src={cat.characterImage}
                    alt={cat.name}
                    className="w-full h-full object-contain rounded-xl sm:rounded-2xl transition-transform duration-500 group-hover:scale-108 drop-shadow-md"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    {getCategoryIcon(cat.icon)}
                  </div>
                )}

                {/* Animated Trade Indicator Badge */}
                <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2 py-1 rounded-full border border-slate-200 shadow-xs flex items-center gap-1.5 z-10">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Ready
                  </span>
                </div>
              </div>

              {/* Title & Animated Character Action */}
              <div className="p-3 sm:p-4.5 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1 rounded-lg bg-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      {getCategoryIcon(cat.icon)}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                      {cat.name}
                    </h3>
                  </div>

                  {cat.characterAction && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {cat.characterAction}
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-600 flex items-center gap-1">
                    Connect Now →
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">
                    from ${cat.basePrice || 45}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
