import React, { useState, useEffect } from 'react';
import { Download, Sparkles, Heart, CheckCircle2, ChevronDown } from 'lucide-react';
import { ActiveOutfitState, EventBackground, GenderSelection } from '../types';
import {
  getPieceAlignment,
  getAlignmentStyle,
  PieceAlignment,
} from '../data/pieceAlignments';
import { drawAlignedLayer, drawImageContained } from '../services/tryOnService';

interface StudioCanvas2DProps {
  outfit: ActiveOutfitState;
  allEvents: EventBackground[];
  onSelectEvent: (event: EventBackground) => void;
  onSelectGender: (gender: GenderSelection) => void;
  onOpenCustomEventModal: () => void;
  onTryOn: () => void;
  onSaveOutfit: () => void;
  isLoggedIn: boolean;
  canTryOn: boolean;
  onLoginPrompt?: () => void;
}

export const StudioCanvas2D: React.FC<StudioCanvas2DProps> = ({
  outfit,
  allEvents,
  onSelectEvent,
  onSelectGender,
  onOpenCustomEventModal,
  onTryOn,
  onSaveOutfit,
  isLoggedIn,
  canTryOn,
  onLoginPrompt,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const [, setAlignmentVersion] = useState(0);

  // Subscribe to live alignment updates from Dev Calibrator
  useEffect(() => {
    const handleUpdate = () => setAlignmentVersion((v) => v + 1);
    window.addEventListener('vietphuc_alignments_updated', handleUpdate);
    return () => window.removeEventListener('vietphuc_alignments_updated', handleUpdate);
  }, []);

  // Compute active pieces (supporting piece or variant alias)
  const bottomPiece = outfit.bottomPiece || outfit.bottomVariant;
  const footwearPiece = outfit.footwearPiece || outfit.footwearVariant;
  const topPiece = outfit.topPiece || outfit.topVariant;
  const accessoryPiece = outfit.accessoryPiece || outfit.accessoryVariant;

  const bottomAlign = getPieceAlignment(bottomPiece?.id);
  const footwearAlign = getPieceAlignment(footwearPiece?.id);
  const topAlign = getPieceAlignment(topPiece?.id);
  const accessoryAlign = getPieceAlignment(accessoryPiece?.id);

  // Export current layers to a single downloadable PNG via HTML5 Canvas
  const handleDownloadMockup = async () => {
    if (!isLoggedIn) {
      onLoginPrompt?.();
      return;
    }
    setIsExporting(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 900;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      interface LayerItem {
        url: string;
        alignment?: PieceAlignment;
        isCover?: boolean;
      }

      const layersToDraw: LayerItem[] = [];

      // 0. Event Background
      if (outfit.event.bgUrl) layersToDraw.push({ url: outfit.event.bgUrl, isCover: true });

      // 1. Mannequin
      layersToDraw.push({
        url: outfit.mannequinGender === 'men' ? '/assets/mannequins/mannequin-men.png' : '/assets/mannequins/mannequin-base.png',
      });

      // 2. Bottoms
      if (bottomPiece) {
        layersToDraw.push({ url: bottomPiece.assetUrl, alignment: bottomAlign });
      }

      // 3. Footwear
      if (footwearPiece) {
        layersToDraw.push({ url: footwearPiece.assetUrl, alignment: footwearAlign });
      }

      // 4. Tops
      if (topPiece) {
        layersToDraw.push({ url: topPiece.assetUrl, alignment: topAlign });
      }

      // 5. Accessories
      if (accessoryPiece) {
        layersToDraw.push({ url: accessoryPiece.assetUrl, alignment: accessoryAlign });
      }

      // Load all images
      const loadImg = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`Failed to load ${url}`));
          img.src = url;
        });

      for (const item of layersToDraw) {
        const img = await loadImg(item.url);
        if (item.isCover) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        } else if (item.alignment) {
          drawAlignedLayer(ctx, img, item.alignment, canvas.width, canvas.height);
        } else {
          drawImageContained(ctx, img, 0, 0, canvas.width, canvas.height);
        }
      }

      // Watermark / signature
      ctx.fillStyle = 'rgba(10, 13, 18, 0.85)';
      ctx.fillRect(20, canvas.height - 70, 360, 50);
      ctx.strokeStyle = '#C69B56';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, canvas.height - 70, 360, 50);
      ctx.fillStyle = '#C69B56';
      ctx.font = 'bold 18px "Inter", sans-serif';
      ctx.fillText('Việt phục Remix — Atelier 2D', 35, canvas.height - 38);

      const link = document.createElement('a');
      link.download = `vietphuc-remix-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative w-full h-full min-h-0 bg-lacquer-surface flex items-center justify-center overflow-hidden select-none font-sans">
      {/* Layer 0: Full-bleed Event Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={outfit.event.bgUrl}
          alt={outfit.event.name}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        {/* Cinematic Vignette - Subtly reduced so background shines through bright and vibrant */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/15 pointer-events-none" />
      </div>

      {/* Layer 1 - 5: Scaled 3:4 Mannequin & Clothes Composite Stage inside 1:1 Canvas */}
      <div className="relative z-10 h-full max-h-[96%] aspect-[3/4] flex items-center justify-center pointer-events-none py-2">
        {/* Layer 1: Mannequin */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={outfit.mannequinGender === 'men' ? '/assets/mannequins/mannequin-men.png' : '/assets/mannequins/mannequin-base.png'}
            alt={outfit.mannequinGender === 'men' ? 'Ma-nơ-canh nam' : 'Ma-nơ-canh chuẩn'}
            className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)]"
          />
        </div>

        {/* Layer 2: Quần / Chân váy (Z=20) */}
        {bottomPiece && (
          <div
            className="absolute inset-0 z-20 pointer-events-none transition-all duration-150"
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
        {footwearPiece && (
          <div
            className="absolute inset-0 z-30 pointer-events-none transition-all duration-150"
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
        {topPiece && (
          <div
            className="absolute inset-0 z-40 pointer-events-none transition-all duration-150"
            style={getAlignmentStyle(topAlign)}
          >
            <img
              src={topPiece.assetUrl}
              alt={topPiece.name}
              className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]"
            />
          </div>
        )}

        {/* Layer 5: Phụ kiện (Z=50) - Trên cùng */}
        {accessoryPiece && (
          <div
            className="absolute inset-0 z-50 pointer-events-none transition-all duration-150"
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

      {/* TOP-LEFT: Mannequin Gender Switcher */}
      <div className="absolute top-4 left-4 z-40 pointer-events-auto">
        <div className="flex items-center p-1 rounded-lg bg-lacquer/85 backdrop-blur-md border border-[#C5A059]/25 shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
          {/* Nút Nam (Male ♂) */}
          <button
            onClick={() => onSelectGender('men')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              outfit.mannequinGender === 'men'
                ? 'bg-gradient-to-r from-[#F0D195] via-[#E5BA70] to-[#DCAB5E] text-[#1A140E] shadow-[0_2px_8px_rgba(229,186,112,0.3)]'
                : 'text-[#EDE5D8]/70 hover:text-white hover:bg-white/[0.05]'
            }`}
            title="Mẫu Ma-nơ-canh Nam"
          >
            <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
              <circle cx="10" cy="14" r="5" />
              <path d="M19 5l-5.4 5.4M19 5h-5M19 5v5" />
            </svg>
            <span>Nam</span>
          </button>

          {/* Nút Nữ (Female ♀) */}
          <button
            onClick={() => onSelectGender('women')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              outfit.mannequinGender === 'women'
                ? 'bg-gradient-to-r from-rose-300 via-rose-200 to-amber-200 text-[#1A140E] shadow-[0_2px_8px_rgba(244,114,182,0.3)]'
                : 'text-[#EDE5D8]/70 hover:text-white hover:bg-white/[0.05]'
            }`}
            title="Mẫu Ma-nơ-canh Nữ"
          >
            <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
              <circle cx="12" cy="9" r="5" />
              <path d="M12 14v7M9 18h6" />
            </svg>
            <span>Nữ</span>
          </button>
        </div>
      </div>

      {/* TOP-RIGHT: Event Background Dropdown Selector */}
      <div className="absolute top-4 right-4 z-40 pointer-events-auto">
        <div className="relative">
          <button
            onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
            className="flex max-w-[min(78vw,28rem)] items-center gap-2 py-1.5 sm:py-2 px-3 sm:px-3.5 rounded-lg bg-lacquer/85 backdrop-blur-md border border-[#C5A059]/25 text-xs sm:text-sm font-semibold text-silk-ivory hover:border-[#E5BA70]/60 hover:text-[#E5BA70] shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-all cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#E5BA70] shadow-[0_0_6px_rgba(229,186,112,0.6)] flex-shrink-0" />
            <span className="min-w-0 truncate">Bối cảnh: {outfit.event.name}</span>
            <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C5A059] transition-transform flex-shrink-0 ${isEventDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isEventDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-[min(78vw,28rem)] rounded-xl bg-lacquer/95 backdrop-blur-xl border border-[#C5A059]/30 shadow-[0_12px_32px_rgba(0,0,0,0.85)] p-2 z-50 animate-fadeIn font-sans">
              <div className="px-3 py-1.5 text-[11px] font-sans font-bold uppercase tracking-wider text-[#E5BA70] border-b border-white/10 mb-1 flex items-center justify-between">
                <span>Chọn bối cảnh sự kiện</span>
                <span className="text-[10px] text-[#EDE5D8]/40 font-mono">({allEvents.length})</span>
              </div>
              <div className="max-h-60 overflow-y-auto no-scrollbar py-0.5 space-y-0.5">
                {allEvents.map((evt) => (
                  <button
                    key={evt.id}
                    onClick={() => {
                      onSelectEvent(evt);
                      setIsEventDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                      outfit.event.id === evt.id
                        ? 'bg-[#E5BA70]/15 text-[#E5BA70] font-bold border border-[#E5BA70]/30 shadow-sm'
                        : 'text-silk-ivory hover:bg-white/[0.06] hover:text-[#E5BA70] border border-transparent'
                    }`}
                  >
                    <span className="min-w-0 flex-1 leading-snug">{evt.name}</span>
                    {outfit.event.id === evt.id && <span className="w-1.5 h-1.5 rounded-full bg-[#E5BA70]" />}
                  </button>
                ))}
              </div>

              <div className="pt-2 mt-1 border-t border-white/10">
                <button
                  onClick={() => {
                    setIsEventDropdownOpen(false);
                    onOpenCustomEventModal();
                  }}
                  className="w-full flex items-center px-3 py-2 rounded-lg text-xs font-bold text-[#E5BA70] hover:bg-[#E5BA70]/15 transition-all cursor-pointer border border-[#E5BA70]/25"
                >
                  <span>Tạo bối cảnh bằng AI</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM-RIGHT: Vertical Action Dock (Sleek High-Res Luxury Action Stack) */}
      <div className="absolute bottom-6 right-5 z-40 flex flex-col items-center gap-3.5 pointer-events-auto">
        {/* Action 1: AI Try on */}
        <div className="relative group flex items-center justify-center">
          <button
            onClick={onTryOn}
            disabled={!canTryOn}
            aria-label="AI Try on"
            className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-[0_6px_20px_rgba(0,0,0,0.65)] ${
              canTryOn
                ? 'bg-lacquer/85 border border-[#E5BA70]/60 hover:border-[#E5BA70] hover:scale-110 active:scale-95 text-[#E5BA70] hover:shadow-[0_0_20px_rgba(229,186,112,0.5)] cursor-pointer'
                : 'bg-lacquer/60 border border-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            <Sparkles className={`w-6 h-6 sm:w-7 sm:h-7 transition-transform ${canTryOn ? 'fill-[#E5BA70]/20 text-[#E5BA70] group-hover:scale-110' : 'text-white/30'}`} />
          </button>

          {/* Left-floating Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 flex items-center opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 translate-x-1 group-hover:translate-x-0 z-50">
            <div className="bg-lacquer/95 text-silk-ivory text-xs font-sans font-semibold px-3 py-1.5 rounded-lg border border-[#C5A059]/40 shadow-2xl backdrop-blur-md whitespace-nowrap">
              {canTryOn ? 'Thử trang phục trên người thật (AI Try on)' : 'Chọn đủ Áo, Quần, Giày để thử đồ'}
            </div>
            <div className="w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-[#C5A059]/40" />
          </div>
        </div>

        {/* Action 2: Save Outfit */}
        <div className="relative group flex items-center justify-center">
          <button
            onClick={() => {
              if (!isLoggedIn) {
                onLoginPrompt?.();
              } else {
                onSaveOutfit();
              }
            }}
            disabled={!canTryOn}
            aria-label="Lưu outfit"
            className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-[0_6px_20px_rgba(0,0,0,0.65)] ${
              canTryOn
                ? 'bg-lacquer/85 border border-[#C5A059]/30 hover:border-rose-400 hover:scale-110 active:scale-95 text-rose-300 hover:shadow-[0_0_20px_rgba(244,114,182,0.4)] cursor-pointer'
                : 'bg-lacquer/60 border border-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            <Heart className={`w-6 h-6 sm:w-7 sm:h-7 transition-transform ${canTryOn ? 'text-rose-300 group-hover:fill-rose-300/40 group-hover:scale-110' : 'text-white/30'}`} />
          </button>

          {/* Left-floating Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 flex items-center opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 translate-x-1 group-hover:translate-x-0 z-50">
            <div className="bg-lacquer/95 text-silk-ivory text-xs font-sans font-semibold px-3 py-1.5 rounded-lg border border-[#C5A059]/40 shadow-2xl backdrop-blur-md whitespace-nowrap">
              {canTryOn ? (isLoggedIn ? 'Lưu vào Lookbook cá nhân' : 'Đăng nhập để lưu outfit') : 'Chọn đủ Áo, Quần, Giày để lưu'}
            </div>
            <div className="w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-[#C5A059]/40" />
          </div>
        </div>

        {/* Action 3: Download Canvas Mockup (PNG) */}
        <div className="relative group flex items-center justify-center">
          <button
            onClick={handleDownloadMockup}
            disabled={isExporting}
            aria-label="Tải ảnh phối đồ"
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-lacquer/85 border border-[#C5A059]/30 hover:border-[#E5BA70] hover:scale-110 active:scale-95 transition-all duration-200 backdrop-blur-md shadow-[0_6px_20px_rgba(0,0,0,0.65)] hover:shadow-[0_0_20px_rgba(229,186,112,0.4)] flex items-center justify-center text-silk-ivory hover:text-[#E5BA70] cursor-pointer"
          >
            {downloadSuccess ? (
              <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-green-400 fill-green-400/20" />
            ) : (
              <Download className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2] group-hover:scale-110 transition-transform" />
            )}
          </button>

          {/* Left-floating Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 flex items-center opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 translate-x-1 group-hover:translate-x-0 z-50">
            <div className="bg-lacquer/95 text-silk-ivory text-xs font-sans font-semibold px-3 py-1.5 rounded-lg border border-[#C5A059]/40 shadow-2xl backdrop-blur-md whitespace-nowrap">
              {downloadSuccess ? 'Đã tải ảnh mockup thành công!' : (isLoggedIn ? 'Tải ảnh phối đồ 2D (PNG)' : 'Đăng nhập để tải/lưu ảnh')}
            </div>
            <div className="w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-[#C5A059]/40" />
          </div>
        </div>
      </div>
    </div>
  );
};
