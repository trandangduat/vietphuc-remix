import React, { useState } from 'react';
import { SavedOutfit, Piece } from '../types';
import {
  Sparkles,
  ExternalLink,
  Trash2,
  Edit2,
  Check,
  X,
  Maximize2,
  Calendar,
  Layers,
  Download,
  Filter,
  ArrowRight,
  ShieldCheck,
  Plus,
} from 'lucide-react';

interface LookbookScreenProps {
  outfits: SavedOutfit[];
  isLoggedIn: boolean;
  onLoginPrompt: () => void;
  onLoadOutfitIntoStudio: (outfit: SavedOutfit) => void;
  onDeleteOutfit: (id: string) => void;
  onRenameOutfit: (id: string, newName: string) => void;
  onOpenStudio: () => void;
}

export const LookbookScreen: React.FC<LookbookScreenProps> = ({
  outfits,
  isLoggedIn,
  onLoginPrompt,
  onLoadOutfitIntoStudio,
  onDeleteOutfit,
  onRenameOutfit,
  onOpenStudio,
}) => {
  // Modal detail view for clicked outfit
  const [selectedOutfit, setSelectedOutfit] = useState<SavedOutfit | null>(null);

  // Active view inside modal: '2d' or index of AI image
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);

  // Filter state: 'all' | 'ai_only' | '2d_only'
  const [mediaFilter, setMediaFilter] = useState<'all' | 'ai_only' | '2d_only'>('all');

  // Event filter: 'all' or eventId
  const [eventFilter, setEventFilter] = useState<string>('all');

  // Inline rename state in modal
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameText, setEditNameText] = useState('');

  // Filtered outfits
  const filteredOutfits = outfits.filter((outfit) => {
    // Media filter
    if (mediaFilter === 'ai_only' && !outfit.tryOnImage && (!outfit.tryOnImages || outfit.tryOnImages.length === 0)) {
      return false;
    }
    if (mediaFilter === '2d_only' && (outfit.tryOnImage || (outfit.tryOnImages && outfit.tryOnImages.length > 0))) {
      return false;
    }
    // Event filter
    if (eventFilter !== 'all' && outfit.event.id !== eventFilter) {
      return false;
    }
    return true;
  });

  // Unique events from outfits for filtering
  const availableEvents = Array.from(new Set(outfits.map((o) => o.event.name)));

  // Open detail modal for outfit
  const handleOpenDetail = (outfit: SavedOutfit) => {
    setSelectedOutfit(outfit);
    // If outfit has AI try on image, default to AI image view (index 1), else 2D (index 0)
    const hasAI = Boolean(outfit.tryOnImage || (outfit.tryOnImages && outfit.tryOnImages.length > 0));
    setActiveMediaIndex(hasAI ? 1 : 0);
    setIsEditingName(false);
    setEditNameText(outfit.name);
  };

  // Save rename
  const handleSaveRename = () => {
    if (selectedOutfit && editNameText.trim()) {
      onRenameOutfit(selectedOutfit.id, editNameText.trim());
      setSelectedOutfit({ ...selectedOutfit, name: editNameText.trim() });
    }
    setIsEditingName(false);
  };

  // Helper to get all media photos for an outfit
  const getOutfitMediaList = (outfit: SavedOutfit) => {
    const list: { id: string; label: string; type: '2d' | 'ai'; url: string }[] = [];
    
    // 1. 2D composite top piece or canvas
    list.push({
      id: '2d-studio',
      label: 'Bản phối 2D Studio',
      type: '2d',
      url: outfit.top.piece.assetUrl || (outfit.top.variant as Piece)?.assetUrl || '',
    });

    // 2. AI try on images
    if (outfit.tryOnImages && outfit.tryOnImages.length > 0) {
      outfit.tryOnImages.forEach((img, idx) => {
        list.push({
          id: `ai-${idx}`,
          label: `Ảnh AI Try-on #${idx + 1}`,
          type: 'ai',
          url: img,
        });
      });
    } else if (outfit.tryOnImage) {
      list.push({
        id: 'ai-default',
        label: 'Ảnh AI Try-on',
        type: 'ai',
        url: outfit.tryOnImage,
      });
    }

    return list;
  };

  // Format relative or date string
  const formatDisplayDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return 'Hôm nay';
      if (diffDays === 1) return 'Hôm qua';
      if (diffDays < 7) return `${diffDays} ngày trước`;
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-56px)] bg-lacquer text-silk-ivory font-sans pb-20">
      {/* 1. GUEST SESSION BANNER (Non-intrusive, allows full browsing) */}
      {!isLoggedIn && (
        <div className="w-full bg-lacquer-surface border-b border-imperial-gold/30 px-4 sm:px-6 lg:px-10 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-imperial-gold animate-ping" />
            <span className="text-silk-muted">
              Bạn đang ở chế độ xem tạm thời ({outfits.length} outfit đã lưu trong phiên).
            </span>
          </div>
          <button
            onClick={onLoginPrompt}
            className="px-4 py-1.5 bg-imperial-gold hover:bg-imperial-gold-light text-lacquer font-bold text-xs uppercase tracking-wider shadow transition-all whitespace-nowrap"
          >
            Đăng nhập để lưu vĩnh viễn
          </button>
        </div>
      )}

      {/* 2. GALLERY HERO HEADER & MINIMAL EDITORIAL CONTROLS */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-lacquer-border/60">
          <div>
            <div className="flex items-center gap-2 text-imperial-gold text-xs font-bold uppercase tracking-[0.2em] mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phòng Trưng Bày Phục Sức</span>
            </div>
            <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-silk-ivory tracking-tight">
              Bộ Sưu Tập Outfit
            </h1>
            <p className="text-xs sm:text-sm text-silk-muted mt-1.5 font-normal max-w-lg">
              Kho lưu trữ tác phẩm thời trang cổ phong và những bản phục dựng AI cá nhân của bạn.
            </p>
          </div>

          {/* Right Action: Create New Outfit in Studio */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenStudio}
              className="py-3 px-5 bg-gradient-to-r from-imperial-gold to-imperial-gold-light hover:brightness-105 text-lacquer font-bold text-xs sm:text-sm shadow-[0_4px_16px_rgba(212,175,55,0.25)] flex items-center gap-2 transition-all uppercase tracking-wider rounded-xl"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Phối Bộ Đồ Mới</span>
            </button>
          </div>
        </div>

        {/* 3. MINIMAL 1-LINE FILTER PILLS */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-5">
          {/* Source filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setMediaFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                mediaFilter === 'all'
                  ? 'bg-imperial-gold text-lacquer font-bold shadow-md'
                  : 'bg-lacquer-surface border border-lacquer-border text-silk-muted hover:text-silk-ivory hover:border-imperial-gold/40'
              }`}
            >
              Tất cả ({outfits.length})
            </button>

            <button
              onClick={() => setMediaFilter('ai_only')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                mediaFilter === 'ai_only'
                  ? 'bg-imperial-gold text-lacquer font-bold shadow-md'
                  : 'bg-lacquer-surface border border-lacquer-border text-silk-muted hover:text-silk-ivory hover:border-imperial-gold/40'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Có ảnh AI</span>
            </button>

            <button
              onClick={() => setMediaFilter('2d_only')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                mediaFilter === '2d_only'
                  ? 'bg-imperial-gold text-lacquer font-bold shadow-md'
                  : 'bg-lacquer-surface border border-lacquer-border text-silk-muted hover:text-silk-ivory hover:border-imperial-gold/40'
              }`}
            >
              Bản phối 2D
            </button>
          </div>

          {/* Event filter pills */}
          {availableEvents.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-silk-muted font-medium flex items-center gap-1">
                <Filter className="w-3 h-3 text-imperial-gold" />
                <span>Bối cảnh:</span>
              </span>
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="bg-lacquer-surface border border-lacquer-border text-xs text-silk-ivory px-3 py-1.5 rounded-full focus:outline-none focus:border-imperial-gold"
              >
                <option value="all">Tất cả bối cảnh</option>
                {availableEvents.map((eventName) => (
                  <option key={eventName} value={outfits.find((o) => o.event.name === eventName)?.event.id}>
                    {eventName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* 4. THE STAGGERED MASONRY WATERFALL GALLERY */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {filteredOutfits.length === 0 ? (
          /* Empty State */
          <div className="text-center py-24 p-8 rounded-2xl bg-lacquer-surface/40 border border-lacquer-border">
            <Layers className="w-16 h-16 text-silk-muted mx-auto mb-4 opacity-30" />
            <h3 className="font-serif font-bold text-2xl text-silk-ivory mb-2">
              Chưa có outfit nào trong bộ sưu tập
            </h3>
            <p className="text-sm text-silk-muted max-w-sm mx-auto mb-6 leading-relaxed">
              Hãy quay lại Studio để bắt đầu phối bộ xiêm y cổ phong đầu tiên của bạn!
            </p>
            <button
              onClick={onOpenStudio}
              className="py-3 px-6 rounded-xl bg-imperial-gold text-lacquer font-bold text-xs uppercase tracking-wider hover:bg-imperial-gold-light shadow-lg transition-all"
            >
              Mở Studio Phối Đồ Ngay
            </button>
          </div>
        ) : (
          /* True Masonry Multi-Column Waterfall Layout */
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-3 gap-6 [column-fill:_balance]">
            {filteredOutfits.map((outfit, index) => {
              // Determine card aspect ratio to create natural staggered waterfall rhythm
              const hasAIImage = Boolean(outfit.tryOnImage || (outfit.tryOnImages && outfit.tryOnImages.length > 0));
              const displayImage = outfit.tryOnImage || outfit.top.piece.assetUrl || (outfit.top.variant as Piece)?.assetUrl;

              // Staggered height logic:
              // - If outfit specifies aspectRatio: use it
              // - If has AI image: towering tall (3:4 or 9:16)
              // - Otherwise: alternate between 3:4, 4:5, and 1:1
              let aspectClass = 'aspect-[3/4]';
              if (outfit.aspectRatio === 'tall') {
                aspectClass = 'aspect-[9/16]';
              } else if (outfit.aspectRatio === 'medium') {
                aspectClass = 'aspect-[4/5]';
              } else if (outfit.aspectRatio === 'short') {
                aspectClass = 'aspect-[1/1]';
              } else if (hasAIImage && index % 2 === 0) {
                aspectClass = 'aspect-[9/15]';
              } else if (index % 3 === 1) {
                aspectClass = 'aspect-[4/5]';
              } else if (index % 3 === 2) {
                aspectClass = 'aspect-[1/1]';
              }

              return (
                <div
                  key={outfit.id}
                  onClick={() => handleOpenDetail(outfit)}
                  className="break-inside-avoid mb-6 group relative rounded-2xl overflow-hidden border border-lacquer-border/80 hover:border-imperial-gold/70 bg-lacquer-surface shadow-lg hover:shadow-[0_16px_36px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer"
                >
                  {/* Photo Canvas Container with varying aspect ratio */}
                  <div className={`relative w-full ${aspectClass} overflow-hidden bg-lacquer-card`}>
                    {/* Event Background Layer (for 2D Studio Outfits) */}
                    {!hasAIImage && (
                      <div className="absolute inset-0 z-0 overflow-hidden">
                        <img
                          src={outfit.event.bgUrl}
                          alt={outfit.event.name}
                          className="w-full h-full object-cover opacity-50 filter blur-[1px] group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
                      </div>
                    )}

                    {/* Main Subject Image */}
                    <div className="relative z-10 w-full h-full flex items-center justify-center p-3">
                      <img
                        src={displayImage}
                        alt={outfit.name}
                        className={`w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-500 ${
                          hasAIImage ? 'object-cover' : 'object-contain'
                        }`}
                      />
                    </div>

                    {/* Top Badges: Event Pill & AI Badge */}
                    <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-silk-ivory border border-white/10 shadow-sm">
                        {outfit.event.name}
                      </span>

                      {hasAIImage && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-imperial-gold/25 backdrop-blur-md text-amber-300 border border-imperial-gold/50 flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-3 h-3 text-imperial-gold animate-pulse" />
                          <span>AI Try-on</span>
                        </span>
                      )}
                    </div>

                    {/* MINIMAL BOTTOM OVERLAY (Exactly like user's reference photo) */}
                    <div className="absolute bottom-0 inset-x-0 z-20 p-3.5 sm:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between gap-3">
                      {/* Left: Minimal Author / Outfit Title & Date */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Minimal avatar seal */}
                        <div className="w-7 h-7 rounded-full bg-imperial-gold/20 border border-imperial-gold/50 flex items-center justify-center flex-shrink-0 text-[10px] font-serif font-bold text-imperial-gold">
                          {isLoggedIn ? 'MA' : 'VP'}
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-serif font-bold text-xs sm:text-sm text-silk-ivory truncate group-hover:text-imperial-gold transition-colors">
                            {outfit.name}
                          </h4>
                          <span className="text-[10px] text-silk-muted/90 block font-normal">
                            {formatDisplayDate(outfit.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Right: Minimal Circular Expand Icon */}
                      <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-imperial-gold text-silk-ivory group-hover:text-lacquer flex items-center justify-center flex-shrink-0 transition-all shadow-md">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. THE OUTFIT DETAIL MODAL (Opens when clicking any card) */}
      {selectedOutfit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedOutfit(null)}
        >
          {/* Modal Container */}
          <div
            className="w-full max-w-5xl max-h-[92vh] bg-lacquer-surface border-2 border-imperial-gold shadow-[0_24px_64px_rgba(0,0,0,0.95)] rounded-2xl flex flex-col lg:flex-row overflow-hidden animate-in zoom-in-95 duration-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedOutfit(null)}
              className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-imperial-gold text-silk-muted hover:text-lacquer flex items-center justify-center border border-white/20 transition-all shadow-lg"
              title="Đóng cửa sổ"
            >
              <X className="w-4 h-4" />
            </button>

            {/* LEFT SIDE: Media Visual Stage (60%) */}
            <div className="w-full lg:w-[58%] bg-lacquer-card flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-lacquer-border/80 relative overflow-hidden">
              {/* Media Display Canvas */}
              <div className="relative flex-1 min-h-[320px] sm:min-h-[420px] flex items-center justify-center p-6 bg-gradient-to-b from-lacquer to-lacquer-surface overflow-hidden">
                {/* Event background behind 2D mockup */}
                {activeMediaIndex === 0 && (
                  <div className="absolute inset-0 z-0">
                    <img
                      src={selectedOutfit.event.bgUrl}
                      alt={selectedOutfit.event.name}
                      className="w-full h-full object-cover opacity-60 filter blur-[1px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
                  </div>
                )}

                {/* The Active Image */}
                {(() => {
                  const mediaList = getOutfitMediaList(selectedOutfit);
                  const activeMedia = mediaList[activeMediaIndex] || mediaList[0];
                  return (
                    <img
                      src={activeMedia?.url || selectedOutfit.top.piece.assetUrl}
                      alt={selectedOutfit.name}
                      className={`relative z-10 max-h-[460px] max-w-full drop-shadow-[0_16px_36px_rgba(0,0,0,0.9)] ${
                        activeMedia?.type === 'ai' ? 'object-cover rounded-xl' : 'object-contain'
                      }`}
                    />
                  );
                })()}

                {/* Floating badge for active media */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-imperial-gold border border-imperial-gold/40 shadow">
                    {selectedOutfit.event.name}
                  </span>
                </div>
              </div>

              {/* Media Switcher Thumbnails Bar (If multiple media exist) */}
              {(() => {
                const mediaList = getOutfitMediaList(selectedOutfit);
                if (mediaList.length <= 1) return null;
                return (
                  <div className="p-3 bg-lacquer/90 border-t border-lacquer-border flex items-center gap-2.5 overflow-x-auto">
                    <span className="text-[10px] text-silk-muted uppercase tracking-wider font-bold ml-1">
                      Ảnh ({mediaList.length}):
                    </span>
                    {mediaList.map((media, idx) => (
                      <button
                        key={media.id}
                        onClick={() => setActiveMediaIndex(idx)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          activeMediaIndex === idx
                            ? 'bg-imperial-gold text-lacquer border-imperial-gold font-bold shadow-md'
                            : 'bg-lacquer-surface border-lacquer-border text-silk-muted hover:text-silk-ivory hover:border-imperial-gold/40'
                        }`}
                      >
                        {media.type === 'ai' ? <Sparkles className="w-3 h-3 text-amber-300" /> : <Layers className="w-3 h-3" />}
                        <span>{media.label}</span>
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* RIGHT SIDE: Dossier & Pieces Breakdown (42%) */}
            <div className="w-full lg:w-[42%] flex flex-col justify-between p-6 sm:p-7 overflow-y-auto max-h-[90vh]">
              <div className="space-y-6">
                {/* 1. Header: Editable Outfit Title & Date */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-imperial-gold">
                      Hồ Sơ Trang Phục
                    </span>
                    <span className="text-xs text-silk-muted flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{selectedOutfit.createdAt}</span>
                    </span>
                  </div>

                  {isEditingName ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={editNameText}
                        onChange={(e) => setEditNameText(e.target.value)}
                        className="flex-1 bg-lacquer border border-imperial-gold px-3 py-1.5 text-base font-serif text-silk-ivory focus:outline-none rounded-md"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveRename}
                        className="p-2 bg-imperial-gold text-lacquer hover:bg-imperial-gold-light rounded-md"
                        title="Lưu tên mới"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group/edit">
                      <h2 className="font-serif font-extrabold text-2xl text-silk-ivory tracking-tight">
                        {selectedOutfit.name}
                      </h2>
                      <button
                        onClick={() => {
                          setIsEditingName(true);
                          setEditNameText(selectedOutfit.name);
                        }}
                        className="text-silk-muted hover:text-imperial-gold opacity-0 group-hover/edit:opacity-100 transition-opacity p-1"
                        title="Đổi tên bộ trang phục"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-silk-muted mt-1">
                    Bối cảnh phục sức: <strong className="text-silk-ivory">{selectedOutfit.event.name}</strong> • Giới tính:{' '}
                    <strong className="text-silk-ivory">{selectedOutfit.gender === 'women' ? 'Nữ' : 'Nam'}</strong>
                  </p>
                </div>

                {/* 2. PIECES BREAKDOWN (Bóc tách từng món đồ) */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-imperial-gold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Cấu Thành Phục Sức ({selectedOutfit.accessory ? '4' : '3'} món)</span>
                  </h4>

                  <div className="space-y-2">
                    {/* Áo */}
                    <div className="p-2.5 rounded-xl bg-lacquer/80 border border-lacquer-border flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-lacquer-surface border border-imperial-gold/30 p-1 flex items-center justify-center flex-shrink-0">
                        <img
                          src={selectedOutfit.top.piece.thumbnailUrl || selectedOutfit.top.piece.assetUrl}
                          alt={selectedOutfit.top.piece.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-imperial-gold uppercase font-bold tracking-wider">Áo</span>
                          {selectedOutfit.top.piece.culturalInfo && (
                            <span className="text-[9px] text-silk-muted">
                              {selectedOutfit.top.piece.culturalInfo.period.split('(')[0]}
                            </span>
                          )}
                        </div>
                        <h5 className="font-bold text-xs sm:text-sm text-silk-ivory truncate">
                          {selectedOutfit.top.piece.name}
                        </h5>
                      </div>
                    </div>

                    {/* Quần */}
                    <div className="p-2.5 rounded-xl bg-lacquer/80 border border-lacquer-border flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-lacquer-surface border border-imperial-gold/30 p-1 flex items-center justify-center flex-shrink-0">
                        <img
                          src={selectedOutfit.bottom.piece.thumbnailUrl || selectedOutfit.bottom.piece.assetUrl}
                          alt={selectedOutfit.bottom.piece.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-imperial-gold uppercase font-bold tracking-wider">Quần / Váy</span>
                          {selectedOutfit.bottom.piece.culturalInfo && (
                            <span className="text-[9px] text-silk-muted">
                              {selectedOutfit.bottom.piece.culturalInfo.period.split('(')[0]}
                            </span>
                          )}
                        </div>
                        <h5 className="font-bold text-xs sm:text-sm text-silk-ivory truncate">
                          {selectedOutfit.bottom.piece.name}
                        </h5>
                      </div>
                    </div>

                    {/* Giày */}
                    <div className="p-2.5 rounded-xl bg-lacquer/80 border border-lacquer-border flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-lacquer-surface border border-imperial-gold/30 p-1 flex items-center justify-center flex-shrink-0">
                        <img
                          src={selectedOutfit.footwear.piece.thumbnailUrl || selectedOutfit.footwear.piece.assetUrl}
                          alt={selectedOutfit.footwear.piece.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-imperial-gold uppercase font-bold tracking-wider">Giày / Dép</span>
                          {selectedOutfit.footwear.piece.culturalInfo && (
                            <span className="text-[9px] text-silk-muted">
                              {selectedOutfit.footwear.piece.culturalInfo.period.split('(')[0]}
                            </span>
                          )}
                        </div>
                        <h5 className="font-bold text-xs sm:text-sm text-silk-ivory truncate">
                          {selectedOutfit.footwear.piece.name}
                        </h5>
                      </div>
                    </div>

                    {/* Phụ kiện (nếu có) */}
                    {selectedOutfit.accessory && (
                      <div className="p-2.5 rounded-xl bg-lacquer/80 border border-lacquer-border flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-lacquer-surface border border-imperial-gold/30 p-1 flex items-center justify-center flex-shrink-0">
                          <img
                            src={selectedOutfit.accessory.piece.thumbnailUrl || selectedOutfit.accessory.piece.assetUrl}
                            alt={selectedOutfit.accessory.piece.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-imperial-gold uppercase font-bold tracking-wider block">Phụ kiện</span>
                          <h5 className="font-bold text-xs sm:text-sm text-silk-ivory truncate">
                            {selectedOutfit.accessory.piece.name}
                          </h5>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Đánh giá văn hóa (Bé Nghê Cung Đình) */}
                {selectedOutfit.aiAnalysis && (
                  <div className="p-3.5 rounded-xl bg-lacquer/90 border border-imperial-gold/40 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-imperial-gold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-imperial-gold" />
                        <span>Nhận Xét Điển Lễ</span>
                      </span>
                      <span className="text-xs font-serif font-bold px-2 py-0.5 rounded-md bg-imperial-gold/20 text-imperial-gold border border-imperial-gold/40">
                        ★ {selectedOutfit.aiAnalysis.totalScore}/10
                      </span>
                    </div>
                    <p className="font-serif italic text-xs text-silk-ivory leading-relaxed">
                      "{selectedOutfit.aiAnalysis.mascotQuote || selectedOutfit.aiAnalysis.explanation}"
                    </p>
                  </div>
                )}
              </div>

              {/* 4. Action Buttons at bottom of modal */}
              <div className="pt-6 border-t border-lacquer-border flex flex-col sm:flex-row items-center gap-3 mt-6">
                <button
                  onClick={() => {
                    onLoadOutfitIntoStudio(selectedOutfit);
                    setSelectedOutfit(null);
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-imperial-gold to-imperial-gold-light hover:brightness-105 text-lacquer font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Mở Trong Studio (Remix)</span>
                </button>

                <button
                  onClick={() => {
                    const idToDelete = selectedOutfit.id;
                    setSelectedOutfit(null);
                    onDeleteOutfit(idToDelete);
                  }}
                  className="py-3 px-4 rounded-xl bg-lacquer hover:bg-rose-950/60 border border-lacquer-border hover:border-rose-500/50 text-silk-muted hover:text-rose-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  title="Xóa bộ trang phục này"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
