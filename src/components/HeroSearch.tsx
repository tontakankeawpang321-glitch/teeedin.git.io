import React, { useState } from 'react';
import { Search, MapPin, SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';
import { FilterState, SortOption } from '../types';
import { THAI_PROVINCES, POPULAR_PROVINCES } from '../data/provinces';

interface HeroSearchProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters =
    filters.province !== 'all' ||
    filters.districtQuery !== '' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.hasMapOnly ||
    filters.sortBy !== 'latest';

  return (
    <div className="bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative background grid and lighting effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>แหล่งรวมประกาศขายที่ดิน ค้นหาง่าย ติดต่อตรง</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2 sm:mb-3">
            ค้นหาที่ดินทำเลทอง ทั่วประเทศไทย
          </h1>
          <p className="text-slate-300 text-xs sm:text-base font-light">
            ระบุจังหวัด อำเภอ หรือช่วงราคา เพื่อค้นหาแปลงที่ดินตรงความต้องการของคุณ
          </p>
        </div>

        {/* Main Search Panel Card */}
        <div className="bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-xl border border-white/20 text-slate-800 max-w-4xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
            
            {/* Province Select */}
            <div className="md:col-span-4 relative">
              <label className="block text-[11px] font-bold text-slate-500 mb-1 px-1 uppercase tracking-wider">
                จังหวัด
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-600 pointer-events-none" />
                <select
                  value={filters.province}
                  onChange={(e) => onFilterChange({ province: e.target.value })}
                  className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none cursor-pointer appearance-none transition-all"
                >
                  <option value="all">ทุกจังหวัด (ทั่วประเทศ)</option>
                  {THAI_PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* District / Amphoe Query */}
            <div className="md:col-span-5 relative">
              <label className="block text-[11px] font-bold text-slate-500 mb-1 px-1 uppercase tracking-wider">
                อำเภอ / เขต / คำค้นหา
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={filters.districtQuery}
                  onChange={(e) => onFilterChange({ districtQuery: e.target.value })}
                  placeholder="เช่น แม่ริม, บางพลี, ติดถนนใหญ่..."
                  className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                />
                {filters.districtQuery && (
                  <button
                    onClick={() => onFilterChange({ districtQuery: '' })}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Sort Order Selector */}
            <div className="md:col-span-3 relative">
              <label className="block text-[11px] font-bold text-slate-500 mb-1 px-1 uppercase tracking-wider">
                เรียงลำดับ
              </label>
              <div className="relative">
                <ArrowUpDown className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                <select
                  value={filters.sortBy}
                  onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
                  className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none cursor-pointer appearance-none transition-all"
                >
                  <option value="latest">ล่าสุดมาก่อน</option>
                  <option value="price_asc">ราคา: ต่ำไปสูง</option>
                  <option value="price_desc">ราคา: สูงไปต่ำ</option>
                </select>
                <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

          </div>

          {/* Advanced Controls Toggle */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 font-semibold text-slate-600 hover:text-emerald-700 p-1 rounded-lg transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'ซ่อนตัวกรองเพิ่มเติม' : 'กรองตามราคา / พิกัดแผนที่'}</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold p-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>ล้างตัวกรองทั้งหมด</span>
              </button>
            )}
          </div>

          {/* Advanced Filter Inputs */}
          {showAdvanced && (
            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">ราคาสูงสุด (บาท)</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => onFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : '' })}
                  placeholder="เช่น 10000000"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">ราคาต่ำสุด (บาท)</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => onFilterChange({ minPrice: e.target.value ? Number(e.target.value) : '' })}
                  placeholder="เช่น 1000000"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer p-2 bg-white border border-slate-200 rounded-lg w-full hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.hasMapOnly}
                    onChange={(e) => onFilterChange({ hasMapOnly: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-700">เฉพาะแปลงที่มีพิกัด GPS</span>
                </label>
              </div>
            </div>
          )}

        </div>

        {/* Quick Province Pills */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium mr-1 hidden sm:inline">จังหวัดยอดนิยม:</span>
          {POPULAR_PROVINCES.slice(0, 6).map((p) => {
            const isSelected = filters.province === p;
            return (
              <button
                key={p}
                onClick={() => onFilterChange({ province: isSelected ? 'all' : p })}
                className={`px-3 py-1 rounded-full border transition-all text-xs font-medium ${
                  isSelected
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-xs'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20 border-white/10'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
