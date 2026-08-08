import React from 'react';
import { LandPost } from '../types';
import { X, Heart, Trash2, ArrowRight } from 'lucide-react';
import { formatPriceThai } from './PostCard';

interface FavoritesModalProps {
  isOpen: boolean;
  favorites: LandPost[];
  onClose: () => void;
  onSelectPost: (post: LandPost) => void;
  onRemoveFavorite: (id: string | number) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  favorites,
  onClose,
  onSelectPost,
  onRemoveFavorite,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                รายการโปรดที่บันทึกไว้
              </h2>
              <p className="text-xs text-slate-500">
                {favorites.length} รายการที่ดินที่คุณสนใจ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List Content */}
        <div className="p-4 overflow-y-auto space-y-2.5 max-h-[60vh]">
          {favorites.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Heart className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
              <p className="font-medium text-sm">ยังไม่มีรายการโปรด</p>
              <p className="text-xs text-slate-400">
                กดปุ่มหัวใจ บนการ์ดที่ดินเพื่อบันทึกรายการที่คุณสนใจ
              </p>
            </div>
          ) : (
            favorites.map((post) => {
              const mainImg =
                post.images && post.images.length > 0 && post.images[0].startsWith('http')
                  ? post.images[0]
                  : 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80';

              return (
                <div
                  key={post.id}
                  className="flex items-center gap-3 p-2.5 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 rounded-2xl transition-colors cursor-pointer group"
                  onClick={() => {
                    onClose();
                    onSelectPost(post);
                  }}
                >
                  <img
                    src={mainImg}
                    alt={post.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                  />

                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-slate-800 text-xs sm:text-sm truncate group-hover:text-emerald-700">
                      {post.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {post.province} {post.address && `• ${post.address}`}
                    </p>
                    <p className="text-xs font-extrabold text-emerald-600 mt-1">
                      {formatPriceThai(post.price)}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(post.id);
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                    title="ลบออกจากรายการโปรด"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400">
          ข้อมูลรายการโปรดจะถูกบันทึกไว้ในเบราว์เซอร์ของคุณ
        </div>
      </div>
    </div>
  );
};
