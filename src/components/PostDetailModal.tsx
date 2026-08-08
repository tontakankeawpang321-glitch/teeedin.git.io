import React, { useState, useEffect } from 'react';
import { LandPost } from '../types';
import {
  X,
  MapPin,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Heart,
  Share2,
  Trash2,
  ExternalLink,
  User,
  Image as ImageIcon,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { formatPriceThai } from './PostCard';

interface PostDetailModalProps {
  post: LandPost | null;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string | number) => void;
  onOpenSlider: (index: number) => void;
  onDeletePost: (id: string | number) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  isFavorite,
  onClose,
  onToggleFavorite,
  onOpenSlider,
  onDeletePost,
  onShowToast,
}) => {
  const [copiedField, setCopiedField] = useState<'phone' | 'line' | 'link' | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
    setShowConfirmDelete(false);
  }, [post]);

  if (!post) return null;

  const images = post.images && post.images.length > 0 ? post.images : [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
  ];

  const currentMainImage = images[activeImageIndex] || images[0];

  const copyText = (text: string, type: 'phone' | 'line' | 'link', label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(
      () => {
        setCopiedField(type);
        onShowToast(`คัดลอก ${label} เรียบร้อยแล้ว`, 'success');
        setTimeout(() => setCopiedField(null), 2000);
      },
      () => {
        // Fallback for copy
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopiedField(type);
        onShowToast(`คัดลอก ${label} เรียบร้อยแล้ว`, 'success');
        setTimeout(() => setCopiedField(null), 2000);
      }
    );
  };

  const handleShare = () => {
    const url = window.location.href;
    copyText(url, 'link', 'ลิงก์ประกาศ');
  };

  const googleMapsUrl = post.lat && post.lng
    ? `https://www.google.com/maps/search/?api=1&query=${post.lat},${post.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(post.province + ' ' + post.address)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Top Action Bar */}
        <div className="absolute top-3 right-3 left-3 z-20 flex justify-between items-center pointer-events-none">
          <div className="flex gap-2 pointer-events-auto">
            <button
              onClick={() => onToggleFavorite(post.id)}
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-all ${
                isFavorite
                  ? 'bg-rose-500 text-white scale-105'
                  : 'bg-white/90 hover:bg-white text-slate-700'
              }`}
              title="บันทึกรายการโปรด"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center backdrop-blur-md shadow-md transition-all"
              title="แชร์ประกาศนี้"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="pointer-events-auto w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md shadow-md transition-all"
            aria-label="ปิด"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header Image Stage */}
        <div className="relative h-64 sm:h-80 bg-slate-900 shrink-0 group cursor-pointer" onClick={() => onOpenSlider(activeImageIndex)}>
          <img
            src={currentMainImage}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20"></div>

          {/* Price & Zoom Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white pointer-events-none">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 drop-shadow-md block">
                {formatPriceThai(post.price)}
              </span>
              <span className="text-xs text-slate-200 font-medium flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {post.province} {post.address && `• ${post.address}`}
              </span>
            </div>

            <span className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-white flex items-center gap-1.5 border border-white/20">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>แตะเพื่อดูรูปใหญ่ ({images.length})</span>
            </span>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Thumbnails Gallery Strip */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx ? 'border-emerald-500 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`ภาพที่ ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Title & Post Owner Actions */}
          <div className="flex justify-between items-start gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {post.title}
            </h2>

            <button
              onClick={() => setShowConfirmDelete(true)}
              className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors shrink-0"
              title="ลบประกาศนี้"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Confirm Delete Banner */}
          {showConfirmDelete && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-rose-800 text-xs font-semibold">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>คุณแน่ใจหรือไม่ว่าต้องการลบประกาศนี้?</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex-1 sm:flex-initial"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => onDeletePost(post.id)}
                  className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 flex-1 sm:flex-initial"
                >
                  ยืนยันลบ
                </button>
              </div>
            </div>
          )}

          {/* Contact Action Cards (Click to Copy / Call) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Phone Card */}
            {post.phone && (
              <div
                onClick={() => copyText(post.phone, 'phone', 'เบอร์โทรศัพท์')}
                className="group flex items-center p-3.5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 rounded-2xl transition-all cursor-pointer shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="ml-3 flex-grow min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">เบอร์โทรศัพท์</span>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                      {copiedField === 'phone' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'phone' ? 'คัดลอกแล้ว' : 'คัดลอก'}
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 text-sm sm:text-base truncate">{post.phone}</p>
                </div>
              </div>
            )}

            {/* Line ID Card */}
            {post.line_id && (
              <div
                onClick={() => copyText(post.line_id, 'line', 'Line ID')}
                className="group flex items-center p-3.5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 rounded-2xl transition-all cursor-pointer shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-[#06C755] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="ml-3 flex-grow min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Line ID</span>
                    <span className="text-[10px] text-[#06C755] font-bold flex items-center gap-0.5">
                      {copiedField === 'line' ? <Check className="w-3 h-3 text-[#06C755]" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'line' ? 'คัดลอกแล้ว' : 'คัดลอก'}
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 text-sm sm:text-base truncate">{post.line_id}</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Details Badges */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white text-emerald-600 border border-slate-200 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">ผู้ลงประกาศ</span>
                <span className="font-bold text-slate-800 truncate block">{post.contact_name || 'ไม่ระบุชื่อ'}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white text-emerald-600 border border-slate-200 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">ทำเลที่ตั้ง</span>
                <span className="font-bold text-slate-800 truncate block">{post.province}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>รายละเอียดที่ดิน</span>
            </h3>
            <p className="whitespace-pre-line text-sm text-slate-700 font-normal leading-relaxed">
              {post.body || 'ไม่มีรายละเอียดเพิ่มเติม'}
            </p>
          </div>

          {/* Location & Navigation Section */}
          <div className="p-4 bg-emerald-950/5 border border-emerald-500/20 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>พิกัดสถานที่จริง</span>
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>เปิดนำทาง Google Maps</span>
              </a>
            </div>

            {post.lat && post.lng ? (
              <div className="text-xs text-slate-600 font-mono bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <span>ละติจูด, ลองจิจูด: {post.lat.toFixed(5)}, {post.lng.toFixed(5)}</span>
                <button
                  onClick={() => copyText(`${post.lat},${post.lng}`, 'link', 'พิกัด GPS')}
                  className="text-emerald-700 hover:underline text-[11px] font-sans font-bold"
                >
                  ก๊อปปี้พิกัด
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                ประกาศนี้ไม่ได้ระบุหมุด GPS แบบละเอียด สามารถกดเปิด Google Maps เพื่อค้นหาทำเลคร่าวๆ
              </p>
            )}
          </div>

        </div>

        {/* Modal Bottom CTA Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-3">
          {post.phone && (
            <a
              href={`tel:${post.phone}`}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 text-center"
            >
              <Phone className="w-4 h-4" />
              <span>โทรติดต่อผู้ขาย</span>
            </a>
          )}
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
