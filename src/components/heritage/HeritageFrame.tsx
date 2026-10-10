import React, { useEffect } from 'react';
import { HeritageBookIcon } from './HeritageDecorations';
import { X } from 'lucide-react';

export interface HeritageFrameProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  badge?: string;
  icon?: React.ReactNode;
  /** Skip the bordered plate around the title icon. */
  bareIcon?: boolean;
  source?: string;
  citationUrl?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
  className?: string;
  contentClassName?: string;
}

/** Flat bezel outside the outer gold rail — solid only, no gradients. */
const FRAME_BEZEL = 'p-2 sm:p-2.5';
/** Tight gutter between outer and inner gold rails. */
const FRAME_RAIL_GAP = 'p-[2px] sm:p-[3px]';

/**
 * Corner bracket on the outer rail apex; caps both frame lines.
 */
export const BrassCorner: React.FC<{ position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }> = ({ position }) => {
  const placement: Record<typeof position, string> = {
    'top-left': 'top-0 left-0 origin-top-left -translate-x-px -translate-y-px',
    'top-right': 'top-0 right-0 origin-top-right rotate-90 translate-x-px -translate-y-px',
    'bottom-right': 'bottom-0 right-0 origin-bottom-right rotate-180 translate-x-px translate-y-px',
    'bottom-left': 'bottom-0 left-0 origin-bottom-left -rotate-90 -translate-x-px translate-y-px',
  };

  return (
    <div
      className={`absolute ${placement[position]} pointer-events-none z-20 h-5 w-5 text-imperial-gold/85`}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M3 15 V3 H15" stroke="currentColor" strokeWidth="1.35" strokeLinecap="square" />
        <path d="M6 14 V6 H14" stroke="currentColor" strokeWidth="1" strokeLinecap="square" opacity="0.55" />
        <rect x="3" y="3" width="5" height="5" fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="0.75" />
      </svg>
    </div>
  );
};

/**
 * Sharp lacquered double-frame: flat outer bezel, decorative fill only inside the gold rails.
 */
export const HeritageFrame: React.FC<HeritageFrameProps> = React.memo(({
  children,
  title,
  subtitle,
  badge,
  icon,
  bareIcon = false,
  source,
  citationUrl,
  onClose,
  showCloseButton = false,
  className = '',
  contentClassName = '',
}) => {
  return (
    <div
      className={`relative flex min-h-0 flex-col overflow-hidden rounded-none bg-[#07090d] font-sans text-silk-ivory shadow-[0_35px_110px_rgba(0,0,0,0.98),0_0_60px_rgba(198,155,86,0.12)] select-none ${FRAME_BEZEL} ${className}`}
    >
      {/* Outer rail — gutter between rails stays flat #07090d (no lacquer bleed) */}
      <div
        className={`relative flex min-h-0 max-h-full flex-1 flex-col overflow-hidden border border-imperial-gold/40 bg-[#07090d] ${FRAME_RAIL_GAP}`}
      >
        <BrassCorner position="top-left" />
        <BrassCorner position="top-right" />
        <BrassCorner position="bottom-left" />
        <BrassCorner position="bottom-right" />

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden border border-imperial-gold/25 [contain:paint]">
          <div className="pointer-events-none absolute inset-0 isolate overflow-hidden bg-lacquer select-none">
            <div className="absolute inset-0 bg-gradient-to-b from-lacquer via-lacquer/[0.98] to-[#080b10]" />
          </div>

          <div
            className={`relative z-10 flex min-h-0 flex-1 flex-col px-5 py-5 sm:px-7 sm:py-6 ${contentClassName}`}
          >
          {title && (
            <header className="flex flex-shrink-0 flex-col">
              <div className="flex items-center justify-between gap-3 pr-10">
                <div className="flex min-w-0 items-center gap-3">
                  {bareIcon ? (
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center text-imperial-gold">
                      {icon !== undefined ? (
                        icon
                      ) : (
                        <HeritageBookIcon className="h-5 w-5 text-imperial-gold" />
                      )}
                    </span>
                  ) : (
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-imperial-gold/40 bg-imperial-gold/[0.08] text-imperial-gold">
                      {icon !== undefined ? (
                        icon
                      ) : (
                        <HeritageBookIcon className="h-4 w-4 text-imperial-gold" />
                      )}
                    </span>
                  )}
                  <div className="min-w-0">
                    <h3 className="truncate font-serif text-[1.15rem] font-semibold leading-tight tracking-wide text-silk-ivory sm:text-xl">
                      {title}
                    </h3>
                    {subtitle && (
                      <p className="mt-1 max-w-[34rem] truncate font-sans text-[13px] leading-snug text-silk-muted">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {badge && (
                  <span className="whitespace-nowrap rounded-none border border-imperial-gold/40 bg-imperial-gold/15 px-2.5 py-0.5 font-sans text-[11px] font-medium text-imperial-gold-light shadow-sm">
                    {badge}
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-center gap-3" aria-hidden>
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-imperial-gold/30 to-imperial-gold/75" />
                <span className="h-[5px] w-[5px] rotate-45 bg-imperial-gold shadow-[0_0_8px_rgba(229,186,112,0.7)]" />
                <span className="h-px flex-1 bg-gradient-to-l from-transparent via-imperial-gold/30 to-imperial-gold/75" />
              </div>
            </header>
          )}

          <div className={`min-h-0 flex-1 ${title ? 'pt-4 sm:pt-5' : ''}`}>{children}</div>

          {source && (
            <div className="mt-3.5 flex flex-shrink-0 items-start gap-2 border-t border-imperial-gold/20 pt-2.5 font-sans text-xs text-imperial-gold">
              <HeritageBookIcon className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-imperial-gold opacity-90" />
              <div className="font-sans text-[11px] leading-relaxed">
                <span className="font-semibold text-imperial-gold">Nguồn: </span>
                {citationUrl ? (
                  <a
                    href={citationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer italic text-silk-ivory/90 underline decoration-imperial-gold/50 underline-offset-2 transition-colors hover:text-imperial-gold-light"
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

        {showCloseButton && onClose && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-2.5 right-2.5 z-30 flex h-8 w-8 cursor-pointer items-center justify-center rounded-none border border-imperial-gold/40 bg-[#07090d]/95 text-silk-ivory/80 shadow-lg transition-all duration-200 hover:border-imperial-gold-light hover:bg-imperial-gold hover:text-lacquer group active:scale-95 sm:top-3 sm:right-3"
            title="Đóng (ESC)"
          >
            <X className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
          </button>
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
      className="heritage-modal-active fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/85 p-4 font-sans backdrop-blur-md select-none animate-in fade-in duration-200 sm:p-8 lg:p-10"
      onClick={onClose}
    >
      <div
        className={`my-auto w-full ${maxWidth} animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <HeritageFrame
          {...props}
          onClose={onClose}
          showCloseButton={Boolean(onClose)}
          className={`flex max-h-[min(92dvh,880px)] w-full flex-col ${className}`}
          contentClassName={`overflow-hidden ${contentClassName}`}
        />
      </div>
    </div>
  );
};
