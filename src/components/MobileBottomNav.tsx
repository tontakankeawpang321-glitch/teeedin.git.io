import React from 'react';
import { Home, Plus, Heart } from 'lucide-react';

interface MobileBottomNavProps {
  favoriteCount: number;
  onGoHome: () => void;
  onOpenCreate: () => void;
  onOpenFavorites: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  favoriteCount,
  onGoHome,
  onOpenCreate,
  onOpenFavorites,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-8 py-2 flex justify-between items-center sm:hidden z-40 shadow-lg">
      
      {/* Home / Refresh */}
      <button
        onClick={onGoHome}
        className="flex flex-col items-center gap-1 text-slate-500 hover:text-emerald-600 active:text-emerald-600 transition-colors"
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-semibold">หน้าแรก</span>
      </button>

      {/* Floating Center Create Button */}
      <button
        onClick={onOpenCreate}
        className="flex flex-col items-center gap-1 -mt-7"
      >
        <div className="w-13 h-13 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-600/30 active:scale-95 transition-all border-4 border-slate-50">
          <Plus className="w-6 h-6 stroke-[3]" />
        </div>
        <span className="text-[10px] font-extrabold text-emerald-700">ลงประกาศ</span>
      </button>

      {/* Favorites */}
      <button
        onClick={onOpenFavorites}
        className="relative flex flex-col items-center gap-1 text-slate-500 hover:text-rose-500 active:text-rose-500 transition-colors"
      >
        <Heart className={`w-5 h-5 ${favoriteCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
        <span className="text-[10px] font-semibold">รายการโปรด</span>
        {favoriteCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {favoriteCount}
          </span>
        )}
      </button>

    </div>
  );
};
