import React, { useState } from 'react';
import { SavedOutfit, Piece } from '../types';
import {
  Sparkles,
  ExternalLink,
  Trash2,
  Edit2,
  Check,
  X,
  Calendar,
  Layers,
  Download,
  ArrowRight,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import { getPieceAlignment, getAlignmentStyle } from '../data/pieceAlignments';

/**
 * Renders the full mannequin composite wearing all pieces for an outfit
 */
const OutfitMannequinComposite: React.FC<{
  outfit: SavedOutfit;
  className?: string;
  isModal?: boolean;
}> = ({ outfit, className = '', isModal = false }) => {
  const bottomPiece = outfit.bottom?.piece || (outfit.bottom?.variant as Piece | undefined);
  const footwearPiece = outfit.footwear?.piece || (outfit.footwear?.variant as Piece | undefined);
  const topPiece = outfit.top?.piece || (outfit.top?.variant as Piece | undefined);
  const accessoryPiece = outfit.accessory?.piece || (outfit.accessory?.variant as Piece | undefined);

  const bottomAlign = getPieceAlignment(bottomPiece?.id);
  const footwearAlign = getPieceAlignment(footwearPiece?.id);
  const topAlign = getPieceAlignment(topPiece?.id);
  const accessoryAlign = getPieceAlignment(accessoryPiece?.id);

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none ${className}`}>
      {/* Background Event Layer */}
      {outfit.event?.bgUrl && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={outfit.event.bgUrl}
            alt={outfit.event.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isModal ? 'opacity-95' : 'opacity-90 group-hover:scale-105'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      {/* Scaled Mannequin & Clothes Composite Stage */}
      <div
        className={`relative z-10 w-full h-full max-h-[96%] aspect-[3/4] flex items-center justify-center pointer-events-none py-2 transition-transform duration-500 ${
          isModal ? '' : 'group-hover:scale-105'
        }`}
      >
        {/* Layer 1: Mannequin Base */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <img
            src="/assets/mannequins/mannequin-base.png"
            alt="Ma-nơ-canh"
            className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)]"
          />
        </div>

        {/* Layer 2: Quần / Chân váy (Z=20) */}
        {bottomPiece?.assetUrl && (
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={getAlignmentStyle(bottomAlign)}
          >
            <img
              src={bottomPiece.assetUrl}
              alt={bottomPiece.name}
              className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
            />
          </div>
        )}

        {/* Layer 3: Giày / Dép (Z=30) */}
        {footwearPiece?.assetUrl && (
          <div
            className="absolute inset-0 z-30 pointer-events-none"
            style={getAlignmentStyle(footwearAlign)}
          >
            <img
              src={footwearPiece.assetUrl}
              alt={footwearPiece.name}
              className="w-full h-full object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]"
            />
          </div>
        )}

        {/* Layer 4: Áo (Z=40) - Phủ lên quần */}
        {topPiece?.assetUrl && (
          <div
            className="absolute inset-0 z-40 pointer-events-none"
            style={getAlignmentStyle(topAlign)}
          >
            <img
              src={topPiece.assetUrl}
              alt={topPiece.name}
              className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]"
            />
          </div>
        )}

        {/* Layer 5: Phụ kiện (Z=50) - Nón, khăn, mũ */}
        {accessoryPiece?.assetUrl && (
          <div
            className="absolute inset-0 z-50 pointer-events-none"
            style={getAlignmentStyle(accessoryAlign)}
          >
            <img
              src={accessoryPiece.assetUrl}
              alt={accessoryPiece.name}
              className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.65)]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface LookbookScreenProps {
  outfits: SavedOutfit[];
  isLoggedIn: boolean;
  onLoginPrompt: () => void;
  onLoadOutfitIntoStudio: (outfit: SavedOutfit) => void;
  onDeleteOutfit: (id: string) => void;
  onRenameOutfit: (id: string, newName: string) => void;
  onOpenStudio: () => void;
}

export const LookbookScreen: React.FC<LookbookScreenProps> = ({
  outfits,
  isLoggedIn,
  onLoginPrompt,
  onLoadOutfitIntoStudio,
  onDeleteOutfit,
  onRenameOutfit,
  onOpenStudio,
}) => {
  // Modal detail view for clicked outfit
  const [selectedOutfit, setSelectedOutfit] = useState<SavedOutfit | null>(null);

  // Active view inside modal: '2d' or index of AI image
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);

  // Inline rename state in modal
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameText, setEditNameText] = useState('');

  // Open detail modal for outfit
  const handleOpenDetail = (outfit: SavedOutfit) => {
    setSelectedOutfit(outfit);
    // If outfit has AI try on image, default to AI image view (index 1), else 2D (index 0)
    const hasAI = Boolean(outfit.tryOnImage || (outfit.tryOnImages && outfit.tryOnImages.length > 0));
    setActiveMediaIndex(hasAI ? 1 : 0);
    setIsEditingName(false);
    setEditNameText(outfit.name);
  };

  // Save rename
  const handleSaveRename = () => {
    if (selectedOutfit && editNameText.trim()) {
      onRenameOutfit(selectedOutfit.id, editNameText.trim());
      setSelectedOutfit({ ...selectedOutfit, name: editNameText.trim() });
    }
    setIsEditingName(false);
  };

  // Helper to get all media photos for an outfit
  const getOutfitMediaList = (outfit: SavedOutfit) => {
    const list: { id: string; label: string; type: '2d' | 'ai'; url: string }[] = [];
    
    // 1. 2D composite top piece or canvas
    list.push({
      id: '2d-studio',
      label: 'Bản phối 2D Studio',
      type: '2d',
      url: outfit.top.piece.assetUrl || (outfit.top.variant as Piece)?.assetUrl || '',
    });

    // 2. AI try on images
    if (outfit.tryOnImages && outfit.tryOnImages.length > 0) {
      outfit.tryOnImages.forEach((img, idx) => {
        list.push({
          id: `ai-${idx}`,
          label: `Ảnh AI Try-on #${idx + 1}`,
          type: 'ai',
          url: img,
        });
      });
    } else if (outfit.tryOnImage) {
      list.push({
        id: 'ai-default',
        label: 'Ảnh AI Try-on',
        type: 'ai',
        url: outfit.tryOnImage,
      });
    }

    return list;
  };

  // Format creation date and time: DD/MM/YYYY • HH:mm
  const formatCreationDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const day = date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const hasTime = dateStr.includes('T') || dateStr.includes(':');
      const time = hasTime
        ? date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })
        : '09:00';
      return `${day} • ${time}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-56px)] bg-lacquer text-silk-ivory font-sans pb-20">
      {/* 1. GUEST SESSION BANNER (Non-intrusive, allows full browsing) */}
      {!isLoggedIn && (
        <div className="w-full bg-lacquer-surface border-b border-imperial-gold/30 px-4 sm:px-6 lg:px-10 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-imperial-gold animate-ping" />
            <span className="text-silk-muted">
              Bạn đang ở chế độ xem tạm thời ({outfits.length} outfit đã lưu trong phiên).
            </span>
          </div>
          <button
            onClick={onLoginPrompt}
            className="px-4 py-1.5 bg-imperial-gold hover:bg-imperial-gold-light text-lacquer font-bold text-xs uppercase tracking-wider shadow transition-all whitespace-nowrap"
          >
            Đăng nhập để lưu vĩnh viễn
          </button>
        </div>
      )}

      {/* 2. GALLERY HERO HEADER (No separator) */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-6 sm:pt-8 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-silk-ivory tracking-tight">
              Bộ Sưu Tập Outfit
            </h1>
          </div>

          {/* Right Action: Create Lookbook */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {}}
              className="py-2.5 px-5 bg-gradient-to-r from-imperial-gold to-imperial-gold-light hover:brightness-105 text-lacquer font-bold text-xs sm:text-sm shadow-[0_4px_16px_rgba(212,175,55,0.25)] flex items-center gap-2 transition-all uppercase tracking-wider rounded-xl cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Tạo Lookbook</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. GALLERY OUTFITS GRID (Full Width, Uniform 9:16 Ratio, Compact Sizing) */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-3">
        {outfits.length === 0 ? (
          /* Empty State */
          <div className="text-center py-24 p-8 rounded-2xl bg-lacquer-surface/40 border border-lacquer-border">
            <Layers className="w-16 h-16 text-silk-muted mx-auto mb-4 opacity-30" />
            <h3 className="font-serif font-bold text-2xl text-silk-ivory mb-2">
              Chưa có outfit nào trong bộ sưu tập
            </h3>
            <p className="text-sm text-silk-muted max-w-sm mx-auto mb-6 leading-relaxed">
              Hãy quay lại Studio để bắt đầu phối bộ xiêm y cổ phong đầu tiên của bạn!
            </p>
            <button
              onClick={onOpenStudio}
              className="py-3 px-6 rounded-xl bg-imperial-gold text-lacquer font-bold text-xs uppercase tracking-wider hover:bg-imperial-gold-light shadow-lg transition-all"
            >
              Mở Studio Phối Đồ Ngay
            </button>
          </div>
        ) : (
          /* Responsive Grid with Compact Uniform 9:16 Cards (5-7 cards per row on larger screens) */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3.5 sm:gap-4.5">
            {outfits.map((outfit) => {
              const hasAIImage = Boolean(outfit.tryOnImage || (outfit.tryOnImages && outfit.tryOnImages.length > 0));

              return (
                <div
                  key={outfit.id}
                  onClick={() => handleOpenDetail(outfit)}
                  className="group relative rounded-xl sm:rounded-2xl overflow-hidden border border-lacquer-border/80 hover:border-imperial-gold/70 bg-lacquer-surface shadow-md hover:shadow-[0_16px_36px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer"
                >
                  {/* Photo Canvas Container with uniform 9:16 aspect ratio */}
                  <div className="relative w-full aspect-[9/16] overflow-hidden bg-lacquer-card">
                    {hasAIImage ? (
                      /* AI Try-on Photo */
                      <div className="relative w-full h-full overflow-hidden">
                        <img
                          src={outfit.tryOnImage || (outfit.tryOnImages && outfit.tryOnImages[0])}
                          alt={outfit.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      </div>
                    ) : (
                      /* Full Mannequin Composite Stage */
                      <OutfitMannequinComposite outfit={outfit} />
                    )}

                    {/* MINIMAL BOTTOM OVERLAY: Only Date and Time of Creation */}
                    <div className="absolute bottom-0 inset-x-0 z-20 py-2 sm:py-2.5 px-2 bg-gradient-to-t from-black/80 via-black/35 to-transparent flex items-center justify-center text-center pointer-events-none">
                      <span className="text-[10px] sm:text-[11px] text-silk-ivory/85 font-mono tracking-wider">
                        {formatCreationDateTime(outfit.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. THE OUTFIT DETAIL MODAL (Opens when clicking any card) */}
      {selectedOutfit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedOutfit(null)}
        >
          {/* Modal Container */}
          <div
            className="w-full max-w-5xl max-h-[92vh] bg-lacquer-surface border-2 border-imperial-gold shadow-[0_24px_64px_rgba(0,0,0,0.95)] rounded-2xl flex flex-col lg:flex-row overflow-hidden animate-in zoom-in-95 duration-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedOutfit(null)}
              className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-imperial-gold text-silk-muted hover:text-lacquer flex items-center justify-center border border-white/20 transition-all shadow-lg"
              title="Đóng cửa sổ"
            >
              <X className="w-4 h-4" />
            </button>

            {/* LEFT SIDE: Media Visual Stage (60%) */}
            <div className="w-full lg:w-[58%] bg-lacquer-card flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-lacquer-border/80 relative overflow-hidden">
              {/* Media Display Canvas */}
              <div className="relative flex-1 min-h-[340px] sm:min-h-[440px] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-lacquer to-lacquer-surface overflow-hidden">
                {/* The Active Media */}
                {(() => {
                  const mediaList = getOutfitMediaList(selectedOutfit);
                  const activeMedia = mediaList[activeMediaIndex] || mediaList[0];
                  if (activeMedia?.type === '2d') {
                    return <OutfitMannequinComposite outfit={selectedOutfit} isModal={true} />;
                  }
                  return (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={activeMedia?.url}
                        alt={selectedOutfit.name}
                        className="relative z-10 max-h-[460px] max-w-full rounded-xl object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.9)]"
                      />
                    </div>
                  );
                })()}

                {/* Floating badge for active media */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-imperial-gold border border-imperial-gold/40 shadow">
                    {selectedOutfit.event.name}
                  </span>
                </div>
              </div>

              {/* Media Switcher Thumbnails Bar (If multiple media exist) */}
              {(() => {
                const mediaList = getOutfitMediaList(selectedOutfit);
                if (mediaList.length <= 1) return null;
                return (
                  <div className="p-3 bg-lacquer/90 border-t border-lacquer-border flex items-center gap-2.5 overflow-x-auto">
                    <span className="text-[10px] text-silk-muted uppercase tracking-wider font-bold ml-1">
                      Ảnh ({mediaList.length}):
                    </span>
                    {mediaList.map((media, idx) => (
                      <button
                        key={media.id}
                        onClick={() => setActiveMediaIndex(idx)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          activeMediaIndex === idx
                            ? 'bg-imperial-gold text-lacquer border-imperial-gold font-bold shadow-md'
                            : 'bg-lacquer-surface border-lacquer-border text-silk-muted hover:text-silk-ivory hover:border-imperial-gold/40'
                        }`}
                      >
                        {media.type === 'ai' ? <Sparkles className="w-3 h-3 text-amber-300" /> : <Layers className="w-3 h-3" />}
                        <span>{media.label}</span>
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* RIGHT SIDE: Dossier & Pieces Breakdown (42%) */}
            <div className="w-full lg:w-[42%] flex flex-col justify-between p-6 sm:p-7 overflow-y-auto max-h-[90vh]">
              <div className="space-y-6">
                {/* 1. Header: Editable Outfit Title & Date */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-imperial-gold">
                      Hồ Sơ Trang Phục
                    </span>
                    <span className="text-xs text-silk-muted flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{selectedOutfit.createdAt}</span>
                    </span>
                  </div>

                  {isEditingName ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={editNameText}
                        onChange={(e) => setEditNameText(e.target.value)}
                        className="flex-1 bg-lacquer border border-imperial-gold px-3 py-1.5 text-base font-serif text-silk-ivory focus:outline-none rounded-md"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveRename}
                        className="p-2 bg-imperial-gold text-lacquer hover:bg-imperial-gold-light rounded-md"
                        title="Lưu tên mới"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group/edit">
                      <h2 className="font-serif font-extrabold text-2xl text-silk-ivory tracking-tight">
                        {selectedOutfit.name}
                      </h2>
                      <button
                        onClick={() => {
                          setIsEditingName(true);
                          setEditNameText(selectedOutfit.name);
                        }}
                        className="text-silk-muted hover:text-imperial-gold opacity-0 group-hover/edit:opacity-100 transition-opacity p-1"
                        title="Đổi tên bộ trang phục"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-silk-muted mt-1">
                    Bối cảnh phục sức: <strong className="text-silk-ivory">{selectedOutfit.event.name}</strong> • Giới tính:{' '}
                    <strong className="text-silk-ivory">{selectedOutfit.gender === 'women' ? 'Nữ' : 'Nam'}</strong>
                  </p>
                </div>

                {/* 2. PIECES BREAKDOWN (Bóc tách từng món đồ) */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-imperial-gold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Cấu Thành Phục Sức ({selectedOutfit.accessory ? '4' : '3'} món)</span>
                  </h4>

                  <div className="space-y-2">
                    {/* Áo */}
                    <div className="p-2.5 rounded-xl bg-lacquer/80 border border-lacquer-border flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-lacquer-surface border border-imperial-gold/30 p-1 flex items-center justify-center flex-shrink-0">
                        <img
                          src={selectedOutfit.top.piece.thumbnailUrl || selectedOutfit.top.piece.assetUrl}
                          alt={selectedOutfit.top.piece.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-imperial-gold uppercase font-bold tracking-wider">Áo</span>
                          {selectedOutfit.top.piece.culturalInfo && (
                            <span className="text-[9px] text-silk-muted">
                              {selectedOutfit.top.piece.culturalInfo.period.split('(')[0]}
                            </span>
                          )}
                        </div>
                        <h5 className="font-bold text-xs sm:text-sm text-silk-ivory truncate">
                          {selectedOutfit.top.piece.name}
                        </h5>
                      </div>
                    </div>

                    {/* Quần */}
                    <div className="p-2.5 rounded-xl bg-lacquer/80 border border-lacquer-border flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-lacquer-surface border border-imperial-gold/30 p-1 flex items-center justify-center flex-shrink-0">
                        <img
                          src={selectedOutfit.bottom.piece.thumbnailUrl || selectedOutfit.bottom.piece.assetUrl}
                          alt={selectedOutfit.bottom.piece.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-imperial-gold uppercase font-bold tracking-wider">Quần / Váy</span>
                          {selectedOutfit.bottom.piece.culturalInfo && (
                            <span className="text-[9px] text-silk-muted">
                              {selectedOutfit.bottom.piece.culturalInfo.period.split('(')[0]}
                            </span>
                          )}
                        </div>
                        <h5 className="font-bold text-xs sm:text-sm text-silk-ivory truncate">
                          {selectedOutfit.bottom.piece.name}
                        </h5>
                      </div>
                    </div>

                    {/* Giày */}
                    <div className="p-2.5 rounded-xl bg-lacquer/80 border border-lacquer-border flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-lacquer-surface border border-imperial-gold/30 p-1 flex items-center justify-center flex-shrink-0">
                        <img
                          src={selectedOutfit.footwear.piece.thumbnailUrl || selectedOutfit.footwear.piece.assetUrl}
                          alt={selectedOutfit.footwear.piece.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-imperial-gold uppercase font-bold tracking-wider">Giày / Dép</span>
                          {selectedOutfit.footwear.piece.culturalInfo && (
                            <span className="text-[9px] text-silk-muted">
                              {selectedOutfit.footwear.piece.culturalInfo.period.split('(')[0]}
                            </span>
                          )}
                        </div>
                        <h5 className="font-bold text-xs sm:text-sm text-silk-ivory truncate">
                          {selectedOutfit.footwear.piece.name}
                        </h5>
                      </div>
                    </div>

                    {/* Phụ kiện (nếu có) */}
                    {selectedOutfit.accessory && (
                      <div className="p-2.5 rounded-xl bg-lacquer/80 border border-lacquer-border flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-lacquer-surface border border-imperial-gold/30 p-1 flex items-center justify-center flex-shrink-0">
                          <img
                            src={selectedOutfit.accessory.piece.thumbnailUrl || selectedOutfit.accessory.piece.assetUrl}
                            alt={selectedOutfit.accessory.piece.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-imperial-gold uppercase font-bold tracking-wider block">Phụ kiện</span>
                          <h5 className="font-bold text-xs sm:text-sm text-silk-ivory truncate">
                            {selectedOutfit.accessory.piece.name}
                          </h5>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Đánh giá văn hóa (Bé Nghê Cung Đình) */}
                {selectedOutfit.aiAnalysis && (
                  <div className="p-3.5 rounded-xl bg-lacquer/90 border border-imperial-gold/40 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-imperial-gold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-imperial-gold" />
                        <span>Nhận Xét Điển Lễ</span>
                      </span>
                      <span className="text-xs font-serif font-bold px-2 py-0.5 rounded-md bg-imperial-gold/20 text-imperial-gold border border-imperial-gold/40">
                        ★ {selectedOutfit.aiAnalysis.totalScore}/10
                      </span>
                    </div>
                    <p className="font-serif italic text-xs text-silk-ivory leading-relaxed">
                      "{selectedOutfit.aiAnalysis.mascotQuote || selectedOutfit.aiAnalysis.explanation}"
                    </p>
                  </div>
                )}
              </div>

              {/* 4. Action Buttons at bottom of modal */}
              <div className="pt-6 border-t border-lacquer-border flex flex-col sm:flex-row items-center gap-3 mt-6">
                <button
                  onClick={() => {
                    onLoadOutfitIntoStudio(selectedOutfit);
                    setSelectedOutfit(null);
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-imperial-gold to-imperial-gold-light hover:brightness-105 text-lacquer font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Mở Trong Studio (Remix)</span>
                </button>

                <button
                  onClick={() => {
                    const idToDelete = selectedOutfit.id;
                    setSelectedOutfit(null);
                    onDeleteOutfit(idToDelete);
                  }}
                  className="py-3 px-4 rounded-xl bg-lacquer hover:bg-rose-950/60 border border-lacquer-border hover:border-rose-500/50 text-silk-muted hover:text-rose-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  title="Xóa bộ trang phục này"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
