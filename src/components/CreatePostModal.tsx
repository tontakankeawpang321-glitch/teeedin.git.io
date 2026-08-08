import React, { useState } from 'react';
import { NewPostInput } from '../types';
import { THAI_PROVINCES } from '../data/provinces';
import { LeafletMapPicker } from './LeafletMapPicker';
import {
  X,
  Plus,
  Upload,
  Sparkles,
  MapPin,
  Phone,
  MessageCircle,
  User,
  DollarSign,
  FileText,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewPostInput) => Promise<void>;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onShowToast,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<NewPostInput>({
    title: '',
    price: '',
    province: '',
    address: '',
    contact_name: '',
    phone: '',
    line_id: '',
    body: '',
    lat: '',
    lng: '',
    images: [],
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleChange = (field: keyof NewPostInput, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 3 - form.images.length;
    if (remainingSlots <= 0) {
      onShowToast('สามารถอัปโหลดได้สูงสุด 3 รูปภาพ', 'error');
      return;
    }

    const selectedFiles = (Array.from(files) as File[]).slice(0, remainingSlots);
    
    selectedFiles.forEach((file) => {
      // Validate image size (< 5MB)
      if (file.size > 5 * 1024 * 1024) {
        onShowToast(`ไฟล์ ${file.name} มีขนาดใหญ่เกิน 5MB`, 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultStr = event.target.result as string;
          setForm((prev) => ({
            ...prev,
            images: [...prev.images, resultStr].slice(0, 3),
          }));
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input value
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const fillDemoData = () => {
    setForm({
      title: 'ขายที่ดินสวย 5 ไร่ ทำเลดี ติดถนนสาธารณะ เหมาะทำสวนและที่พักอาศัย',
      price: 2800000,
      province: 'เชียงใหม่',
      address: 'อ.แม่ริม ต.แม่แรม',
      contact_name: 'คุณสมศักดิ์',
      phone: '0819998877',
      line_id: 'somsak_land',
      body: 'ที่ดินทำเลสวย บรรยากาศดี ร่มรื่น มองเห็นวิวดอยชัดเจน มีไฟฟ้า ประปา ถนนคอนกรีตตัดผ่านหน้าแปลง พร้อมโอน น.ส.4จ. ไร้ภาระผูกพัน',
      lat: 18.9120,
      lng: 98.9450,
      images: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=80'
      ],
    });
    setValidationErrors({});
    onShowToast('ใส่ข้อมูลตัวอย่างเรียบร้อย', 'info');
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.title.trim()) errors.title = 'กรุณากรอกหัวข้อประกาศ';
    if (!form.province) errors.province = 'กรุณาเลือกจังหวัด';
    if (form.price === '' || Number(form.price) <= 0) errors.price = 'กรุณากรอกราคาขายเป็นตัวเลข';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      onShowToast('กรุณากรอกข้อมูลที่จำเป็น (*) ให้ครบถ้วน', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(form);
      onShowToast('ลงประกาศขายที่ดินสำเร็จแล้ว!', 'success');
      onClose();
    } catch (err) {
      onShowToast('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div
        className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              <span>ลงประกาศขายที่ดินฟรี</span>
            </h2>
            <p className="text-xs text-slate-500">กรอกข้อมูลที่ดินเพื่อประกาศขายบนระบบออนไลน์</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fillDemoData}
              className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full border border-amber-200 font-bold flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>เติมข้อมูลตัวอย่าง</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          
          {/* Title Field */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              หัวข้อประกาศ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="เช่น ขายที่ดินเปล่า 5 ไร่ ติดถนนใหญ่..."
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-slate-800 ${
                validationErrors.title ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
              }`}
            />
            {validationErrors.title && <p className="text-rose-500 text-xs mt-1 font-semibold">{validationErrors.title}</p>}
          </div>

          {/* Province & Price Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                จังหวัด <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.province}
                onChange={(e) => handleChange('province', e.target.value)}
                className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-slate-800 cursor-pointer ${
                  validationErrors.province ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                }`}
              >
                <option value="">-- เลือกจังหวัด --</option>
                {THAI_PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
              {validationErrors.province && <p className="text-rose-500 text-xs mt-1 font-semibold">{validationErrors.province}</p>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ราคาขายรวม (บาท) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => handleChange('price', e.target.value ? Number(e.target.value) : '')}
                  placeholder="เช่น 4500000"
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-slate-800 font-mono ${
                    validationErrors.price ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                  }`}
                />
              </div>
              {validationErrors.price && <p className="text-rose-500 text-xs mt-1 font-semibold">{validationErrors.price}</p>}
            </div>
          </div>

          {/* District / Address */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">อำเภอ / เขต / รายละเอียดที่ตั้ง</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="เช่น อ.เมือง, ถ.บางนา-ตราด กม.10..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 text-slate-800"
            />
          </div>

          {/* Interactive Map Picker Section */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <label className="block font-bold text-slate-800 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>ปักหมุดทำเลที่ดินบนแผนที่ (GPS)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-normal">ไม่บังคับ</span>
            </label>

            <LeafletMapPicker
              lat={form.lat}
              lng={form.lng}
              onChange={(newLat, newLng) => {
                handleChange('lat', newLat);
                handleChange('lng', newLng);
              }}
            />
          </div>

          {/* Contact Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ชื่อผู้ติดต่อ</label>
              <input
                type="text"
                value={form.contact_name}
                onChange={(e) => handleChange('contact_name', e.target.value)}
                placeholder="ชื่อ-นามสกุล"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">เบอร์โทรศัพท์</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="08x-xxx-xxxx"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Line ID</label>
              <input
                type="text"
                value={form.line_id}
                onChange={(e) => handleChange('line_id', e.target.value)}
                placeholder="ไอดีไลน์"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">รายละเอียดและจุดเด่นของที่ดิน</label>
            <textarea
              rows={3}
              value={form.body}
              onChange={(e) => handleChange('body', e.target.value)}
              placeholder="ระบุขนาดที่ดิน (ไร่-งาน-ตารางวา), สิ่งอำนวยความสะดวก, สถานที่ใกล้เคียง..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 text-slate-800 resize-none"
            />
          </div>

          {/* Image Upload Section */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <label className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>อัปโหลดรูปภาพที่ดิน (สูงสุด 3 รูป)</span>
              </label>
              <span className="text-[11px] font-bold text-slate-500 px-2 py-0.5 bg-slate-100 rounded-full">
                {form.images.length}/3 รูป
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {form.images.map((imgSrc, index) => (
                <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group">
                  <img src={imgSrc} alt={`รูปภาพที่ ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1.5 right-1.5 bg-rose-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    title="ลบรูปนี้"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {form.images.length < 3 && (
                <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/50 flex flex-col items-center justify-center cursor-pointer transition-all text-slate-400 hover:text-emerald-600 group">
                  <Upload className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold">เพิ่มรูปภาพ</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-100 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังลงประกาศ...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ลงประกาศขายที่ดิน</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
