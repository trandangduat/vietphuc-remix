import React, { useState, useRef } from 'react';
import { SavedOutfit, Piece, Lookbook } from '../types';
import {
  Sparkles,
  ExternalLink,
  Trash2,
  Edit2,
  Check,
  X,
  Calendar,
  Layers,
  Download,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Heart,
  BookOpen,
  Plus,
} from 'lucide-react';
import { getPieceAlignment, getAlignmentStyle } from '../data/pieceAlignments';
import { CreateLookbookModal } from '../components/CreateLookbookModal';
import { LookbookDetailModal } from '../components/LookbookDetailModal';


/**
 * Traditional corner watermark for cards (cherry blossom, cloud, harvest moon, seal)
 */
const DecorWatermark: React.FC<{ type?: 'cloud' | 'blossom' | 'moon' | 'seal' }> = ({ type = 'blossom' }) => {
  if (type === 'moon') {
    return (
      <div className="w-6 h-6 rounded-full border border-[#8c745c]/40 flex items-center justify-center opacity-45">
        <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#8c745c]/50 to-transparent" />
      </div>
    );
  }
  if (type === 'seal') {
    return (
      <div className="w-4.5 h-4.5 border border-[#8B1E1E]/50 rounded-none flex items-center justify-center opacity-60">
        <span className="text-[7.5px] text-[#8B1E1E] font-serif font-black">ẤN</span>
      </div>
    );
  }
  if (type === 'cloud') {
    return (
      <img
        src="/assets/decorations/golden-cloud.png"
        alt="Mây"
        className="w-6 h-auto opacity-40 object-contain"
      />
    );
  }
  // blossom default
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5 text-[#8c745c] opacity-40">
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 4.5 C 9.5 7 9.5 9 12 9 C 14.5 9 14.5 7 12 4.5 Z M19.5 12 C 17 9.5 15 9.5 15 12 C 15 14 17 14 19 12 Z M12 19.5 C 14.5 17 14.5 15 12 15 C 9.5 15 9.5 17 12 19.5 Z M4.5 12 C 7 14.5 9 14.5 9 12 C 9 9.5 7 9.5 4.5 12 Z" />
    </svg>
  );
};

/**
 * Renders the full mannequin composite wearing all pieces for an outfit
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
      {/* Background Event Layer */}
      {outfit.event?.bgUrl && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={outfit.event.bgUrl}
            alt={outfit.event.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isModal ? 'opacity-95' : 'opacity-90 group-hover:scale-105'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      {/* Scaled Mannequin & Clothes Composite Stage */}
      <div
        className={`relative z-10 w-full h-full max-h-[96%] aspect-[3/4] flex items-center justify-center pointer-events-none py-2 transition-transform duration-500 ${
          isModal ? '' : 'group-hover:scale-105'
        }`}
      >
        {/* Layer 1: Mannequin Base */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <img
            src="/assets/mannequins/mannequin-base.png"
            alt="Ma-nơ-canh"
            className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)]"
          />
        </div>

        {/* Layer 2: Quần / Chân váy (Z=20) */}
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

        {/* Layer 3: Giày / Dép (Z=30) */}
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

        {/* Layer 4: Áo (Z=40) - Phủ lên quần */}
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

        {/* Layer 5: Phụ kiện (Z=50) - Nón, khăn, mũ */}
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

/**
 * Vintage Giấy Dó Postcard Card Component (Artistic Scrapbook Style with Real Torn Paper Asset)
 */
const ScrapbookPostcardCard: React.FC<{
  outfit: SavedOutfit;
  onSelect: () => void;
  onToggleFavorite?: (id: string) => void;
  isLoggedIn?: boolean;
  onLoginPrompt?: () => void;
}> = ({ outfit, onSelect, onToggleFavorite, isLoggedIn, onLoginPrompt }) => {
  const hasAIImage = Boolean(outfit.tryOnImage || (outfit.tryOnImages && outfit.tryOnImages.length > 0));
  const tilt = outfit.tiltAngle || 0;
  const isFeatured = Boolean(outfit.isFeatured);

  // Format date-time: DD/MM/YYYY • HH:mm
  const formatCreationDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const day = date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const hasTime = dateStr.includes('T') || dateStr.includes(':');
      const time = hasTime
        ? date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })
        : '09:00';
      return `${day} • ${time}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative flex-shrink-0 cursor-pointer transition-all duration-300 ${
        isFeatured
          ? 'w-[280px] sm:w-[305px] md:w-[320px] scale-105 z-20'
          : 'w-[250px] sm:w-[270px] md:w-[280px] z-10 hover:z-30 hover:scale-105'
      }`}
      style={{
        transform: tilt !== 0 ? `rotate(${tilt}deg)` : undefined,
      }}
    >
      {/* Outer shadow filter wrapping the authentic torn paper */}
      <div
        className={`w-full transition-all duration-300 ${
          isFeatured
            ? 'filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.95)] drop-shadow-[0_0_28px_rgba(216,175,101,0.5)]'
            : 'filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] group-hover:drop-shadow-[0_18px_32px_rgba(0,0,0,0.95)]'
        }`}
      >
        {/* Pinned Washi Tape / Crown Ribbon at Top (Increased font size) */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none">
          {isFeatured ? (
            <div className="bg-gradient-to-r from-[#d8af65] via-[#f7e3b8] to-[#c69b56] text-[#241402] px-4 py-1.5 text-sm sm:text-base font-calligraphy font-black shadow-md border border-[#9A7332] whitespace-nowrap rounded-xs flex items-center gap-1.5 -rotate-1">
              <span>{outfit.conceptTag || '👑 Được yêu thích nhất'}</span>
            </div>
          ) : (
            <div className="bg-[#ede0ca]/95 backdrop-blur-xs border-y border-[#cbba9e]/70 shadow-xs px-4 py-1 text-sm sm:text-base font-calligraphy text-[#2e2014] font-black whitespace-nowrap -rotate-1.5">
              <span>{outfit.conceptTag || outfit.name}</span>
            </div>
          )}
        </div>

        {/* The Authentic Handmade Giấy Dó Paper Canvas using delicate deckled paper asset */}
        <div className="relative w-full px-5 sm:px-6 pt-5 sm:pt-5.5 pb-5 sm:pb-6 flex flex-col gap-2.5 select-none">
          {/* Real Deckled Paper Texture Asset */}
          <img
            src="/assets/decorations/deckled-paper.png"
            alt="Giấy Dó viền thô tự nhiên"
            className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
          />

          {/* Inner Content Layer (comfortably centered inside deckled paper borders) */}
          <div className="relative z-10 flex flex-col gap-2.5">
            {/* Inner Photo Frame (Standard 9:16 aspect ratio with clean border) */}
            <div className="relative w-full aspect-[9/16] overflow-hidden bg-black/95 border border-[#2d2216]/50 rounded-[2px] shadow-sm">
              {hasAIImage ? (
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={outfit.tryOnImage || (outfit.tryOnImages && outfit.tryOnImages[0])}
                    alt={outfit.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>
              ) : (
                <OutfitMannequinComposite outfit={outfit} />
              )}
            </div>

            {/* Bottom Card Footer Area (Spaced generously away from paper deckled edges) */}
            <div className="flex flex-col gap-2 px-1 pt-1">
              {/* Row 1: Timestamp & Favorite Heart Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs text-[#4a3928] font-mono tracking-wider font-bold">
                  {formatCreationDateTime(outfit.createdAt)}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isLoggedIn) {
                      onLoginPrompt?.();
                      return;
                    }
                    onToggleFavorite?.(outfit.id);
                  }}
                  className="p-1 hover:scale-125 active:scale-95 transition-transform text-[#6d543e] hover:text-[#8B1E1E] cursor-pointer"
                  title={outfit.isFavorite ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
                >
                  <Heart
                    className={`w-3.5 h-3.5 transition-colors ${
                      outfit.isFavorite ? 'fill-[#8B1E1E] text-[#8B1E1E]' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Row 2: Color Palette Swatches & Traditional Corner Watermark */}
              <div className="flex items-center justify-between pt-0.5">
                {/* Palette dots */}
                <div className="flex items-center gap-1.5">
                  {(outfit.colorPalette || ['#8B1E1E', '#F7F4EE', '#9A7332']).map((color, idx) => (
                    <span
                      key={idx}
                      className="w-2.5 h-2.5 rounded-full border border-black/20 shadow-2xs inline-block"
                      style={{ backgroundColor: color }}
                      title={`Màu sắc trang phục #${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Traditional Watermark Stamp */}
                <div className="pr-1">
                  <DecorWatermark type={outfit.decorStamp} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Lookbook Album Card (Trang Lookbook tạp chí thời trang)
 */
const LookbookAlbumCard: React.FC<{
  lookbook: Lookbook;
  allOutfits: SavedOutfit[];
  onOpen: () => void;
  onDelete?: () => void;
}> = ({ lookbook, allOutfits, onOpen, onDelete }) => {
  const outfit =
    allOutfits.find((o) => o.id === lookbook.outfitId) ||
    allOutfits.find((o) => lookbook.outfitIds?.includes(o.id));
  const coverImage =
    lookbook.coverImageUrl ||
    outfit?.tryOnImage ||
    outfit?.top?.piece?.thumbnailUrl ||
    outfit?.top?.piece?.assetUrl ||
    '';

  return (
    <div
      onClick={onOpen}
      className="group relative bg-lacquer-surface border-2 border-imperial-gold/60 hover:border-imperial-gold p-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(216,175,101,0.25)] flex flex-col justify-between cursor-pointer select-none"
    >
      {/* Visual Cover Stage */}
      <div className="relative aspect-[3/4] w-full bg-lacquer overflow-hidden border border-lacquer-border/80 flex items-center justify-center">
        {coverImage ? (
          <img
            src={coverImage}
            alt={lookbook.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="text-center p-4">
            <BookOpen className="w-12 h-12 text-imperial-gold/40 mx-auto mb-2" />
            <span className="text-xs text-silk-muted">Chưa có ảnh bìa</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

        {/* Corner Decor Stamp */}
        <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
          <DecorWatermark type={lookbook.decorStamp || 'seal'} />
        </div>

        {/* Look Number badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-black/75 backdrop-blur-md text-imperial-gold border border-imperial-gold/40">
            {lookbook.lookNumber || 'LOOK 01'}
          </span>
        </div>

        {/* Bottom Title on Image */}
        <div className="absolute bottom-3 inset-x-3 z-10">
          <h3 className="font-serif font-extrabold text-base sm:text-lg text-silk-ivory leading-snug drop-shadow-md group-hover:text-imperial-gold transition-colors line-clamp-2">
            {lookbook.title}
          </h3>
          {lookbook.subtitle && (
            <p className="text-[11px] text-imperial-gold/90 font-serif italic drop-shadow mt-0.5">
              {lookbook.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Info & Actions */}
      <div className="mt-3 pt-2.5 border-t border-lacquer-border/70 flex items-center justify-between">
        <div className="min-w-0 flex-1 pr-2">
          {lookbook.description ? (
            <p className="text-[11px] text-silk-muted italic truncate">
              "{lookbook.description}"
            </p>
          ) : (
            <p className="text-[11px] text-silk-muted">
              Tạo lúc {new Date(lookbook.createdAt).toLocaleDateString('vi-VN')}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Bạn có chắc muốn xóa Lookbook "${lookbook.title}" không? (Outfit gốc vẫn được giữ lại)`)) {
                  onDelete();
                }
              }}
              className="p-1.5 text-silk-muted hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
              title="Xóa Lookbook"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="p-1 text-imperial-gold group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
};

interface LookbookScreenProps {
  outfits: SavedOutfit[];
  lookbooks?: Lookbook[];
  isLoggedIn: boolean;
  onLoginPrompt: () => void;
  onLoadOutfitIntoStudio: (outfit: SavedOutfit) => void;
  onDeleteOutfit: (id: string) => void;
  onRenameOutfit: (id: string, newName: string) => void;
  onToggleFavorite?: (id: string) => void;
  onOpenStudio: () => void;
  onCreateLookbook?: (data: {
    title: string;
    subtitle: string;
    description: string;
    outfitId: string;
    coverImageUrl: string;
    verticalPoem: string;
    decorStamp: 'blossom' | 'cloud' | 'moon' | 'seal';
  }) => Promise<void>;
  onDeleteLookbook?: (id: string) => Promise<void>;
  showToast?: (msg: string) => void;
}

export const LookbookScreen: React.FC<LookbookScreenProps> = ({
  outfits,
  lookbooks = [],
  isLoggedIn,
  onLoginPrompt,
  onLoadOutfitIntoStudio,
  onDeleteOutfit,
  onRenameOutfit,
  onToggleFavorite,
  onOpenStudio,
  onCreateLookbook,
  onDeleteLookbook,
  showToast = () => {},
}) => {
  // Active Tab: 'lookbooks' (Bộ sưu tập) | 'all-outfits' (Tất cả outfit)
  const [activeTab, setActiveTab] = useState<'lookbooks' | 'all-outfits'>('lookbooks');

  // Modal create lookbook state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Selected lookbook for detail viewer
  const [selectedLookbook, setSelectedLookbook] = useState<Lookbook | null>(null);

  // Modal detail view for clicked outfit
  const [selectedOutfit, setSelectedOutfit] = useState<SavedOutfit | null>(null);

  // Active view inside modal: '2d' or index of AI image
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);

  // Inline rename state in modal
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameText, setEditNameText] = useState('');

  // Carousel slider ref
  const sliderRef = useRef<HTMLDivElement>(null);

  // Smooth scroll handler for carousel arrows
  const handleScroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 320;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Open detail modal for outfit
  const handleOpenDetail = (outfit: SavedOutfit) => {
    setSelectedOutfit(outfit);
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

  return (
    <div className="w-full min-h-[calc(100vh-56px)] bg-lacquer text-silk-ivory font-sans pb-16 relative overflow-hidden">
      {/* ATMOSPHERIC BACKGROUND ENVIRONMENT: 16:9 Ancient Imperial Palace Courtyard & Veranda at Night */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <img
          src="/assets/backgrounds/gallery-bg.jpg"
          alt="Không gian cổ lầu hoàng cung"
          className="w-full h-full object-cover object-center opacity-35 sm:opacity-45 filter brightness-90 contrast-105"
        />
        {/* Ambient Dark Gradient Overlays for High Card Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-lacquer/80 via-lacquer/50 to-lacquer/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#0A0D12_90%)]" />
        {/* Warm lantern glow highlights */}
        <div className="absolute top-12 right-1/4 w-96 h-96 rounded-full bg-imperial-gold/15 filter blur-[100px]" />
        <div className="absolute top-24 left-1/4 w-80 h-80 rounded-full bg-imperial-red/10 filter blur-[90px]" />
      </div>

      {/* 1. GUEST SESSION BANNER (Non-intrusive, invites Google Sign-In) */}
      {!isLoggedIn && (
        <div className="relative z-10 w-full bg-lacquer-surface/90 backdrop-blur-md border-b border-imperial-gold/30 px-4 sm:px-6 lg:px-10 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-imperial-gold animate-ping" />
            <span className="text-silk-muted">
              Đăng nhập bằng tài khoản Google để bắt đầu lưu trữ và quản lý các bộ sưu tập Việt phục của riêng bạn.
            </span>
          </div>
          <button
            onClick={onLoginPrompt}
            className="px-4 py-1.5 bg-imperial-gold hover:bg-imperial-gold-light text-lacquer font-bold text-xs uppercase tracking-wider shadow transition-all whitespace-nowrap cursor-pointer"
          >
            Đăng nhập với Google
          </button>
        </div>
      )}

      {/* 2. ARTISTIC EDITORIAL HERO HEADER (Title without badge, Golden Chim Lac Hong motif next to Outfit) */}
      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 pt-7 pb-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Title "Bộ Sưu Tập" over "Outfit" + Golden Chim Lạc Hồng Motif */}
          <div className="flex flex-col">
            {/* Line 1: Bộ Sưu Tập */}
            <h1 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-silk-ivory tracking-tight drop-shadow-md leading-none">
              Bộ Sưu Tập
            </h1>

            {/* Line 2: Outfit + Golden Chim Lạc Hồng Motif Asset (Simplified, Golden) */}
            <div className="flex items-center gap-3.5 sm:gap-4 mt-2">
              <span className="font-calligraphy text-4xl sm:text-5xl lg:text-6xl text-[#e8c87b] -rotate-2 font-bold drop-shadow-[0_4px_14px_rgba(232,200,123,0.35)] leading-none select-none">
                Outfit
              </span>
              <img
                src="/assets/decorations/chim-lac.png"
                alt="Họa tiết chim Lạc Hồng vàng kim"
                className="h-8 sm:h-10 lg:h-11 w-auto object-contain filter drop-shadow-[0_2px_12px_rgba(232,200,123,0.5)] select-none pointer-events-none inline-block hover:scale-105 transition-transform"
              />
            </div>
          </div>

          {/* Right: Poetic Calligraphic Quote & Parchment "Tạo Lookbook" Button (No rounded corners) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 self-start md:self-center">
            {/* Calligraphic poetic quote */}
            <div className="text-left sm:text-right hidden sm:block">
              <p className="font-calligraphy text-lg sm:text-xl text-[#f3eedd]/90 italic -rotate-1 leading-snug drop-shadow-sm">
                Mỗi bộ đồ là một câu chuyện về văn hóa Việt
              </p>
            </div>

            {/* Stylized Golden Parchment Button (rounded-none, sharp corners) */}
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  onLoginPrompt();
                } else {
                  setIsCreateModalOpen(true);
                }
              }}
              className="py-2.5 px-6 rounded-none bg-gradient-to-r from-[#d8af65] via-[#f2d89b] to-[#d8af65] text-[#241708] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[0_6px_22px_rgba(216,175,101,0.4)] hover:brightness-110 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 border-2 border-[#fae7be]/70 cursor-pointer flex-shrink-0"
              title="Tạo Lookbook mới"
            >
              <BookOpen className="w-4 h-4 stroke-[2.5]" />
              <span className="font-extrabold">TẠO LOOKBOOK</span>
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. TABS SELECTOR (Trực quan & dễ hiểu): "Lookbook" & "Tất Cả Outfit" */}
      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 mt-4 mb-2 flex items-center gap-3">
        <button
          onClick={() => setActiveTab('lookbooks')}
          className={`px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 border cursor-pointer ${
            activeTab === 'lookbooks'
              ? 'bg-imperial-gold text-lacquer border-imperial-gold shadow-md'
              : 'bg-lacquer/80 text-silk-muted border-lacquer-border hover:text-silk-ivory hover:border-imperial-gold/50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Lookbook</span>
          <span
            className={`px-1.5 py-0.2 text-[10px] font-bold ${
              activeTab === 'lookbooks'
                ? 'bg-lacquer text-imperial-gold'
                : 'bg-imperial-gold/20 text-imperial-gold'
            }`}
          >
            {lookbooks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all-outfits')}
          className={`px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 border cursor-pointer ${
            activeTab === 'all-outfits'
              ? 'bg-imperial-gold text-lacquer border-imperial-gold shadow-md'
              : 'bg-lacquer/80 text-silk-muted border-lacquer-border hover:text-silk-ivory hover:border-imperial-gold/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Tất Cả Outfit</span>
          <span
            className={`px-1.5 py-0.2 text-[10px] font-bold ${
              activeTab === 'all-outfits'
                ? 'bg-lacquer text-imperial-gold'
                : 'bg-imperial-gold/20 text-imperial-gold'
            }`}
          >
            {outfits.length}
          </span>
        </button>
      </div>

      {/* 4. MAIN CONTENT AREA: TAB "LOOKBOOK" HOẶC TAB "TẤT CẢ OUTFIT" */}
      {activeTab === 'lookbooks' ? (
        /* TAB 1: LOOKBOOK (MAGAZINE SPREADS GRID) */
        <div className="relative z-10 w-full pt-4 pb-8">
          {lookbooks.length === 0 ? (
            <div className="mx-6 sm:mx-12 text-center py-20 p-8 rounded-none bg-lacquer-surface/60 border border-lacquer-border backdrop-blur-md">
              <BookOpen className="w-16 h-16 text-imperial-gold/40 mx-auto mb-4" />
              <h3 className="font-serif font-bold text-2xl text-silk-ivory mb-2">
                Chưa có Lookbook nào
              </h3>
              <p className="text-sm text-silk-muted max-w-md mx-auto mb-6 leading-relaxed">
                Bạn đã có {outfits.length} bộ outfit đã lưu. Hãy chọn 1 bộ outfit và bấm 'TẠO LOOKBOOK' để biến thành trang bìa tạp chí thời trang cổ phong tinh xảo!
              </p>
              <button
                onClick={() => {
                  if (!isLoggedIn) onLoginPrompt();
                  else setIsCreateModalOpen(true);
                }}
                className="py-3 px-6 rounded-none bg-gradient-to-r from-imperial-gold to-imperial-gold-light text-lacquer font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg transition-all cursor-pointer"
              >
                Tạo Lookbook Đầu Tiên
              </button>
            </div>
          ) : (
            <div className="px-4 sm:px-8 lg:px-12 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {lookbooks.map((lb) => (
                <LookbookAlbumCard
                  key={lb.id}
                  lookbook={lb}
                  allOutfits={outfits}
                  onOpen={() => setSelectedLookbook(lb)}
                  onDelete={
                    onDeleteLookbook ? () => onDeleteLookbook(lb.id) : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* TAB 2: TẤT CẢ OUTFIT (SCRAPBOOK POSTCARDS REEL) */
        <div className="relative z-10 w-full pt-4 pb-8">
          {outfits.length === 0 ? (
            /* Empty State */
            <div className="mx-6 sm:mx-12 text-center py-24 p-8 rounded-2xl bg-lacquer-surface/50 border border-lacquer-border backdrop-blur-md">
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
            /* Carousel Stage Container with Floating Nav Buttons and Edge Fades */
            <div className="relative w-full">
              {/* Left Edge Fade for Overflow Effect */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-lacquer via-lacquer/80 to-transparent z-30" />

              {/* Right Edge Fade for Overflow Effect */}
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-lacquer via-lacquer/80 to-transparent z-30" />

              {/* Floating Left Arrow Button */}
              <button
                onClick={() => handleScroll('left')}
                className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-[#d8af65] hover:text-lacquer text-silk-ivory border border-white/20 hover:border-[#d8af65] backdrop-blur-md flex items-center justify-center transition-all shadow-[0_8px_24px_rgba(0,0,0,0.8)] hover:scale-110 active:scale-95 cursor-pointer"
                title="Cuộn sang trái"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
              </button>

              {/* Floating Right Arrow Button */}
              <button
                onClick={() => handleScroll('right')}
                className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-[#d8af65] hover:text-lacquer text-silk-ivory border border-white/20 hover:border-[#d8af65] backdrop-blur-md flex items-center justify-center transition-all shadow-[0_8px_24px_rgba(0,0,0,0.8)] hover:scale-110 active:scale-95 cursor-pointer"
                title="Cuộn sang phải"
              >
                <ChevronRight className="w-6 h-6 stroke-[2.5]" />
              </button>

              {/* Horizontal Scroll Reel */}
              <div
                ref={sliderRef}
                className="w-full overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-6 sm:gap-7 lg:gap-8 px-12 sm:px-20 lg:px-24 py-10"
              >
                {outfits.map((outfit) => (
                  <ScrapbookPostcardCard
                    key={outfit.id}
                    outfit={outfit}
                    onSelect={() => handleOpenDetail(outfit)}
                    onToggleFavorite={onToggleFavorite}
                    isLoggedIn={isLoggedIn}
                    onLoginPrompt={onLoginPrompt}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. THE OUTFIT DETAIL MODAL (Opens when clicking any card) */}
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

            {/* LEFT SIDE: Media Visual Stage (58%) */}
            <div className="w-full lg:w-[58%] bg-lacquer-card flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-lacquer-border/80 relative overflow-hidden">
              {/* Media Display Canvas */}
              <div className="relative flex-1 min-h-[340px] sm:min-h-[440px] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-lacquer to-lacquer-surface overflow-hidden">
                {/* The Active Media */}
                {(() => {
                  const mediaList = getOutfitMediaList(selectedOutfit);
                  const activeMedia = mediaList[activeMediaIndex] || mediaList[0];
                  if (activeMedia?.type === '2d') {
                    return <OutfitMannequinComposite outfit={selectedOutfit} isModal={true} />;
                  }
                  return (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={activeMedia?.url}
                        alt={selectedOutfit.name}
                        className="relative z-10 max-h-[460px] max-w-full rounded-xl object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.9)]"
                      />
                    </div>
                  );
                })()}

                {/* Floating badge for active media */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
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
                      {isLoggedIn && (
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
                      )}
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

                {isLoggedIn && (
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
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Lookbook Modal */}
      {onCreateLookbook && (
        <CreateLookbookModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          outfits={outfits}
          onCreateLookbook={onCreateLookbook}
          onOpenStudio={onOpenStudio}
        />
      )}

      {/* Lookbook Detail Viewer Modal */}
      {selectedLookbook && (
        <LookbookDetailModal
          isOpen={Boolean(selectedLookbook)}
          onClose={() => setSelectedLookbook(null)}
          lookbook={selectedLookbook}
          allOutfits={outfits}
          onLoadOutfitIntoStudio={onLoadOutfitIntoStudio}
          onDeleteLookbook={(id) => {
            onDeleteLookbook?.(id);
            setSelectedLookbook(null);
          }}
          showToast={showToast}
        />
      )}
    </div>
  );
};
