import React, { useState, useEffect, useMemo } from 'react';
import { LandPost, FilterState, ToastMessage, NewPostInput } from './types';
import { fetchPosts, createPost, deletePost } from './services/api';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { PostCard } from './components/PostCard';
import { PostDetailModal } from './components/PostDetailModal';
import { CreatePostModal } from './components/CreatePostModal';
import { FavoritesModal } from './components/FavoritesModal';
import { ImageSliderOverlay } from './components/ImageSliderOverlay';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ToastContainer } from './components/Toast';
import {
  Layers,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Loader2,
  Globe,
  Sparkles,
} from 'lucide-react';

const ITEMS_PER_PAGE = 12;

export default function App() {
  const [posts, setPosts] = useState<LandPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Favorites state loaded from localStorage
  const [favorites, setFavorites] = useState<(string | number)[]>(() => {
    try {
      const saved = localStorage.getItem('landmarket_favs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Filter & Pagination State
  const [filters, setFilters] = useState<FilterState>({
    province: 'all',
    districtQuery: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'latest',
    hasMapOnly: false,
  });

  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal & Overlay State
  const [selectedPost, setSelectedPost] = useState<LandPost | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isFavsOpen, setIsFavsOpen] = useState<boolean>(false);

  // Image Slider Lightbox State
  const [sliderImages, setSliderImages] = useState<string[]>([]);
  const [sliderIndex, setSliderIndex] = useState<number>(0);
  const [isSliderOpen, setIsSliderOpen] = useState<boolean>(false);

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync Favorites with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('landmarket_favs', JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites]);

  // Load Posts on Mount
  const loadData = async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (err) {
      showToast('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กำลังแสดงข้อมูลล่าสุด', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(false);
  }, []);

  // Filter & Sorting Computation
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Province Filter
    if (filters.province !== 'all') {
      result = result.filter((p) => p.province === filters.province);
    }

    // District / Keyword Query
    if (filters.districtQuery.trim() !== '') {
      const q = filters.districtQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.province.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.body.toLowerCase().includes(q) ||
          p.contact_name.toLowerCase().includes(q)
      );
    }

    // Price Filters
    if (filters.minPrice !== '') {
      result = result.filter((p) => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice !== '') {
      result = result.filter((p) => p.price <= Number(filters.maxPrice));
    }

    // Map Coordinates Filter
    if (filters.hasMapOnly) {
      result = result.filter((p) => p.lat !== null && p.lng !== null);
    }

    // Sorting
    if (filters.sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // Default: latest
      result.sort((a, b) => String(b.id).localeCompare(String(a.id)));
    }

    return result;
  }, [posts, filters]);

  // Pagination Computation
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE) || 1;
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPosts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  // Filter change helper resets to page 1
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      province: 'all',
      districtQuery: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'latest',
      hasMapOnly: false,
    });
    setCurrentPage(1);
    showToast('ล้างตัวกรองการค้นหาแล้ว', 'info');
  };

  // Toggle Favorite
  const toggleFavorite = (id: string | number) => {
    setFavorites((prev) => {
      const isFav = prev.includes(id);
      if (isFav) {
        showToast('นำออกจากรายการโปรดแล้ว', 'info');
        return prev.filter((item) => item !== id);
      } else {
        showToast('บันทึกในรายการโปรดแล้ว', 'success');
        return [...prev, id];
      }
    });
  };

  // Create Post Handler
  const handleCreatePost = async (inputData: NewPostInput) => {
    const res = await createPost(inputData);
    if (res.success) {
      setPosts((prev) => [res.post, ...prev]);
      setCurrentPage(1);
    }
  };

  // Delete Post Handler
  const handleDeletePost = async (id: string | number) => {
    await deletePost(id);
    setPosts((prev) => prev.filter((p) => String(p.id) !== String(id)));
    if (selectedPost && String(selectedPost.id) === String(id)) {
      setSelectedPost(null);
    }
    setFavorites((prev) => prev.filter((item) => String(item) !== String(id)));
    showToast('ลบประกาศขายเรียบร้อยแล้ว', 'success');
  };

  // Open Full Image Slider
  const handleOpenSlider = (images: string[], startIndex: number = 0) => {
    setSliderImages(images);
    setSliderIndex(startIndex);
    setIsSliderOpen(true);
  };

  const favoritePostsList = useMemo(() => {
    return posts.filter((p) => favorites.includes(p.id));
  }, [posts, favorites]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pb-20 sm:pb-8 text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* Toast Floating Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Main Header Bar */}
      <Header
        favoriteCount={favorites.length}
        onOpenFavorites={() => setIsFavsOpen(true)}
        onOpenCreateModal={() => setIsCreateOpen(true)}
        onRefresh={() => loadData(true)}
        isRefreshing={isRefreshing}
      />

      {/* Hero Search & Filter Section */}
      <HeroSearch
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalResults={filteredPosts.length}
      />

      {/* Main Grid Section */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 px-1">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {filters.province !== 'all' ? `ที่ดินใน${filters.province}` : 'รายการประกาศที่ดินล่าสุด'}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="bg-white px-3 py-1 rounded-full border border-slate-200/80 shadow-2xs font-semibold text-slate-700">
              พบทั้งหมด <strong className="text-emerald-600">{filteredPosts.length}</strong> รายการ
            </span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-3">
            <div className="relative">
              <div className="w-14 h-14 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
              <Globe className="w-6 h-6 text-emerald-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="font-semibold text-sm text-slate-600 animate-pulse">
              กำลังโหลดข้อมูลที่ดิน...
            </p>
          </div>
        ) : filteredPosts.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-2xs my-8 space-y-4">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Inbox className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">ไม่พบประกาศขายที่ดินที่ตรงกับเงื่อนไข</h3>
              <p className="text-xs text-slate-500 mt-1">
                ลองปรับหรือเปลี่ยนคำค้นหา / ล้างตัวกรองเพื่อดูรายการทั้งหมด
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              แสดงประกาศทั้งหมด
            </button>
          </div>
        ) : (
          /* Property Cards Grid */
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {paginatedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isFavorite={favorites.includes(post.id)}
                onToggleFavorite={(e, id) => {
                  e.stopPropagation();
                  toggleFavorite(id);
                }}
                onSelect={(selected) => setSelectedPost(selected)}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10">
            <button
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 350, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 disabled:opacity-30 disabled:hover:bg-white shadow-2xs transition-all cursor-pointer"
              title="หน้าก่อนหน้า"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs sm:text-sm font-bold text-slate-700 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-2xs">
              หน้า {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 350, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 disabled:opacity-30 disabled:hover:bg-white shadow-2xs transition-all cursor-pointer"
              title="หน้าถัดไป"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              LM
            </div>
            <div>
              <span className="font-bold text-slate-800 block text-sm">LandMarket Online</span>
              <span className="text-[11px] text-slate-400">ระบบศูนย์กลางซื้อขายที่ดินออนไลน์</span>
            </div>
          </div>

          <p className="text-slate-400">
            &copy; 2026 LandMarket Online. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Nav */}
      <MobileBottomNav
        favoriteCount={favorites.length}
        onGoHome={() => {
          handleResetFilters();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCreate={() => setIsCreateOpen(true)}
        onOpenFavorites={() => setIsFavsOpen(true)}
      />

      {/* Detail Modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          isFavorite={favorites.includes(selectedPost.id)}
          onClose={() => setSelectedPost(null)}
          onToggleFavorite={toggleFavorite}
          onOpenSlider={(startIndex) => handleOpenSlider(selectedPost.images || [], startIndex)}
          onDeletePost={handleDeletePost}
          onShowToast={showToast}
        />
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreatePost}
        onShowToast={showToast}
      />

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={isFavsOpen}
        favorites={favoritePostsList}
        onClose={() => setIsFavsOpen(false)}
        onSelectPost={(p) => setSelectedPost(p)}
        onRemoveFavorite={(id) => toggleFavorite(id)}
      />

      {/* Image Lightbox Slider */}
      <ImageSliderOverlay
        isOpen={isSliderOpen}
        images={sliderImages}
        initialIndex={sliderIndex}
        onClose={() => setIsSliderOpen(false)}
      />

    </div>
  );
}
