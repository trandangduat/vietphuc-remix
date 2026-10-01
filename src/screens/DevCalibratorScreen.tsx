import React, { useState, useEffect, useRef } from 'react';
import { PIECES } from '../data/catalog';
import {
  PieceAlignment,
  AlignmentMap,
  DEFAULT_PIECE_ALIGNMENTS,
  DEFAULT_PIECE_ALIGNMENT,
  getStoredPieceAlignments,
  savePieceAlignmentsToStorage,
  savePieceAlignments,
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
  Grid,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';

interface DevCalibratorScreenProps {
  onExit: () => void;
}

export const DevCalibratorScreen: React.FC<DevCalibratorScreenProps> = ({ onExit }) => {
  // Load stored alignments or defaults
  const [alignments, setAlignments] = useState<AlignmentMap>(() => getStoredPieceAlignments());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: 'idle' | 'success_file' | 'success_local' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });

  // Category filter for the pieces list
  const [categoryFilter, setCategoryFilter] = useState<PieceCategory | 'all'>('all');

  // Currently active piece being calibrated (1-on-1 with mannequin)
  const [selectedPiece, setSelectedPiece] = useState<Piece>(() => {
    // Default to bottom (Quần lụa) since user is actively tuning pants
    const defaultPiece = PIECES.find((p) => p.id === 'piece-quan-lua') || PIECES[0];
    return defaultPiece;
  });

  // Currently active variant of the selected piece
  const [selectedVariant, setSelectedVariant] = useState<PieceVariant>(() => {
    const defaultPiece = PIECES.find((p) => p.id === 'piece-quan-lua') || PIECES[0];
    return defaultPiece.variants[0];
  });

  // When selected piece changes, ensure selected variant belongs to it
  const handleSelectPiece = (piece: Piece) => {
    setSelectedPiece(piece);
    setSelectedVariant(piece.variants[0]);
  };

  // Preview options
  const [bgMode, setBgMode] = useState<'checker' | 'dark' | 'light'>('checker');
  const [showGuidelines, setShowGuidelines] = useState(true);
  const [pieceOpacity, setPieceOpacity] = useState(1);
  const [showFullOutfit, setShowFullOutfit] = useState(false); // Default: FALSE (Pure 1-on-1)

  // Current alignment for selected piece
  const pieceKey = selectedPiece.id;
  const currentAlignment: PieceAlignment =
    alignments[pieceKey] || DEFAULT_PIECE_ALIGNMENTS[pieceKey] || { ...DEFAULT_PIECE_ALIGNMENT };

  // Update alignment helper
  const updateCurrentAlignment = (patch: Partial<PieceAlignment>) => {
    if (!pieceKey) return;
    setAlignments((prev) => {
      const existing = prev[pieceKey] || DEFAULT_PIECE_ALIGNMENTS[pieceKey] || { ...DEFAULT_PIECE_ALIGNMENT };
      return {
        ...prev,
        [pieceKey]: {
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

  // Keyboard navigation
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentAlignment, pieceKey]);

  // Save handler - writes directly to file src/data/pieceAlignments.ts and updates localStorage
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await savePieceAlignments(alignments);
      setHasUnsavedChanges(false);
      setSaveStatus({
        type: res.savedToFile ? 'success_file' : 'success_local',
        message: res.message,
      });
      setTimeout(() => {
        setSaveStatus({ type: 'idle', message: '' });
      }, 4000);
    } catch (err: any) {
      setSaveStatus({
        type: 'error',
        message: err?.message || 'Có lỗi xảy ra khi lưu!',
      });
      setTimeout(() => {
        setSaveStatus({ type: 'idle', message: '' });
      }, 4000);
    } finally {
      setIsSaving(false);
    }
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

  // Reset selected piece
  const handleResetCurrentPiece = () => {
    const def = DEFAULT_PIECE_ALIGNMENTS[pieceKey] || { ...DEFAULT_PIECE_ALIGNMENT };
    updateCurrentAlignment(def);
  };

  // Filtered pieces
  const displayedPieces = PIECES.filter((p) => {
    if (categoryFilter === 'all') return true;
    return p.category === categoryFilter;
  });

  // Find reference pieces if showFullOutfit is enabled
  const refTop = PIECES.find((p) => p.category === 'top');
  const refBottom = PIECES.find((p) => p.category === 'bottom');
  const refFootwear = PIECES.find((p) => p.category === 'footwear');
  const refAccessory = PIECES.find((p) => p.category === 'accessory');

  // Compute piece transform style
  const activePieceStyle = {
    ...getAlignmentStyle(currentAlignment),
    opacity: pieceOpacity,
  };

  return (
    <div className="min-h-screen bg-lacquer text-silk-ivory flex flex-col font-sans select-none">
      {/* Header Bar */}
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
            <div>
              <h1 className="font-serif font-bold text-base text-imperial-gold flex items-center gap-1.5">
                <span>Căn Chỉnh Từng Piece Với Ma-nơ-canh (1-on-1 Calibrator)</span>
              </h1>
              <p className="text-xs text-silk-muted">
                Căn chỉnh độc lập từng món đồ trực tiếp trên phôi ma-nơ-canh, không bị che khuất bởi các món khác
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleResetCurrentPiece}
            className="px-3 py-1.5 text-xs font-semibold text-silk-muted hover:text-white border border-lacquer-border hover:border-imperial-red transition-all flex items-center gap-1"
            title="Đặt lại món này về mặc định"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại món này</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 text-xs font-semibold bg-lacquer border border-imperial-gold/60 text-imperial-gold hover:bg-imperial-gold/10 transition-all flex items-center gap-1.5"
            title="Sao chép toàn bộ mã cấu hình TypeScript để dán vào src/data/pieceAlignments.ts"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Đã chép mã!' : 'Xuất mã TypeScript'}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-1.5 text-sm font-bold transition-all flex items-center gap-1.5 shadow-lg ${
              saveStatus.type === 'success_file'
                ? 'bg-emerald-600 text-white border-2 border-emerald-400'
                : saveStatus.type === 'success_local'
                ? 'bg-amber-600 text-white border-2 border-amber-400'
                : isSaving
                ? 'bg-imperial-gold/50 text-lacquer border-2 border-imperial-gold cursor-wait'
                : hasUnsavedChanges
                ? 'bg-imperial-gold text-lacquer border-2 border-imperial-gold hover:bg-imperial-gold-hover animate-pulse'
                : 'bg-imperial-gold/20 text-imperial-gold border-2 border-imperial-gold/40 hover:bg-imperial-gold/30'
            }`}
            title="Tự động ghi trực tiếp tọa độ căn chỉnh vào file code src/data/pieceAlignments.ts"
          >
            {isSaving ? (
              <RotateCw className="w-4 h-4 animate-spin" />
            ) : saveStatus.type === 'success_file' ? (
              <Check className="w-4 h-4 stroke-[3]" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>
              {isSaving
                ? 'Đang ghi file...'
                : saveStatus.type === 'success_file'
                ? 'Đã ghi vào file code!'
                : saveStatus.type === 'success_local'
                ? 'Đã lưu localStorage!'
                : 'Lưu vào file code'}
            </span>
          </button>
        </div>
      </header>

      {/* Floating notification toast confirming file write */}
      {saveStatus.type !== 'idle' && (
        <div
          className={`fixed top-16 right-6 z-50 px-4 py-2.5 shadow-2xl border flex items-center gap-2.5 backdrop-blur-md transition-all ${
            saveStatus.type === 'success_file'
              ? 'bg-emerald-950/95 text-emerald-200 border-emerald-500 shadow-emerald-950/50'
              : saveStatus.type === 'success_local'
              ? 'bg-amber-950/95 text-amber-200 border-amber-500 shadow-amber-950/50'
              : 'bg-rose-950/95 text-rose-200 border-rose-500 shadow-rose-950/50'
          }`}
        >
          {saveStatus.type === 'success_file' && <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />}
          {saveStatus.type === 'success_local' && <Info className="w-4 h-4 text-amber-400" />}
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider">
              {saveStatus.type === 'success_file'
                ? '✓ Đã đồng bộ mã nguồn'
                : saveStatus.type === 'success_local'
                ? 'Thông báo'
                : 'Lỗi'}
            </span>
            <span className="text-xs text-white/90">{saveStatus.message}</span>
          </div>
        </div>
      )}

      {/* 3-Column Layout: [Piece Catalog List] | [Isolated 1-on-1 Canvas] | [Sliders & Fine-tuning] */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* COLUMN 1: Piece Catalog List (Left Sidebar) */}
        <div className="w-full lg:w-72 bg-lacquer-surface border-b lg:border-b-0 lg:border-r border-lacquer-border flex flex-col flex-shrink-0">
          {/* Category Filter Chips */}
          <div className="p-3 border-b border-lacquer-border">
            <span className="text-xs font-bold text-silk-muted uppercase tracking-wider block mb-2">
              Danh mục đồ:
            </span>
            <div className="grid grid-cols-3 gap-1 text-xs font-semibold">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`py-1.5 px-2 text-center border ${
                  categoryFilter === 'all'
                    ? 'bg-imperial-gold text-lacquer border-imperial-gold font-bold'
                    : 'bg-lacquer border-lacquer-border text-silk-muted hover:text-white'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setCategoryFilter('top')}
                className={`py-1.5 px-2 text-center border ${
                  categoryFilter === 'top'
                    ? 'bg-imperial-gold text-lacquer border-imperial-gold font-bold'
                    : 'bg-lacquer border-lacquer-border text-silk-muted hover:text-white'
                }`}
              >
                Áo
              </button>
              <button
                onClick={() => setCategoryFilter('bottom')}
                className={`py-1.5 px-2 text-center border ${
                  categoryFilter === 'bottom'
                    ? 'bg-imperial-gold text-lacquer border-imperial-gold font-bold'
                    : 'bg-lacquer border-lacquer-border text-silk-muted hover:text-white'
                }`}
              >
                Quần
              </button>
              <button
                onClick={() => setCategoryFilter('footwear')}
                className={`py-1.5 px-2 text-center border ${
                  categoryFilter === 'footwear'
                    ? 'bg-imperial-gold text-lacquer border-imperial-gold font-bold'
                    : 'bg-lacquer border-lacquer-border text-silk-muted hover:text-white'
                }`}
              >
                Giày / Hài
              </button>
              <button
                onClick={() => setCategoryFilter('accessory')}
                className={`py-1.5 px-2 text-center border col-span-2 ${
                  categoryFilter === 'accessory'
                    ? 'bg-imperial-gold text-lacquer border-imperial-gold font-bold'
                    : 'bg-lacquer border-lacquer-border text-silk-muted hover:text-white'
                }`}
              >
                Nón / Phụ kiện
              </button>
            </div>
          </div>

          {/* Piece Cards List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {displayedPieces.map((piece) => {
              const isSelected = piece.id === selectedPiece.id;
              const align = alignments[piece.id] || DEFAULT_PIECE_ALIGNMENTS[piece.id] || DEFAULT_PIECE_ALIGNMENT;
              const isModified =
                align.x !== 0 ||
                align.y !== 0 ||
                align.scale !== 1 ||
                (align.scaleX ?? 1) !== 1 ||
                (align.scaleY ?? 1) !== 1;

              return (
                <div
                  key={piece.id}
                  onClick={() => handleSelectPiece(piece)}
                  className={`p-2.5 border-2 transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-lacquer-card border-imperial-gold ring-1 ring-imperial-gold/50 shadow-md'
                      : 'bg-lacquer border-lacquer-border hover:border-silk-muted hover:bg-lacquer-surface'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-none bg-lacquer-card border border-lacquer-border flex items-center justify-center p-1 flex-shrink-0">
                    <img
                      src={piece.variants[0]?.thumbnailUrl || piece.thumbnailUrl || piece.variants[0]?.assetUrl}
                      alt={piece.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-imperial-gold' : 'text-silk-ivory'}`}>
                        {piece.name}
                      </h4>
                      {isModified && (
                        <span className="text-[10px] px-1 bg-imperial-gold/20 text-imperial-gold border border-imperial-gold/40 flex-shrink-0">
                          Đã chỉnh
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-silk-muted">
                      <span className="capitalize">
                        {piece.category === 'top'
                          ? 'Áo'
                          : piece.category === 'bottom'
                          ? 'Quần'
                          : piece.category === 'footwear'
                          ? 'Giày'
                          : 'Phụ kiện'}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-silk-muted">
                        X:{align.x} Y:{align.y}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 2: Isolated Canvas Stage (Center) */}
        <div className="flex-1 bg-lacquer-card p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-lacquer-border">
          {/* Top Canvas Toolbar */}
          <div className="absolute top-4 left-4 z-40 flex items-center gap-2 bg-lacquer/90 backdrop-blur border border-lacquer-border p-1 text-xs">
            <span className="text-silk-muted px-1.5 font-bold uppercase">Nền:</span>
            <button
              onClick={() => setBgMode('checker')}
              className={`px-2 py-1 ${bgMode === 'checker' ? 'bg-imperial-gold text-lacquer font-bold' : 'text-silk-muted hover:text-white'}`}
            >
              Lưới Pixel
            </button>
            <button
              onClick={() => setBgMode('dark')}
              className={`px-2 py-1 ${bgMode === 'dark' ? 'bg-imperial-gold text-lacquer font-bold' : 'text-silk-muted hover:text-white'}`}
            >
              Tối đen
            </button>
            <button
              onClick={() => setBgMode('light')}
              className={`px-2 py-1 ${bgMode === 'light' ? 'bg-imperial-gold text-lacquer font-bold' : 'text-silk-muted hover:text-white'}`}
              title="Phông nền sáng (rất dễ nhìn khi căn chỉnh quần hoặc giày tối màu)"
            >
              Phông sáng
            </button>
          </div>

          <div className="absolute top-4 right-4 z-40 flex items-center gap-2 bg-lacquer/90 backdrop-blur border border-lacquer-border p-1 text-xs">
            <button
              onClick={() => setShowGuidelines(!showGuidelines)}
              className={`px-2.5 py-1 flex items-center gap-1 transition-all ${
                showGuidelines ? 'bg-imperial-gold text-lacquer font-bold' : 'text-silk-muted hover:text-white'
              }`}
              title="Hiện các đường gióng giải phẫu (Vai, Eo, Gối, Cổ chân)"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Đường gióng: {showGuidelines ? 'BẬT' : 'TẮT'}</span>
            </button>

            <button
              onClick={() => setShowFullOutfit(!showFullOutfit)}
              className={`px-2.5 py-1 flex items-center gap-1 transition-all ${
                showFullOutfit ? 'bg-imperial-red text-white font-bold' : 'text-silk-muted hover:text-white'
              }`}
              title="Bật/Tắt xem cùng các món đồ khác để kiểm tra tổng thể"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Xem cùng outfit: {showFullOutfit ? 'BẬT' : 'TẮT'}</span>
            </button>
          </div>

          {/* Interactive Mannequin Canvas Container (Aspect 3:4) */}
          <div
            ref={stageRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            className={`relative w-full max-w-[420px] aspect-[3/4] border-2 border-imperial-gold/60 shadow-2xl flex items-center justify-center overflow-hidden cursor-move select-none ${
              bgMode === 'checker'
                ? 'bg-[radial-gradient(#2a3441_1px,transparent_1px)] [background-size:16px_16px] bg-lacquer-surface'
                : bgMode === 'dark'
                ? 'bg-lacquer'
                : 'bg-[#d8d4c8]'
            }`}
          >
            {/* Layer 1: Mannequin Base (Always visible at center) */}
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
              <img
                src="/assets/mannequins/mannequin-base.png"
                alt="Mannequin"
                className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)]"
              />
            </div>

            {/* Optional Full Outfit Context (if enabled, semi-transparent) */}
            {showFullOutfit && (
              <>
                {refBottom && refBottom.id !== selectedPiece.id && (
                  <div
                    className="absolute inset-0 z-20 pointer-events-none opacity-40"
                    style={getAlignmentStyle(alignments[refBottom.id] || DEFAULT_PIECE_ALIGNMENTS[refBottom.id] || DEFAULT_PIECE_ALIGNMENT)}
                  >
                    <img src={refBottom.variants[0].assetUrl} alt="Ref Bottom" className="w-full h-full object-contain" />
                  </div>
                )}
                {refFootwear && refFootwear.id !== selectedPiece.id && (
                  <div
                    className="absolute inset-0 z-30 pointer-events-none opacity-40"
                    style={getAlignmentStyle(alignments[refFootwear.id] || DEFAULT_PIECE_ALIGNMENTS[refFootwear.id] || DEFAULT_PIECE_ALIGNMENT)}
                  >
                    <img src={refFootwear.variants[0].assetUrl} alt="Ref Footwear" className="w-full h-full object-contain" />
                  </div>
                )}
                {refTop && refTop.id !== selectedPiece.id && (
                  <div
                    className="absolute inset-0 z-40 pointer-events-none opacity-40"
                    style={getAlignmentStyle(alignments[refTop.id] || DEFAULT_PIECE_ALIGNMENTS[refTop.id] || DEFAULT_PIECE_ALIGNMENT)}
                  >
                    <img src={refTop.variants[0].assetUrl} alt="Ref Top" className="w-full h-full object-contain" />
                  </div>
                )}
                {refAccessory && refAccessory.id !== selectedPiece.id && (
                  <div
                    className="absolute inset-0 z-50 pointer-events-none opacity-40"
                    style={getAlignmentStyle(alignments[refAccessory.id] || DEFAULT_PIECE_ALIGNMENTS[refAccessory.id] || DEFAULT_PIECE_ALIGNMENT)}
                  >
                    <img src={refAccessory.variants[0].assetUrl} alt="Ref Accessory" className="w-full h-full object-contain" />
                  </div>
                )}
              </>
            )}

            {/* THE ISOLATED TARGET PIECE BEING CALIBRATED */}
            <div
              className="absolute inset-0 z-40 pointer-events-none transition-transform duration-75 ring-1 ring-imperial-gold/60"
              style={activePieceStyle}
            >
              <img
                src={selectedVariant.assetUrl}
                alt={selectedPiece.name}
                className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)]"
              />
            </div>

            {/* Anatomical Reference Guidelines */}
            {showGuidelines && (
              <div className="absolute inset-0 pointer-events-none z-30 opacity-70">
                {/* Đỉnh đầu (Y ≈ 15%) */}
                <div className="absolute top-[15%] left-0 right-0 border-b border-dashed border-sky-400/60">
                  <span className="text-[9px] font-mono text-sky-400 bg-black/80 px-1 absolute right-1 -top-3">
                    Đỉnh đầu (15%)
                  </span>
                </div>
                {/* Vai & Cổ (Y ≈ 25%) */}
                <div className="absolute top-[25%] left-0 right-0 border-b border-dashed border-emerald-400/60">
                  <span className="text-[9px] font-mono text-emerald-400 bg-black/80 px-1 absolute right-1 -top-3">
                    Vai / Cổ áo (25%)
                  </span>
                </div>
                {/* Eo / Cạp quần (Y ≈ 50%) */}
                <div className="absolute top-[50%] left-0 right-0 border-b-2 border-dashed border-imperial-gold">
                  <span className="text-[9px] font-mono text-imperial-gold bg-black/80 px-1 absolute right-1 -top-3">
                    Eo / Cạp quần (50%)
                  </span>
                </div>
                {/* Gối (Y ≈ 72%) */}
                <div className="absolute top-[72%] left-0 right-0 border-b border-dashed border-amber-400/60">
                  <span className="text-[9px] font-mono text-amber-400 bg-black/80 px-1 absolute right-1 -top-3">
                    Đầu gối (72%)
                  </span>
                </div>
                {/* Gấu quần / Cổ chân (Y ≈ 87.5%) */}
                <div className="absolute top-[87.5%] left-0 right-0 border-b-2 border-dashed border-rose-400">
                  <span className="text-[9px] font-mono text-rose-400 bg-black/80 px-1 absolute right-1 -top-3">
                    Gấu quần / Cổ chân (87.5%)
                  </span>
                </div>
                {/* Bàn chân (Y ≈ 94%) */}
                <div className="absolute top-[94%] left-0 right-0 border-b border-dashed border-purple-400/60">
                  <span className="text-[9px] font-mono text-purple-400 bg-black/80 px-1 absolute right-1 -top-3">
                    Bàn chân (94%)
                  </span>
                </div>

                {/* Trục giữa cơ thể (Center line) */}
                <div className="absolute left-1/2 top-0 bottom-0 border-r border-dashed border-imperial-gold/40" />
              </div>
            )}

            {/* Live dragging indicator */}
            {isDragging && (
              <div className="absolute bottom-3 bg-imperial-gold text-lacquer text-xs font-bold px-3 py-1 shadow-lg pointer-events-none z-50">
                X: {currentAlignment.x}% | Y: {currentAlignment.y}%
              </div>
            )}
          </div>

          <p className="text-xs text-silk-muted mt-3 text-center max-w-sm">
            💡 <strong className="text-imperial-gold">Kéo thả chuột</strong> trực tiếp trên khung • Lăn chuột để Zoom • Dùng phím mũi tên <kbd className="px-1 bg-lacquer border border-lacquer-border">↑</kbd> <kbd className="px-1 bg-lacquer border border-lacquer-border">↓</kbd> <kbd className="px-1 bg-lacquer border border-lacquer-border">←</kbd> <kbd className="px-1 bg-lacquer border border-lacquer-border">→</kbd>
          </p>
        </div>

        {/* COLUMN 3: Fine-Tuning Sliders & Precision Controls (Right) */}
        <div className="w-full lg:w-96 bg-lacquer-surface p-4 sm:p-5 overflow-y-auto flex flex-col gap-4 border-l border-lacquer-border flex-shrink-0">
          {/* Active Piece Header Info */}
          <div className="p-3 bg-lacquer border-2 border-imperial-gold/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-imperial-gold">Đang căn chỉnh:</span>
              <button
                onClick={handleResetCurrentPiece}
                className="text-xs text-imperial-red-bright hover:underline font-semibold"
              >
                Khôi phục mặc định
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-lacquer-surface border border-imperial-gold/50 p-1 flex items-center justify-center flex-shrink-0">
                <img
                  src={selectedVariant.thumbnailUrl || selectedPiece.thumbnailUrl || selectedVariant.assetUrl}
                  alt={selectedPiece.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-silk-ivory truncate">{selectedPiece.name}</h3>
                <p className="text-xs text-silk-muted capitalize">
                  {selectedPiece.category === 'top'
                    ? 'Áo'
                    : selectedPiece.category === 'bottom'
                    ? 'Quần'
                    : selectedPiece.category === 'footwear'
                    ? 'Giày'
                    : 'Phụ kiện'}
                  {' • ' + selectedVariant.colorName}
                </p>
              </div>
            </div>

            {/* Color Swatch Picker if piece has variants */}
            {selectedPiece.variants.length > 1 && (
              <div className="pt-2 border-t border-lacquer-border flex items-center gap-2">
                <span className="text-xs text-silk-muted font-bold">Màu thử:</span>
                <div className="flex items-center gap-1.5">
                  {selectedPiece.variants.map((v) => (
                    <button
                      key={v.variantId}
                      onClick={() => setSelectedVariant(v)}
                      className={`w-5 h-5 border transition-all ${
                        selectedVariant.variantId === v.variantId
                          ? 'border-imperial-gold ring-2 ring-imperial-gold/50 scale-110'
                          : 'border-lacquer-border hover:scale-105'
                      }`}
                      style={{ backgroundColor: v.swatchHex }}
                      title={v.colorName}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Precision Sliders */}
          <div className="space-y-3.5">
            {/* Vị trí X (%) */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-silk-muted mb-1">
                <span>VỊ TRÍ NGANG X (%)</span>
                <span className="text-imperial-gold font-mono">{currentAlignment.x}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => updateCurrentAlignment({ x: Number((currentAlignment.x - 1).toFixed(2)) })}
                  className="px-1.5 py-1 bg-lacquer border border-lacquer-border text-xs font-mono hover:border-imperial-gold"
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
                  className="px-1.5 py-1 bg-lacquer border border-lacquer-border text-xs font-mono hover:border-imperial-gold"
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
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => updateCurrentAlignment({ y: Number((currentAlignment.y - 1).toFixed(2)) })}
                  className="px-1.5 py-1 bg-lacquer border border-lacquer-border text-xs font-mono hover:border-imperial-gold"
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
                  className="px-1.5 py-1 bg-lacquer border border-lacquer-border text-xs font-mono hover:border-imperial-gold"
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

            {/* Co giãn Ngang (Scale X) */}
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

            {/* Co giãn Dọc (Scale Y) */}
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

            {/* Độ mờ của vải (Opacity Preview) */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-silk-muted mb-1">
                <span>ĐỘ MỜ CỦA VẢI (NHÌN XUYÊN THẤU)</span>
                <span className="text-imperial-gold font-mono">{Math.round(pieceOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={pieceOpacity}
                onChange={(e) => setPieceOpacity(parseFloat(e.target.value))}
                className="w-full accent-imperial-gold cursor-pointer"
              />
            </div>
          </div>

          {/* Live JSON snippet */}
          <div className="mt-auto pt-3 border-t border-lacquer-border">
            <span className="text-[11px] font-bold text-silk-muted uppercase tracking-wider block mb-1">
              Thông số JSON của món này:
            </span>
            <pre className="p-2 bg-lacquer text-[11px] font-mono text-imperial-gold overflow-x-auto border border-lacquer-border">
              {JSON.stringify(
                {
                  [pieceKey]: {
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
