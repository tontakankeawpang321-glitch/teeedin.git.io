import React from 'react';
import { LandPost } from '../types';
import { MapPin, Heart, Image as ImageIcon, User, Phone } from 'lucide-react';

interface PostCardProps {
  post: LandPost;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, id: string | number) => void;
  onSelect: (post: LandPost) => void;
}

export function formatPriceThai(price: number): string {
  if (!price || isNaN(price)) return 'ไม่ระบุราคา';
  
  if (price >= 1_000_000) {
    const million = price / 1_000_000;
    const formatted = million % 1 === 0 ? million.toFixed(0) : million.toFixed(2).replace(/\.00$/, '');
    return `฿${formatted} ล้าน`;
  } else if (price >= 100_000) {
    const lakh = price / 100_000;
    const formatted = lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1);
    return `฿${formatted} แสน`;
  }
  return `฿${price.toLocaleString('th-TH')}`;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  isFavorite,
  onToggleFavorite,
  onSelect,
}) => {
  const mainImage =
    post.images && post.images.length > 0 && post.images[0].startsWith('http')
      ? post.images[0]
      : post.images && post.images.length > 0 && post.images[0].startsWith('data:image')
      ? post.images[0]
      : 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';

  const imageCount = post.images ? post.images.length : 0;

  return (
    <div
      onClick={() => onSelect(post)}
      className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-250 cursor-pointer flex flex-col overflow-hidden transform hover:-translate-y-1 h-full"
    >
      {/* Card Media Header */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={mainImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20 opacity-80 pointer-events-none"></div>

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-center pointer-events-none">
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-white/20 flex items-center gap-1 shadow-xs truncate max-w-[65%]">
            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">{post.province}</span>
          </span>

          {/* Favorite Toggle Button */}
          <button
            onClick={(e) => onToggleFavorite(e, post.id)}
            className={`pointer-events-auto w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all backdrop-blur-md shadow-md ${
              isFavorite
                ? 'bg-rose-500 text-white scale-110'
                : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-500'
            }`}
            title={isFavorite ? 'นำออกจากรายการโปรด' : 'บันทึกเป็นรายการโปรด'}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Bottom Image Overlay Indicators */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end pointer-events-none">
          <div className="bg-emerald-600/90 text-white font-extrabold text-xs sm:text-base px-2 py-0.5 sm:px-2.5 rounded-lg shadow-md border border-emerald-400/30 backdrop-blur-xs">
            {formatPriceThai(post.price)}
          </div>

          <div className="flex gap-1">
            {post.lat && post.lng && (
              <span className="bg-slate-900/80 text-emerald-400 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                GPS
              </span>
            )}
            {imageCount > 1 && (
              <span className="bg-black/60 text-white text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1 backdrop-blur-xs">
                <ImageIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {imageCount}
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Card Content */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-grow justify-between gap-2">
        
        <div>
          <h3 className="font-bold text-slate-800 text-xs sm:text-base line-clamp-2 leading-tight sm:leading-snug group-hover:text-emerald-700 transition-colors">
            {post.title}
          </h3>

          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 mt-1.5 sm:mt-2 font-medium">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {post.address ? `${post.address}, ${post.province}` : post.province}
            </span>
          </div>
        </div>

        {/* Card Footer Info & CTA */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-1 text-slate-500 truncate max-w-[90px] sm:max-w-[140px]">
            <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
            <span className="truncate font-medium">{post.contact_name || 'ผู้ขาย'}</span>
          </div>

          <span className="text-emerald-600 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
            <span className="hidden sm:inline">ดูรายละเอียด</span> →
          </span>
        </div>

      </div>
    </div>
  );
};
