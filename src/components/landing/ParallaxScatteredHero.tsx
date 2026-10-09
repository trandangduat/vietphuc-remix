import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';
import { GoldParticlesCanvas } from './GoldParticlesCanvas';
import { PresetOutfit, EventBackground } from '../../types';

interface ParallaxScatteredHeroProps {
  onOpenStudio: (preset?: PresetOutfit, event?: EventBackground) => void;
}

export const ParallaxScatteredHero: React.FC<ParallaxScatteredHeroProps> = ({ onOpenStudio }) => {
  const containerRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredPiece, setHoveredPiece] = useState<string | null>(null);

  // Smooth lerped mouse movement tracking
  useEffect(() => {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Normalize to range -1 to +1
      targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };

    const updatePhysics = () => {
      // Linear interpolation (lerp factor 0.06 for physical mass)
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      setMousePos({ x: currentX, y: currentY });
      animId = requestAnimationFrame(updatePhysics);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animId = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[96vh] flex items-center justify-center pt-16 pb-24 px-4 sm:px-6 lg:px-12 w-full overflow-hidden select-none"
      aria-label="Atelier Hero"
    >
      {/* 1. Atmospheric Golden Dust Particles */}
      <GoldParticlesCanvas />

      {/* 2. Deep Royal Lighting Vignettes */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-imperial-gold/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-imperial-red/5 blur-[180px] pointer-events-none" />

      {/* 3. Deep Background Watermark (Moves inversely) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * -16}px, ${mousePos.y * -12}px, 0)`,
        }}
      >
        <span className="font-serif text-[24vw] font-bold tracking-tighter text-silk-ivory uppercase leading-none">
          VIỆT PHỤC
        </span>
      </div>

      {/* 4. Background Golden Cloud (Soft Parallax) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.04] transition-transform duration-150 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * -24}px, ${mousePos.y * -18}px, 0)`,
        }}
      >
        <img
          src="/assets/decorations/golden-cloud.png"
          alt="Golden Cloud"
          className="w-[950px] max-w-none object-contain"
        />
      </div>

      {/* ================= LAYER A: PIECES BEHIND THE TEXT ================= */}
      <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto z-10">
        {/* Piece A1: Áo tấc xanh lam sắc quý tộc (Behind text on the right) */}
        <div
          className="absolute top-1/3 right-4 sm:right-12 lg:right-20 pointer-events-auto transition-transform duration-200 ease-out"
          style={{
            transform: `translate3d(${mousePos.x * 24}px, ${mousePos.y * 20}px, 0)`,
          }}
          onMouseEnter={() => setHoveredPiece('top-indigo')}
          onMouseLeave={() => setHoveredPiece(null)}
          onClick={() => onOpenStudio()}
        >
          <div className="relative animate-float-slow cursor-pointer group">
            <div className="w-48 sm:w-64 lg:w-76 rotate-6 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
              <img
                src="/assets/pieces/tops/top-ao-tac-indigo.png"
                alt="Áo tấc lam sắc quý tộc"
                className="w-full h-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] filter opacity-85 group-hover:opacity-100 transition-opacity"
              />
            </div>
            {/* Tooltip */}
            <div
              className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 pointer-events-none ${
                hoveredPiece === 'top-indigo' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <div className="px-3 py-1 bg-[#0A0D12]/95 border border-imperial-gold/60 backdrop-blur-md shadow-2xl text-[11px] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A4B54]" />
                <span className="font-bold text-silk-ivory">Áo tấc lam sắc quý tộc</span>
                <span className="text-imperial-gold">· Thời Nguyễn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Piece A2: Quần lụa tơ tằm trắng ngà (Behind text on the left) */}
        <div
          className="absolute top-1/2 -translate-y-16 left-2 sm:left-10 lg:left-16 pointer-events-auto transition-transform duration-200 ease-out"
          style={{
            transform: `translate3d(${mousePos.x * 18}px, ${mousePos.y * 14}px, 0)`,
          }}
          onMouseEnter={() => setHoveredPiece('bottom-silk')}
          onMouseLeave={() => setHoveredPiece(null)}
          onClick={() => onOpenStudio()}
        >
          <div className="relative animate-float-reverse cursor-pointer group">
            <div className="w-32 sm:w-44 lg:w-52 -rotate-3 transition-transform duration-500 group-hover:scale-105">
              <img
                src="/assets/pieces/bottoms/bottom-quan-lua-white.png"
                alt="Quần lụa tơ tằm Vạn Phúc"
                className="w-full h-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] opacity-75 group-hover:opacity-100 transition-opacity"
              />
            </div>
            {/* Tooltip */}
            <div
              className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 pointer-events-none ${
                hoveredPiece === 'bottom-silk' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <div className="px-3 py-1 bg-[#0A0D12]/95 border border-imperial-gold/60 backdrop-blur-md shadow-2xl text-[11px] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F7F4EE]" />
                <span className="font-bold text-silk-ivory">Quần lụa tơ tằm Vạn Phúc</span>
                <span className="text-imperial-gold">· Lụa ngà</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= LAYER B: MONUMENTAL TYPOGRAPHY ================= */}
      <div className="relative z-20 max-w-3xl mx-auto text-center space-y-7 pointer-events-auto">
        {/* Edition Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 border border-imperial-gold/40 bg-[#0A0D12]/90 backdrop-blur-md text-imperial-gold text-xs font-semibold uppercase tracking-[0.2em] shadow-xl">
          <Sparkles className="w-3.5 h-3.5 text-imperial-gold" />
          <span>Haute Atelier Di sản số · 2026</span>
        </div>

        {/* Master Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight [text-wrap:balance]">
          <span className="text-silk-ivory block drop-shadow-md">Thổi hồn đương đại</span>
          <span className="bg-gradient-to-r from-imperial-gold-light via-imperial-gold to-[#9A7332] bg-clip-text text-transparent block mt-1.5 drop-shadow-xl">
            vào áo mũ nghìn năm
          </span>
        </h1>

        {/* Rationale Copy */}
        <p className="text-base sm:text-lg text-silk-muted max-w-xl mx-auto leading-relaxed font-normal [text-wrap:pretty] px-4 bg-[#0A0D12]/40 backdrop-blur-[2px]">
          Xưởng phối đồ trực quan 2D dành cho giới trẻ: kết hợp Áo tấc, Ngũ thân kinh điển cùng trang phục thường ngày, bảo chứng tư liệu lịch sử từ bảo tàng uy tín.
        </p>

        {/* Action Group */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => onOpenStudio()}
            className="py-4 px-9 bg-imperial-gold hover:bg-imperial-gold-light text-lacquer font-bold text-sm sm:text-base flex items-center gap-3 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-gold-glow uppercase tracking-wider active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-imperial-gold"
          >
            <span>Bước vào Atelier phối đồ</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#visual-showcase"
            className="py-4 px-7 bg-[#12161F]/90 backdrop-blur-md border-2 border-lacquer-border hover:border-imperial-gold text-silk-ivory text-sm sm:text-base font-bold transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] uppercase tracking-wider active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-imperial-gold"
          >
            Xem bộ sưu tập Runway
          </a>
        </div>

        {/* Provenance Strip */}
        <div className="pt-6 border-t border-lacquer-border/80 flex flex-wrap items-center justify-center gap-6 text-xs text-silk-muted font-normal">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-imperial-gold flex-shrink-0" />
            <span>Đối chiếu tư liệu: <strong className="text-silk-ivory">Bảo tàng Lịch sử Quốc gia & "Ngàn năm áo mũ"</strong></span>
          </div>
          <span className="hidden sm:inline text-lacquer-border">|</span>
          <span className="text-imperial-gold font-semibold tracking-wider uppercase text-[11px]">
            Tỷ lệ chuẩn mực 100%
          </span>
        </div>
      </div>

      {/* ================= LAYER C: FOREGROUND PIECES (OVERLAPPING & PROMINENT) ================= */}
      <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto z-30">
        {/* Piece C1: Áo tấc đỏ gấm Thủy ba (Top-Right Foreground with large presence) */}
        <div
          className="absolute top-4 right-4 sm:right-10 lg:right-16 xl:right-24 pointer-events-auto transition-transform duration-200 ease-out"
          style={{
            transform: `translate3d(${mousePos.x * 48}px, ${mousePos.y * 36}px, 0)`,
          }}
          onMouseEnter={() => setHoveredPiece('top-crimson')}
          onMouseLeave={() => setHoveredPiece(null)}
          onClick={() => onOpenStudio()}
        >
          <div className="relative animate-float-gentle cursor-pointer group">
            <div className="w-52 sm:w-64 lg:w-80 -rotate-3 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-0">
              <img
                src="/assets/pieces/tops/top-ao-tac-crimson.png"
                alt="Áo tấc đỏ gấm Thủy ba"
                className="w-full h-auto object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)] filter group-hover:brightness-110 transition-all"
              />
            </div>
            {/* Tooltip */}
            <div
              className={`absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 pointer-events-none ${
                hoveredPiece === 'top-crimson' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <div className="px-3.5 py-1.5 bg-[#0A0D12]/95 border border-imperial-gold backdrop-blur-md shadow-2xl text-[11px] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#7A1C1C]" />
                <span className="font-bold text-silk-ivory">Áo tấc đỏ gấm Thủy ba</span>
                <span className="text-imperial-gold">· Lễ phục đại triều</span>
              </div>
            </div>
          </div>
        </div>

        {/* Piece C2: Nón lá cổ truyền (Top-Left Foreground) */}
        <div
          className="absolute top-8 left-4 sm:left-10 lg:left-14 pointer-events-auto transition-transform duration-200 ease-out"
          style={{
            transform: `translate3d(${mousePos.x * 38}px, ${mousePos.y * 30}px, 0)`,
          }}
          onMouseEnter={() => setHoveredPiece('acc-nonla')}
          onMouseLeave={() => setHoveredPiece(null)}
          onClick={() => onOpenStudio()}
        >
          <div className="relative animate-float-reverse cursor-pointer group">
            <div className="w-36 sm:w-44 lg:w-56 rotate-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              <img
                src="/assets/pieces/accessories/acc-non-la-traditional.png"
                alt="Nón lá quai lụa cổ truyền"
                className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] filter group-hover:brightness-110 transition-all"
              />
            </div>
            {/* Tooltip */}
            <div
              className={`absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 pointer-events-none ${
                hoveredPiece === 'acc-nonla' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <div className="px-3.5 py-1.5 bg-[#0A0D12]/95 border border-imperial-gold backdrop-blur-md shadow-2xl text-[11px] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-imperial-gold" />
                <span className="font-bold text-silk-ivory">Nón lá quai lụa hồng</span>
                <span className="text-imperial-gold">· Cổ phong</span>
              </div>
            </div>
          </div>
        </div>

        {/* Piece C3: Hài nhung thêu kim tuyến (Bottom-Left Foreground) */}
        <div
          className="absolute bottom-12 left-6 sm:left-16 lg:left-24 pointer-events-auto transition-transform duration-200 ease-out"
          style={{
            transform: `translate3d(${mousePos.x * 42}px, ${mousePos.y * 32}px, 0)`,
          }}
          onMouseEnter={() => setHoveredPiece('footwear-hai')}
          onMouseLeave={() => setHoveredPiece(null)}
          onClick={() => onOpenStudio()}
        >
          <div className="relative animate-float-gentle cursor-pointer group">
            <div className="w-28 sm:w-36 lg:w-48 -rotate-8 transition-transform duration-500 group-hover:scale-110">
              <img
                src="/assets/pieces/footwear/footwear-hai-nhung-red.png"
                alt="Hài nhung thêu mũi cong"
                className="w-full h-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] filter group-hover:brightness-110 transition-all"
              />
            </div>
            {/* Tooltip */}
            <div
              className={`absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 pointer-events-none ${
                hoveredPiece === 'footwear-hai' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}
            >
              <div className="px-3.5 py-1.5 bg-[#0A0D12]/95 border border-imperial-gold backdrop-blur-md shadow-2xl text-[11px] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8B1E1E]" />
                <span className="font-bold text-silk-ivory">Hài nhung thêu kim tuyến</span>
                <span className="text-imperial-gold">· Mũi cong</span>
              </div>
            </div>
          </div>
        </div>

        {/* Piece C4: Giày Loafer da bóng đương đại (Bottom-Right Foreground) */}
        <div
          className="absolute bottom-8 right-8 sm:right-20 lg:right-32 pointer-events-auto transition-transform duration-200 ease-out"
          style={{
            transform: `translate3d(${mousePos.x * 52}px, ${mousePos.y * 38}px, 0)`,
          }}
          onMouseEnter={() => setHoveredPiece('footwear-loafer')}
          onMouseLeave={() => setHoveredPiece(null)}
          onClick={() => onOpenStudio()}
        >
          <div className="relative animate-float-reverse cursor-pointer group">
            <div className="w-28 sm:w-36 lg:w-48 rotate-10 transition-transform duration-500 group-hover:scale-110">
              <img
                src="/assets/pieces/footwear/footwear-loafer-darkbrown.png"
                alt="Giày Loafer da bóng phong cách Parisian"
                className="w-full h-auto object-contain drop-shadow-[0_18px_35px_rgba(0,0,0,0.9)] filter group-hover:brightness-110 transition-all"
              />
            </div>
            {/* Tooltip */}
            <div
              className={`absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 pointer-events-none ${
                hoveredPiece === 'footwear-loafer' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}
            >
              <div className="px-3.5 py-1.5 bg-[#0A0D12]/95 border border-imperial-gold backdrop-blur-md shadow-2xl text-[11px] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4A2E18]" />
                <span className="font-bold text-silk-ivory">Giày Loafer da bóng</span>
                <span className="text-teal-300">· Gen Z Remix</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Imperial Vermilion Seal Stamp (Top Right) */}
        <div
          className="absolute top-14 right-2 sm:right-8 lg:right-12 pointer-events-none select-none z-40 transition-transform duration-150 ease-out hidden sm:block"
          style={{
            transform: `translate3d(${mousePos.x * 20}px, ${mousePos.y * 15}px, 0)`,
          }}
        >
          <div
            className="w-16 h-16 bg-[#7C1C16] border border-[#F0D7A2]/80 flex flex-col items-center justify-center text-[#F6E7C1] shadow-2xl animate-float-slow"
            style={{ transform: 'rotate(-8deg)' }}
          >
            <div className="absolute inset-[3px] border border-[#F0D7A2]/30" />
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#F0D7A2]/80 leading-none">
              ĐIỂM CHUẨN
            </span>
            <span className="font-serif font-bold text-xl leading-tight">
              9.8
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
