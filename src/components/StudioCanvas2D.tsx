import React, { useState } from 'react';
import { Download, Sparkles, Heart, CheckCircle2, AlertCircle, ChevronDown, Plus } from 'lucide-react';
import { ActiveOutfitState, EventBackground, GenderSelection } from '../types';

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

  // Export current layers to a single downloadable PNG via HTML5 Canvas
  const handleDownloadMockup = async () => {
    setIsExporting(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 900;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const layerUrls: string[] = [];

      // 0. Event Background
      if (outfit.event.bgUrl) layerUrls.push(outfit.event.bgUrl);

      // 1. Mannequin
      layerUrls.push('/assets/mannequins/mannequin-base.png');

      // 2. Bottoms
      if (outfit.bottomVariant) layerUrls.push(outfit.bottomVariant.assetUrl);

      // 3. Footwear
      if (outfit.footwearVariant) layerUrls.push(outfit.footwearVariant.assetUrl);

      // 4. Tops
      if (outfit.topVariant) layerUrls.push(outfit.topVariant.assetUrl);

      // 5. Accessories
      if (outfit.accessoryVariant) layerUrls.push(outfit.accessoryVariant.assetUrl);

      // Load all images in order
      const loadImg = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`Failed to load ${url}`));
          img.src = url;
        });

      const loadedImages = await Promise.all(layerUrls.map(loadImg));
      for (const img of loadedImages) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
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
        {outfit.bottomVariant && (
          <div className="absolute inset-0 z-20 pointer-events-none transition-all duration-200">
            <img
              src={outfit.bottomVariant.assetUrl}
              alt={outfit.bottomPiece?.name}
              className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
            />
          </div>
        )}

        {/* Layer 3: Giày / Dép (Z=30) */}
        {outfit.footwearVariant && (
          <div className="absolute inset-0 z-30 pointer-events-none transition-all duration-200">
            <img
              src={outfit.footwearVariant.assetUrl}
              alt={outfit.footwearPiece?.name}
              className="w-full h-full object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]"
            />
          </div>
        )}

        {/* Layer 4: Áo (Z=40) - Phủ lên quần */}
        {outfit.topVariant && (
          <div className="absolute inset-0 z-40 pointer-events-none transition-all duration-200">
            <img
              src={outfit.topVariant.assetUrl}
              alt={outfit.topPiece?.name}
              className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]"
            />
          </div>
        )}

        {/* Layer 5: Phụ kiện (Z=50) - Trên cùng */}
        {outfit.accessoryVariant && (
          <div className="absolute inset-0 z-50 pointer-events-none transition-all duration-200">
            <img
              src={outfit.accessoryVariant.assetUrl}
              alt={outfit.accessoryPiece?.name}
              className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.65)]"
            />
          </div>
        )}
      </div>

      {/* TOP OVERLAY CONTROLS (Square, large text, vintage border) */}
      <div className="absolute top-4 inset-x-4 z-40 flex items-center justify-between gap-3 pointer-events-auto flex-wrap">
        {/* Left Side: Mannequin Gender Switcher + Event Dropdown */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Gender Square Toggle */}
          <div className="flex items-center p-1 rounded-none bg-lacquer/90 backdrop-blur-md border border-lacquer-border shadow-lg">
            <button
              onClick={() => onSelectGender('men')}
              className={`py-2 px-4 rounded-none text-xs sm:text-sm font-bold transition-all ${
                outfit.mannequinGender === 'men'
                  ? 'bg-imperial-gold text-lacquer shadow-sm font-extrabold'
                  : 'text-silk-muted hover:text-silk-ivory'
              }`}
            >
              Men (Nam)
            </button>
            <button
              onClick={() => onSelectGender('women')}
              className={`py-2 px-4 rounded-none text-xs sm:text-sm font-bold transition-all ${
                outfit.mannequinGender === 'women'
                  ? 'bg-rose-300 text-lacquer shadow-sm font-extrabold'
                  : 'text-silk-muted hover:text-silk-ivory'
              }`}
            >
              Women (Nữ)
            </button>
          </div>

          {/* Event Dropdown Picker */}
          <div className="relative">
            <button
              onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
              className="flex items-center gap-2.5 py-2 px-4 rounded-none bg-lacquer/90 backdrop-blur-md border border-lacquer-border text-xs sm:text-sm font-bold text-silk-ivory hover:border-imperial-gold/60 shadow-lg transition-all"
            >
              <span className="w-2.5 h-2.5 rounded-none bg-imperial-gold" />
              <span>Bối cảnh: {outfit.event.name}</span>
              <ChevronDown className={`w-4 h-4 text-silk-muted transition-transform ${isEventDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isEventDropdownOpen && (
              <div className="absolute left-0 mt-1 w-64 rounded-none bg-lacquer/95 backdrop-blur-xl border-2 border-imperial-gold/60 shadow-2xl p-2 z-50 animate-fadeIn">
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
                    className={`w-full text-left px-3.5 py-2.5 rounded-none text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${
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
                    className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-none text-xs sm:text-sm font-bold text-imperial-gold hover:bg-imperial-gold/15 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Tạo Event AI mới</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Download Canvas Mockup Button */}
        <button
          onClick={handleDownloadMockup}
          disabled={isExporting}
          className="flex items-center gap-2 py-2 px-4 rounded-none bg-lacquer/90 backdrop-blur-md border border-lacquer-border text-silk-ivory hover:text-imperial-gold hover:border-imperial-gold/60 shadow-lg text-xs sm:text-sm font-bold transition-all group"
          title="Tải ảnh kết quả phối đồ 2D (PNG)"
        >
          {downloadSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-bold">Đã tải ảnh!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-imperial-gold group-hover:scale-110 transition-transform" />
              <span>Tải ảnh Mockup</span>
            </>
          )}
        </button>
      </div>

      {/* BOTTOM OVERLAY HUD (Square, large text, high contrast) */}
      <div className="absolute bottom-4 inset-x-4 z-40 flex flex-col gap-3 pointer-events-auto max-w-xl mx-auto w-[calc(100%-2rem)]">
        {/* Floating Outfit Pieces Status Badge Bar */}
        <div className="p-3 sm:p-4 rounded-none bg-lacquer/90 backdrop-blur-md border-2 border-lacquer-border shadow-2xl">
          <div className="flex items-center justify-between text-xs sm:text-sm text-silk-muted mb-2">
            <span className="font-bold text-silk-ivory uppercase tracking-wider text-xs">Trang phục đang thử:</span>
            <span className={canTryOn ? 'text-green-400 font-bold flex items-center gap-1.5' : 'text-amber-400 font-semibold flex items-center gap-1.5'}>
              {canTryOn ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Đủ 3 món bắt buộc
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" /> Cần đủ Áo, Quần, Giày
                </>
              )}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`px-2.5 py-1 rounded-none text-xs sm:text-sm font-semibold border ${outfit.topVariant ? 'bg-imperial-gold/15 text-imperial-gold border-imperial-gold/50' : 'bg-lacquer-surface text-silk-muted border-lacquer-border'}`}>
              Áo: {outfit.topVariant ? outfit.topVariant.colorName : 'Chưa chọn'}
            </span>
            <span className={`px-2.5 py-1 rounded-none text-xs sm:text-sm font-semibold border ${outfit.bottomVariant ? 'bg-imperial-gold/15 text-imperial-gold border-imperial-gold/50' : 'bg-lacquer-surface text-silk-muted border-lacquer-border'}`}>
              Quần: {outfit.bottomVariant ? outfit.bottomVariant.colorName : 'Chưa chọn'}
            </span>
            <span className={`px-2.5 py-1 rounded-none text-xs sm:text-sm font-semibold border ${outfit.footwearVariant ? 'bg-imperial-gold/15 text-imperial-gold border-imperial-gold/50' : 'bg-lacquer-surface text-silk-muted border-lacquer-border'}`}>
              Giày: {outfit.footwearVariant ? outfit.footwearVariant.colorName : 'Chưa chọn'}
            </span>
            {outfit.accessoryVariant && (
              <span className="px-2.5 py-1 rounded-none text-xs sm:text-sm font-semibold border bg-imperial-teal/20 text-teal-300 border-imperial-teal/50">
                Phụ kiện: {outfit.accessoryPiece?.name}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons Directly Overlaid on Canvas Stage (Wireframe [Try on] [SAVE OUTFIT]) */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onTryOn}
            disabled={!canTryOn}
            className={`flex items-center justify-center gap-2 py-3.5 px-5 rounded-none font-bold text-sm sm:text-base tracking-wider transition-all shadow-xl uppercase ${
              canTryOn
                ? 'bg-gradient-to-r from-imperial-red via-cinnabar to-imperial-red-bright text-silk-ivory hover:brightness-110 shadow-imperial-red/40 border border-imperial-red-bright active:scale-[0.99]'
                : 'bg-lacquer/85 backdrop-blur-md text-silk-muted border border-lacquer-border cursor-not-allowed opacity-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-imperial-gold-light" />
            <span>Try on</span>
          </button>

          <button
            onClick={onSaveOutfit}
            disabled={!canTryOn}
            className={`flex items-center justify-center gap-2 py-3.5 px-5 rounded-none font-bold text-sm sm:text-base tracking-wider transition-all border-2 shadow-xl uppercase ${
              canTryOn
                ? 'bg-imperial-gold hover:bg-imperial-gold-light text-lacquer border-imperial-gold shadow-imperial-gold/20 active:scale-[0.99]'
                : 'bg-lacquer/85 backdrop-blur-md text-silk-muted border-lacquer-border cursor-not-allowed opacity-50'
            }`}
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>SAVE OUTFIT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
