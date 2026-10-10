import React from 'react';
import { Piece } from '../types';
import { ExternalLink, Shirt, Columns2, Footprints, Crown, Sparkles, BookOpen, Compass, Landmark } from 'lucide-react';
import { HeritageModal } from './heritage/HeritageFrame';

export interface PieceInfoModalProps {
  piece: Piece | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectPiece?: (piece: Piece) => void;
  isEquipped?: boolean;
}

export const PieceInfoModal: React.FC<PieceInfoModalProps> = ({
  piece,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !piece) return null;

  const info = piece.culturalInfo;

  const sourcesList =
    info?.sources && info.sources.length > 0
      ? info.sources
      : info?.source
      ? [
          {
            title: info.source,
            url: info.citationUrl || `https://www.google.com/search?q=${encodeURIComponent(info.source)}`,
          },
        ]
      : [];

  const getCategoryLabel = () => {
    switch (piece.category) {
      case 'top':
        return { label: 'Áo cổ truyền', Icon: Shirt };
      case 'bottom':
        return { label: 'Quần / Váy', Icon: Columns2 };
      case 'footwear':
        return { label: 'Giày / Hài', Icon: Footprints };
      case 'accessory':
        return { label: 'Phụ kiện', Icon: Crown };
      default:
        return { label: 'Phục trang', Icon: Sparkles };
    }
  };

  const { label: categoryLabel, Icon: CategoryIcon } = getCategoryLabel();

  return (
    <HeritageModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-5xl"
      className="p-0"
      contentClassName="overflow-y-auto p-0"
    >
      <div className="flex flex-col lg:flex-row min-h-[520px] lg:min-h-[580px]">
        {/* ======================================================== */}
        {/* LEFT COLUMN: HERO GARMENT SHOWCASE (100% Piece Focused)  */}
        {/* ======================================================== */}
        <div className="lg:w-[46%] xl:w-[45%] flex flex-col p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-imperial-gold/20 relative bg-lacquer/30">
          {/* Background Aura Spotlight */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(198,155,86,0.18)_0%,_rgba(10,13,18,0.45)_65%,_transparent_100%)] pointer-events-none" />

          {/* Top Showcase Header: Category Tag & Era */}
          <div className="relative z-10 flex items-center justify-between w-full pb-3 border-b border-imperial-gold/15 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-imperial-gold" />
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-imperial-gold flex items-center gap-1.5">
                <CategoryIcon className="w-3.5 h-3.5" />
                <span>{categoryLabel}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-wider px-2 py-0.5 bg-imperial-gold/15 text-imperial-gold-light border border-imperial-gold/30">
                {piece.style === 'traditional' ? 'CỔ PHONG' : piece.style === 'modern' ? 'HIỆN ĐẠI' : 'REMIX'}
              </span>
            </div>
          </div>

          {/* Central Piece Hero Visual: Big, High-Resolution, Maximized */}
          <div className="relative z-10 flex-1 flex items-center justify-center py-4 group min-h-[380px] sm:min-h-[460px] lg:min-h-[520px]">
            {/* Subtle antique pedestal reflection shadow */}
            <div className="absolute bottom-2 w-52 sm:w-64 h-8 bg-black/80 filter blur-xl rounded-full pointer-events-none" />

            <img
              src={piece.thumbnailUrl || piece.assetUrl}
              alt={piece.name}
              className="max-h-[360px] sm:max-h-[460px] lg:max-h-[520px] w-auto max-w-full object-contain filter drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)] transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: CURATORIAL MONOGRAPH (Clean Editorial)      */}
        {/* ======================================================== */}
        <div className="lg:w-[54%] xl:w-[55%] flex flex-col p-6 sm:p-8 lg:p-10 justify-between max-h-[85vh] lg:max-h-[660px] overflow-y-auto pr-4 sm:pr-8">
          <div className="space-y-6">
            
            {/* Monograph Title & Era Ribbon */}
            <div className="pb-4 border-b border-imperial-gold/20">
              {info?.period && (
                <p className="text-xs font-sans font-bold uppercase tracking-widest text-imperial-gold mb-1.5 flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5" />
                  <span>{info.period}</span>
                </p>
              )}
              <h2 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-silk-ivory tracking-wide leading-tight">
                {piece.name}
              </h2>
            </div>

            {/* Section 1: Origin & History (No nested box!) */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-imperial-gold flex-shrink-0" />
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-imperial-gold">
                  Nguồn gốc & Lai lịch lịch sử
                </h4>
              </div>
              <p className="text-sm text-silk-ivory/90 font-sans leading-relaxed text-justify pl-6">
                {info?.origin || info?.period || 'Cổ phục truyền thống mang đậm bản sắc văn hiến dân tộc.'}
              </p>
            </div>

            {/* Section 2: Cultural Meaning & Symbolism (No nested box!) */}
            {info?.meaning && (
              <div className="space-y-2 pt-2 border-t border-imperial-gold/15">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-imperial-gold flex-shrink-0" />
                  <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-imperial-gold">
                    Ý nghĩa văn hóa & Triết lý thẩm mỹ
                  </h4>
                </div>
                <p className="text-sm text-silk-ivory/90 font-sans leading-relaxed text-justify pl-6">
                  {info.meaning}
                </p>
              </div>
            )}

            {/* Section 3: Proper Context (No nested box!) */}
            {info?.context && (
              <div className="space-y-2 pt-2 border-t border-imperial-gold/15">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-imperial-gold flex-shrink-0" />
                  <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-imperial-gold">
                    Bối cảnh chuẩn mực
                  </h4>
                </div>
                <p className="text-sm text-silk-ivory/90 font-sans leading-relaxed text-justify pl-6">
                  {info.context}
                </p>
              </div>
            )}

            {/* Section 4: Verified Clickable Sources (Clean Editorial Link List) */}
            {sourcesList.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-imperial-gold/20">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-imperial-gold flex-shrink-0" />
                  <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-imperial-gold">
                    Tư liệu & Nguồn tham khảo chính thống (Nhấn để đọc)
                  </h4>
                </div>

                {/* Clean List of Links with hover gold shine */}
                <div className="pl-6 space-y-2">
                  {sourcesList.map((srcItem, index) => (
                    <a
                      key={index}
                      href={srcItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-3 py-1.5 px-3 rounded-none hover:bg-white/[0.04] transition-colors border-b border-white/5 hover:border-imperial-gold/40 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-imperial-gold/70 group-hover:bg-imperial-gold-light transition-colors flex-shrink-0" />
                        <span className="text-xs sm:text-[13px] font-sans text-silk-ivory group-hover:text-[#F0D195] font-medium transition-colors truncate">
                          {srcItem.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-imperial-gold opacity-75 group-hover:opacity-100 flex-shrink-0">
                        <span className="text-[11px] font-sans hidden sm:inline text-imperial-gold group-hover:underline">
                          Truy cập
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Discreet Archive Signature */}
          <div className="pt-6 mt-6 border-t border-imperial-gold/15 flex items-center justify-between text-[11px] font-mono text-silk-muted/50">
            <span>Hồ sơ giám định cổ phục • Việt Phục Remix</span>
            <span>Di sản & Thời trang đương đại</span>
          </div>
        </div>

      </div>
    </HeritageModal>
  );
};
