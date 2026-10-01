import React, { useState, useEffect, useRef } from 'react';
import { PIECES, EVENTS } from '../data/catalog';
import {
  PieceAlignment,
  AlignmentMap,
  DEFAULT_PIECE_ALIGNMENTS,
  DEFAULT_PIECE_ALIGNMENT,
  getStoredPieceAlignments,
  savePieceAlignmentsToStorage,
  resetPieceAlignments,
  exportAlignmentsAsCode,
  getAlignmentStyle,
} from '../data/pieceAlignments';
import { Piece, PieceCategory, PieceVariant } from '../types';
import {
  Sliders,
  Move,
  Maximize2,
  RotateCw,
  Eye,
  Save,
  Copy,
  RotateCcw,
  Check,
  ArrowLeft,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

interface DevCalibratorScreenProps {
  onExit: () => void;
}

export const DevCalibratorScreen: React.FC<DevCalibratorScreenProps> = ({ onExit }) => {
  // Load stored alignments or defaults
  const [alignments, setAlignments] = useState<AlignmentMap>(() => getStoredPieceAlignments());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Active outfit test state
  const tops = PIECES.filter((p) => p.category === 'top');
  const bottoms = PIECES.filter((p) => p.category === 'bottom');
  const footwears = PIECES.filter((p) => p.category === 'footwear');
  const accessories = PIECES.filter((p) => p.category === 'accessory');

  const [activeTop, setActiveTop] = useState<Piece>(tops[0]);
  const [activeTopVariant, setActiveTopVariant] = useState<PieceVariant>(tops[0].variants[0]);

  const [activeBottom, setActiveBottom] = useState<Piece>(bottoms[0]);
  const [activeBottomVariant, setActiveBottomVariant] = useState<PieceVariant>(bottoms[0].variants[0]);

  const [activeFootwear, setActiveFootwear] = useState<Piece>(footwears[0]);
  const [activeFootwearVariant, setActiveFootwearVariant] = useState<PieceVariant>(footwears[0].variants[0]);

  const [activeAccessory, setActiveAccessory] = useState<Piece | null>(accessories[0]);
  const [activeAccessoryVariant, setActiveAccessoryVariant] = useState<PieceVariant | null>(accessories[0].variants[0]);

  // Calibration target category
  const [targetCategory, setTargetCategory] = useState<PieceCategory>('bottom');

  // Preview options
  const [bgMode, setBgMode] = useState<'checker' | 'event' | 'dark'>('checker');
  const [xrayMode, setXrayMode] = useState(false);

  // Active piece being calibrated
  const currentTargetPiece: Piece | null =
    targetCategory === 'top'
      ? activeTop
      : targetCategory === 'bottom'
      ? activeBottom
      : targetCategory === 'footwear'
      ? activeFootwear
      : activeAccessory;

  const currentTargetVariant: PieceVariant | null =
    targetCategory === 'top'
      ? activeTopVariant
      : targetCategory === 'bottom'
      ? activeBottomVariant
      : targetCategory === 'footwear'
      ? activeFootwearVariant
      : activeAccessoryVariant;

  const currentPieceKey = currentTargetPiece?.id || '';

  // Current alignment for target piece
  const currentAlignment: PieceAlignment =
    alignments[currentPieceKey] || DEFAULT_PIECE_ALIGNMENTS[currentPieceKey] || { ...DEFAULT_PIECE_ALIGNMENT };

  // Update alignment helper
  const updateCurrentAlignment = (patch: Partial<PieceAlignment>) => {
    if (!currentPieceKey) return;
    setAlignments((prev) => {
      const existing = prev[currentPieceKey] || DEFAULT_PIECE_ALIGNMENTS[currentPieceKey] || { ...DEFAULT_PIECE_ALIGNMENT };
      return {
        ...prev,
        [currentPieceKey]: {
          ...existing,
          ...patch,
        },
      };
    });
    setHasUnsavedChanges(true);
  };

  // Dragging support on canvas stage
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!stageRef.current) return;
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: currentAlignment.x,
      startY: currentAlignment.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStartRef.current || !stageRef.current) return;
    const stageRect = stageRef.current.getBoundingClientRect();
    // Delta in pixels converted to percentage of stage dimension
    const dxPx = e.clientX - dragStartRef.current.mouseX;
    const dyPx = e.clientY - dragStartRef.current.mouseY;

    const dxPercent = (dxPx / stageRect.width) * 100;
    const dyPercent = (dyPx / stageRect.height) * 100;

    const newX = Number((dragStartRef.current.startX + dxPercent).toFixed(2));
    const newY = Number((dragStartRef.current.startY + dyPercent).toFixed(2));

    updateCurrentAlignment({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.02 : -0.02;
    const newScale = Math.max(0.3, Math.min(2.5, Number((currentAlignment.scale + delta).toFixed(3))));
    updateCurrentAlignment({ scale: newScale });
  };

  // Keyboard nudge navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const step = e.shiftKey ? 2 : 0.5;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        updateCurrentAlignment({ x: Number((currentAlignment.x - step).toFixed(2)) });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        updateCurrentAlignment({ x: Number((currentAlignment.x + step).toFixed(2)) });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        updateCurrentAlignment({ y: Number((currentAlignment.y - step).toFixed(2)) });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        updateCurrentAlignment({ y: Number((currentAlignment.y + step).toFixed(2)) });
      } else if (e.key === '[') {
        e.preventDefault();
        updateCurrentAlignment({ scale: Math.max(0.3, Number((currentAlignment.scale - 0.05).toFixed(3))) });
      } else if (e.key === ']') {
        e.preventDefault();
        updateCurrentAlignment({ scale: Math.min(2.5, Number((currentAlignment.scale + 0.05).toFixed(3))) });
      } else if (e.key === '1') {
        setTargetCategory('top');
      } else if (e.key === '2') {
        setTargetCategory('bottom');
      } else if (e.key === '3') {
        setTargetCategory('footwear');
      } else if (e.key === '4') {
        setTargetCategory('accessory');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentAlignment, currentPieceKey]);

  // Save handler
  const handleSave = () => {
    savePieceAlignmentsToStorage(alignments);
    setHasUnsavedChanges(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Copy code handler
  const handleCopyCode = async () => {
    const code = exportAlignmentsAsCode(alignments);
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      console.log('Exported code:\n', code);
    }
  };

  // Reset target handler
  const handleResetTarget = () => {
    if (!currentPieceKey) return;
    const def = DEFAULT_PIECE_ALIGNMENTS[currentPieceKey] || { ...DEFAULT_PIECE_ALIGNMENT };
    updateCurrentAlignment(def);
  };

  // Reset all handler
  const handleResetAll = () => {
    if (confirm('Khôi phục toàn bộ các piece về thông số gốc mặc định?')) {
      resetPieceAlignments();
      setAlignments({ ...DEFAULT_PIECE_ALIGNMENTS });
      setHasUnsavedChanges(false);
    }
  };

  // Helper styles for preview layers
  const getStyleForCategory = (cat: PieceCategory, pieceId?: string) => {
    if (!pieceId) return {};
    const align = alignments[pieceId] || DEFAULT_PIECE_ALIGNMENTS[pieceId] || DEFAULT_PIECE_ALIGNMENT;
    const baseStyle = getAlignmentStyle(align);

    if (xrayMode) {
      if (cat !== targetCategory) {
        return { ...baseStyle, opacity: 0.35 };
      }
    }
    return baseStyle;
  };

  return (
    <div className="min-h-screen bg-lacquer text-silk-ivory flex flex-col font-sans select-none">
      {/* Top Header Bar */}
      <header className="border-b-2 border-imperial-gold/40 bg-lacquer-surface px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-lacquer border border-lacquer-border hover:border-imperial-gold text-sm font-semibold transition-all hover:bg-lacquer-hover"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Thoát về Studio</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold px-2 py-0.5 bg-imperial-red text-white tracking-widest border border-imperial-red-bright shadow-sm">
              DEV ONLY
            </span>
            <h1 className="font-serif font-bold text-lg text-imperial-gold flex items-center gap-1.5">
              <span>Bộ Căn Chỉnh Piece (Visual Calibrator)</span>
            </h1>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleResetAll}
            className="px-3 py-1.5 text-xs font-semibold text-silk-muted hover:text-white border border-lacquer-border hover:border-imperial-red transition-all flex items-center gap-1"
            title="Khôi phục toàn bộ về mặc định"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại tất cả</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 text-xs font-semibold bg-lacquer border border-imperial-gold/60 text-imperial-gold hover:bg-imperial-gold/10 transition-all flex items-center gap-1.5"
            title="Sao chép mã TypeScript để dán vào source code"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Đã chép mã!' : 'Xuất mã TypeScript'}</span>
          </button>

          <button
            onClick={handleSave}
            className={`px-4 py-1.5 text-sm font-bold transition-all flex items-center gap-1.5 shadow-lg ${
              saveSuccess
                ? 'bg-emerald-600 text-white border-2 border-emerald-400'
                : hasUnsavedChanges
                ? 'bg-imperial-gold text-lacquer border-2 border-imperial-gold hover:bg-imperial-gold-hover animate-pulse'
                : 'bg-imperial-gold/20 text-imperial-gold border-2 border-imperial-gold/40 hover:bg-imperial-gold/30'
            }`}
          >
            {saveSuccess ? <Check className="w-4 h-4 stroke-[3]" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? 'Đã lưu thành công!' : 'Lưu cấu hình'}</span>
          </button>
        </div>
      </header>

      {/* Main 2-Column Workbench */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT COLUMN: Visual Interactive Stage */}
        <div className="flex-1 bg-lacquer-card p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-lacquer-border">
          {/* Stage Quick Controls */}
          <div className="absolute top-4 left-4 z-40 flex items-center gap-2 bg-lacquer/90 backdrop-blur border border-lacquer-border p-1 text-xs">
            <span className="text-silk-muted px-2 font-bold uppercase">Phông:</span>
            <button
              onClick={() => setBgMode('checker')}
              className={`px-2 py-1 ${bgMode === 'checker' ? 'bg-imperial-gold text-lacquer font-bold' : 'text-silk-muted hover:text-white'}`}
            >
              Lưới Pixel
            </button>
            <button
              onClick={() => setBgMode('event')}
              className={`px-2 py-1 ${bgMode === 'event' ? 'bg-imperial-gold text-lacquer font-bold' : 'text-silk-muted hover:text-white'}`}
            >
              Phố Tết
            </button>
            <button
              onClick={() => setBgMode('dark')}
              className={`px-2 py-1 ${bgMode === 'dark' ? 'bg-imperial-gold text-lacquer font-bold' : 'text-silk-muted hover:text-white'}`}
            >
              Tối giản
            </button>
          </div>

          <div className="absolute top-4 right-4 z-40 flex items-center gap-2 bg-lacquer/90 backdrop-blur border border-lacquer-border p-1 text-xs">
            <button
              onClick={() => setXrayMode(!xrayMode)}
              className={`px-2.5 py-1 flex items-center gap-1.5 transition-all ${
                xrayMode
                  ? 'bg-imperial-red text-white font-bold'
                  : 'text-silk-muted hover:text-white'
              }`}
              title="Làm mờ các lớp khác để nhìn rõ khung xương ma-nơ-canh bên dưới"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>X-Ray Skeleton: {xrayMode ? 'BẬT' : 'TẮT'}</span>
            </button>
          </div>

          {/* Interactive Mannequin Canvas Container (Aspect 3:4) */}
          <div
            ref={stageRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            className={`relative w-full max-w-[420px] aspect-[3/4] border-2 border-imperial-gold/60 shadow-2xl flex items-center justify-center overflow-hidden cursor-move ${
              bgMode === 'checker'
                ? 'bg-[radial-gradient(#2a3441_1px,transparent_1px)] [background-size:16px_16px] bg-lacquer-surface'
                : bgMode === 'dark'
                ? 'bg-lacquer'
                : 'bg-lacquer-surface'
            }`}
          >
            {/* Background Image if Event Mode */}
            {bgMode === 'event' && (
              <img
                src={EVENTS[0].bgUrl}
                alt="Event"
                className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
              />
            )}

            {/* Mannequin Base (Always centered & reference base) */}
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
              <img
                src="/assets/mannequins/mannequin-base.png"
                alt="Mannequin"
                className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)]"
              />
            </div>

            {/* Layer 2: Quần (Bottom) */}
            {activeBottomVariant && (
              <div
                className={`absolute inset-0 z-20 pointer-events-none transition-transform duration-75 ${
                  targetCategory === 'bottom' ? 'ring-1 ring-imperial-gold/40' : ''
                }`}
                style={getStyleForCategory('bottom', activeBottom.id)}
              >
                <img
                  src={activeBottomVariant.assetUrl}
                  alt={activeBottom.name}
                  className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                />
              </div>
            )}

            {/* Layer 3: Giày (Footwear) */}
            {activeFootwearVariant && (
              <div
                className={`absolute inset-0 z-30 pointer-events-none transition-transform duration-75 ${
                  targetCategory === 'footwear' ? 'ring-1 ring-imperial-gold/40' : ''
                }`}
                style={getStyleForCategory('footwear', activeFootwear.id)}
              >
                <img
                  src={activeFootwearVariant.assetUrl}
                  alt={activeFootwear.name}
                  className="w-full h-full object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]"
                />
              </div>
            )}

            {/* Layer 4: Áo (Top) */}
            {activeTopVariant && (
              <div
                className={`absolute inset-0 z-40 pointer-events-none transition-transform duration-75 ${
                  targetCategory === 'top' ? 'ring-1 ring-imperial-gold/40' : ''
                }`}
                style={getStyleForCategory('top', activeTop.id)}
              >
                <img
                  src={activeTopVariant.assetUrl}
                  alt={activeTop.name}
                  className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]"
                />
              </div>
            )}

            {/* Layer 5: Phụ kiện (Accessory) */}
            {activeAccessoryVariant && (
              <div
                className={`absolute inset-0 z-50 pointer-events-none transition-transform duration-75 ${
                  targetCategory === 'accessory' ? 'ring-1 ring-imperial-gold/40' : ''
                }`}
                style={getStyleForCategory('accessory', activeAccessory?.id)}
              >
                <img
                  src={activeAccessoryVariant.assetUrl}
                  alt={activeAccessory?.name}
                  className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.65)]"
                />
              </div>
            )}

            {/* Center Reference Crosshairs */}
            <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-imperial-gold" />
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-imperial-gold" />
            </div>

            {/* Dragging notification tag */}
            {isDragging && (
              <div className="absolute bottom-3 bg-imperial-gold text-lacquer text-xs font-bold px-3 py-1 shadow-lg pointer-events-none z-50">
                X: {currentAlignment.x}% | Y: {currentAlignment.y}%
              </div>
            )}
          </div>

          <p className="text-xs text-silk-muted mt-3 text-center">
            💡 <strong className="text-imperial-gold">Mẹo:</strong> Kéo chuột trực tiếp trên khung để di chuyển
            layer đang chọn • Lăn chuột để Zoom • Dùng phím mũi tên <kbd className="px-1 bg-lacquer border border-lacquer-border">↑</kbd> <kbd className="px-1 bg-lacquer border border-lacquer-border">↓</kbd> <kbd className="px-1 bg-lacquer border border-lacquer-border">←</kbd> <kbd className="px-1 bg-lacquer border border-lacquer-border">→</kbd>
          </p>
        </div>

        {/* RIGHT COLUMN: Control Panel & Fine-tuning Sliders */}
        <div className="w-full lg:w-[460px] bg-lacquer-surface p-4 sm:p-6 overflow-y-auto flex flex-col gap-5 border-l border-lacquer-border">
          {/* Section 1: Target Layer Category Selector */}
          <div>
            <label className="text-xs font-bold text-silk-muted uppercase tracking-wider block mb-2">
              1. Chọn Layer Cần Căn Chỉnh
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setTargetCategory('top')}
                className={`py-2 px-1 text-xs font-bold transition-all border ${
                  targetCategory === 'top'
                    ? 'bg-imperial-gold text-lacquer border-imperial-gold shadow'
                    : 'bg-lacquer border-lacquer-border text-silk-muted hover:text-silk-ivory'
                }`}
              >
                1. Áo (Top)
              </button>
              <button
                onClick={() => setTargetCategory('bottom')}
                className={`py-2 px-1 text-xs font-bold transition-all border ${
                  targetCategory === 'bottom'
                    ? 'bg-imperial-gold text-lacquer border-imperial-gold shadow'
                    : 'bg-lacquer border-lacquer-border text-silk-muted hover:text-silk-ivory'
                }`}
              >
                2. Quần (Bottom)
              </button>
              <button
                onClick={() => setTargetCategory('footwear')}
                className={`py-2 px-1 text-xs font-bold transition-all border ${
                  targetCategory === 'footwear'
                    ? 'bg-imperial-gold text-lacquer border-imperial-gold shadow'
                    : 'bg-lacquer border-lacquer-border text-silk-muted hover:text-silk-ivory'
                }`}
              >
                3. Giày (Footwear)
              </button>
              <button
                onClick={() => setTargetCategory('accessory')}
                className={`py-2 px-1 text-xs font-bold transition-all border ${
                  targetCategory === 'accessory'
                    ? 'bg-imperial-gold text-lacquer border-imperial-gold shadow'
                    : 'bg-lacquer border-lacquer-border text-silk-muted hover:text-silk-ivory'
                }`}
              >
                4. Nón / Phụ kiện
              </button>
            </div>
          </div>

          {/* Section 2: Swap Item & Variant within Active Category */}
          <div className="p-3 bg-lacquer border border-lacquer-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-imperial-gold uppercase">
                Món đang chọn: {currentTargetPiece?.name}
              </span>
              <button
                onClick={handleResetTarget}
                className="text-xs text-imperial-red-bright hover:underline font-semibold"
              >
                Đặt lại món này
              </button>
            </div>

            {/* Quick swap options for this category */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {(targetCategory === 'top'
                ? tops
                : targetCategory === 'bottom'
                ? bottoms
                : targetCategory === 'footwear'
                ? footwears
                : accessories
              ).map((p) => {
                const isSelected = p.id === currentTargetPiece?.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      if (targetCategory === 'top') {
                        setActiveTop(p);
                        setActiveTopVariant(p.variants[0]);
                      } else if (targetCategory === 'bottom') {
                        setActiveBottom(p);
                        setActiveBottomVariant(p.variants[0]);
                      } else if (targetCategory === 'footwear') {
                        setActiveFootwear(p);
                        setActiveFootwearVariant(p.variants[0]);
                      } else {
                        setActiveAccessory(p);
                        setActiveAccessoryVariant(p.variants[0]);
                      }
                    }}
                    className={`px-2.5 py-1 text-xs font-semibold whitespace-nowrap border ${
                      isSelected
                        ? 'bg-imperial-gold/20 text-imperial-gold border-imperial-gold'
                        : 'text-silk-muted border-lacquer-border hover:text-white'
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Fine-Tuning Sliders & Step Inputs */}
          <div className="space-y-4">
            {/* Vị trí X (%) */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-silk-muted mb-1">
                <span>VỊ TRÍ NGANG X (%)</span>
                <span className="text-imperial-gold font-mono">{currentAlignment.x}%</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCurrentAlignment({ x: Number((currentAlignment.x - 1).toFixed(2)) })}
                  className="px-2 py-1 bg-lacquer border border-lacquer-border text-xs font-mono hover:border-imperial-gold"
                >
                  -1%
                </button>
                <button
                  onClick={() => updateCurrentAlignment({ x: Number((currentAlignment.x - 0.2).toFixed(2)) })}
                  className="px-1.5 py-1 bg-lacquer border border-lacquer-border text-xs font-mono hover:border-imperial-gold"
                >
                  -0.2
                </button>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  step="0.1"
                  value={currentAlignment.x}
                  onChange={(e) => updateCurrentAlignment({ x: parseFloat(e.target.value) })}
                  className="flex-1 accent-imperial-gold cursor-pointer"
                />
                <button
                  onClick={() => updateCurrentAlignment({ x: Number((currentAlignment.x + 0.2).toFixed(2)) })}
                  className="px-1.5 py-1 bg-lacquer border border-lacquer-border text-xs font-mono hover:border-imperial-gold"
                >
                  +0.2
                </button>
                <button
                  onClick={() => updateCurrentAlignment({ x: Number((currentAlignment.x + 1).toFixed(2)) })}
                  className="px-2 py-1 bg-lacquer border border-lacquer-border text-xs font-mono hover:border-imperial-gold"
                >
                  +1%
                </button>
              </div>
            </div>

            {/* Vị trí Y (%) */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-silk-muted mb-1">
                <span>VỊ TRÍ DỌC Y (%)</span>
                <span className="text-imperial-gold font-mono">{currentAlignment.y}%</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCurrentAlignment({ y: Number((currentAlignment.y - 1).toFixed(2)) })}
                  className="px-2 py-1 bg-lacquer border border-lacquer-border text-xs font-mono hover:border-imperial-gold"
                >
                  -1%
                </button>
                <button
                  onClick={() => updateCurrentAlignment({ y: Number((currentAlignment.y - 0.2).toFixed(2)) })}
                  className="px-1.5 py-1 bg-lacquer border border-lacquer-border text-xs font-mono hover:border-imperial-gold"
                >
                  -0.2
                </button>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  step="0.1"
                  value={currentAlignment.y}
                  onChange={(e) => updateCurrentAlignment({ y: parseFloat(e.target.value) })}
                  className="flex-1 accent-imperial-gold cursor-pointer"
                />
                <button
                  onClick={() => updateCurrentAlignment({ y: Number((currentAlignment.y + 0.2).toFixed(2)) })}
                  className="px-1.5 py-1 bg-lacquer border border-lacquer-border text-xs font-mono hover:border-imperial-gold"
                >
                  +0.2
                </button>
                <button
                  onClick={() => updateCurrentAlignment({ y: Number((currentAlignment.y + 1).toFixed(2)) })}
                  className="px-2 py-1 bg-lacquer border border-lacquer-border text-xs font-mono hover:border-imperial-gold"
                >
                  +1%
                </button>
              </div>
            </div>

            {/* Phóng to / Thu nhỏ (Scale) */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-silk-muted mb-1">
                <span>PHÓNG TO / THU NHỎ (SCALE)</span>
                <span className="text-imperial-gold font-mono">{currentAlignment.scale}x</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateCurrentAlignment({ scale: Math.max(0.3, Number((currentAlignment.scale - 0.05).toFixed(3))) })
                  }
                  className="px-2 py-1 bg-lacquer border border-lacquer-border text-xs font-mono hover:border-imperial-gold"
                >
                  -0.05
                </button>
                <input
                  type="range"
                  min="0.4"
                  max="2.2"
                  step="0.01"
                  value={currentAlignment.scale}
                  onChange={(e) => updateCurrentAlignment({ scale: parseFloat(e.target.value) })}
                  className="flex-1 accent-imperial-gold cursor-pointer"
                />
                <button
                  onClick={() =>
                    updateCurrentAlignment({ scale: Math.min(2.5, Number((currentAlignment.scale + 0.05).toFixed(3))) })
                  }
                  className="px-2 py-1 bg-lacquer border border-lacquer-border text-xs font-mono hover:border-imperial-gold"
                >
                  +0.05
                </button>
              </div>
            </div>

            {/* Co giãn Ngang (Scale X) - Cực kỳ quan trọng để bóp/nới hông quần */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-silk-muted mb-1">
                <span>CO GIÃN CHIỀU NGANG (SCALE X)</span>
                <span className="text-imperial-gold font-mono">{currentAlignment.scaleX}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.01"
                value={currentAlignment.scaleX}
                onChange={(e) => updateCurrentAlignment({ scaleX: parseFloat(e.target.value) })}
                className="w-full accent-imperial-gold cursor-pointer"
              />
            </div>

            {/* Co giãn Dọc (Scale Y) - Kéo dài ống quần / thu ngắn vạt */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-silk-muted mb-1">
                <span>CO GIÃN CHIỀU DỌC (SCALE Y)</span>
                <span className="text-imperial-gold font-mono">{currentAlignment.scaleY}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.01"
                value={currentAlignment.scaleY}
                onChange={(e) => updateCurrentAlignment({ scaleY: parseFloat(e.target.value) })}
                className="w-full accent-imperial-gold cursor-pointer"
              />
            </div>

            {/* Góc xoay (Rotate) */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-silk-muted mb-1">
                <span>GÓC XOAY NGHIÊNG (ĐỘ)</span>
                <span className="text-imperial-gold font-mono">{currentAlignment.rotate}°</span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="0.5"
                value={currentAlignment.rotate}
                onChange={(e) => updateCurrentAlignment({ rotate: parseFloat(e.target.value) })}
                className="w-full accent-imperial-gold cursor-pointer"
              />
            </div>
          </div>

          {/* Section 4: Live Code Snippet for Selected Piece */}
          <div className="mt-auto pt-3 border-t border-lacquer-border">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-silk-muted uppercase tracking-wider">
                Thông số JSON hiện tại:
              </span>
            </div>
            <pre className="p-2.5 bg-lacquer text-[11px] font-mono text-imperial-gold overflow-x-auto border border-lacquer-border">
              {JSON.stringify(
                {
                  [currentPieceKey]: {
                    x: currentAlignment.x,
                    y: currentAlignment.y,
                    scale: currentAlignment.scale,
                    scaleX: currentAlignment.scaleX,
                    scaleY: currentAlignment.scaleY,
                    rotate: currentAlignment.rotate,
                  },
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
