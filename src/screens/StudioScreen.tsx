import React, { useState } from 'react';
import { StudioCanvas2D } from '../components/StudioCanvas2D';
import { PieceSelector } from '../components/PieceSelector';
import { CulturalMascot } from '../components/CulturalMascot';
import { AITryOnModal } from '../components/AITryOnModal';
import { CustomEventModal } from '../components/CustomEventModal';
import { PIECES, EVENTS, PRESET_OUTFITS } from '../data/catalog';
import {
  ActiveOutfitState,
  Piece,
  PieceVariant,
  PieceCategory,
  StyleFilter,
  PresetOutfit,
  EventBackground,
  GenderSelection,
} from '../types';

interface StudioScreenProps {
  outfit: ActiveOutfitState;
  setOutfit: React.Dispatch<React.SetStateAction<ActiveOutfitState>>;
  isLoggedIn: boolean;
  onLoginPrompt: () => void;
  onSaveOutfit: () => void;
  onSaveTryOnToLookbook: (tryOnImgUrl: string) => void;
}

export const StudioScreen: React.FC<StudioScreenProps> = ({
  outfit,
  setOutfit,
  isLoggedIn,
  onLoginPrompt,
  onSaveOutfit,
  onSaveTryOnToLookbook,
}) => {
  const [activeCategory, setActiveCategory] = useState<PieceCategory | 'presets'>('top');
  const [isTryOnModalOpen, setIsTryOnModalOpen] = useState(false);
  const [isCustomEventModalOpen, setIsCustomEventModalOpen] = useState(false);
  const [allEvents, setAllEvents] = useState<EventBackground[]>(EVENTS);

  // Check if outfit has required 3 pieces (Top, Bottom, Footwear)
  const canTryOn = Boolean(
    (outfit.topPiece || outfit.topVariant) &&
    (outfit.bottomPiece || outfit.bottomVariant) &&
    (outfit.footwearPiece || outfit.footwearVariant)
  );

  // Switch Mannequin Gender (Chuyển đổi ma-nơ-canh & tự động cập nhật đồ phù hợp)
  const handleSelectGender = (gender: GenderSelection) => {
    if (gender === outfit.mannequinGender) return;

    // Kiểm tra xem trang phục hiện tại có chứa món không tương thích với giới tính mới không
    const isTopIncompatible = outfit.topPiece && outfit.topPiece.gender !== gender && outfit.topPiece.gender !== 'unisex';
    const isBottomIncompatible = outfit.bottomPiece && outfit.bottomPiece.gender !== gender && outfit.bottomPiece.gender !== 'unisex';
    const isFootwearIncompatible = outfit.footwearPiece && outfit.footwearPiece.gender !== gender && outfit.footwearPiece.gender !== 'unisex';
    const isAccessoryIncompatible = outfit.accessoryPiece && outfit.accessoryPiece.gender !== gender && outfit.accessoryPiece.gender !== 'unisex';

    // Nếu trang phục hiện tại không tương thích, tự động nạp preset chuẩn mặc định của giới tính đó
    if (isTopIncompatible || isBottomIncompatible || isFootwearIncompatible || !outfit.topPiece) {
      const defaultPreset = PRESET_OUTFITS.find((p) => p.gender === gender);
      if (defaultPreset) {
        handleSelectPreset(defaultPreset);
        return;
      }
    }

    setOutfit((prev) => ({
      ...prev,
      mannequinGender: gender,
      accessoryPiece: isAccessoryIncompatible ? undefined : prev.accessoryPiece,
      accessoryVariant: isAccessoryIncompatible ? undefined : prev.accessoryVariant,
    }));
  };

  // Switch Event
  const handleSelectEvent = (event: EventBackground) => {
    setOutfit((prev) => ({ ...prev, event }));
  };

  // Switch Style
  const handleSelectStyle = (styleFilter: StyleFilter) => {
    setOutfit((prev) => ({ ...prev, styleFilter }));
  };

  // Select Piece directly
  const handleSelectPiece = (piece: Piece) => {
    setOutfit((prev) => {
      switch (piece.category) {
        case 'top':
          return { ...prev, topPiece: piece, topVariant: piece };
        case 'bottom':
          return { ...prev, bottomPiece: piece, bottomVariant: piece };
        case 'footwear':
          return { ...prev, footwearPiece: piece, footwearVariant: piece };
        case 'accessory':
          return { ...prev, accessoryPiece: piece, accessoryVariant: piece };
        default:
          return prev;
      }
    });
  };

  // Clear piece by category
  const handleClearCategory = (category: PieceCategory) => {
    setOutfit((prev) => {
      switch (category) {
        case 'top':
          return { ...prev, topPiece: undefined, topVariant: undefined };
        case 'bottom':
          return { ...prev, bottomPiece: undefined, bottomVariant: undefined };
        case 'footwear':
          return { ...prev, footwearPiece: undefined, footwearVariant: undefined };
        case 'accessory':
          return { ...prev, accessoryPiece: undefined, accessoryVariant: undefined };
        default:
          return prev;
      }
    });
  };

  // Clear accessory (shortcut)
  const handleClearAccessory = () => handleClearCategory('accessory');

  // Load Preset Outfit
  const handleSelectPreset = (preset: PresetOutfit) => {
    const topPiece = PIECES.find((p) => p.id === preset.topPieceId);
    const bottomPiece = PIECES.find((p) => p.id === preset.bottomPieceId);
    const footwearPiece = PIECES.find((p) => p.id === preset.footwearPieceId);
    const accessoryPiece = preset.accessoryPieceId ? PIECES.find((p) => p.id === preset.accessoryPieceId) : undefined;
    const event = allEvents.find((e) => e.id === preset.eventId) || allEvents[0];

    setOutfit((prev) => ({
      ...prev,
      topPiece,
      topVariant: topPiece,
      bottomPiece,
      bottomVariant: bottomPiece,
      footwearPiece,
      footwearVariant: footwearPiece,
      accessoryPiece,
      accessoryVariant: accessoryPiece,
      event,
      mannequinGender: preset.gender,
    }));
  };

  // Add custom AI generated event
  const handleEventCreated = (newEvent: EventBackground) => {
    setAllEvents((prev) => [newEvent, ...prev]);
    setOutfit((prev) => ({ ...prev, event: newEvent }));
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-col lg:flex-row overflow-hidden bg-lacquer">
      {/* LEFT COLUMN: 1:1 Square Preview Stage */}
      <div className="w-full h-[50vh] lg:h-full lg:w-auto lg:aspect-square relative overflow-hidden flex-shrink-0 flex items-center justify-center bg-lacquer-surface">
        <StudioCanvas2D
          outfit={outfit}
          allEvents={allEvents}
          onSelectEvent={handleSelectEvent}
          onSelectGender={handleSelectGender}
          onOpenCustomEventModal={() => {
            if (!isLoggedIn) {
              onLoginPrompt();
            } else {
              setIsCustomEventModalOpen(true);
            }
          }}
          onTryOn={() => setIsTryOnModalOpen(true)}
          onSaveOutfit={onSaveOutfit}
          isLoggedIn={isLoggedIn}
          canTryOn={canTryOn}
          onLoginPrompt={onLoginPrompt}
        />
      </div>

      {/* RIGHT COLUMN: Docked Pieces Selector + Integrated AI Overview with Maximum Space */}
      <div className="flex-1 min-w-0 h-full flex flex-col border-t lg:border-t-0 lg:border-l border-lacquer-border bg-lacquer-card overflow-hidden relative">
        {/* Top: Piece Selector with Category Tabs and Swatches */}
        <PieceSelector
          pieces={PIECES.filter(
            (p) => p.gender === outfit.mannequinGender || p.gender === 'unisex'
          )}
          presets={PRESET_OUTFITS.filter(
            (pr) => pr.gender === outfit.mannequinGender
          )}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          styleFilter={outfit.styleFilter}
          onSelectStyle={handleSelectStyle}
          selectedPieces={{
            top: outfit.topPiece || outfit.topVariant,
            bottom: outfit.bottomPiece || outfit.bottomVariant,
            footwear: outfit.footwearPiece || outfit.footwearVariant,
            accessory: outfit.accessoryPiece || outfit.accessoryVariant,
          }}
          onSelectPiece={handleSelectPiece}
          onSelectVariant={handleSelectPiece}
          onClearAccessory={handleClearAccessory}
          onClearCategory={handleClearCategory}
          onSelectPreset={handleSelectPreset}
        />
      </div>

      {/* Floating Free-Draggable Cultural Mascot (Bé Nghê Cung Đình - chỉ hiển thị cho thành viên đã đăng nhập) */}
      {isLoggedIn && (
        <CulturalMascot
          outfit={outfit}
          isLoggedIn={isLoggedIn}
          onLoginPrompt={onLoginPrompt}
        />
      )}

      {/* Modals */}
      <AITryOnModal
        isOpen={isTryOnModalOpen}
        onClose={() => setIsTryOnModalOpen(false)}
        outfit={outfit}
        onSaveToLookbook={onSaveTryOnToLookbook}
        isLoggedIn={isLoggedIn}
        onLoginPrompt={onLoginPrompt}
      />

      <CustomEventModal
        isOpen={isCustomEventModalOpen}
        onClose={() => setIsCustomEventModalOpen(false)}
        onEventCreated={handleEventCreated}
      />
    </div>
  );
};
