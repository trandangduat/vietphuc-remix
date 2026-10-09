import React from 'react';
import { Sparkles, ArrowRight, Palette, Calendar } from 'lucide-react';
import { PRESET_OUTFITS, EVENTS } from '../../data/catalog';
import { PresetOutfit, EventBackground } from '../../types';
import { AncientCloudDivider } from '../heritage/HeritageDecorations';

interface VisualLookbookGalleryProps {
  onOpenStudio: (preset?: PresetOutfit, event?: EventBackground) => void;
}

interface VisualSpread {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  bgUrl: string;
  pieceUrl: string;
  pieceName: string;
  score: string;
  preset: PresetOutfit;
  event: EventBackground;
  palette: string[];
  occasion: string;
}

export const VisualLookbookGallery: React.FC<VisualLookbookGalleryProps> = ({ onOpenStudio }) => {
  const spreads: VisualSpread[] = [
    {
      id: 'spread-01',
      tag: 'LỄ TẾT CỔ TRUYỀN',
      title: 'Đại Hồng Hỷ Khởi',
      subtitle: 'Áo tấc gấm đỏ đại triều & Lụa tơ tằm trắng ngà',
      bgUrl: '/assets/events/bg-tet-pho-co.png',
      pieceUrl: '/assets/pieces/tops/top-ao-tac-crimson.png',
      pieceName: 'Áo tấc đỏ gấm Thủy ba',
      score: '9.8',
      preset: PRESET_OUTFITS[0],
      event: EVENTS[0],
      palette: ['#7A1C1C', '#F7F4EE', '#C69B56'],
      occasion: 'Tết Nguyên Đán, Tế bái gia tộc, Lễ cưới',
    },
    {
      id: 'spread-02',
      tag: 'DẠ HỘI TRƯỜNG HỌC',
      title: 'Thanh Lam Đương Thời',
      subtitle: 'Áo tấc xanh cổ vịt & Quần âu xếp ly than chì',
      bgUrl: '/assets/events/bg-school-prom.jpg',
      pieceUrl: '/assets/pieces/tops/top-ao-tac-indigo.png',
      pieceName: 'Áo tấc lam sắc quý tộc',
      score: '9.4',
      preset: PRESET_OUTFITS[1],
      event: EVENTS[1],
      palette: ['#1A4B54', '#2A303C', '#4A2E18'],
      occasion: 'Dạ hội School Prom, Kỷ yếu giảng đường',
    },
    {
      id: 'spread-03',
      tag: 'TẾT TRUNG THU',
      title: 'Hội An Đêm Rằm',
      subtitle: 'Áo tấc lam sắc & Hài nhung dưới trăng rằm',
      bgUrl: '/assets/events/bg-tet-trung-thu.jpg',
      pieceUrl: '/assets/pieces/accessories/acc-non-la-traditional.png',
      pieceName: 'Nón lá quai lụa cổ truyền',
      score: '9.6',
      preset: PRESET_OUTFITS[0],
      event: EVENTS[2],
      palette: ['#1A4B54', '#8B1E1E', '#EDE5D8'],
      occasion: 'Đêm hội đèn lồng, Dạo phố cổ, Triển lãm',
    },
    {
      id: 'spread-04',
      tag: 'LỄ GIA ĐÌNH',
      title: 'Cung Đình Đoan Chính',
      subtitle: 'Áo tấc đỏ đô, Hài nhung thêu & Lụa tơ tằm',
      bgUrl: '/assets/events/bg-le-cuoi-gia-dinh.png',
      pieceUrl: '/assets/pieces/footwear/footwear-hai-nhung-red.png',
      pieceName: 'Hài nhung thêu mũi cong',
      score: '9.7',
      preset: PRESET_OUTFITS[0],
      event: EVENTS[4],
      palette: ['#7A1C1C', '#F7F4EE', '#2A303C'],
      occasion: 'Lễ cưới gia đình, Đại hỷ, Chụp ảnh kỷ niệm',
    },
  ];

  return (
    <section id="visual-showcase" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full" aria-label="Sàn diễn hình ảnh">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-imperial-gold/30 bg-imperial-gold/10 text-imperial-gold text-xs font-semibold uppercase tracking-widest mb-3">
          <Calendar className="w-3.5 h-3.5" />
          <span>Sàn diễn Visual</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-silk-ivory mb-3 [text-wrap:balance]">
          Bản Phối Thực Tế Trong Từng Bối Cảnh
        </h2>
        <p className="text-sm sm:text-base text-silk-muted font-normal [text-wrap:pretty]">
          Mỗi tà áo gấm hòa mình vào một không gian văn hóa riêng biệt: từ phố xuân rực rỡ đến dạ hội trường học lung linh.
        </p>
      </div>

      <AncientCloudDivider className="mb-12 opacity-30 max-w-xs mx-auto" />

      {/* 4 Large Visual Image Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {spreads.map((spread) => (
          <div
            key={spread.id}
            className="group relative bg-[#12161F] border-2 border-lacquer-border hover:border-imperial-gold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden flex flex-col justify-between"
          >
            {/* Visual Image Viewport (Aspect 16:10) */}
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#0A0D12]">
              {/* Event Background Image */}
              <img
                src={spread.bgUrl}
                alt={spread.title}
                className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
              />

              {/* Cinematic Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#12161F] via-black/40 to-black/30" />

              {/* Foreground Layered Garment Silhouette */}
              <div className="absolute right-4 bottom-2 w-36 sm:w-48 h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.9)] transition-transform duration-700 group-hover:scale-105 group-hover:-translate-y-1">
                <img
                  src={spread.pieceUrl}
                  alt={spread.pieceName}
                  className="w-full h-auto object-contain max-h-48"
                />
              </div>

              {/* Event Tag (Top Left) */}
              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 bg-[#0A0D12]/90 border border-imperial-gold/40 text-[10px] font-bold text-imperial-gold uppercase tracking-wider backdrop-blur-md">
                  {spread.tag}
                </span>
              </div>

              {/* Score Stamp (Top Right) */}
              <div className="absolute top-4 right-4 z-20">
                <div
                  className="w-12 h-12 bg-[#7C1C16] border border-[#F0D7A2]/80 flex flex-col items-center justify-center text-[#F6E7C1] shadow-lg"
                  style={{ transform: 'rotate(-5deg)' }}
                >
                  <span className="text-[8px] uppercase font-bold tracking-widest text-[#F0D7A2]/80 leading-none">
                    ĐIỂM
                  </span>
                  <span className="font-serif font-bold text-sm leading-tight">
                    {spread.score}
                  </span>
                </div>
              </div>
            </div>

            {/* Content & Action Area */}
            <div className="p-6 sm:p-7 space-y-4 bg-[#12161F]">
              <div>
                <h3 className="font-serif font-bold text-2xl text-silk-ivory group-hover:text-imperial-gold transition-colors">
                  {spread.title}
                </h3>
                <p className="text-xs sm:text-sm text-silk-muted mt-1 font-medium">
                  {spread.subtitle}
                </p>
              </div>

              {/* Palette & Occasion Strip */}
              <div className="pt-3 border-t border-lacquer-border flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-imperial-gold flex-shrink-0" />
                  <div className="flex items-center gap-1.5">
                    {spread.palette.map((color, idx) => (
                      <span
                        key={idx}
                        className="w-3.5 h-3.5 rounded-none border border-white/30"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-silk-muted text-[11px] truncate max-w-[200px]">
                  {spread.occasion}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onOpenStudio(spread.preset, spread.event)}
                  className="w-full py-3 px-5 bg-[#181E29] border border-imperial-gold/60 hover:bg-imperial-gold hover:text-lacquer text-imperial-gold font-bold text-xs uppercase tracking-wider transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Mở bản phối này trong Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
