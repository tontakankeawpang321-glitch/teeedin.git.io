import React from 'react';
import { Globe, Heart, Plus, RefreshCw, MapPin, Sparkles } from 'lucide-react';

interface HeaderProps {
  favoriteCount: number;
  onOpenFavorites: () => void;
  onOpenCreateModal: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  favoriteCount,
  onOpenFavorites,
  onOpenCreateModal,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center gap-4">
        
        {/* Brand Logo & Refresh */}
        <div className="flex items-center gap-3">
          <div
            onClick={onRefresh}
            className="flex items-center gap-2.5 cursor-pointer group"
            title="คลิกเพื่อรีเฟรชข้อมูล"
          >
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-all duration-200">
              <Globe className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg leading-tight tracking-tight text-slate-900">
                  Land<span className="text-emerald-600">Market</span>
                </span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200/60 hidden sm:inline-block">
                  ONLINE
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium tracking-wide">
                ศูนย์กลางซื้อขายที่ดินไทย
              </span>
            </div>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-xl transition-all hidden sm:flex items-center gap-1 text-xs font-medium"
            title="รีเฟรชประกาศ"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Feature Highlights (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>ค้นหาตามพิกัดแผนที่</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>ลงประกาศขายฟรี ไม่มีค่าธรรมเนียม</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {/* Favorites Button */}
          <button
            onClick={onOpenFavorites}
            className="relative p-2.5 rounded-xl bg-slate-100/80 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-all border border-slate-200/80 flex items-center justify-center group"
            title="ดูรายการโปรด"
          >
            <Heart className={`w-5 h-5 ${favoriteCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {favoriteCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in-50">
                {favoriteCount}
              </span>
            )}
          </button>

          {/* Create Post Button (Desktop) */}
          <button
            onClick={onOpenCreateModal}
            className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all font-medium text-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>ลงประกาศขายฟรี</span>
          </button>
        </div>

      </div>
    </header>
  );
};
