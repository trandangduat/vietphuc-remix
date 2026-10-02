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
      style={{ borderRadius: '10px' }}
      className={`relative bg-gradient-to-b from-[#11141C] via-[#0C0E14] to-[#07090D] text-[#EDE5D8] border border-[#C5A059]/65 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_24px_rgba(197,160,89,0.12),inset_0_0_0_1px_rgba(197,160,89,0.2)] font-sans select-none overflow-hidden ${className}`}
    >
      {/* 4 Signature Heritage Corner Ornaments */}
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
          className="absolute top-2.5 right-2.5 z-30 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 border border-[#C5A059]/50 hover:border-[#D4AF37] text-[#EDE5D8]/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
          title="Đóng (ESC)"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Main Inner Content Area (Padded to fit comfortably inside corner brackets) */}
      <div className={`relative z-10 px-5 sm:px-6 pt-4 pb-4 flex flex-col ${contentClassName}`}>
        {/* Header (Book Icon + Title + Badge) */}
        {title && (
          <div className="flex flex-col mb-1">
            <div className="flex items-center justify-between gap-3 pr-2">
              {/* Left: Book Icon + Title */}
              <div className="flex items-center gap-2 min-w-0">
                <HeritageBookIcon className="w-4 h-4 flex-shrink-0 text-[#C5A059]" />
                <h3 className="font-serif font-bold text-sm sm:text-base text-[#F7F4EE] tracking-wide truncate">
                  {title}
                </h3>
              </div>

              {/* Right: Badge (CỔ PHONG) */}
              {badge && (
                <span className="px-2.5 py-0.5 rounded-[4px] bg-[#12161F]/90 border border-[#C5A059]/60 text-[#D4AF37] text-[10px] font-serif font-bold uppercase tracking-[0.16em] whitespace-nowrap shadow-sm">
                  {badge}
                </span>
              )}
            </div>

            {/* Ancient Calligraphic Cloud Divider */}
            <AncientCloudDivider className="my-2" />
          </div>
        )}

        {/* Dynamic Body Content */}
        <div className="flex-1">{children}</div>

        {/* Optional Source Citation Footer */}
        {source && (
          <div className="mt-3 pt-2 border-t border-[#C5A059]/25 flex items-start gap-2 text-xs font-serif text-[#C5A059]">
            <HeritageBookIcon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 opacity-90 text-[#C5A059]" />
            <div className="leading-relaxed text-[11px]">
              <span className="font-bold text-[#C5A059]">Nguồn: </span>
              {citationUrl ? (
                <a
                  href={citationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="italic text-[#EDE5D8] hover:text-[#D4AF37] underline decoration-[#C5A059]/50 underline-offset-2 transition-colors cursor-pointer"
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
