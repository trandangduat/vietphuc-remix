import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { ActiveOutfitState, AIOverviewResult } from '../types';
import { evaluateCulturalOutfit } from '../data/culturalEvaluator';
import { HeritageFrame } from './heritage/HeritageFrame';

function formatAppraisalScore(score: number): string {
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

function ScoreSeal({ score, size = 'md' }: { score: string; size?: 'md' | 'sm' }) {
  const box = size === 'sm' ? 'h-[58px] w-[58px]' : 'h-[72px] w-[72px]';
  const type =
    score.length > 1
      ? 'text-[1.2rem]'
      : size === 'sm'
        ? 'text-[1.65rem]'
        : 'text-[2rem]';

  return (
    <div
      className={`relative shrink-0 ${box}`}
      style={{ transform: 'rotate(-8deg)' }}
      role="img"
      aria-label={`${score} trên 10`}
    >
      <div className="absolute inset-0 bg-[#7C1C16]" />
      <div className="absolute inset-[3px] border border-[#F0D7A2]/75" />
      <div className="absolute inset-[6px] border border-[#F0D7A2]/30" />
      <div className="relative flex h-full items-center justify-center text-[#F6E7C1]" aria-hidden="true">
        <span className={`font-medium leading-none ${type}`}>{score}</span>
      </div>
    </div>
  );
}

function AppraisalSlip({
  analysis,
  eventName,
  onHide,
}: {
  analysis: AIOverviewResult;
  eventName: string;
  onHide: () => void;
}) {
  const scoreLabel = formatAppraisalScore(analysis.totalScore);
  const verdict = analysis.explanation.replace(/!+$/, '.');
  const criteria = [
    analysis.criteria.colorHarmony,
    analysis.criteria.eventFit,
    analysis.criteria.culturalNorm,
  ];

  return (
    <div className="font-serif flex items-start gap-5 px-2 py-1 text-left">
      <h2 className="sr-only">Thẩm định văn hóa</h2>
      <div className="pt-1.5 shrink-0">
        <ScoreSeal score={scoreLabel} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-4">
          <p className="truncate text-[0.95rem] italic text-[#F7F4EE]/55">{eventName}</p>
          <button
            type="button"
            onClick={onHide}
            className="shrink-0 border-b border-[#F7F4EE]/35 pb-0.5 text-[0.95rem] text-[#F7F4EE] transition-colors hover:border-[#F7F4EE] cursor-pointer"
          >
            Ẩn
          </button>
        </div>
        <p className="mt-1.5 text-[1.05rem] font-medium leading-snug text-[#F7F4EE]">{verdict}</p>
        {analysis.totalScore > 0 && (
          <ul className="mt-3 space-y-2.5">
            {criteria.map((item) => {
              const ratio = Math.max(0, Math.min(1, item.score / item.maxScore));
              return (
                <li key={item.name} className="space-y-1">
                  <div className="grid grid-cols-[8.75rem_minmax(0,1fr)_2.4rem] items-center gap-3">
                    <span className="truncate text-[0.9rem] font-medium text-[#EDE5D8]/85">{item.name}</span>
                    <span className="block h-[3px] bg-[#F7F4EE]/15 rounded-full overflow-hidden" aria-hidden="true">
                      <span className="block h-full bg-[#E8C87B] rounded-full transition-all duration-300" style={{ width: `${ratio * 100}%` }} />
                    </span>
                    <span className="text-right text-[0.9rem] font-semibold text-[#F7F4EE]">{formatAppraisalScore(item.score)}</span>
                  </div>
                  {item.comment && (
                    <p className="text-[0.82rem] text-[#EDE5D8]/75 leading-relaxed italic pl-0.5 mt-0.5">
                      {item.comment}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-3 truncate text-[11px] italic text-[#EDE5D8]/60 border-t border-[#C5A059]/15 pt-2">{analysis.source}</p>
      </div>
    </div>
  );
}

function MiniScoreBubble({
  analysis,
  eventName,
  onDetail,
  onHide,
}: {
  analysis: AIOverviewResult;
  eventName: string;
  onDetail: () => void;
  onHide: () => void;
}) {
  const scoreLabel = formatAppraisalScore(analysis.totalScore);

  return (
    <div className="font-serif px-2 py-0.5 text-left">
      <div className="flex items-baseline justify-between gap-3">
        <p className="truncate text-[0.92rem] italic text-[#F7F4EE]/55">{eventName}</p>
        <button
          type="button"
          onClick={onHide}
          className="shrink-0 border-b border-[#F7F4EE]/35 pb-0.5 text-[0.92rem] text-[#F7F4EE]/80 hover:text-[#F7F4EE] transition-colors cursor-pointer"
        >
          Ẩn
        </button>
      </div>
      <p className="mt-2 text-[1.05rem] font-medium leading-snug text-[#F7F4EE]">
        <span className="text-[#F0D195] font-semibold">Bé Cáo</span> chấm cho outfit của bạn:{' '}
        <span className="font-serif font-bold text-[1.25rem] text-[#F6E7C1] whitespace-nowrap">
          {scoreLabel} điểm!
        </span>
      </p>
      <div className="mt-3 flex items-center justify-end">
        <button
          type="button"
          onClick={onDetail}
          className="px-3 py-1 rounded-[6px] bg-gradient-to-r from-[#F0D195] via-[#E5BA70] to-[#DCAB5E] text-[#1A140E] font-serif font-bold text-xs hover:brightness-110 shadow-[0_2px_10px_rgba(229,186,112,0.35)] transition-all cursor-pointer flex items-center gap-1"
        >
          <span>Chi tiết</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

interface CulturalMascotProps {
  outfit: ActiveOutfitState;
  isLoggedIn: boolean;
  onLoginPrompt: () => void;
}

export const CulturalMascot: React.FC<CulturalMascotProps> = ({
  outfit,
  isLoggedIn,
}) => {
  const [isThinking, setIsThinking] = useState(false);
  const [bubble, setBubble] = useState<null | 'summary' | 'detail'>(null);
  const [shownAnalysis, setShownAnalysis] = useState<AIOverviewResult | null>(null);
  const scoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Current analysis result
  const analysis = useMemo<AIOverviewResult>(() => evaluateCulturalOutfit(outfit), [
    outfit.topPiece?.id,
    outfit.bottomPiece?.id,
    outfit.footwearPiece?.id,
    outfit.accessoryPiece?.id,
    outfit.event.id,
  ]);

  const analysisRef = useRef(analysis);
  analysisRef.current = analysis;

  // Track previous outfit signature to immediately trigger thinking & scoring
  const prevSignatureRef = useRef<string>('');
  const isInitialMount = useRef(true);

  useEffect(() => {
    const currentSignature = `${outfit.topPiece?.id || 'none'}-${outfit.bottomPiece?.id || 'none'}-${outfit.footwearPiece?.id || 'none'}-${outfit.accessoryPiece?.id || 'none'}-${outfit.event.id}-${outfit.mannequinGender}`;

    const clearTimers = () => {
      if (scoreTimerRef.current) clearTimeout(scoreTimerRef.current);
    };

    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevSignatureRef.current = currentSignature;
      setShownAnalysis(analysisRef.current);
      return;
    }

    if (prevSignatureRef.current === currentSignature) return;
    prevSignatureRef.current = currentSignature;

    clearTimers();

    // 1. Immediately switch to Thinking state and close old bubble
    setIsThinking(true);
    setBubble(null);

    // 2. After ~1.3s thinking duration, switch back to Normal and show mini score bubble
    scoreTimerRef.current = setTimeout(() => {
      setIsThinking(false);
      setShownAnalysis(analysisRef.current);
      setBubble('summary');
    }, 1300);

    return clearTimers;
  }, [
    outfit.topPiece?.id,
    outfit.bottomPiece?.id,
    outfit.footwearPiece?.id,
    outfit.accessoryPiece?.id,
    outfit.event.id,
    outfit.mannequinGender,
  ]);

  // Free Dragging Position State (No snap to edge)
  const MASCOT_WIDTH = 96;
  const MASCOT_HEIGHT = 130;
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('vietphuc_mascot_pos');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (
            typeof parsed.x === 'number' &&
            typeof parsed.y === 'number' &&
            parsed.x >= 0 &&
            parsed.x <= window.innerWidth - MASCOT_WIDTH &&
            parsed.y >= 70 &&
            parsed.y <= window.innerHeight - MASCOT_HEIGHT
          ) {
            return parsed;
          }
        }
      } catch (e) {
        // fallback
      }
      return {
        x: Math.max(16, window.innerWidth - 100),
        y: Math.max(80, window.innerHeight - 120),
      };
    }
    return { x: 500, y: 500 };
  });

  // Drag handling refs
  const isDraggingRef = useRef(false);
  const startPosRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });
  const hasMovedRef = useRef(false);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only primary click
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startPosRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: position.x,
      startY: position.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = moveEvent.clientX - startPosRef.current.mouseX;
      const dy = moveEvent.clientY - startPosRef.current.mouseY;

      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        hasMovedRef.current = true;
      }

      const newX = Math.min(
        Math.max(10, startPosRef.current.startX + dx),
        window.innerWidth - MASCOT_WIDTH - 10
      );
      const newY = Math.min(
        Math.max(70, startPosRef.current.startY + dy),
        window.innerHeight - MASCOT_HEIGHT - 10
      );

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      if (hasMovedRef.current) {
        setPosition((current) => {
          localStorage.setItem('vietphuc_mascot_pos', JSON.stringify(current));
          return current;
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Touch drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startPosRef.current = {
      mouseX: touch.clientX,
      mouseY: touch.clientY,
      startX: position.x,
      startY: position.y,
    };

    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (!isDraggingRef.current || moveEvent.touches.length !== 1) return;
      const moveTouch = moveEvent.touches[0];
      const dx = moveTouch.clientX - startPosRef.current.mouseX;
      const dy = moveTouch.clientY - startPosRef.current.mouseY;

      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        hasMovedRef.current = true;
      }

      const newX = Math.min(
        Math.max(10, startPosRef.current.startX + dx),
        window.innerWidth - MASCOT_WIDTH - 10
      );
      const newY = Math.min(
        Math.max(70, startPosRef.current.startY + dy),
        window.innerHeight - MASCOT_HEIGHT - 10
      );

      setPosition({ x: newX, y: newY });
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);

      if (hasMovedRef.current) {
        setPosition((current) => {
          localStorage.setItem('vietphuc_mascot_pos', JSON.stringify(current));
          return current;
        });
      }
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  // Click mascot directly -> Opens FULL Detailed Appraisal Slip
  const handleClickMascot = () => {
    if (hasMovedRef.current) return;
    if (bubble === 'detail') {
      setBubble(null);
    } else {
      setBubble('detail');
      setShownAnalysis(analysisRef.current);
      setIsThinking(false);
    }
  };

  const [viewport, setViewport] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [bubbleSize, setBubbleSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Track if any full-screen modal or dialog is currently open in the DOM
  const [isModalActive, setIsModalActive] = useState(false);

  useEffect(() => {
    const checkModal = () => {
      const activeModal = document.querySelector(
        '[role="dialog"], [aria-modal="true"], .heritage-modal-active, .fixed.inset-0.z-\\[100\\], .fixed.inset-0.z-50'
      );
      setIsModalActive(Boolean(activeModal));
    };

    checkModal();
    const observer = new MutationObserver(checkModal);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const node = bubbleRef.current;
    if (!node) return;
    const measure = () => {
      const rect = node.getBoundingClientRect();
      setBubbleSize((prev) => {
        if (Math.abs(prev.width - rect.width) < 1 && Math.abs(prev.height - rect.height) < 1) return prev;
        return { width: rect.width, height: rect.height };
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [bubble, shownAnalysis]);

  const edge = 12;
  const spaceLeft = position.x - edge;
  const spaceRight = viewport.width - (position.x + MASCOT_WIDTH) - edge;
  const openLeft = spaceLeft >= spaceRight;
  const beside = Math.max(180, (openLeft ? spaceLeft : spaceRight) - 14);
  const bubbleWidth = Math.min(bubble === 'detail' ? 680 : 330, beside);
  const fallbackHeight = bubble === 'detail' ? 300 : 110;
  const bubbleHeight = bubbleSize.height || fallbackHeight;
  const minOffset = edge - position.y;
  const maxOffset = viewport.height - edge - bubbleHeight - position.y;
  const bubbleOffsetY =
    minOffset > maxOffset ? minOffset : Math.min(Math.max((MASCOT_HEIGHT - bubbleHeight) / 2, minOffset), maxOffset);
  const tailY = Math.min(Math.max(MASCOT_HEIGHT / 2 - bubbleOffsetY, 18), Math.max(18, bubbleHeight - 18));

  // Forbid displaying mascot assistant if user is not logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      {/* FLOATING DRAGGABLE MASCOT CONTAINER (Submerged under modals) */}
      <div
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: isModalActive ? -1 : 35,
          opacity: isModalActive ? 0 : 1,
          visibility: isModalActive ? 'hidden' : 'visible',
          pointerEvents: isModalActive ? 'none' : 'auto',
          transition: 'opacity 0.2s ease, visibility 0.2s ease',
        }}
        className="select-none font-sans"
      >
        {/* 1. THINKING 3-DOTS BOUNCING BUBBLE (Messenger style) */}
        {isThinking && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              ...(openLeft ? { right: '100%', marginRight: '12px' } : { left: '100%', marginLeft: '12px' }),
              zIndex: 10,
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#11141C]/95 border border-[#C5A059]/60 shadow-[0_8px_24px_rgba(0,0,0,0.85)] backdrop-blur-md animate-in fade-in zoom-in-95 pointer-events-none"
          >
            <span className="w-2 h-2 rounded-full bg-[#E5BA70] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-[#E5BA70] animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-[#E5BA70] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}

        {/* 2. CHAT BUBBLE (Summary or Full Detail) */}
        {bubble && shownAnalysis && !isThinking && (
          <div
            ref={bubbleRef}
            style={{
              position: 'absolute',
              width: bubbleWidth,
              maxWidth: bubbleWidth,
              top: bubbleOffsetY,
              maxHeight: viewport.height - edge * 2,
              ...(openLeft ? { right: '100%', marginRight: '14px' } : { left: '100%', marginLeft: '14px' }),
            }}
            className="animate-in fade-in zoom-in-95 duration-200"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tail Arrow Pointer */}
            <div
              style={{
                position: 'absolute',
                zIndex: 2,
                top: tailY,
                ...(openLeft
                  ? { right: '-7px', borderLeft: '8px solid #C5A059' }
                  : { left: '-7px', borderRight: '8px solid #C5A059' }),
                width: 0,
                height: 0,
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
              }}
            />

            {bubble === 'summary' ? (
              /* Mini Summary Chat Bubble in Heritage Frame */
              <HeritageFrame className="w-full">
                <MiniScoreBubble
                  analysis={shownAnalysis}
                  eventName={outfit.event.name}
                  onDetail={() => setBubble('detail')}
                  onHide={() => setBubble(null)}
                />
              </HeritageFrame>
            ) : (
              /* Full Detailed Cultural Appraisal Card */
              <div style={{ maxHeight: viewport.height - edge * 2, overflowY: 'auto' }}>
                <HeritageFrame className="w-full">
                  <AppraisalSlip
                    analysis={shownAnalysis}
                    eventName={outfit.event.name}
                    onHide={() => setBubble(null)}
                  />
                </HeritageFrame>
              </div>
            )}
          </div>
        )}

        {/* 3. MASCOT STICKER AVATAR (DRAGGABLE & CLICKABLE) */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={handleClickMascot}
          style={{ touchAction: 'none' }}
          className="relative cursor-grab active:cursor-grabbing transition-transform duration-200 active:scale-95 group select-none"
          title="Bé Cáo Cổ Phong - Nhấp để xem Thẩm định Văn hóa"
        >
          <img
            src={
              isThinking
                ? '/assets/decorations/mascot-nghe-thinking.png'
                : '/assets/decorations/mascot-nghe-normal.png'
            }
            alt={isThinking ? 'Bé Cáo đang suy nghĩ...' : 'Bé Cáo Cổ Phong'}
            className={`h-[130px] w-auto object-contain filter drop-shadow-[0_8px_18px_rgba(0,0,0,0.7)] transition-all duration-300 pointer-events-none select-none ${
              isThinking
                ? 'scale-105 brightness-105'
                : 'group-hover:scale-105 group-hover:drop-shadow-[0_12px_24px_rgba(229,186,112,0.4)]'
            }`}
          />
        </div>
      </div>
    </>
  );
};
