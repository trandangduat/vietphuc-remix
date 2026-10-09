import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, ArrowRight, Compass, MoveHorizontal } from 'lucide-react';
import { PRESET_OUTFITS, EVENTS } from '../../data/catalog';
import { PresetOutfit, EventBackground } from '../../types';
import { AncientCloudDivider } from '../heritage/HeritageDecorations';

interface RemixInteractiveWipeProps {
  onOpenStudio: (preset?: PresetOutfit, event?: EventBackground) => void;
}

export const RemixInteractiveWipe: React.FC<RemixInteractiveWipeProps> = ({ onOpenStudio }) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full select-none" aria-label="Đối chiếu chuyển hóa">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-imperial-gold/30 bg-imperial-gold/10 text-imperial-gold text-xs font-semibold uppercase tracking-widest mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Đối chiếu thị giác</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-silk-ivory mb-3 [text-wrap:balance]">
          Chuyển Hóa Giữa Hai Thế Kỷ
        </h2>
        <p className="text-sm sm:text-base text-silk-muted font-normal [text-wrap:pretty]">
          Kéo thanh trượt hoàng kim để chứng kiến sự chuyển mình kỳ diệu từ chuẩn mực hoàng triều 1885 sang phong cách dạo phố đương đại 2026.
        </p>
      </div>

      <AncientCloudDivider className="mb-12 opacity-30 max-w-xs mx-auto" />

      {/* Main Interactive Wipe Container */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-[16/10] sm:aspect-[21/10] bg-[#0A0D12] border-2 border-imperial-gold/60 overflow-hidden cursor-ew-resize shadow-2xl"
      >
        {/* ================= RIGHT SIDE: GEN Z REMIX 2026 ================= */}
        <div className="absolute inset-0 w-full h-full bg-[#12161F]">
          {/* Background */}
          <img
            src="/assets/events/bg-school-prom.jpg"
            alt="Dạ hội hiện đại"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D12] via-black/40 to-transparent" />

          {/* Garment silhouette layer */}
          <div className="absolute right-12 sm:right-24 bottom-4 w-44 sm:w-64 h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]">
            <img
              src="/assets/pieces/tops/top-ao-tac-indigo.png"
              alt="Áo tấc lam sắc"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Label Right */}
          <div className="absolute bottom-6 right-6 sm:right-10 z-20 text-right max-w-xs space-y-1">
            <span className="px-3 py-1 bg-imperial-gold/20 border border-imperial-gold/50 text-[11px] font-bold text-imperial-gold uppercase tracking-wider inline-block">
              GEN Z REMIX · 2026
            </span>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-silk-ivory">
              Thanh Lam & Quần Âu Loafer
            </h3>
            <p className="text-xs text-silk-muted hidden sm:block">
              Áo tấc xanh cổ vịt kết hợp quần âu xếp ly và giày Loafer da bóng phong cách Parisian.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenStudio(PRESET_OUTFITS[1], EVENTS[1]);
                }}
                className="px-4 py-2 bg-imperial-gold text-lacquer font-bold text-xs uppercase tracking-wider hover:bg-imperial-gold-light transition-all"
              >
                Thử bản phối Remix
              </button>
            </div>
          </div>
        </div>

        {/* ================= LEFT SIDE: HOÀNG TRIỀU CỔ PHONG 1885 (CLIPPED) ================= */}
        <div
          className="absolute inset-0 h-full overflow-hidden z-10"
          style={{ width: `${sliderPos}%` }}
        >
          <div className="relative w-full h-full" style={{ width: containerRef.current?.clientWidth || '100%' }}>
            {/* Background */}
            <img
              src="/assets/events/bg-tet-pho-co.png"
              alt="Phố cổ Tết"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D12] via-black/40 to-transparent" />

            {/* Garment silhouette layer */}
            <div className="absolute left-8 sm:left-20 bottom-4 w-44 sm:w-64 h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]">
              <img
                src="/assets/pieces/tops/top-ao-tac-crimson.png"
                alt="Áo tấc đỏ gấm Thủy ba"
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Label Left */}
            <div className="absolute bottom-6 left-6 sm:left-10 z-20 text-left max-w-xs space-y-1">
              <span className="px-3 py-1 bg-[#7C1C16] border border-[#F0D7A2]/60 text-[11px] font-bold text-[#F6E7C1] uppercase tracking-wider inline-block">
                HOÀNG TRIỀU · 1885
              </span>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-silk-ivory">
                Đại Hồng & Lụa Ngà Cung Đình
              </h3>
              <p className="text-xs text-silk-muted hidden sm:block">
                Lễ phục Áo tấc gấm đỏ Thủy ba triều Nguyễn, quần lụa tơ tằm trắng ngà và hài nhung thêu.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenStudio(PRESET_OUTFITS[0], EVENTS[0]);
                  }}
                  className="px-4 py-2 bg-[#7C1C16] border border-[#F0D7A2]/60 text-[#F6E7C1] font-bold text-xs uppercase tracking-wider hover:bg-[#8B1E1E] transition-all"
                >
                  Thử bản phối Cổ phong
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= THE GOLDEN DIVIDER & HANDLE ================= */}
        <div
          className="absolute top-0 bottom-0 z-30 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Vertical Golden Hairline */}
          <div className="w-[2px] h-full bg-gradient-to-b from-imperial-gold-light via-imperial-gold to-[#9A7332] shadow-[0_0_15px_rgba(198,155,86,0.9)]" />

          {/* Circular Grab Handle */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#0A0D12] border-2 border-imperial-gold shadow-gold-glow flex items-center justify-center text-imperial-gold">
            <MoveHorizontal className="w-5 h-5 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};
