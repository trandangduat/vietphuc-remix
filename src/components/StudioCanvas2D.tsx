import React, { useState, useEffect } from 'react';
import { Download, Sparkles, Heart, CheckCircle2, ChevronDown, Plus } from 'lucide-react';
import { ActiveOutfitState, EventBackground, GenderSelection } from '../types';
import {
  getPieceAlignment,
  getAlignmentStyle,
  PieceAlignment,
} from '../data/pieceAlignments';

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
      layersToDraw.push({ url: '/assets/mannequins/mannequin-base.png' });

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
          const align = item.alignment;
          ctx.save();
          const cx = canvas.width / 2 + (align.x / 100) * canvas.width;
          const cy = canvas.height / 2 + (align.y / 100) * canvas.height;
          ctx.translate(cx, cy);
          if (align.rotate) {
            ctx.rotate((align.rotate * Math.PI) / 180);
          }
          const sx = align.scale * (align.scaleX ?? 1);
          const sy = align.scale * (align.scaleY ?? 1);
          ctx.scale(sx, sy);
          ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
          ctx.restore();
        } else {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
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
    <div className="relative w-full h-full min-h-[500px] lg:min-h-0 bg-lacquer-surface flex items-center justify-center overflow-hidden select-none font-sans">
      {/* Layer 0: Full-bleed Event Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={outfit.event.bgUrl}
          alt={outfit.event.name}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-lacquer via-transparent to-lacquer/60 pointer-events-none" />
      </div>

      {/* Layer 1 - 5: Scaled 3:4 Mannequin & Clothes Composite Stage */}
      <div className="relative z-10 h-full max-h-[96%] aspect-[3/4] flex items-center justify-center pointer-events-none py-2">
        {/* Layer 1: Mannequin */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="/assets/mannequins/mannequin-base.png"
            alt="Ma-nơ-canh chuẩn"
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

      {/* TOP-LEFT: Mannequin Gender Switcher (Vietnamese label & Gender symbols) */}
      <div className="absolute top-4 left-4 z-40 pointer-events-auto">
        <div className="flex items-center p-1 rounded-none bg-lacquer/90 backdrop-blur-md border-2 border-lacquer-border shadow-xl">
          {/* Nút Nam (Male ♂) */}
          <button
            onClick={() => onSelectGender('men')}
            className={`flex items-center gap-1.5 py-2 px-3.5 rounded-none text-sm font-bold transition-all uppercase tracking-wider ${
              outfit.mannequinGender === 'men'
                ? 'bg-imperial-gold text-lacquer shadow font-extrabold'
                : 'text-silk-muted hover:text-silk-ivory'
            }`}
            title="Mẫu Ma-nơ-canh Nam"
          >
            <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[2.5]" viewBox="0 0 24 24">
              <circle cx="10" cy="14" r="5" />
              <path d="M19 5l-5.4 5.4M19 5h-5M19 5v5" />
            </svg>
            <span>Nam</span>
          </button>

          {/* Nút Nữ (Female ♀) */}
          <button
            onClick={() => onSelectGender('women')}
            className={`flex items-center gap-1.5 py-2 px-3.5 rounded-none text-sm font-bold transition-all uppercase tracking-wider ${
              outfit.mannequinGender === 'women'
                ? 'bg-rose-300 text-lacquer shadow font-extrabold'
                : 'text-silk-muted hover:text-silk-ivory'
            }`}
            title="Mẫu Ma-nơ-canh Nữ"
          >
            <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[2.5]" viewBox="0 0 24 24">
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
            className="flex items-center gap-2.5 py-2 px-4 rounded-none bg-lacquer/90 backdrop-blur-md border-2 border-lacquer-border text-sm font-bold text-silk-ivory hover:border-imperial-gold shadow-xl transition-all"
          >
            <span className="w-2.5 h-2.5 rounded-none bg-imperial-gold" />
            <span>Bối cảnh: {outfit.event.name}</span>
            <ChevronDown className={`w-4 h-4 text-silk-muted transition-transform ${isEventDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu (Opens towards left/bottom from right edge) */}
          {isEventDropdownOpen && (
            <div className="absolute right-0 mt-1 w-64 rounded-none bg-lacquer/95 backdrop-blur-xl border-2 border-imperial-gold shadow-2xl p-2 z-50 animate-fadeIn">
              <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-silk-muted border-b border-lacquer-border mb-1">
                Chọn bối cảnh sự kiện
              </div>
              {allEvents.map((evt) => (
                <button
                  key={evt.id}
                  onClick={() => {
                    onSelectEvent(evt);
                    setIsEventDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-none text-sm font-semibold transition-all flex items-center justify-between ${
                    outfit.event.id === evt.id
                      ? 'bg-imperial-gold/20 text-imperial-gold font-bold border-l-2 border-imperial-gold'
                      : 'text-silk-ivory hover:bg-lacquer-surface'
                  }`}
                >
                  <span>{evt.name}</span>
                  {outfit.event.id === evt.id && <span className="w-2 h-2 rounded-none bg-imperial-gold" />}
                </button>
              ))}

              <div className="pt-2 mt-1 border-t border-lacquer-border">
                <button
                  onClick={() => {
                    setIsEventDropdownOpen(false);
                    onOpenCustomEventModal();
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-none text-sm font-bold text-imperial-gold hover:bg-imperial-gold/15 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tạo Event AI mới</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM-RIGHT: Vertical Action Dock (TikTok-Style Action Stack) */}
      <div className="absolute bottom-6 right-5 z-40 flex flex-col items-center gap-4 pointer-events-auto">
        {/* Action 1: AI Try on */}
        <div className="relative group flex items-center justify-center">
          <button
            onClick={onTryOn}
            disabled={!canTryOn}
            aria-label="AI Try on"
            className={`w-12 h-12 flex items-center justify-center transition-all duration-200 ${
              canTryOn
                ? 'text-white hover:scale-120 active:scale-95 cursor-pointer'
                : 'text-white/40 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-8 h-8 fill-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] drop-shadow-[0_0_2px_rgba(0,0,0,0.9)] transition-transform" />
          </button>

          {/* Left-floating Tooltip */}
          <div className="absolute right-full mr-3.5 top-1/2 -translate-y-1/2 flex items-center opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 translate-x-1 group-hover:translate-x-0 z-50">
            <div className="bg-lacquer/95 text-silk-ivory text-xs font-sans font-bold px-3 py-1.5 rounded-none border border-imperial-gold/60 shadow-2xl backdrop-blur-md whitespace-nowrap">
              {canTryOn ? 'Thử trang phục trên người thật (AI Try on)' : 'Chọn đủ Áo, Quần, Giày để thử đồ'}
            </div>
            <div className="w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-imperial-gold/60" />
          </div>
        </div>

        {/* Action 2: Save Outfit */}
        <div className="relative group flex items-center justify-center">
          <button
            onClick={onSaveOutfit}
            disabled={!canTryOn}
            aria-label="Lưu outfit"
            className={`w-12 h-12 flex items-center justify-center transition-all duration-200 ${
              canTryOn
                ? 'text-white hover:scale-120 active:scale-95 cursor-pointer'
                : 'text-white/40 cursor-not-allowed'
            }`}
          >
            <Heart className="w-8 h-8 fill-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] drop-shadow-[0_0_2px_rgba(0,0,0,0.9)] transition-transform" />
          </button>

          {/* Left-floating Tooltip */}
          <div className="absolute right-full mr-3.5 top-1/2 -translate-y-1/2 flex items-center opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 translate-x-1 group-hover:translate-x-0 z-50">
            <div className="bg-lacquer/95 text-silk-ivory text-xs font-sans font-bold px-3 py-1.5 rounded-none border border-imperial-gold/60 shadow-2xl backdrop-blur-md whitespace-nowrap">
              {canTryOn ? (isLoggedIn ? 'Lưu vào Lookbook cá nhân' : 'Lưu tạm vào phiên hiện tại') : 'Chọn đủ Áo, Quần, Giày để lưu'}
            </div>
            <div className="w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-imperial-gold/60" />
          </div>
        </div>

        {/* Action 3: Download Canvas Mockup (PNG) */}
        <div className="relative group flex items-center justify-center">
          <button
            onClick={handleDownloadMockup}
            disabled={isExporting}
            aria-label="Tải ảnh phối đồ"
            className="w-12 h-12 flex items-center justify-center text-white hover:scale-120 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            {downloadSuccess ? (
              <CheckCircle2 className="w-8 h-8 text-green-400 fill-green-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] drop-shadow-[0_0_2px_rgba(0,0,0,0.9)]" />
            ) : (
              <Download className="w-8 h-8 text-white stroke-[2.5] drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] drop-shadow-[0_0_2px_rgba(0,0,0,0.9)]" />
            )}
          </button>

          {/* Left-floating Tooltip */}
          <div className="absolute right-full mr-3.5 top-1/2 -translate-y-1/2 flex items-center opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 translate-x-1 group-hover:translate-x-0 z-50">
            <div className="bg-lacquer/95 text-silk-ivory text-xs font-sans font-bold px-3 py-1.5 rounded-none border border-imperial-gold/60 shadow-2xl backdrop-blur-md whitespace-nowrap">
              {downloadSuccess ? 'Đã tải ảnh mockup thành công!' : 'Tải ảnh phối đồ 2D (PNG)'}
            </div>
            <div className="w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-imperial-gold/60" />
          </div>
        </div>
      </div>
    </div>
  );
};
