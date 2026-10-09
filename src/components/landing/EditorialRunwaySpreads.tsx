import React, { useState } from 'react';
import { Sparkles, ArrowRight, Palette, Calendar } from 'lucide-react';
import { PRESET_OUTFITS, EVENTS } from '../../data/catalog';
import { PresetOutfit, EventBackground } from '../../types';
import { CornerTopLeftTassel, CornerBottomRightBrass } from '../heritage/HeritageDecorations';

interface EditorialRunwaySpreadsProps {
  onOpenStudio: (preset?: PresetOutfit, event?: EventBackground) => void;
}

interface RunwayLook {
  id: string;
  serial: string;
  title: string;
  subtitle: string;
  concept: string;
  bgUrl: string;
  pieceUrl: string;
  pieceName: string;
  score: string;
  event: EventBackground;
  preset: PresetOutfit;
  palette: { name: string; hex: string }[];
  details: {
    top: string;
    bottom: string;
    footwear: string;
  };
}

export const EditorialRunwaySpreads: React.FC<EditorialRunwaySpreadsProps> = ({ onOpenStudio }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const looks: RunwayLook[] = [
    {
      id: 'look-tet',
      serial: 'LOOK 01 · ĐẠI HỒNG HỶ KHỞI',
      title: 'Áo Tấc Gấm Đỏ & Lụa Ngà',
      subtitle: 'Lễ phục triều Nguyễn trong không gian Tết cổ truyền',
      concept: 'Tương phản kinh điển giữa sắc đỏ gấm sóng nước quyền quý và tà lụa tơ tằm buông rũ thanh tao.',
      bgUrl: '/assets/events/bg-tet-pho-co.png',
      pieceUrl: '/assets/pieces/tops/top-ao-tac-crimson.png',
      pieceName: 'Áo tấc đỏ gấm Thủy ba',
      score: '9.8',
      event: EVENTS[0],
      preset: PRESET_OUTFITS[0],
      palette: [
        { name: 'Đỏ gấm', hex: '#7A1C1C' },
        { name: 'Lụa ngà', hex: '#F7F4EE' },
        { name: 'Kim tuyến', hex: '#C69B56' },
      ],
      details: {
        top: 'Áo tấc tay thụng 40cm, gấm dệt hoa văn sóng nước',
        bottom: 'Quần lụa tơ tằm dệt thủ công làng Vạn Phúc',
        footwear: 'Hài nhung thêu mũi cong đâm xô chỉ vàng',
      },
    },
    {
      id: 'look-prom',
      serial: 'LOOK 02 · THANH LAM ĐƯƠNG THỜI',
      title: 'Áo Tấc Lam Sắc & Quần Âu',
      subtitle: 'Phong cách Campus & Dạ hội School Prom thế hệ mới',
      concept: 'Cú bắt tay ngoạn mục giữa cổ phục quý tộc và đường nét dứt khoát của âu phục sartorial hiện đại.',
      bgUrl: '/assets/events/bg-school-prom.jpg',
      pieceUrl: '/assets/pieces/tops/top-ao-tac-indigo.png',
      pieceName: 'Áo tấc lam sắc quý tộc',
      score: '9.4',
      event: EVENTS[1],
      preset: PRESET_OUTFITS[1],
      palette: [
        { name: 'Chàm vịt', hex: '#1A4B54' },
        { name: 'Than chì', hex: '#2A303C' },
        { name: 'Da nâu', hex: '#4A2E18' },
      ],
      details: {
        top: 'Áo tấc xanh cổ vịt nẹp cổ ngũ khuy nghiêm trang',
        bottom: 'Quần âu xếp ly dáng suông than chì chống nhăn',
        footwear: 'Giày Loafer da bóng phong cách Parisian chic',
      },
    },
    {
      id: 'look-moon',
      serial: 'LOOK 03 · PHỐ CỔ VỌNG NGUYỆT',
      title: 'Nón Lá & Cổ Phục Đêm Trăng',
      subtitle: 'Tết Trung Thu phố đèn lồng Hội An hoài niệm',
      concept: 'Nét dịu dàng, khoan thai của phụ nữ Việt dưới ánh trăng rằm và hàng trăm ngọn hoa đăng lung linh.',
      bgUrl: '/assets/events/bg-tet-trung-thu.jpg',
      pieceUrl: '/assets/pieces/accessories/acc-non-la-traditional.png',
      pieceName: 'Nón lá quai lụa cổ truyền',
      score: '9.6',
      event: EVENTS[2],
      preset: PRESET_OUTFITS[0],
      palette: [
        { name: 'Đỏ đô', hex: '#8B1E1E' },
        { name: 'Trắng ngà', hex: '#EDE5D8' },
        { name: 'Vàng rơm', hex: '#D4AF37' },
      ],
      details: {
        top: 'Áo ngũ thân cổ phong nẹp đứng cài khuy hữu nhậm',
        bottom: 'Quần lụa buông rũ nhẹ nhàng theo từng bước đi',
        footwear: 'Nón lá truyền thống quai lụa tơ tằm thắt nơ',
      },
    },
  ];

  const currentLook = looks[activeIndex];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full select-none" aria-label="Sàn diễn Lookbook">
      {/* Editorial Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6 border-b border-lacquer-border pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-imperial-gold block mb-2">
            RUNWAY COLLECTION · 2026
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-silk-ivory [text-wrap:balance]">
            Sàn Diễn Di Sản Thực Tế
          </h2>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {looks.map((look, idx) => (
            <button
              key={look.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 border flex-shrink-0 flex items-center gap-2 ${
                activeIndex === idx
                  ? 'bg-imperial-gold text-lacquer border-imperial-gold shadow-gold-glow'
                  : 'bg-[#12161F] text-silk-muted border-lacquer-border hover:border-imperial-gold/40 hover:text-silk-ivory'
              }`}
            >
              <span>0{idx + 1}</span>
              <span className="hidden sm:inline">· {look.title.split('&')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Exhibition Showcase Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#12161F] border-2 border-lacquer-border p-6 sm:p-10 relative">
        {/* Left Column: Visual Image Artboard with stereoscopic depth */}
        <div className="lg:col-span-7 relative">
          <div className="relative w-full aspect-[4/3] bg-[#0A0D12] border-2 border-imperial-gold/50 overflow-hidden shadow-2xl group">
            {/* Corner filigree */}
            <CornerTopLeftTassel className="scale-90" />
            <CornerBottomRightBrass className="scale-90" />

            {/* Event Background Image */}
            <img
              key={currentLook.bgUrl}
              src={currentLook.bgUrl}
              alt={currentLook.title}
              className="w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
            />
            {/* Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D12] via-black/40 to-black/20" />

            {/* Floating Garment Artwork in 3D Depth */}
            <div className="absolute right-6 bottom-4 w-48 sm:w-64 h-auto drop-shadow-[0_25px_40px_rgba(0,0,0,0.95)] transition-transform duration-700 group-hover:scale-105 group-hover:-translate-y-2">
              <img
                key={currentLook.pieceUrl}
                src={currentLook.pieceUrl}
                alt={currentLook.pieceName}
                className="w-full h-auto object-contain max-h-64 sm:max-h-80 animate-fadeIn"
              />
            </div>

            {/* Imperial Score Stamp */}
            <div className="absolute top-4 right-4 z-20 pointer-events-none">
              <div
                className="w-14 h-14 bg-[#7C1C16] border border-[#F0D7A2]/80 flex flex-col items-center justify-center text-[#F6E7C1] shadow-xl"
                style={{ transform: 'rotate(-6deg)' }}
              >
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#F0D7A2]/80 leading-none">
                  ĐIỂM
                </span>
                <span className="font-serif font-bold text-lg leading-tight">
                  {currentLook.score}
                </span>
              </div>
            </div>

            {/* Event Tag */}
            <div className="absolute top-4 left-4 z-20">
              <span className="px-3 py-1 bg-[#0A0D12]/95 border border-imperial-gold/40 text-[11px] font-bold text-imperial-gold uppercase tracking-wider backdrop-blur-md">
                {currentLook.event.name}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Lookbook Commentary */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-imperial-gold block">
              {currentLook.serial}
            </span>
            <h3 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-silk-ivory mt-1">
              {currentLook.title}
            </h3>
            <p className="text-xs sm:text-sm text-silk-muted mt-2 font-normal leading-relaxed">
              {currentLook.concept}
            </p>
          </div>

          {/* Outfit Anatomy Breakdown */}
          <div className="space-y-2.5 p-4 bg-[#181E29] border border-lacquer-border text-xs">
            <div className="flex items-start gap-2">
              <span className="text-imperial-gold font-bold uppercase min-w-[55px] text-[11px]">Áo chính:</span>
              <span className="text-silk-ivory">{currentLook.details.top}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-imperial-gold font-bold uppercase min-w-[55px] text-[11px]">Hạ y:</span>
              <span className="text-silk-ivory">{currentLook.details.bottom}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-imperial-gold font-bold uppercase min-w-[55px] text-[11px]">Giày/Nón:</span>
              <span className="text-silk-ivory">{currentLook.details.footwear}</span>
            </div>
          </div>

          {/* Color Palette Chips */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-imperial-gold" />
              <span className="text-[11px] uppercase font-bold text-silk-muted">Bảng hòa sắc:</span>
            </div>
            <div className="flex items-center gap-1.5">
              {currentLook.palette.map((color, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 px-2 py-0.5 border border-white/10 text-[10px] text-silk-ivory bg-[#0A0D12]"
                >
                  <span
                    className="w-2.5 h-2.5 border border-white/20"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* One-Click Action Button to Studio */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onOpenStudio(currentLook.preset, currentLook.event)}
              className="w-full py-4 px-6 bg-imperial-gold hover:bg-imperial-gold-light text-lacquer font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-gold-glow flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Mở bản phối này trong Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
