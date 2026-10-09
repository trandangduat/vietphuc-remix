import React from 'react';
import { Sparkles, ArrowRight, Palette, Tag } from 'lucide-react';
import { PRESET_OUTFITS, EVENTS } from '../../data/catalog';
import { PresetOutfit, EventBackground } from '../../types';
import { AncientCloudDivider } from '../heritage/HeritageDecorations';

interface RunwayLookbookProps {
  onOpenStudio: (preset?: PresetOutfit, event?: EventBackground) => void;
}

interface CuratedLook {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  event: EventBackground;
  preset: PresetOutfit;
  imageSrc: string;
  score: string;
  palette: { name: string; hex: string }[];
  description: string;
  occasion: string;
}

export const RunwayLookbook: React.FC<RunwayLookbookProps> = ({ onOpenStudio }) => {
  const looks: CuratedLook[] = [
    {
      id: 'look-01',
      code: 'LOOK 01 / CỔ ĐIỂN',
      title: 'Đại Hồng Hỷ Khởi',
      subtitle: 'Áo tấc gấm đỏ đại hồng & Lụa tơ tằm trắng ngà',
      event: EVENTS[0], // Tết cổ truyền
      preset: PRESET_OUTFITS[0],
      imageSrc: '/assets/pieces/tops/top-ao-tac-crimson.png',
      score: '9.8',
      palette: [
        { name: 'Đỏ gấm', hex: '#7A1C1C' },
        { name: 'Lụa ngà', hex: '#F7F4EE' },
        { name: 'Kim tuyến', hex: '#C69B56' },
      ],
      description:
        'Lễ phục hoàng triều trang trọng bậc nhất thời Nguyễn. Sắc đỏ gấm dệt hoa văn sóng nước đại diện cho vượng khí, tương phản kinh điển cùng tà lụa trắng ngà buông rũ.',
      occasion: 'Tết Nguyên Đán, Tế bái gia tộc, Lễ cưới cổ phong.',
    },
    {
      id: 'look-02',
      code: 'LOOK 02 / REMIX',
      title: 'Thanh Lam Đương Thời',
      subtitle: 'Áo tấc xanh cổ vịt & Quần âu xếp ly than chì',
      event: EVENTS[1], // Prom Dạ hội
      preset: PRESET_OUTFITS[1],
      imageSrc: '/assets/pieces/tops/top-ao-tac-indigo.png',
      score: '9.4',
      palette: [
        { name: 'Chàm vịt', hex: '#1A4B54' },
        { name: 'Than chì', hex: '#2A303C' },
        { name: 'Da nâu', hex: '#4A2E18' },
      ],
      description:
        'Sự kết hợp táo bạo giữa tà áo thụng quý tộc và phom quần âu dứt khoát. Giày Loafer da bóng tạo nên phong thái trí thức đĩnh đạc mang hơi thở Sartorial đương đại.',
      occasion: 'Dạ hội School Prom, Triển lãm nghệ thuật, Campus Chic.',
    },
    {
      id: 'look-03',
      code: 'LOOK 03 / CỔ PHONG',
      title: 'Hội An Cổ Kính',
      subtitle: 'Áo tấc đỏ gấm, Hài thêu & Nón lá truyền thống',
      event: EVENTS[2], // Tết Trung Thu
      preset: PRESET_OUTFITS[0],
      imageSrc: '/assets/events/bg-tet-trung-thu.jpg',
      score: '9.6',
      palette: [
        { name: 'Đỏ đô', hex: '#8B1E1E' },
        { name: 'Trắng ngà', hex: '#EDE5D8' },
        { name: 'Vàng rơm', hex: '#D4AF37' },
      ],
      description:
        'Hòa mình vào không gian phố cổ lung linh đèn lồng. Chiếc nón lá truyền thống điểm xuyết cho dáng đi khoan thai, tôn vinh nét dịu dàng đoan chính của phụ nữ Việt.',
      occasion: 'Tết Trung Thu, Lễ hội đèn lồng, Dạo phố cổ.',
    },
    {
      id: 'look-04',
      code: 'LOOK 04 / REMIX',
      title: 'Giao Hòa Thế Kỷ',
      subtitle: 'Áo tấc lam sắc & Quần âu trong không gian trường học',
      event: EVENTS[3], // Ngày hội trường học
      preset: PRESET_OUTFITS[1],
      imageSrc: '/assets/events/bg-ngay-hoi-truong.jpg',
      score: '9.5',
      palette: [
        { name: 'Xanh chàm', hex: '#1A4B54' },
        { name: 'Xám tuyết', hex: '#4A5568' },
        { name: 'Vàng kim', hex: '#C69B56' },
      ],
      description:
        'Cổ phục tự tin xuất hiện giữa khuôn viên trường đại học hiện đại. Một tuyên ngôn mạnh mẽ rằng di sản không phải là hoài niệm, mà là một phong cách sống của hôm nay.',
      occasion: 'Ngày hội văn hóa, Lễ khai giảng, Thuyết trình nghệ thuật.',
    },
  ];

  return (
    <section id="runway" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full" aria-label="Bộ sưu tập Runway">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-imperial-gold/30 bg-imperial-gold/10 text-imperial-gold text-xs font-semibold uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sàn diễn Di sản</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-silk-ivory mb-4 [text-wrap:balance]">
          Bộ Sưu Tập Runway Tuyển Chọn
        </h2>
        <p className="text-sm sm:text-base text-silk-muted font-normal [text-wrap:pretty] leading-relaxed">
          Bốn bản phối tiêu biểu đã được các nhà nghiên cứu trang phục và chuyên gia thời trang phê chuẩn. Nạp vào Atelier chỉ với 1 thao tác nhấn chuột.
        </p>
      </div>

      <AncientCloudDivider className="mb-14 opacity-30 max-w-sm mx-auto" />

      {/* 4 Editorial Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {looks.map((look) => (
          <div
            key={look.id}
            className="bg-[#12161F] border-2 border-lacquer-border hover:border-imperial-gold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] p-6 sm:p-8 flex flex-col justify-between group"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-lacquer-border">
                <span className="text-xs font-bold uppercase tracking-widest text-imperial-gold">
                  {look.code}
                </span>
                <span className="px-2.5 py-0.5 text-[11px] font-bold border border-imperial-gold/40 bg-imperial-gold/10 text-imperial-gold">
                  ĐIỂM: {look.score}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-silk-ivory group-hover:text-imperial-gold transition-colors">
                {look.title}
              </h3>
              <p className="text-xs sm:text-sm text-silk-muted mt-1 font-medium">
                {look.subtitle}
              </p>

              {/* Description */}
              <p className="text-xs sm:text-sm text-silk-muted/90 mt-4 leading-relaxed font-normal">
                {look.description}
              </p>

              {/* Color Palette Swatches */}
              <div className="mt-5 pt-4 border-t border-lacquer-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-imperial-gold" />
                  <span className="text-[11px] uppercase font-bold text-silk-muted tracking-wider">
                    Bảng hòa sắc:
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {look.palette.map((swatch, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 px-2 py-0.5 border border-white/10 text-[10px] text-silk-ivory bg-[#181E29]"
                    >
                      <span
                        className="w-2.5 h-2.5 border border-white/20"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <span>{swatch.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Occasion Note */}
              <div className="mt-3 flex items-center gap-2 text-xs text-silk-muted">
                <Tag className="w-3.5 h-3.5 text-teal-300" />
                <span>
                  <strong className="text-silk-ivory font-semibold">Bối cảnh khuyến nghị:</strong>{' '}
                  {look.occasion}
                </span>
              </div>
            </div>

            {/* Launch CTA */}
            <div className="pt-6 mt-6 border-t border-lacquer-border">
              <button
                type="button"
                onClick={() => onOpenStudio(look.preset, look.event)}
                className="w-full py-3.5 px-6 bg-[#181E29] border border-imperial-gold/60 hover:bg-imperial-gold hover:text-lacquer text-imperial-gold font-bold text-xs uppercase tracking-wider transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Mở bản phối này trong Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
