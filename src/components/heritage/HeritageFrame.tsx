import React, { useEffect } from 'react';
import { AncientCloudDivider, HeritageBookIcon } from './HeritageDecorations';
import { X } from 'lucide-react';

export interface HeritageFrameProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  badge?: string;
  icon?: React.ReactNode;
  source?: string;
  citationUrl?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
  className?: string;
  contentClassName?: string;
}

/**
 * Minimal Slender Imperial Brass Corner Bracket for sharp square double-frame
 */
export const BrassCorner: React.FC<{ position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }> = ({ position }) => {
  const getTransform = () => {
    switch (position) {
      case 'top-left':
        return 'top-1.5 left-1.5';
      case 'top-right':
        return 'top-1.5 right-1.5 rotate-90';
      case 'bottom-right':
        return 'bottom-1.5 right-1.5 rotate-180';
      case 'bottom-left':
        return 'bottom-1.5 left-1.5 -rotate-90';
    }
  };

  return (
    <div className={`absolute ${getTransform()} pointer-events-none select-none z-20 w-4 h-4 text-imperial-gold/70`}>
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 12 V2 H12" strokeLinecap="square" />
        <rect x="2" y="2" width="5" height="5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    </div>
  );
};

/**
 * Reusable Sharp Lacquered Atelier Frame with Authentic Website Ambient Background:
 * - Exact Website Background Texture (gallery-bg.jpg + lacquer vignette)
 * - Imperial Gold & Vermilion Ambient Radial Glows
 * - Sharp double-frame with 4 Brass Corners (NO ROUNDED CARD CORNERS)
 * - Minimalist square close button
 */
export const HeritageFrame: React.FC<HeritageFrameProps> = React.memo(({
  children,
  title,
  subtitle,
  badge,
  icon,
  source,
  citationUrl,
  onClose,
  showCloseButton = false,
  className = '',
  contentClassName = '',
}) => {
  return (
    <div
      className={`relative bg-lacquer text-silk-ivory border border-imperial-gold/40 shadow-[0_35px_110px_rgba(0,0,0,0.98),0_0_60px_rgba(198,155,86,0.12)] font-sans select-none overflow-hidden rounded-none ${className}`}
    >
      {/* ======================================================== */}
      {/* CLEAN LACQUER ATELIER BACKGROUND (NO BACKGROUND IMAGES) */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        {/* Pure Lacquer Ambient Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-lacquer via-lacquer/95 to-lacquer" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#0A0D12_95%)]" />

        {/* Subtle Ambient Radial Glows (Imperial Gold & Vermilion) */}
        <div className="absolute top-12 right-1/4 w-80 h-80 rounded-full bg-imperial-gold/10 filter blur-[100px]" />
        <div className="absolute bottom-16 left-1/4 w-80 h-80 rounded-full bg-imperial-red/10 filter blur-[100px]" />
      </div>

      {/* Slender Inner Brass Filament Line (Double Frame Effect - Sharp 90deg edges) */}
      <div className="absolute inset-1.5 sm:inset-2 border border-imperial-gold/20 pointer-events-none z-10" />

      {/* 4 Minimalist Antique Brass Corners */}
      <BrassCorner position="top-left" />
      <BrassCorner position="top-right" />
      <BrassCorner position="bottom-left" />
      <BrassCorner position="bottom-right" />

      {/* Optional Sharp Square Close Button */}
      {showCloseButton && onClose && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-30 w-8 h-8 rounded-none bg-lacquer-surface/90 hover:bg-imperial-gold border border-imperial-gold/40 hover:border-imperial-gold-light text-silk-ivory/80 hover:text-lacquer flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg group active:scale-95"
          title="Đóng (ESC)"
        >
          <X className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
        </button>
      )}

      {/* Main Inner Content Area */}
      <div className={`relative z-10 px-5 sm:px-7 pt-5 pb-5 flex flex-col ${contentClassName}`}>
        {/* Optional Header (Icon + Title + Subtitle + Badge) */}
        {title && (
          <div className="flex flex-col mb-2 flex-shrink-0">
            <div className="flex items-center justify-between gap-3 pr-8">
              {/* Left: Icon + Title */}
              <div className="flex items-center gap-2.5 min-w-0">
                {icon !== undefined ? (
                  icon
                ) : (
                  <HeritageBookIcon className="w-4 h-4 flex-shrink-0 text-imperial-gold" />
                )}
                <div className="min-w-0">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-silk-ivory tracking-wide truncate">
                    {title}
                  </h3>
                  {subtitle && (
                    <p className="font-sans text-[11px] text-silk-muted mt-0.5 truncate">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Badge */}
              {badge && (
                <span className="px-2.5 py-0.5 rounded-none bg-imperial-gold/15 border border-imperial-gold/40 text-imperial-gold-light text-[11px] font-sans font-medium whitespace-nowrap shadow-sm">
                  {badge}
                </span>
              )}
            </div>

            {/* Ancient Calligraphic Cloud Divider */}
            <AncientCloudDivider className="my-2.5" />
          </div>
        )}

        {/* Dynamic Body Content */}
        <div className="flex-1 min-h-0">{children}</div>

        {/* Optional Source Citation Footer */}
        {source && (
          <div className="mt-3.5 pt-2.5 border-t border-imperial-gold/20 flex items-start gap-2 text-xs font-sans text-imperial-gold flex-shrink-0">
            <HeritageBookIcon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 opacity-90 text-imperial-gold" />
            <div className="leading-relaxed text-[11px] font-sans">
              <span className="font-semibold text-imperial-gold">Nguồn: </span>
              {citationUrl ? (
                <a
                  href={citationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="italic text-silk-ivory/90 hover:text-imperial-gold-light underline decoration-imperial-gold/50 underline-offset-2 transition-colors cursor-pointer"
                >
                  {source}
                </a>
              ) : (
                <span className="italic text-silk-ivory/90">{source}</span>
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
 * Fullscreen Backdrop Modal wrapped in Sharp Lacquered Frame
 */
export const HeritageModal: React.FC<HeritageModalProps> = ({
  isOpen,
  onClose,
  maxWidth = 'max-w-xl',
  className = '',
  contentClassName = '',
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
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] heritage-modal-active flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-y-auto font-sans"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} my-auto animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <HeritageFrame
          {...props}
          onClose={onClose}
          showCloseButton={Boolean(onClose)}
          className={`w-full max-h-[92vh] flex flex-col ${className}`}
          contentClassName={`overflow-y-auto ${contentClassName}`}
        />
      </div>
    </div>
  );
};
