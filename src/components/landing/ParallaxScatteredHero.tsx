import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { GoldParticlesCanvas } from './GoldParticlesCanvas';
import { PresetOutfit, EventBackground } from '../../types';

interface ParallaxScatteredHeroProps {
  onOpenStudio: (preset?: PresetOutfit, event?: EventBackground) => void;
}

interface HeroPieceConfig {
  key: string;
  src: string;
  alt: string;
  name: string;
  sub: string;
  dotClass: string;
  /** Absolute positioning of the piece wrapper */
  wrapperClass: string;
  /** Width + rotation of the inner box */
  boxClass: string;
  imgClass: string;
  floatClass: string;
  depthX: number;
  depthY: number;
  /** Tooltip opens upward (for bottom-strip pieces) */
  tooltipAbove?: boolean;
}

// Layer A: scattered behind the typography (safe zone, never covers text)
const BACK_PIECES: HeroPieceConfig[] = [
  {
    key: 'top-indigo',
    src: '/assets/pieces/tops/thumb-ao-tac-indigo.png',
    alt: 'Áo tấc lam sắc quý tộc',
    name: 'Áo tấc lam sắc quý tộc',
    sub: 'Thời Nguyễn',
    dotClass: 'bg-[#1A4B54]',
    wrapperClass: 'top-[36%] right-0 sm:right-4 lg:right-8',
    boxClass: 'w-28 sm:w-32 lg:w-44 rotate-6',
    imgClass: 'drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] opacity-85 group-hover:opacity-100 transition-opacity',
    floatClass: 'animate-float-slow',
    depthX: 24,
    depthY: 20,
  },
  {
    key: 'bottom-silk',
    src: '/assets/pieces/bottoms/thumb-quan-lua-white.png',
    alt: 'Quần lụa tơ tằm Vạn Phúc',
    name: 'Quần lụa tơ tằm Vạn Phúc',
    sub: 'Lụa ngà',
    dotClass: 'bg-[#F7F4EE]',
    wrapperClass: 'top-1/2 left-2 sm:left-10 lg:left-16',
    boxClass: 'w-24 sm:w-28 lg:w-36 -rotate-3',
    imgClass: 'drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] opacity-75 group-hover:opacity-100 transition-opacity',
    floatClass: 'animate-float-reverse',
    depthX: 18,
    depthY: 14,
  },
  {
    key: 'top-nguthan',
    src: '/assets/pieces/tops/thumb-ao-ngu-than-nam.png',
    alt: 'Áo ngũ thân tay chẽn',
    name: 'Áo ngũ thân tay chẽn',
    sub: 'Nam',
    dotClass: 'bg-[#B98A2F]',
    wrapperClass: 'top-[24%] left-0 sm:left-2 lg:left-4',
    boxClass: 'w-24 sm:w-28 lg:w-36 rotate-3',
    imgClass: 'drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] opacity-75 group-hover:opacity-100 transition-opacity',
    floatClass: 'animate-float-slow',
    depthX: 20,
    depthY: 16,
  },
  {
    key: 'top-somi',
    src: '/assets/pieces/tops/thumb-ao-hien-dai-nam.png',
    alt: 'Áo sơ mi cổ trụ linen',
    name: 'Áo sơ mi cổ trụ linen',
    sub: 'Hiện đại',
    dotClass: 'bg-[#D8D2C4]',
    wrapperClass: 'top-10 left-[29%]',
    boxClass: 'w-20 sm:w-24 lg:w-28 rotate-6',
    imgClass: 'drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] opacity-70 group-hover:opacity-100 transition-opacity',
    floatClass: 'animate-float-reverse',
    depthX: 22,
    depthY: 18,
  },
  {
    key: 'bottom-tay',
    src: '/assets/pieces/bottoms/thumb-quan-tay-charcoal.png',
    alt: 'Quần tây xám than',
    name: 'Quần tây xám than',
    sub: 'Hiện đại',
    dotClass: 'bg-[#3A3F4A]',
    wrapperClass: 'top-8 left-[13%]',
    boxClass: 'w-16 sm:w-20 lg:w-24 rotate-3',
    imgClass: 'drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] opacity-70 group-hover:opacity-100 transition-opacity',
    floatClass: 'animate-float-gentle',
    depthX: 16,
    depthY: 12,
  },
  {
    key: 'bottom-aube',
    src: '/assets/pieces/bottoms/thumb-quan-au-beige.png',
    alt: 'Quần âu xếp ly màu be',
    name: 'Quần âu xếp ly be',
    sub: 'Hiện đại',
    dotClass: 'bg-[#C9B18C]',
    wrapperClass: 'top-[13%] right-[17%]',
    boxClass: 'w-16 sm:w-20 lg:w-24 -rotate-3',
    imgClass: 'drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] opacity-70 group-hover:opacity-100 transition-opacity',
    floatClass: 'animate-float-slow',
    depthX: 26,
    depthY: 20,
  },
  {
    key: 'footwear-haiden',
    src: '/assets/pieces/footwear/thumb-hai-nhung-black.png',
    alt: 'Hài nhung đen thêu mây',
    name: 'Hài nhung đen thêu mây',
    sub: 'Mũi cong',
    dotClass: 'bg-neutral-400',
    wrapperClass: 'top-16 right-[27%]',
    boxClass: 'w-16 sm:w-20 lg:w-24 -rotate-6',
    imgClass: 'drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] opacity-70 group-hover:opacity-100 transition-opacity',
    floatClass: 'animate-float-reverse',
    depthX: 30,
    depthY: 22,
  },
  {
    key: 'bottom-luaden',
    src: '/assets/pieces/bottoms/thumb-quan-lua-den.png',
    alt: 'Quần lụa đen truyền thống',
    name: 'Quần lụa đen',
    sub: 'Lụa',
    dotClass: 'bg-neutral-500',
    wrapperClass: 'bottom-6 left-[30%]',
    boxClass: 'w-20 sm:w-24 lg:w-28 rotate-2',
    imgClass: 'drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] opacity-70 group-hover:opacity-100 transition-opacity',
    floatClass: 'animate-float-gentle',
    depthX: 20,
    depthY: 16,
    tooltipAbove: true,
  },
  {
    key: 'footwear-derby',
    src: '/assets/pieces/footwear/thumb-derby-black.png',
    alt: 'Giày Derby da đen bóng',
    name: 'Giày Derby đen bóng',
    sub: 'Hiện đại',
    dotClass: 'bg-[#4A3320]',
    wrapperClass: 'bottom-6 right-[29%]',
    boxClass: 'w-16 sm:w-20 lg:w-24 rotate-6',
    imgClass: 'drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] opacity-70 group-hover:opacity-100 transition-opacity',
    floatClass: 'animate-float-slow',
    depthX: 24,
    depthY: 18,
    tooltipAbove: true,
  },
];

// Layer C: foreground accents at the far edges
const FRONT_PIECES: HeroPieceConfig[] = [
  {
    key: 'top-crimson',
    src: '/assets/pieces/tops/thumb-ao-tac-crimson.png',
    alt: 'Áo tấc đỏ gấm Thủy ba',
    name: 'Áo tấc đỏ gấm Thủy ba',
    sub: 'Lễ phục đại triều',
    dotClass: 'bg-[#7A1C1C]',
    wrapperClass: 'top-6 right-2 sm:right-6 lg:right-10 xl:right-6',
    boxClass: 'w-32 sm:w-36 lg:w-44 xl:w-48 -rotate-3',
    imgClass: 'drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)] filter group-hover:brightness-110 transition-all',
    floatClass: 'animate-float-gentle',
    depthX: 48,
    depthY: 36,
  },
  {
    key: 'acc-nonla',
    src: '/assets/pieces/accessories/thumb-non-la-traditional.png',
    alt: 'Nón lá quai lụa cổ truyền',
    name: 'Nón lá quai lụa hồng',
    sub: 'Cổ phong',
    dotClass: 'bg-imperial-gold',
    wrapperClass: 'top-8 left-4 sm:left-10 lg:left-14',
    boxClass: 'w-28 sm:w-32 lg:w-40 rotate-8',
    imgClass: 'drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] filter group-hover:brightness-110 transition-all',
    floatClass: 'animate-float-reverse',
    depthX: 38,
    depthY: 30,
  },
  {
    key: 'footwear-hai',
    src: '/assets/pieces/footwear/thumb-hai-nhung-red.png',
    alt: 'Hài nhung thêu mũi cong',
    name: 'Hài nhung thêu kim tuyến',
    sub: 'Mũi cong',
    dotClass: 'bg-[#8B1E1E]',
    wrapperClass: 'bottom-8 left-2 sm:left-6 lg:left-8',
    boxClass: 'w-20 sm:w-24 lg:w-28 -rotate-8',
    imgClass: 'drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] filter group-hover:brightness-110 transition-all',
    floatClass: 'animate-float-gentle',
    depthX: 42,
    depthY: 32,
    tooltipAbove: true,
  },
  {
    key: 'footwear-loafer',
    src: '/assets/pieces/footwear/thumb-loafer-darkbrown.png',
    alt: 'Giày Loafer da bóng phong cách Parisian',
    name: 'Giày Loafer da bóng',
    sub: 'Gen Z Remix',
    dotClass: 'bg-[#4A2E18]',
    wrapperClass: 'bottom-8 right-8 sm:right-20 lg:right-32',
    boxClass: 'w-20 sm:w-24 lg:w-32 rotate-10',
    imgClass: 'drop-shadow-[0_18px_35px_rgba(0,0,0,0.9)] filter group-hover:brightness-110 transition-all',
    floatClass: 'animate-float-reverse',
    depthX: 52,
    depthY: 38,
    tooltipAbove: true,
  },
  {
    key: 'acc-khandong',
    src: '/assets/pieces/accessories/thumb-khan-dong-royal.png',
    alt: 'Khăn đóng hoàng gia',
    name: 'Khăn đóng hoàng gia',
    sub: 'Phụ kiện',
    dotClass: 'bg-imperial-gold',
    wrapperClass: 'top-[52%] right-0 sm:right-2 lg:right-4',
    boxClass: 'w-20 sm:w-24 lg:w-28 -rotate-6',
    imgClass: 'drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] filter opacity-80 group-hover:opacity-100 group-hover:brightness-110 transition-all',
    floatClass: 'animate-float-gentle',
    depthX: 44,
    depthY: 34,
  },
];

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

  const renderPiece = (piece: HeroPieceConfig) => (
    <div
      key={piece.key}
      className={`absolute ${piece.wrapperClass} pointer-events-auto transition-transform duration-200 ease-out`}
      style={{
        transform: `translate3d(${mousePos.x * piece.depthX}px, ${mousePos.y * piece.depthY}px, 0)`,
      }}
      onMouseEnter={() => setHoveredPiece(piece.key)}
      onMouseLeave={() => setHoveredPiece(null)}
      onClick={() => onOpenStudio()}
    >
      <div className={`relative ${piece.floatClass} cursor-pointer group`}>
        <div className={`${piece.boxClass} transition-transform duration-500 group-hover:scale-105`}>
          <img
            src={piece.src}
            alt={piece.alt}
            className={`w-full h-auto object-contain ${piece.imgClass}`}
          />
        </div>
        {/* Tooltip */}
        <div
          className={`absolute ${piece.tooltipAbove ? '-top-9' : '-bottom-8'} left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 pointer-events-none ${
            hoveredPiece === piece.key
              ? 'opacity-100 translate-y-0'
              : piece.tooltipAbove
                ? 'opacity-0 -translate-y-2'
                : 'opacity-0 translate-y-2'
          }`}
        >
          <div className="px-3 py-1 bg-[#0A0D12]/95 border border-imperial-gold/60 backdrop-blur-md shadow-2xl text-[11px] flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${piece.dotClass}`} />
            <span className="font-bold text-silk-ivory">{piece.name}</span>
            <span className="text-imperial-gold">· {piece.sub}</span>
          </div>
        </div>
      </div>
    </div>
  );

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
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.02] transition-transform duration-100 ease-out"
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
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.02] transition-transform duration-150 ease-out"
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
        {BACK_PIECES.map(renderPiece)}
      </div>

      {/* ================= LAYER B: MONUMENTAL TYPOGRAPHY ================= */}
      <div className="relative z-20 max-w-3xl mx-auto text-center space-y-7 pointer-events-auto">
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
            <span>Vào phối đồ</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#visual-showcase"
            className="py-4 px-7 bg-[#12161F]/90 backdrop-blur-md border-2 border-lacquer-border hover:border-imperial-gold text-silk-ivory text-sm sm:text-base font-bold transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] uppercase tracking-wider active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-imperial-gold"
          >
            Xem bộ sưu tầm
          </a>
        </div>
      </div>

      {/* ================= LAYER C: FOREGROUND PIECES (OVERLAPPING & PROMINENT) ================= */}
      <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto z-30">
        {FRONT_PIECES.map(renderPiece)}
      </div>
    </section>
  );
};
