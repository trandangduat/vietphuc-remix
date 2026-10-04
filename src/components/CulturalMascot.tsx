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
    <div className="font-serif flex items-center gap-5 px-2 py-1 text-left">
      <h2 className="sr-only">Thẩm định văn hóa</h2>
      <ScoreSeal score={scoreLabel} />
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
          <ul className="mt-3 space-y-2">
            {criteria.map((item) => {
              const ratio = Math.max(0, Math.min(1, item.score / item.maxScore));
              return (
                <li key={item.name} className="grid grid-cols-[8.75rem_minmax(0,1fr)_2.4rem] items-center gap-3">
                  <span className="truncate text-[0.9rem] text-[#EDE5D8]/70">{item.name}</span>
                  <span className="block h-[3px] bg-[#F7F4EE]/15" aria-hidden="true">
                    <span className="block h-full bg-[#E8C87B]" style={{ width: `${ratio * 100}%` }} />
                  </span>
                  <span className="text-right text-[0.9rem] text-[#F7F4EE]">{formatAppraisalScore(item.score)}</span>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-2.5 truncate text-[11px] italic text-[#EDE5D8]/60">{analysis.source}</p>
      </div>
    </div>
  );
}

function ScoreSummary({
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
    <div className="font-serif flex items-center gap-5 px-1 py-1 text-left">
      <h2 className="sr-only">Điểm tổng kết</h2>
      <ScoreSeal score={scoreLabel} size="sm" />
      <div className="min-w-0">
        <p className="truncate text-[0.95rem] italic text-[#F7F4EE]/55">{eventName}</p>
        <div className="mt-2 flex items-center gap-6 text-[0.95rem] text-[#F7F4EE]">
          <button
            type="button"
            onClick={onDetail}
            className="border-b border-[#F7F4EE]/35 pb-0.5 transition-colors hover:border-[#F7F4EE] cursor-pointer"
          >
            Chi tiết
          </button>
          <button
            type="button"
            onClick={onHide}
            className="border-b border-[#F7F4EE]/35 pb-0.5 transition-colors hover:border-[#F7F4EE] cursor-pointer"
          >
            Ẩn
          </button>
        </div>
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
  const [phase, setPhase] = useState<'idle' | 'waiting' | 'scoring'>('idle');
  const [bubble, setBubble] = useState<null | 'summary' | 'detail'>(null);
  const [shownAnalysis, setShownAnalysis] = useState<AIOverviewResult | null>(null);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  // Track previous outfit signature to trigger scoring after the outfit settles
  const prevSignatureRef = useRef<string>('');
  const isInitialMount = useRef(true);

  useEffect(() => {
    const currentSignature = `${outfit.topPiece?.id || 'none'}-${outfit.bottomPiece?.id || 'none'}-${outfit.footwearPiece?.id || 'none'}-${outfit.accessoryPiece?.id || 'none'}-${outfit.event.id}`;

    const clearTimers = () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      if (scoreTimerRef.current) clearTimeout(scoreTimerRef.current);
    };

    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevSignatureRef.current = currentSignature;
      return;
    }

    if (prevSignatureRef.current === currentSignature) return;
    prevSignatureRef.current = currentSignature;

    clearTimers();
    setPhase('waiting');
    setIsThinking(false);
    setBubble(null);

    settleTimerRef.current = setTimeout(() => {
      setPhase('scoring');
      setIsThinking(true);
      scoreTimerRef.current = setTimeout(() => {
        setIsThinking(false);
        setPhase('idle');
        setShownAnalysis(analysisRef.current);
        setBubble('summary');
      }, 800);
    }, 5000);

    return clearTimers;
  }, [
    outfit.topPiece?.id,
    outfit.bottomPiece?.id,
    outfit.footwearPiece?.id,
    outfit.accessoryPiece?.id,
    outfit.event.id,
  ]);

  // Free Dragging Position State (No snap to edge)
  const MASCOT_SIZE = 64;
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
            parsed.x <= window.innerWidth - MASCOT_SIZE &&
            parsed.y >= 70 &&
            parsed.y <= window.innerHeight - MASCOT_SIZE
          ) {
            return parsed;
          }
        }
      } catch (e) {
        // fallback
      }
      return {
        x: Math.max(16, window.innerWidth - 88),
        y: Math.max(80, window.innerHeight - 100),
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

      if (Math.hypot(dx, dy) > 5) {
        hasMovedRef.current = true;
      }

      const newX = Math.min(
        Math.max(10, startPosRef.current.startX + dx),
        window.innerWidth - MASCOT_SIZE - 10
      );
      const newY = Math.min(
        Math.max(72, startPosRef.current.startY + dy),
        window.innerHeight - MASCOT_SIZE - 10
      );

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      // Save position to localStorage
      setPosition((current) => {
        try {
          localStorage.setItem('vietphuc_mascot_pos', JSON.stringify(current));
        } catch (e) {
          // ignore
        }
        return current;
      });
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

      if (Math.hypot(dx, dy) > 5) {
        hasMovedRef.current = true;
      }

      const newX = Math.min(
        Math.max(10, startPosRef.current.startX + dx),
        window.innerWidth - MASCOT_SIZE - 10
      );
      const newY = Math.min(
        Math.max(72, startPosRef.current.startY + dy),
        window.innerHeight - MASCOT_SIZE - 10
      );

      setPosition({ x: newX, y: newY });
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);

      setPosition((current) => {
        try {
          localStorage.setItem('vietphuc_mascot_pos', JSON.stringify(current));
        } catch (e) {
          // ignore
        }
        return current;
      });
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  // Click mascot action
  const handleClickMascot = () => {
    if (hasMovedRef.current) return;
    if (phase !== 'idle' || !shownAnalysis) return;
    setBubble((current) => current ?? 'summary');
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

  const mascotSize = 64;
  const edge = 12;
  const spaceLeft = position.x - edge;
  const spaceRight = viewport.width - (position.x + mascotSize) - edge;
  const openLeft = spaceLeft >= spaceRight;
  const beside = Math.max(180, (openLeft ? spaceLeft : spaceRight) - 14);
  const bubbleWidth = Math.min(bubble === 'detail' ? 680 : 360, beside);
  const fallbackHeight = bubble === 'detail' ? 248 : 132;
  const bubbleHeight = bubbleSize.height || fallbackHeight;
  const minOffset = edge - position.y;
  const maxOffset = viewport.height - edge - bubbleHeight - position.y;
  const bubbleOffsetY =
    minOffset > maxOffset ? minOffset : Math.min(Math.max((mascotSize - bubbleHeight) / 2, minOffset), maxOffset);
  const tailY = Math.min(Math.max(mascotSize / 2 - bubbleOffsetY, 18), Math.max(18, bubbleHeight - 18));

  // Forbid displaying mascot assistant if user is not logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      {/* FLOATING DRAGGABLE MASCOT CONTAINER */}
      <div
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 60,
        }}
        className="select-none font-sans"
      >
        {bubble && shownAnalysis && !isThinking && (
          <div
            ref={bubbleRef}
            style={{
              position: 'absolute',
              width: bubbleWidth,
              top: bubbleOffsetY,
              maxHeight: viewport.height - edge * 2,
              ...(openLeft ? { right: '100%', marginRight: '14px' } : { left: '100%', marginLeft: '14px' }),
            }}
            className="animate-in fade-in zoom-in-95 duration-200"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
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
            <div style={{ maxHeight: viewport.height - edge * 2, overflowY: 'auto' }}>
            <HeritageFrame className="w-full">
              {bubble === 'summary' ? (
                <ScoreSummary
                  analysis={shownAnalysis}
                  eventName={outfit.event.name}
                  onDetail={() => setBubble('detail')}
                  onHide={() => setBubble(null)}
                />
              ) : (
                <AppraisalSlip
                  analysis={shownAnalysis}
                  eventName={outfit.event.name}
                  onHide={() => setBubble(null)}
                />
              )}
            </HeritageFrame>
            </div>
          </div>
        )}

        {/* MASCOT AVATAR BUTTON (DRAGGABLE & CLICKABLE) */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={handleClickMascot}
          style={{ touchAction: 'none' }}
          className="relative w-16 h-16 cursor-grab active:cursor-grabbing transition-transform active:scale-95 group"
          title="Bé Nghê Cung Đình - Nhấp để xem Đánh giá Văn hóa"
        >
          {/* Outer glowing aura ring */}
          <div
            className={`absolute -inset-1 rounded-full opacity-70 blur-sm transition-all duration-300 ${
              isThinking
                ? 'bg-gradient-to-r from-imperial-gold via-amber-400 to-imperial-red-bright animate-spin'
                : 'bg-imperial-gold/30 group-hover:opacity-100 group-hover:bg-imperial-gold/50'
            }`}
          />

          {/* Mascot Circle Surface */}
          <div
            className={`relative w-full h-full rounded-full border-2 p-1.5 flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.85)] transition-all ${
              isThinking
                ? 'border-imperial-gold bg-lacquer-card ring-2 ring-imperial-gold/70 animate-pulse'
                : 'border-imperial-gold/80 bg-gradient-to-b from-lacquer-surface to-lacquer group-hover:border-imperial-gold group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]'
            }`}
          >
            {/* SVG MASCOT: BÉ NGHÊ CUNG ĐÌNH CHIBI */}
            <svg
              viewBox="0 0 100 100"
              className={`w-full h-full drop-shadow filter transition-transform ${
                isThinking ? 'scale-105' : 'group-hover:scale-105'
              }`}
            >
              {/* Halos & Traditional Clouds (Vân mây) */}
              <circle cx="50" cy="50" r="46" fill="#181512" stroke="#D4AF37" strokeWidth="2" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="42" fill="#241B12" />

              {/* Royal Horns / Flame Mane (Sừng Nghê uốn lượn phong cách triều Nguyễn) */}
              <path
                d="M32 26 C26 12, 14 18, 22 28 C26 33, 31 34, 34 32 Z"
                fill="#D4AF37"
                stroke="#8A1C14"
                strokeWidth="1.5"
              />
              <path
                d="M68 26 C74 12, 86 18, 78 28 C74 33, 69 34, 66 32 Z"
                fill="#D4AF37"
                stroke="#8A1C14"
                strokeWidth="1.5"
              />

              {/* Royal Cap / Headdress gem (Ngọc bội đỉnh đầu) */}
              <ellipse cx="50" cy="22" rx="7" ry="9" fill="#8A1C14" stroke="#D4AF37" strokeWidth="2" />
              <circle cx="50" cy="22" r="3" fill="#D4AF37" />

              {/* Lion Face Base (Mặt Nghê thuần Việt) */}
              <ellipse cx="50" cy="52" rx="30" ry="26" fill="#D4AF37" stroke="#684A12" strokeWidth="2" />

              {/* Mane Curls (Bờm xoắn ốc cung đình) */}
              <circle cx="24" cy="46" r="6" fill="#B38F2B" stroke="#684A12" strokeWidth="1" />
              <circle cx="22" cy="58" r="6" fill="#B38F2B" stroke="#684A12" strokeWidth="1" />
              <circle cx="76" cy="46" r="6" fill="#B38F2B" stroke="#684A12" strokeWidth="1" />
              <circle cx="78" cy="58" r="6" fill="#B38F2B" stroke="#684A12" strokeWidth="1" />

              {/* Snout & Cheeks */}
              <ellipse cx="50" cy="58" rx="16" ry="12" fill="#FAF8F5" stroke="#684A12" strokeWidth="1.5" />
              <ellipse cx="50" cy="51" rx="5" ry="3.5" fill="#8A1C14" />

              {/* Eyes with Thinking vs Normal Mode */}
              {isThinking ? (
                <>
                  {/* Thinking Eyes (Looking up thoughtfully) */}
                  <ellipse cx="38" cy="43" rx="5" ry="6" fill="#181512" />
                  <circle cx="39" cy="40" r="2.2" fill="#FFFFFF" />
                  <ellipse cx="62" cy="43" rx="5" ry="6" fill="#181512" />
                  <circle cx="63" cy="40" r="2.2" fill="#FFFFFF" />
                  {/* Pondering eyebrows */}
                  <path d="M33 34 Q39 30 43 35" stroke="#684A12" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M67 34 Q61 30 57 35" stroke="#684A12" strokeWidth="2" fill="none" strokeLinecap="round" />
                </>
              ) : (
                <>
                  {/* Happy / Expressive Eyes */}
                  <ellipse cx="38" cy="45" rx="5" ry="5.5" fill="#181512" />
                  <circle cx="37" cy="43" r="2.2" fill="#FFFFFF" />
                  <ellipse cx="62" cy="45" rx="5" ry="5.5" fill="#181512" />
                  <circle cx="61" cy="43" r="2.2" fill="#FFFFFF" />
                  {/* Gentle curved brows */}
                  <path d="M33 36 Q38 32 43 36" stroke="#684A12" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M67 36 Q62 32 57 36" stroke="#684A12" strokeWidth="2" fill="none" strokeLinecap="round" />
                </>
              )}

              {/* Whiskers / Mouth smile */}
              <path d="M44 60 Q50 64 56 60" stroke="#8A1C14" strokeWidth="2" fill="none" strokeLinecap="round" />
              <circle cx="34" cy="56" r="1" fill="#684A12" />
              <circle cx="36" cy="58" r="1" fill="#684A12" />
              <circle cx="66" cy="56" r="1" fill="#684A12" />
              <circle cx="64" cy="58" r="1" fill="#684A12" />

              {/* Royal Gold Bell / Khánh Vàng Cung Đình */}
              <path d="M42 74 L58 74 L54 82 L46 82 Z" fill="#D4AF37" stroke="#8A1C14" strokeWidth="1" />
              <circle cx="50" cy="80" r="2" fill="#8A1C14" />
            </svg>

            {/* THINKING ORBS INDICATOR OVERLAY */}
            {isThinking && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute -top-1 right-0 flex items-center gap-1 bg-black/90 border border-imperial-gold px-1.5 py-0.5 rounded-full shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-imperial-gold animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-imperial-red-bright animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* PERMANENT MINI SCORE BADGE PINNED TO BOTTOM-RIGHT CORNER */}
          {phase === 'idle' && shownAnalysis && shownAnalysis.totalScore > 0 && (
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-lacquer-card border border-imperial-gold text-[10px] font-serif font-bold text-imperial-gold shadow-md flex items-center gap-0.5">
              <span>★</span>
              <span>{formatAppraisalScore(shownAnalysis.totalScore)}</span>
            </div>
          )}
        </div>
      </div>

    </>
  );
};
