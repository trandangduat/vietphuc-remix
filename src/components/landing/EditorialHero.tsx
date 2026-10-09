import React from 'react';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';
import { CornerTopLeftTassel, CornerBottomRightBrass } from '../heritage/HeritageDecorations';
import { PresetOutfit, EventBackground } from '../../types';

interface EditorialHeroProps {
  onOpenStudio: (preset?: PresetOutfit, event?: EventBackground) => void;
}

export const EditorialHero: React.FC<EditorialHeroProps> = ({ onOpenStudio }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-8 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full overflow-hidden">
      {/* Background Ambient Atmospheric Glow */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[600px] h-[600px] bg-imperial-gold/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-imperial-red/5 blur-[140px] pointer-events-none" />

      {/* Background Typographic Watermark */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.03] text-right">
        <span className="font-serif text-[18vw] font-bold leading-none tracking-tighter text-silk-ivory uppercase block">
          CỔ PHỤC
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center w-full relative z-10">
        {/* Left Column: Monumental Editorial Narrative */}
        <div className="lg:col-span-7 space-y-7 text-left max-w-[660px]">
          {/* Atelier Edition Tag */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 border border-imperial-gold/40 bg-imperial-gold/10 text-imperial-gold text-xs font-semibold uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tập san Di sản số · Kỷ nguyên 2026</span>
          </div>

          {/* Monumental Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight [text-wrap:balance]">
            <span className="text-silk-ivory block">Thổi hồn đương đại</span>
            <span className="bg-gradient-to-r from-imperial-gold-light via-imperial-gold to-[#9A7332] bg-clip-text text-transparent block mt-1">
              vào áo mũ nghìn năm
            </span>
          </h1>

          {/* Editorial Rationale */}
          <p className="text-base sm:text-lg text-silk-muted leading-relaxed font-normal [text-wrap:pretty]">
            Không gian nghệ thuật số tôn vinh cốt cách y quan triều Nguyễn. Nơi tà Áo tấc và Áo ngũ thân kinh điển được tái định hình qua lăng kính thời trang đương đại của thế hệ trẻ.
          </p>

          {/* Primary Action Group */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <button
              type="button"
              onClick={() => onOpenStudio()}
              className="py-4 px-8 bg-imperial-gold hover:bg-imperial-gold-light text-lacquer font-bold text-sm sm:text-base flex items-center gap-3 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-gold-glow uppercase tracking-wider active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-imperial-gold"
            >
              <span>Bước vào Atelier phối đồ</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#runway"
              className="py-4 px-7 bg-[#12161F] border-2 border-lacquer-border hover:border-imperial-gold text-silk-ivory text-sm sm:text-base font-bold transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] uppercase tracking-wider active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-imperial-gold"
            >
              Xem bộ sưu tập Runway
            </a>
          </div>

          {/* Editorial Metadata Footer */}
          <div className="pt-8 border-t border-lacquer-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-silk-muted font-normal">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-imperial-gold flex-shrink-0" />
              <span>Đối chiếu tư liệu: <strong>Bảo tàng Lịch sử Quốc gia & "Ngàn năm áo mũ"</strong></span>
            </div>
            <div className="text-imperial-gold font-semibold tracking-wider uppercase text-[11px]">
              Tỷ lệ khảo cứu 100% chuẩn mực
            </div>
          </div>
        </div>

        {/* Right Column: Haute Couture Editorial Visual Frame */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <div className="relative w-full max-w-[420px] aspect-[3/4] bg-[#12161F] border-2 border-imperial-gold/60 shadow-2xl p-2.5 sm:p-3 group">
            {/* Heritage Filigree Corner Ornaments */}
            <CornerTopLeftTassel className="scale-95" />
            <CornerBottomRightBrass className="scale-95" />

            {/* Editorial Inner Canvas Frame */}
            <div className="relative w-full h-full overflow-hidden border border-imperial-gold/30 bg-[#0A0D12]">
              <img
                src="/assets/test-composite-preview.png"
                alt="Bản phối Áo tấc đỏ hoàng triều và quần lụa ngà"
                className="w-full h-full object-cover object-top transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
              />

              {/* Atmospheric Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D12] via-transparent to-black/30 pointer-events-none" />

              {/* Imperial Red Vermilion Seal Stamp (Top Right) */}
              <div className="absolute top-4 right-4 pointer-events-none select-none z-30">
                <div
                  className="w-16 h-16 bg-[#7C1C16] border border-[#F0D7A2]/80 flex flex-col items-center justify-center text-[#F6E7C1] shadow-xl"
                  style={{ transform: 'rotate(-6deg)' }}
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

              {/* Haute Lookbook Serial Badge (Top Left) */}
              <div className="absolute top-4 left-4 z-30 bg-[#0A0D12]/90 backdrop-blur-md border border-imperial-gold/40 px-3 py-1 text-[11px] font-bold text-imperial-gold uppercase tracking-wider">
                LOOK 01 · ĐẠI HỒNG HỶ KHỞI
              </div>

              {/* Bottom Editorial Caption */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 bg-gradient-to-t from-[#0A0D12] via-[#0A0D12]/95 to-transparent z-30 space-y-1">
                <span className="text-[11px] uppercase tracking-widest text-imperial-gold font-bold block">
                  Lễ phục Cố đô Huế thời Nguyễn
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-silk-ivory">
                  Áo tấc đỏ gấm thủy ba & Quần lụa ngà
                </h3>
                <p className="text-xs text-silk-muted font-normal line-clamp-2 leading-relaxed">
                  Tà áo tấc tay thụng 40cm dệt hoa văn sóng nước, kết hợp quần lụa tơ tằm buông rũ và hài nhung thêu kim tuyến.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
