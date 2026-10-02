import React from 'react';
import { Piece } from '../../types';
import { HeritageFrame } from './HeritageFrame';
import {
  HeritageDynastyIcon,
  HeritageCulturalIcon,
  HeritageContextIcon,
} from './HeritageDecorations';

interface HeritageCulturalCardProps {
  piece: Piece;
  className?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}

/**
 * Cultural Information Card matching exactly media_1790929865720.png:
 * - 4 corners (Tassel, Blossom, Brass Corner, Ink wash)
 * - Header with book icon, Piece Name, and "CỔ PHONG" badge
 * - 3 structured heritage sections with gold crest icons
 * - Verified source citation footer
 */
export const HeritageCulturalCard: React.FC<HeritageCulturalCardProps> = React.memo(({
  piece,
  className = '',
  onClose,
  showCloseButton = false,
}) => {
  const info = piece.culturalInfo;

  return (
    <HeritageFrame
      title={piece.name}
      badge={piece.style === 'traditional' ? 'Cổ phong' : 'Hiện đại'}
      source={info?.source}
      citationUrl={info?.citationUrl}
      onClose={onClose}
      showCloseButton={showCloseButton}
      className={`w-full max-w-[340px] ${className}`}
    >
      <div className="space-y-3 text-xs font-sans">
        {/* Section 1: Thời kỳ lịch sử */}
        {info?.period && (
          <div className="flex items-start gap-2.5">
            <HeritageDynastyIcon className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#C5A059]" />
            <div className="flex-1 min-w-0">
              <span className="font-sans font-bold text-[11px] uppercase tracking-wider text-[#C5A059] block">
                THỜI KỲ LỊCH SỬ:
              </span>
              <p className="text-[#EDE5D8] font-medium mt-0.5 leading-relaxed font-sans text-xs">
                {info.period}
              </p>
            </div>
          </div>
        )}

        {/* Section 2: Ý nghĩa văn hóa */}
        {info?.meaning && (
          <div className="flex items-start gap-2.5">
            <HeritageCulturalIcon className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#C5A059]" />
            <div className="flex-1 min-w-0">
              <span className="font-sans font-bold text-[11px] uppercase tracking-wider text-[#C5A059] block">
                Ý NGHĨA VĂN HÓA:
              </span>
              <p className="text-[#EDE5D8]/95 font-normal mt-0.5 leading-relaxed text-justify font-sans text-xs">
                {info.meaning}
              </p>
            </div>
          </div>
        )}

        {/* Section 3: Bối cảnh chuẩn mực */}
        {info?.context && (
          <div className="flex items-start gap-2.5">
            <HeritageContextIcon className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#C5A059]" />
            <div className="flex-1 min-w-0">
              <span className="font-sans font-bold text-[11px] uppercase tracking-wider text-[#C5A059] block">
                BỐI CẢNH CHUẨN MỰC:
              </span>
              <p className="text-[#EDE5D8]/95 font-normal mt-0.5 leading-relaxed text-justify font-sans text-xs">
                {info.context}
              </p>
            </div>
          </div>
        )}
      </div>
    </HeritageFrame>
  );
});

HeritageCulturalCard.displayName = 'HeritageCulturalCard';
