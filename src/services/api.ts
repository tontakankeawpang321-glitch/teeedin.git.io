import { LandPost, NewPostInput } from '../types';

export const API_URL = "https://script.google.com/macros/s/AKfycbxFPLZc1F9OAG0W9KJtv7MRVb8sqOU8YX5dUrIyyKYPJHXytEpHbWGtY7qlIJ02xyP6Rg/exec";

// Initial demo data matching the user's dataset if network fails or initial load
export const DEFAULT_POSTS: LandPost[] = [
  {
    id: 'demo-101',
    title: "ขายที่ดินเปล่า 2 ไร่ วิวดอยสุเทพ เชียงใหม่ (วิวสวย ถมแล้ว)",
    price: 4500000,
    province: "เชียงใหม่",
    address: "อ.แม่ริม",
    contact_name: "คุณสมชาย",
    phone: "0812345678",
    line_id: "somchai.land",
    body: "ที่ดินสวย ถมแล้ว พร้อมสร้างบ้าน น้ำไฟเข้าถึง วิวสวยมาก บรรยากาศดี เหมาะแก่การพักผ่อน\n- หน้ากว้าง 40 เมตร\n- ติดถนนสาธารณะประโยชน์\n- โฉนด น.ส. 4 จ. ครบพร้อมโอน",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80"
    ],
    lat: 18.9080,
    lng: 98.9320,
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-102',
    title: "ขายที่ดินแปลงสวย 5 ไร่ ติดถนนใหญ่ บางนา-ตราด สมุทรปราการ",
    price: 18500000,
    province: "สมุทรปราการ",
    address: "อ.บางพลี",
    contact_name: "คุณวิภา",
    phone: "0898765432",
    line_id: "vipa_property",
    body: "ทำเลทอง ทำโกดัง คลังสินค้า หรือโครงการหมู่บ้านจัดสรร\n- ใกล้สนามบินสุวรรณภูมิ เพียง 15 นาที\n- ที่ดินสี่เหลี่ยมผืนผ้า สวยมาก\n- ไฟฟ้า 3 เฟส ประปาพร้อมใช้งาน",
    images: [
      "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
    ],
    lat: 13.6015,
    lng: 100.7020,
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-103',
    title: "ที่ดินสวนทุเรียนผลผลิตดี 10 ไร่ อ.แกลง ระยอง โฉนดพร้อมโอน",
    price: 8900000,
    province: "ระยอง",
    address: "อ.แกลง",
    contact_name: "คุณธนกฤต",
    phone: "0865551234",
    line_id: "durian_land",
    body: "สวนทุเรียนหมอนทอง 80% ให้ผลผลิตแล้ว พร้อมระบบสปริงเกอร์รดน้ำครบครัน มีสระน้ำในสวน มีบ้านพักคนงาน 1 หลัง",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
    ],
    lat: 12.7780,
    lng: 101.6500,
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-104',
    title: "ขายที่ดินติดทะเล ชะอำ-หัวหิน 1 ไร่ สัมผัสบรรยากาศชายหาดส่วนตัว",
    price: 25000000,
    province: "เพชรบุรี",
    address: "อ.ชะอำ",
    contact_name: "คุณณัฐพล",
    phone: "0823334455",
    line_id: "beachfront_land",
    body: "ที่ดินติดหน้าหาด บรรยากาศสงบ ร่มรื่น เหมาะทำพูลวิลล่า หรือรีสอร์ทส่วนตัว เอกสารสิทธิ์โฉนด น.ส.4จ. ไร้ภาระผูกพัน",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ],
    lat: 12.7980,
    lng: 99.9820,
    createdAt: new Date().toISOString()
  }
];

// Parse image field into a string array safely
export function parseImages(imgData: any): string[] {
  if (!imgData) return [];
  if (Array.isArray(imgData)) {
    return imgData.map(item => String(item).trim()).filter(Boolean);
  }
  if (typeof imgData === 'string') {
    const trimmed = imgData.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.map(item => String(item).trim()).filter(Boolean);
      } catch (e) {
        // Ignore JSON error, fallback below
      }
    }
    if (trimmed.includes(',')) {
      return trimmed.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [trimmed];
  }
  return [];
}

// Format raw backend response item into standardized LandPost
function normalizePost(item: any): LandPost {
  const images = parseImages(item.images);
  const lat = item.lat !== undefined && item.lat !== null && item.lat !== '' ? parseFloat(item.lat) : null;
  const lng = item.lng !== undefined && item.lng !== null && item.lng !== '' ? parseFloat(item.lng) : null;

  return {
    id: item.id || `post-${Math.random().toString(36).substring(2, 9)}`,
    title: item.title ? String(item.title).trim() : 'ไม่มีหัวข้อประกาศ',
    price: Number(item.price) || 0,
    province: item.province ? String(item.province).trim() : 'ไม่ระบุจังหวัด',
    address: item.address ? String(item.address).trim() : '',
    contact_name: item.contact_name ? String(item.contact_name).trim() : '',
    phone: item.phone ? String(item.phone).trim() : '',
    line_id: item.line_id ? String(item.line_id).trim() : '',
    body: item.body ? String(item.body).trim() : '',
    images,
    lat: Number.isNaN(lat) ? null : lat,
    lng: Number.isNaN(lng) ? null : lng,
    createdAt: item.createdAt || item.date || new Date().toISOString(),
  };
}

export async function fetchPosts(): Promise<LandPost[]> {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    let rawData: any[] = [];

    if (Array.isArray(data)) {
      rawData = data;
    } else if (data && Array.isArray(data.data)) {
      rawData = data.data;
    } else if (data && typeof data === 'object') {
      const possibleArray = Object.values(data).find(val => Array.isArray(val));
      if (possibleArray) rawData = possibleArray as any[];
    }

    if (rawData.length > 0) {
      const posts = rawData.map(normalizePost);
      // Cache in localStorage for instant offline/initial loads
      try {
        localStorage.setItem('landmarket_posts_cache', JSON.stringify(posts));
      } catch (e) {
        // Quota exceeded or private browsing
      }
      return posts;
    }

    return getCachedOrDefaultPosts();
  } catch (error) {
    console.warn("Failed to fetch posts from Apps Script backend, loading cached/default posts:", error);
    return getCachedOrDefaultPosts();
  }
}

function getCachedOrDefaultPosts(): LandPost[] {
  try {
    const cached = localStorage.getItem('landmarket_posts_cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // Ignore cache parse error
  }
  return DEFAULT_POSTS;
}

export async function createPost(input: NewPostInput): Promise<{ success: boolean; post: LandPost }> {
  const formData = new FormData();
  formData.append('action', 'create');
  formData.append('title', input.title);
  formData.append('price', String(input.price));
  formData.append('province', input.province);
  formData.append('address', input.address);
  formData.append('contact_name', input.contact_name);
  formData.append('phone', input.phone);
  formData.append('line_id', input.line_id);
  formData.append('body', input.body);
  formData.append('lat', input.lat !== '' ? String(input.lat) : '');
  formData.append('lng', input.lng !== '' ? String(input.lng) : '');
  formData.append('images', JSON.stringify(input.images));

  const newPost: LandPost = {
    id: `post-${Date.now()}`,
    title: input.title,
    price: Number(input.price) || 0,
    province: input.province,
    address: input.address,
    contact_name: input.contact_name,
    phone: input.phone,
    line_id: input.line_id,
    body: input.body,
    images: input.images,
    lat: input.lat !== '' ? Number(input.lat) : null,
    lng: input.lng !== '' ? Number(input.lng) : null,
    createdAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      redirect: 'follow',
    });

    if (!response.ok) {
      console.warn("API submission returned status:", response.status);
    }
    
    // Save to local cache optimistic update
    try {
      const cached = getCachedOrDefaultPosts();
      const updated = [newPost, ...cached];
      localStorage.setItem('landmarket_posts_cache', JSON.stringify(updated));
    } catch (e) {}

    return { success: true, post: newPost };
  } catch (error) {
    console.warn("Backend submit error, saving locally:", error);
    try {
      const cached = getCachedOrDefaultPosts();
      const updated = [newPost, ...cached];
      localStorage.setItem('landmarket_posts_cache', JSON.stringify(updated));
    } catch (e) {}

    return { success: true, post: newPost };
  }
}

export async function deletePost(id: string | number): Promise<boolean> {
  const formData = new FormData();
  formData.append('action', 'delete');
  formData.append('id', String(id));

  try {
    await fetch(API_URL, {
      method: 'POST',
      body: formData,
      redirect: 'follow',
    });
  } catch (error) {
    console.warn("Backend delete error:", error);
  }

  // Always update local cache
  try {
    const cached = getCachedOrDefaultPosts();
    const updated = cached.filter(p => String(p.id) !== String(id));
    localStorage.setItem('landmarket_posts_cache', JSON.stringify(updated));
  } catch (e) {}

  return true;
}
