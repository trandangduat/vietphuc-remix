import React, { useEffect } from 'react';
import {
  CornerTopLeftTassel,
  CornerTopRightBlossom,
  CornerBottomRightBrass,
  CornerBottomLeft,
  AncientCloudDivider,
  HeritageBookIcon,
} from './HeritageDecorations';
import { X } from 'lucide-react';

export interface HeritageFrameProps {
  children: React.ReactNode;
  title?: string;
  badge?: string;
  source?: string;
  citationUrl?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
  className?: string;
  contentClassName?: string;
}

/**
 * Reusable Heritage Lacquer Frame with signature 4 Vietnamese ancient corners:
 * - Top-Left: Brass filigree bracket with royal vermilion silk tassel
 * - Top-Right: Brass bracket with blooming peach blossoms
 * - Bottom-Right: Brass cloud and dragon bracket
 * - Bottom-Left: Brass bracket with ink-wash brush flourish
 */
export const HeritageFrame: React.FC<HeritageFrameProps> = React.memo(({
  children,
  title,
  badge = 'CỔ PHONG',
  source,
  citationUrl,
  onClose,
  showCloseButton = false,
  className = '',
  contentClassName = '',
}) => {
  return (
    <div
      className={`relative bg-gradient-to-b from-[#180E24] via-[#100818] to-[#09040D] text-[#EDE5D8] border border-[#C5A059]/80 shadow-[0_24px_70px_rgba(0,0,0,0.98),0_0_30px_rgba(212,175,55,0.22),inset_0_0_0_1px_rgba(255,224,130,0.2)] font-sans select-none overflow-hidden ${className}`}
    >
      {/* Subtle Royal Plum / Imperial Purple Glow ("Ám tím như hình nền") */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(126,34,206,0.18)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(88,28,135,0.15)_0%,_transparent_65%)] pointer-events-none" />

      {/* Top and Bottom Golden Gradient Accent Lines */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFE89E] to-transparent pointer-events-none z-20 opacity-80" />
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent pointer-events-none z-20 opacity-80" />

      {/* 4 Signature Heritage Corner Image Ornaments */}
      <CornerTopLeftTassel />
      <CornerTopRightBlossom />
      <CornerBottomRightBrass />
      <CornerBottomLeft />

      {/* Optional Close Button */}
      {showCloseButton && onClose && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-2.5 right-2.5 z-30 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 border border-[#C5A059]/50 hover:border-[#D4AF37] text-[#EDE5D8]/80 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
          title="Đóng (ESC)"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Main Inner Content Area (Padded to fit comfortably inside corner brackets) */}
      <div className={`relative z-10 px-5 sm:px-6 pt-5 pb-5 flex flex-col ${contentClassName}`}>
        {/* Header (Book Icon + Title + Badge) */}
        {title && (
          <div className="flex flex-col mb-1">
            <div className="flex items-center justify-between gap-3 pr-4">
              {/* Left: Book Icon + Title */}
              <div className="flex items-center gap-2.5 min-w-0">
                <HeritageBookIcon className="w-5 h-5 flex-shrink-0" />
                <h3 className="font-serif font-black text-base sm:text-lg bg-gradient-to-r from-[#FFFFFF] via-[#FFF3D6] to-[#E5C37A] bg-clip-text text-transparent tracking-wide truncate">
                  {title}
                </h3>
              </div>

              {/* Right: Badge (CỔ PHONG) with Golden Gradient */}
              {badge && (
                <span className="px-3 py-1 rounded-[3px] bg-gradient-to-r from-[#2B1704] via-[#3D2308] to-[#241203] border border-[#D4AF37] text-[#FFE89E] text-[11px] font-serif font-black uppercase tracking-[0.18em] whitespace-nowrap shadow-[0_2px_10px_rgba(0,0,0,0.7),0_0_12px_rgba(212,175,55,0.3)]">
                  {badge}
                </span>
              )}
            </div>

            {/* Ancient Calligraphic Cloud Divider with Golden Gradient */}
            <AncientCloudDivider className="my-2.5" />
          </div>
        )}

        {/* Dynamic Body Content */}
        <div className="flex-1">{children}</div>

        {/* Optional Source Citation Footer */}
        {source && (
          <div className="mt-3.5 pt-2.5 border-t border-[#C5A059]/25 flex items-start gap-2 text-xs font-serif text-[#C5A059]">
            <HeritageBookIcon className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-90" />
            <div className="leading-relaxed">
              <span className="font-bold bg-gradient-to-r from-[#FFE89E] to-[#C5A059] bg-clip-text text-transparent">Nguồn: </span>
              {citationUrl ? (
                <a
                  href={citationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="italic text-[#EDE5D8] hover:text-[#FFE89E] underline decoration-[#C5A059]/50 underline-offset-2 transition-colors cursor-pointer"
                >
                  {source}
                </a>
              ) : (
                <span className="italic text-[#EDE5D8]">{source}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

HeritageFrame.displayName = 'HeritageFrame';

export interface HeritageModalProps extends HeritageFrameProps {
  isOpen: boolean;
  maxWidth?: string;
}

/**
 * Fullscreen Backdrop Modal wrapped in HeritageFrame
 */
export const HeritageModal: React.FC<HeritageModalProps> = ({
  isOpen,
  onClose,
  maxWidth = 'max-w-xl',
  className = '',
  ...props
}) => {
  // ESC key listener
  useEffect(() => {
    if (!isOpen || !onClose) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <HeritageFrame
          {...props}
          onClose={onClose}
          showCloseButton={Boolean(onClose)}
          className={`w-full ${className}`}
        />
      </div>
    </div>
  );
};
