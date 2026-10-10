import React, { useState, useMemo, useEffect } from 'react';
import { SavedOutfit, Piece } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  Sparkles,
  Download,
  Trash2,
  Edit2,
  Check,
  ExternalLink,
  BookOpen,
  Image as ImageIcon,
} from 'lucide-react';
import { getPieceAlignment, getAlignmentStyle } from '../data/pieceAlignments';

/**
 * 2D Composite Mannequin Stage for outfits
 * Khung phẳng góc vuông, không zoom khi hover
 */
const OutfitMannequinComposite: React.FC<{
  outfit: SavedOutfit;
  className?: string;
  isModal?: boolean;
}> = ({ outfit, className = '', isModal = false }) => {
  const bottomPiece = outfit.bottom?.piece || (outfit.bottom?.variant as Piece | undefined);
  const footwearPiece = outfit.footwear?.piece || (outfit.footwear?.variant as Piece | undefined);
  const topPiece = outfit.top?.piece || (outfit.top?.variant as Piece | undefined);
  const accessoryPiece = outfit.accessory?.piece || (outfit.accessory?.variant as Piece | undefined);

  const bottomAlign = getPieceAlignment(bottomPiece?.id);
  const footwearAlign = getPieceAlignment(footwearPiece?.id);
  const topAlign = getPieceAlignment(topPiece?.id);
  const accessoryAlign = getPieceAlignment(accessoryPiece?.id);

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none ${className}`}>
      {outfit.event?.bgUrl && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={outfit.event.bgUrl}
            alt={outfit.event.name}
            className={`w-full h-full object-cover ${
              isModal ? 'opacity-95' : 'opacity-90'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      <div
        className="relative z-10 w-full h-full max-h-[96%] aspect-[3/4] flex items-center justify-center pointer-events-none py-2"
      >
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <img
            src="/assets/mannequins/mannequin-base.png"
            alt="Ma-nơ-canh"
            className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)]"
          />
        </div>

        {bottomPiece?.assetUrl && (
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={getAlignmentStyle(bottomAlign)}
          >
            <img
              src={bottomPiece.assetUrl}
              alt={bottomPiece.name}
              className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
            />
          </div>
        )}

        {footwearPiece?.assetUrl && (
          <div
            className="absolute inset-0 z-30 pointer-events-none"
            style={getAlignmentStyle(footwearAlign)}
          >
            <img
              src={footwearPiece.assetUrl}
              alt={footwearPiece.name}
              className="w-full h-full object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]"
            />
          </div>
        )}

        {topPiece?.assetUrl && (
          <div
            className="absolute inset-0 z-40 pointer-events-none"
            style={getAlignmentStyle(topAlign)}
          >
            <img
              src={topPiece.assetUrl}
              alt={topPiece.name}
              className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]"
            />
          </div>
        )}

        {accessoryPiece?.assetUrl && (
          <div
            className="absolute inset-0 z-50 pointer-events-none"
            style={getAlignmentStyle(accessoryAlign)}
          >
            <img
              src={accessoryPiece.assetUrl}
              alt={accessoryPiece.name}
              className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.65)]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface AiPhotoItem {
  id: string;
  url: string;
  outfit: SavedOutfit;
  index: number;
}

interface AlbumItem {
  id: string;
  title: string;
  type: 'outfit' | 'ai-photo';
  count: number;
  outfits?: SavedOutfit[];
  aiPhotos?: AiPhotoItem[];
  coverOutfit?: SavedOutfit;
  coverImageUrl?: string;
}

interface LookbookScreenProps {
  outfits: SavedOutfit[];
  isLoggedIn: boolean;
  onLoginPrompt: () => void;
  onLoadOutfitIntoStudio: (outfit: SavedOutfit) => void;
  onDeleteOutfit: (id: string) => void;
  onRenameOutfit: (id: string, newName: string) => void;
  onToggleFavorite?: (id: string) => void;
  onOpenStudio: () => void;
  showToast?: (msg: string) => void;
}

export const LookbookScreen: React.FC<LookbookScreenProps> = ({
  outfits,
  isLoggedIn,
  onLoginPrompt,
  onLoadOutfitIntoStudio,
  onDeleteOutfit,
  onRenameOutfit,
  onToggleFavorite,
  onOpenStudio,
  showToast = () => {},
}) => {
  // Navigation: null = Albums Grid view; string = Inside specific album
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);

  // Modal xem chi tiết: hỗ trợ xem outfit hoặc ảnh AI
  const [viewingItem, setViewingItem] = useState<{
    type: 'outfit' | 'ai-photo';
    outfit: SavedOutfit;
    aiPhotoUrl?: string;
  } | null>(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameText, setEditNameText] = useState('');

  // Close modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setViewingItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 1. TẬP HỢP TẤT CẢ ẢNH DO AI TẠO (Album duy nhất "Thử đồ AI")
  const allAiPhotos = useMemo<AiPhotoItem[]>(() => {
    const list: AiPhotoItem[] = [];
    outfits.forEach((o) => {
      const images =
        o.tryOnImages && o.tryOnImages.length > 0
          ? o.tryOnImages
          : o.tryOnImage
          ? [o.tryOnImage]
          : [];

      images.forEach((url, idx) => {
        if (url) {
          list.push({
            id: `${o.id}-ai-${idx}`,
            url,
            outfit: o,
            index: idx,
          });
        }
      });
    });
    return list;
  }, [outfits]);

  // 2. DANH SÁCH ALBUM
  // - Tất cả outfit: Chỉ chứa outfit (không có ảnh AI)
  // - Event (Tết Cổ Truyền, Dạ hội Prom, v.v.): Cũng chỉ chứa outfit
  // - "Thử đồ AI": Album duy nhất chứa ảnh tạo bởi AI (không có outfit)
  const albums = useMemo<AlbumItem[]>(() => {
    const list: AlbumItem[] = [];

    // Album 1: Tất cả outfit
    list.push({
      id: 'all-outfits',
      title: 'Tất cả outfit',
      type: 'outfit',
      count: outfits.length,
      outfits,
      coverOutfit: outfits[0],
    });

    // Album 2+: Nhóm theo Sự kiện (Tết, Dạ hội School Prom, Trung Thu, v.v.)
    const eventMap = new Map<string, { name: string; outfits: SavedOutfit[] }>();
    outfits.forEach((o) => {
      const evName = o.event?.name?.trim() || 'Sự kiện khác';
      if (!eventMap.has(evName)) {
        eventMap.set(evName, { name: evName, outfits: [] });
      }
      eventMap.get(evName)!.outfits.push(o);
    });

    eventMap.forEach((data, evName) => {
      list.push({
        id: `event-${encodeURIComponent(evName)}`,
        title: evName,
        type: 'outfit',
        count: data.outfits.length,
        outfits: data.outfits,
        coverOutfit: data.outfits[0],
      });
    });

    // Album DUY NHẤT: "Thử đồ AI" (Chỉ chứa ảnh do AI tạo)
    list.push({
      id: 'ai-try-on',
      title: 'Thử đồ AI',
      type: 'ai-photo',
      count: allAiPhotos.length,
      aiPhotos: allAiPhotos,
      coverImageUrl: allAiPhotos[0]?.url,
    });

    return list;
  }, [outfits, allAiPhotos]);

  // Album hiện đang mở
  const currentAlbum = useMemo(() => {
    if (!selectedAlbumId) return null;
    return albums.find((a) => a.id === selectedAlbumId) || null;
  }, [albums, selectedAlbumId]);

  // Mở popup xem Outfit
  const handleOpenOutfit = (outfit: SavedOutfit) => {
    setViewingItem({
      type: 'outfit',
      outfit,
    });
    setIsEditingName(false);
    setEditNameText(outfit.name);
  };

  // Mở popup xem Ảnh AI
  const handleOpenAiPhoto = (photo: AiPhotoItem) => {
    setViewingItem({
      type: 'ai-photo',
      outfit: photo.outfit,
      aiPhotoUrl: photo.url,
    });
    setIsEditingName(false);
    setEditNameText(photo.outfit.name);
  };

  // Điều hướng mục tiếp / trước trong popup
  const handleNavigateItem = (direction: 'next' | 'prev') => {
    if (!viewingItem) return;

    if (viewingItem.type === 'outfit') {
      const list = currentAlbum?.outfits || outfits;
      if (list.length === 0) return;
      const currentIndex = list.findIndex((o) => o.id === viewingItem.outfit.id);
      if (currentIndex === -1) return;
      const nextIndex =
        direction === 'next'
          ? (currentIndex + 1) % list.length
          : (currentIndex - 1 + list.length) % list.length;
      handleOpenOutfit(list[nextIndex]);
    } else {
      const list = currentAlbum?.aiPhotos || allAiPhotos;
      if (list.length === 0) return;
      const currentIndex = list.findIndex(
        (p) => p.url === viewingItem.aiPhotoUrl
      );
      if (currentIndex === -1) return;
      const nextIndex =
        direction === 'next'
          ? (currentIndex + 1) % list.length
          : (currentIndex - 1 + list.length) % list.length;
      handleOpenAiPhoto(list[nextIndex]);
    }
  };

  // Lưu đổi tên outfit
  const handleSaveRename = () => {
    if (viewingItem && editNameText.trim()) {
      onRenameOutfit(viewingItem.outfit.id, editNameText.trim());
      setViewingItem({
        ...viewingItem,
        outfit: { ...viewingItem.outfit, name: editNameText.trim() },
      });
    }
    setIsEditingName(false);
  };

  // Tải ảnh về máy
  const handleDownload = (url: string, name: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '_')}.png`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full min-h-[calc(100vh-56px)] bg-lacquer text-silk-ivory font-sans pb-20 select-none relative overflow-hidden">
      {/* 1. NỀN HOÀNG CUNG CỔ TRẦM ẤM */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <img
          src="/assets/backgrounds/gallery-bg.jpg"
          alt="Không gian cổ lầu hoàng cung"
          className="w-full h-full object-cover object-center opacity-35 sm:opacity-45 filter brightness-90 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-lacquer/80 via-lacquer/50 to-lacquer/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#0A0D12_90%)]" />
        <div className="absolute top-12 right-1/4 w-96 h-96 rounded-full bg-imperial-gold/15 filter blur-[100px]" />
        <div className="absolute top-24 left-1/4 w-80 h-80 rounded-full bg-imperial-red/10 filter blur-[90px]" />
      </div>

      {/* CONTAINER THU GỌN VỪA VẶN */}
      <div className="relative z-10 max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2. HEADER: TIÊU ĐỀ BỘ SƯU TẬP + CHIM LẠC */}
        <header className="w-full pt-8 pb-6">
          <div className="flex items-center justify-between">
            {/* TIÊU ĐỀ HOẶC NÚT QUAY LẠI ALBUM */}
            {!selectedAlbumId ? (
              <div className="flex flex-col flex-shrink-0">
                <h1 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-silk-ivory tracking-tight drop-shadow-md leading-none">
                  Bộ Sưu Tập
                </h1>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="font-calligraphy text-4xl sm:text-5xl lg:text-6xl text-[#e8c87b] -rotate-2 font-bold drop-shadow-[0_4px_14px_rgba(232,200,123,0.35)] leading-none select-none">
                    Outfit
                  </span>
                  <img
                    src="/assets/decorations/chim-lac.png"
                    alt="Họa tiết chim Lạc Hồng vàng kim"
                    className="h-8 sm:h-9 lg:h-10 w-auto object-contain filter drop-shadow-[0_2px_12px_rgba(232,200,123,0.5)] select-none pointer-events-none inline-block"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col flex-shrink-0">
                <button
                  onClick={() => setSelectedAlbumId(null)}
                  className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-sm font-semibold transition-colors cursor-pointer group mb-1.5"
                >
                  <ChevronLeft className="w-5 h-5 -ml-1 transition-transform group-hover:-translate-x-0.5" />
                  <span>Quay lại Album</span>
                </button>
                <h1 className="font-serif font-bold text-2xl sm:text-3xl text-silk-ivory tracking-tight leading-snug">
                  {currentAlbum?.title || 'Album'}
                </h1>
                <p className="text-xs sm:text-sm text-silk-muted font-normal">
                  {currentAlbum?.count || 0} {currentAlbum?.type === 'ai-photo' ? 'ảnh' : 'outfit'}
                </p>
              </div>
            )}
          </div>
        </header>

        {/* 3. NỘI DUNG CHÍNH: LƯỚI ALBUM HOẶC BÊN TRONG ALBUM (GÓC VUÔNG, KHÔNG BO GÓC, KHÔNG ZOOM) */}
        <main className="w-full pt-2">
          {/* MÀN HÌNH 1: DANH SÁCH ALBUM Ở NGOÀI */}
          {!selectedAlbumId ? (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
                {albums.map((album) => {
                  return (
                    <div
                      key={album.id}
                      onClick={() => setSelectedAlbumId(album.id)}
                      className="group cursor-pointer text-left flex flex-col"
                    >
                      {/* Khung Album: 1:1, góc vuông, không bo góc, không zoom, hover thay đổi border */}
                      <div className="relative aspect-square w-full overflow-hidden bg-black/60 backdrop-blur-sm border-2 border-white/15 hover:border-[#d8af65] transition-colors duration-150 rounded-none shadow-lg">
                        {album.type === 'ai-photo' ? (
                          album.coverImageUrl ? (
                            <img
                              src={album.coverImageUrl}
                              alt={album.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 text-silk-muted/40 gap-2">
                              <Sparkles className="w-8 h-8" />
                              <span className="text-xs">Chưa có ảnh</span>
                            </div>
                          )
                        ) : album.coverOutfit ? (
                          <OutfitMannequinComposite
                            outfit={album.coverOutfit}
                            className="w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white/5 text-silk-muted/40">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      {/* Tiêu đề & Đếm số lượng */}
                      <div className="mt-2.5 px-0.5">
                        <p className="text-[14px] sm:text-[15px] font-semibold text-silk-ivory tracking-tight leading-snug truncate group-hover:text-amber-300 transition-colors">
                          {album.title}
                        </p>
                        <p className="text-[12px] sm:text-[13px] text-silk-muted font-normal leading-snug mt-0.5">
                          {album.count} {album.type === 'ai-photo' ? 'ảnh' : 'outfit'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* MÀN HÌNH 2: BÊN TRONG ALBUM (GÓC VUÔNG, KHÔNG BO GÓC, KHÔNG ZOOM, KHÔNG TEXT KHI HOVER) */
            <div>
              {/* Nếu là Album Thử đồ AI */}
              {currentAlbum?.type === 'ai-photo' ? (
                (!currentAlbum.aiPhotos || currentAlbum.aiPhotos.length === 0) ? (
                  <div className="py-24 text-center bg-black/40 backdrop-blur-md border border-white/10 p-8 my-4 rounded-none">
                    <Sparkles className="w-12 h-12 text-silk-muted/50 mx-auto mb-3" />
                    <p className="text-silk-muted text-sm">
                      Chưa có ảnh thử đồ AI nào được tạo
                    </p>
                    <button
                      onClick={onOpenStudio}
                      className="mt-4 px-5 py-2.5 bg-imperial-gold hover:bg-imperial-gold-light text-lacquer rounded-none text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
                    >
                      Mở Studio để Thử Đồ AI
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 pb-12">
                    {currentAlbum.aiPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={() => handleOpenAiPhoto(photo)}
                        className="group relative aspect-[3/4] overflow-hidden bg-black/80 border-2 border-white/15 hover:border-[#d8af65] transition-colors duration-150 cursor-pointer rounded-none shadow-md flex items-center justify-center"
                      >
                        <img
                          src={photo.url}
                          alt={photo.outfit.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )
              ) : (
                /* Nếu là Album Outfit (Tất cả outfit, Tết, Prom, v.v.) */
                (!currentAlbum?.outfits || currentAlbum.outfits.length === 0) ? (
                  <div className="py-24 text-center bg-black/40 backdrop-blur-md border border-white/10 p-8 my-4 rounded-none">
                    <ImageIcon className="w-12 h-12 text-silk-muted/50 mx-auto mb-3" />
                    <p className="text-silk-muted text-sm">
                      Không có outfit nào trong album này
                    </p>
                    <button
                      onClick={onOpenStudio}
                      className="mt-4 px-5 py-2.5 bg-imperial-gold hover:bg-imperial-gold-light text-lacquer rounded-none text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
                    >
                      Mở Studio Phối Đồ
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 pb-12">
                    {currentAlbum.outfits.map((outfit) => (
                      <div
                        key={outfit.id}
                        onClick={() => handleOpenOutfit(outfit)}
                        className="group relative aspect-square overflow-hidden bg-black/60 border-2 border-white/15 hover:border-[#d8af65] transition-colors duration-150 cursor-pointer rounded-none shadow-md"
                      >
                        <OutfitMannequinComposite
                          outfit={outfit}
                          className="w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          )}
        </main>
      </div>

      {/* 4. MODAL XEM CHI TIẾT: NỀN MỜ, NÚT ĐÓNG BÊN PHẢI, NÚT XÓA Ở DƯỚI, ẢNH AI BÊN PHẢI */}
      {viewingItem && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-[#07090d]/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setViewingItem(null)}
        >
          {/* THANH HEADER MODAL: TIÊU ĐỀ BÊN TRÁI, NÚT ĐÓNG (X) Ở BÊN PHẢI */}
          <div
            className="flex items-center justify-between border-b border-imperial-gold/25 bg-lacquer/80 px-4 py-3.5 sm:px-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tiêu đề & Đổi tên */}
            <div className="flex items-center gap-3 max-w-xl truncate">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editNameText}
                    onChange={(e) => setEditNameText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                    className="border border-imperial-gold/50 bg-black/40 px-3 py-1.5 text-sm text-silk-ivory focus:border-imperial-gold-light focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveRename}
                    className="cursor-pointer bg-imperial-gold p-1.5 text-lacquer hover:bg-imperial-gold-light"
                    title="Lưu tên"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 truncate">
                  <span className="text-base sm:text-lg font-serif font-bold text-silk-ivory truncate">
                    {viewingItem.outfit.name}
                  </span>
                  <button
                    onClick={() => {
                      setIsEditingName(true);
                      setEditNameText(viewingItem.outfit.name);
                    }}
                    className="cursor-pointer p-1 text-silk-muted transition-colors hover:text-imperial-gold-light"
                    title="Đổi tên"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="hidden border border-imperial-gold/35 px-2 py-0.5 text-[12px] font-medium text-imperial-gold-light sm:inline-block">
                    {viewingItem.type === 'outfit'
                      ? viewingItem.outfit.event?.name || 'Outfit'
                      : 'Ảnh thử đồ'}
                  </span>
                </div>
              )}
            </div>

            {/* NÚT ĐÓNG (X) CHUYỂN SANG BÊN PHẢI */}
            <button
              onClick={() => setViewingItem(null)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center border border-imperial-gold/40 bg-[#07090d] text-silk-ivory transition-colors hover:border-imperial-gold hover:bg-imperial-gold hover:text-lacquer"
              title="Đóng (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SÂN KHẤU CHÍNH: OUTFIT / ẢNH AI + CỘT ẢNH AI BÊN PHẢI */}
          <div
            className="flex-1 relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút lùi */}
            <button
              onClick={() => handleNavigateItem('prev')}
              className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center border border-imperial-gold/40 bg-[#07090d]/90 text-silk-ivory shadow-lg backdrop-blur-md transition-colors hover:bg-imperial-gold hover:text-lacquer active:scale-95 sm:left-6 sm:h-11 sm:w-11"
              title="Mục trước"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2]" />
            </button>

            {/* Nút tiến */}
            <button
              onClick={() => handleNavigateItem('next')}
              className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center border border-imperial-gold/40 bg-[#07090d]/90 text-silk-ivory shadow-lg backdrop-blur-md transition-colors hover:bg-imperial-gold hover:text-lacquer active:scale-95 sm:right-6 sm:h-11 sm:w-11"
              title="Mục tiếp"
            >
              <ChevronRight className="w-6 h-6 stroke-[2]" />
            </button>

            {/* KHUNG HIỂN THỊ CHÍNH (CHIA CỘT) */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 max-h-[75vh] w-full max-w-5xl">
              {/* CỘT CHÍNH:
                  - NẾU LÀ ẢNH AI: GIỮ NGUYÊN TỶ LỆ GỐC (TỰ CO GIÃN THEO ẢNH, KHÔNG BỊ CẮT XÉN ĐẦU HAY CHÂN VÁY)
                  - NẾU LÀ OUTFIT: TỶ LỆ 1:1 VUÔNG CHUẨN PREVIEW STUDIO */}
              {viewingItem.type === 'ai-photo' && viewingItem.aiPhotoUrl ? (
                <div className="relative flex h-[52vh] w-auto max-w-[90vw] flex-shrink-0 items-center justify-center overflow-hidden border border-imperial-gold/45 bg-[#07090d] p-[3px] shadow-[0_24px_70px_rgba(0,0,0,0.65)] sm:h-[62vh] lg:h-[72vh] lg:max-w-[calc(100%-320px)]">
                  <div className="flex h-full w-full items-center justify-center border border-imperial-gold/25 bg-black">
                  <img
                    src={viewingItem.aiPhotoUrl}
                    alt={viewingItem.outfit.name}
                    className="block h-full w-auto max-w-full object-contain"
                  />
                  </div>
                </div>
              ) : (
                <div className="relative flex aspect-square h-[52vh] max-w-[70vh] flex-shrink-0 items-center justify-center overflow-hidden border border-imperial-gold/45 bg-[#07090d] p-[3px] shadow-[0_24px_70px_rgba(0,0,0,0.65)] sm:h-[62vh] lg:h-[70vh]">
                  <div className="h-full w-full border border-imperial-gold/25">
                  <OutfitMannequinComposite
                    outfit={viewingItem.outfit}
                    className="h-full w-full"
                    isModal
                  />
                  </div>
                </div>
              )}

              {/* CỘT BÊN PHẢI:
                  - NẾU LÀ OUTFIT: THÊM CÁC ẢNH ĐÃ TẠO BỞI AI TỪ OUTFIT ĐÓ
                  - NẾU LÀ ẢNH AI: HIỂN THỊ BẢN PHỐI OUTFIT GỐC ĐỂ THAM CHIẾU */}
              {viewingItem.type === 'outfit' ? (
                <div className="flex h-auto w-full flex-col border border-imperial-gold/30 bg-lacquer/90 p-4 lg:h-[70vh] lg:w-72 xl:w-80">
                  <div className="mb-3 flex items-center justify-between border-b border-imperial-gold/20 pb-3">
                    <div className="flex items-center gap-2 text-imperial-gold">
                      <Sparkles className="h-4 w-4" fill="currentColor" strokeWidth={1.25} />
                      <span className="text-[13px] font-medium text-silk-ivory">
                        Ảnh tạo bởi AI
                      </span>
                    </div>
                    {(() => {
                      const aiImgs =
                        viewingItem.outfit.tryOnImages && viewingItem.outfit.tryOnImages.length > 0
                          ? viewingItem.outfit.tryOnImages
                          : viewingItem.outfit.tryOnImage
                          ? [viewingItem.outfit.tryOnImage]
                          : [];
                      return (
                        <span className="text-[12px] text-silk-muted">{aiImgs.length} ảnh</span>
                      );
                    })()}
                  </div>

                  {(() => {
                    const aiImgs =
                      viewingItem.outfit.tryOnImages && viewingItem.outfit.tryOnImages.length > 0
                        ? viewingItem.outfit.tryOnImages
                        : viewingItem.outfit.tryOnImage
                        ? [viewingItem.outfit.tryOnImage]
                        : [];

                    if (aiImgs.length > 0) {
                      return (
                        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                          {aiImgs.map((aiUrl, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                setViewingItem({
                                  type: 'ai-photo',
                                  outfit: viewingItem.outfit,
                                  aiPhotoUrl: aiUrl,
                                });
                              }}
                              className="group relative flex aspect-[3/4] w-full cursor-pointer items-center justify-center overflow-hidden border border-imperial-gold/25 bg-black/80 transition-colors hover:border-imperial-gold"
                              title="Bấm để xem ảnh lớn"
                            >
                              <img
                                src={aiUrl}
                                alt={`${viewingItem.outfit.name} - AI ${idx + 1}`}
                                className="w-full h-full object-contain"
                              />
                              <div className="absolute bottom-2 left-2 flex items-center gap-1 border border-imperial-gold/30 bg-[#07090d]/90 px-2 py-0.5 text-[11px] font-medium text-imperial-gold-light">
                                <Sparkles className="w-3 h-3" />
                                <span>Xem ảnh lớn</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }

                    return (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center border border-imperial-gold/30 text-imperial-gold/80">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-silk-ivory mb-1">
                          Chưa có ảnh AI
                        </p>
                        <p className="text-xs text-silk-muted mb-4 leading-relaxed">
                          Outfit này chưa tạo ảnh thử đồ AI. Mở Studio để phối và tạo ảnh độc bản.
                        </p>
                        <button
                          onClick={() => {
                            onLoadOutfitIntoStudio(viewingItem.outfit);
                            setViewingItem(null);
                            onOpenStudio();
                          }}
                          className="flex w-full cursor-pointer items-center justify-center gap-1.5 bg-imperial-gold px-3 py-2.5 text-[13px] font-semibold text-lacquer transition-colors hover:bg-imperial-gold-light"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Tạo ảnh trong Studio</span>
                        </button>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* NẾU ĐANG XEM ẢNH AI: CỘT PHẢI HIỂN THỊ OUTFIT GỐC */
                <div className="flex h-auto w-full flex-col border border-imperial-gold/30 bg-lacquer/90 p-4 lg:h-[70vh] lg:w-72 xl:w-80">
                  <div className="mb-3 flex items-center gap-2 border-b border-imperial-gold/20 pb-3 text-imperial-gold">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-[13px] font-medium text-silk-ivory">
                      Bản phối gốc
                    </span>
                  </div>

                  <div
                    onClick={() => {
                      setViewingItem({
                        type: 'outfit',
                        outfit: viewingItem.outfit,
                      });
                    }}
                    className="relative mb-3 aspect-square w-full cursor-pointer overflow-hidden border border-imperial-gold/25 bg-black/70 transition-colors hover:border-imperial-gold"
                    title="Bấm để xem outfit"
                  >
                    <OutfitMannequinComposite
                      outfit={viewingItem.outfit}
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 border border-imperial-gold/30 bg-[#07090d]/90 px-2 py-0.5 text-[11px] text-imperial-gold-light">
                      <span>Xem bản phối</span>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-silk-ivory truncate">
                    {viewingItem.outfit.name}
                  </p>
                  <p className="text-xs text-silk-muted mt-0.5">
                    {viewingItem.outfit.event?.name || 'Sự kiện cổ truyền'}
                  </p>

                  <button
                    onClick={() => {
                      onLoadOutfitIntoStudio(viewingItem.outfit);
                      setViewingItem(null);
                      onOpenStudio();
                    }}
                    className="mt-auto flex w-full cursor-pointer items-center justify-center gap-1.5 border border-imperial-gold/40 px-3 py-2.5 text-[13px] font-medium text-silk-ivory transition-colors hover:border-imperial-gold hover:text-imperial-gold-light"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Mở trong Studio</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* THANH CÔNG CỤ DƯỚI ĐÁY: NÚT XÓA CHUYỂN XUỐNG ĐÂY */}
          <div
            className="flex items-center justify-center border-t border-imperial-gold/25 bg-lacquer/85 px-4 py-3.5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Nút Xóa (Đã chuyển xuống thanh công cụ dưới đáy) */}
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `Bạn có chắc muốn xóa "${viewingItem.outfit.name}" khỏi bộ sưu tập?`
                    )
                  ) {
                    onDeleteOutfit(viewingItem.outfit.id);
                    setViewingItem(null);
                  }
                }}
                className="flex cursor-pointer items-center gap-1.5 border border-rose-400/35 bg-rose-950/30 px-3.5 py-2 text-[13px] font-medium text-rose-200 transition-colors hover:border-rose-300"
                title="Xóa khỏi bộ sưu tập"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa</span>
              </button>

              {/* Yêu thích */}
              {onToggleFavorite && (
                <button
                  onClick={() => onToggleFavorite(viewingItem.outfit.id)}
                  className={`flex cursor-pointer items-center gap-1.5 border px-3.5 py-2 text-[13px] font-medium transition-colors ${
                    viewingItem.outfit.isFavorite
                      ? 'border-rose-400/40 bg-rose-950/30 text-rose-200'
                      : 'border-imperial-gold/30 text-silk-muted hover:border-imperial-gold/60 hover:text-silk-ivory'
                  }`}
                  title={viewingItem.outfit.isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      viewingItem.outfit.isFavorite ? 'fill-rose-400' : ''
                    }`}
                  />
                  <span>{viewingItem.outfit.isFavorite ? 'Đã thích' : 'Yêu thích'}</span>
                </button>
              )}

              {/* Tải ảnh về máy */}
              <button
                onClick={() => {
                  const url =
                    viewingItem.type === 'ai-photo' && viewingItem.aiPhotoUrl
                      ? viewingItem.aiPhotoUrl
                      : viewingItem.outfit.tryOnImage ||
                        (viewingItem.outfit.tryOnImages && viewingItem.outfit.tryOnImages[0]) ||
                        viewingItem.outfit.top?.piece?.assetUrl ||
                        '';
                  if (url) {
                    handleDownload(url, viewingItem.outfit.name);
                  } else {
                    showToast('Không có liên kết ảnh để tải');
                  }
                }}
                className="flex cursor-pointer items-center gap-1.5 border border-imperial-gold/30 px-3.5 py-2 text-[13px] font-medium text-silk-muted transition-colors hover:border-imperial-gold/60 hover:text-silk-ivory"
                title="Tải ảnh về máy"
              >
                <Download className="w-4 h-4" />
                <span>Tải ảnh</span>
              </button>

              {/* Mở lại trong Studio */}
              <button
                onClick={() => {
                  onLoadOutfitIntoStudio(viewingItem.outfit);
                  setViewingItem(null);
                  onOpenStudio();
                }}
                className="flex cursor-pointer items-center gap-1.5 bg-imperial-gold px-4 py-2 text-[13px] font-semibold text-lacquer transition-colors hover:bg-imperial-gold-light"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Mở trong Studio</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
