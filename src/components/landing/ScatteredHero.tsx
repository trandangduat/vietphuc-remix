import React, { useState } from 'react';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';
import { PresetOutfit, EventBackground } from '../../types';

interface ScatteredHeroProps {
  onOpenStudio: (preset?: PresetOutfit, event?: EventBackground) => void;
}

interface ScatteredPiece {
  id: string;
  name: string;
  category: string;
  period: string;
  imageSrc: string;
  styleClass: string;
  animationClass: string;
  pillPosition: 'top' | 'bottom' | 'right' | 'left';
  tilt: string;
  widthClass: string;
  zIndex: number;
}

export const ScatteredHero: React.FC<ScatteredHeroProps> = ({ onOpenStudio }) => {
  const [hoveredPiece, setHoveredPiece] = useState<string | null>(null);

  const pieces: ScatteredPiece[] = [
    // 1. Áo tấc đỏ đô hoàng triều (Top-Right Hero)
    {
      id: 'piece-ao-tac-do',
      name: 'Áo tấc đỏ gấm Thủy ba',
      category: 'Lễ phục đại triều',
      period: 'Thời Nguyễn (Thế kỷ XIX)',
      imageSrc: '/assets/pieces/tops/top-ao-tac-crimson.png',
      styleClass: 'top-8 right-6 lg:right-16 xl:right-28',
      animationClass: 'animate-float-gentle',
      pillPosition: 'bottom',
      tilt: '-rotate-3',
      widthClass: 'w-44 sm:w-56 lg:w-72',
      zIndex: 20,
    },
    // 2. Nón lá truyền thống (Top-Left)
    {
      id: 'piece-non-la',
      name: 'Nón lá quai lụa tơ tằm',
      category: 'Phụ kiện cổ phong',
      period: 'Cổ truyền Việt Nam',
      imageSrc: '/assets/pieces/accessories/acc-non-la-traditional.png',
      styleClass: 'top-10 left-4 sm:left-10 lg:left-12',
      animationClass: 'animate-float-reverse',
      pillPosition: 'bottom',
      tilt: 'rotate-6',
      widthClass: 'w-32 sm:w-40 lg:w-48',
      zIndex: 15,
    },
    // 3. Áo tấc xanh cổ vịt (Far-Right Mid)
    {
      id: 'piece-ao-tac-xanh',
      name: 'Áo tấc lam sắc quý tộc',
      category: 'Thường phục quý tộc',
      period: 'Thời Nguyễn',
      imageSrc: '/assets/pieces/tops/top-ao-tac-indigo.png',
      styleClass: 'bottom-12 right-2 sm:right-10 lg:right-12 xl:right-20',
      animationClass: 'animate-float-slow',
      pillPosition: 'top',
      tilt: 'rotate-4',
      widthClass: 'w-40 sm:w-52 lg:w-64',
      zIndex: 25,
    },
    // 4. Hài nhung thêu kim tuyến (Bottom-Left)
    {
      id: 'piece-hai-nhung',
      name: 'Hài nhung thêu mũi cong',
      category: 'Lý hài hoàng cung',
      period: 'Chỉ kim tuyến 18K',
      imageSrc: '/assets/pieces/footwear/footwear-hai-nhung-red.png',
      styleClass: 'bottom-16 left-6 sm:left-16 lg:left-24',
      animationClass: 'animate-float-gentle',
      pillPosition: 'top',
      tilt: '-rotate-6',
      widthClass: 'w-28 sm:w-36 lg:w-44',
      zIndex: 22,
    },
    // 5. Giày Loafer đương đại (Bottom-Center Right)
    {
      id: 'piece-loafer',
      name: 'Giày Loafer da bóng',
      category: 'Phối ngẫu đương đại',
      period: 'Thời trang Gen Z',
      imageSrc: '/assets/pieces/footwear/footwear-loafer-darkbrown.png',
      styleClass: 'bottom-6 left-1/2 translate-x-12 sm:translate-x-24 lg:translate-x-32',
      animationClass: 'animate-float-reverse',
      pillPosition: 'top',
      tilt: 'rotate-8',
      widthClass: 'w-24 sm:w-32 lg:w-40',
      zIndex: 24,
    },
    // 6. Quần lụa trắng ngà (Mid-Left Floating)
    {
      id: 'piece-quan-lua',
      name: 'Quần lụa tơ tằm Vạn Phúc',
      category: 'Hạ y cổ truyền',
      period: 'Lụa tơ tằm tự nhiên',
      imageSrc: '/assets/pieces/bottoms/bottom-quan-lua-white.png',
      styleClass: 'top-1/2 -translate-y-12 left-2 sm:left-6 lg:left-8 opacity-75',
      animationClass: 'animate-float-slow',
      pillPosition: 'right',
      tilt: '-rotate-2',
      widthClass: 'w-28 sm:w-36 lg:w-44',
      zIndex: 10,
    },
  ];

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-16 pb-24 px-4 sm:px-6 lg:px-12 w-full overflow-hidden select-none">
      {/* Background Ambient Atmospheric Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-imperial-gold/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-imperial-red/5 blur-[140px] pointer-events-none" />

      {/* Background Antique Golden Cloud Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] select-none">
        <img
          src="/assets/decorations/golden-cloud.png"
          alt="Golden Cloud"
          className="w-[900px] max-w-none object-contain"
        />
      </div>

      {/* Background Big Typography Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.025]">
        <span className="font-serif text-[22vw] font-bold tracking-tighter text-silk-ivory uppercase leading-none">
          VIỆT PHỤC
        </span>
      </div>

      {/* ================= SCATTERED PIECES LAYER ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden max-w-7xl mx-auto">
        {pieces.map((piece) => {
          const isHovered = hoveredPiece === piece.id;

          return (
            <div
              key={piece.id}
              style={{ zIndex: isHovered ? 50 : piece.zIndex }}
              className={`absolute ${piece.styleClass} pointer-events-auto transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                isHovered ? 'scale-110' : 'hover:scale-105'
              }`}
              onMouseEnter={() => setHoveredPiece(piece.id)}
              onMouseLeave={() => setHoveredPiece(null)}
              onClick={() => onOpenStudio()}
            >
              {/* Floating Container */}
              <div className={`relative ${piece.animationClass} cursor-pointer group`}>
                {/* The Piece Image with Drop Shadow */}
                <div className={`relative ${piece.widthClass} ${piece.tilt} transition-all duration-500`}>
                  <img
                    src={piece.imageSrc}
                    alt={piece.name}
                    className="w-full h-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] filter group-hover:brightness-110 transition-all duration-300"
                  />
                </div>

                {/* Editorial Provenance Pill */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none transition-all duration-300 ${
                    piece.pillPosition === 'top' ? '-top-8' : '-bottom-8'
                  } ${
                    isHovered
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 sm:opacity-75 sm:group-hover:opacity-100'
                  }`}
                >
                  <div className="px-2.5 py-1 bg-[#0A0D12]/95 border border-imperial-gold/60 backdrop-blur-md shadow-xl flex items-center gap-1.5 text-[11px] font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-imperial-gold" />
                    <span className="font-bold text-silk-ivory">{piece.name}</span>
                    <span className="text-imperial-gold font-medium">({piece.category})</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Floating Imperial Score Stamp (Top-Right Accent) */}
        <div className="absolute top-12 right-4 sm:right-12 lg:right-20 pointer-events-none z-30 hidden sm:block">
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

      {/* ================= CENTRAL EDITORIAL CONTENT LAYER ================= */}
      <div className="relative z-40 max-w-3xl mx-auto text-center space-y-7 pointer-events-auto">
        {/* Edition Tag */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 border border-imperial-gold/40 bg-[#0A0D12]/90 backdrop-blur-md text-imperial-gold text-xs font-semibold uppercase tracking-[0.2em] shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-imperial-gold" />
          <span>Tập san Di sản số · Kỷ nguyên 2026</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight [text-wrap:balance]">
          <span className="text-silk-ivory block drop-shadow-md">Thổi hồn đương đại</span>
          <span className="bg-gradient-to-r from-imperial-gold-light via-imperial-gold to-[#9A7332] bg-clip-text text-transparent block mt-1.5 drop-shadow-lg">
            vào áo mũ nghìn năm
          </span>
        </h1>

        {/* Rationale Copy */}
        <p className="text-base sm:text-lg text-silk-muted max-w-xl mx-auto leading-relaxed font-normal [text-wrap:pretty] px-4 bg-[#0A0D12]/40 backdrop-blur-[2px]">
          Xưởng phối đồ trực quan 2D dành cho giới trẻ: khám phá vẻ đẹp Áo tấc, Ngũ thân triều Nguyễn kết hợp ngẫu hứng cùng trang phục hiện đại, có thẩm định văn hóa chuẩn xác.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => onOpenStudio()}
            className="py-4 px-8 bg-imperial-gold hover:bg-imperial-gold-light text-lacquer font-bold text-sm sm:text-base flex items-center gap-3 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-gold-glow uppercase tracking-wider active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-imperial-gold"
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

        {/* Provenance Footer Bar */}
        <div className="pt-6 border-t border-lacquer-border/80 flex flex-wrap items-center justify-center gap-6 text-xs text-silk-muted font-normal">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-imperial-gold flex-shrink-0" />
            <span>Đối chiếu tư liệu: <strong className="text-silk-ivory">Bảo tàng Lịch sử Quốc gia & "Ngàn năm áo mũ"</strong></span>
          </div>
          <span className="hidden sm:inline text-lacquer-border">|</span>
          <span className="text-imperial-gold font-semibold tracking-wider uppercase text-[11px]">
            42+ Mảnh phối · 5 Đại cảnh văn hóa
          </span>
        </div>
      </div>
    </section>
  );
};
