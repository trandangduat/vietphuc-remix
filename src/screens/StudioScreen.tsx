import React, { useState } from 'react';
import { StudioCanvas2D } from '../components/StudioCanvas2D';
import { PieceSelector } from '../components/PieceSelector';
import { AIOverviewCard } from '../components/AIOverviewCard';
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
  const canTryOn = Boolean(outfit.topVariant && outfit.bottomVariant && outfit.footwearVariant);

  // Switch Mannequin Gender
  const handleSelectGender = (gender: GenderSelection) => {
    setOutfit((prev) => ({ ...prev, mannequinGender: gender }));
  };

  // Switch Event
  const handleSelectEvent = (event: EventBackground) => {
    setOutfit((prev) => ({ ...prev, event }));
  };

  // Switch Style
  const handleSelectStyle = (styleFilter: StyleFilter) => {
    setOutfit((prev) => ({ ...prev, styleFilter }));
  };

  // Select Piece Variant (from swatches)
  const handleSelectVariant = (piece: Piece, variant: PieceVariant) => {
    setOutfit((prev) => {
      switch (piece.category) {
        case 'top':
          return { ...prev, topPiece: piece, topVariant: variant };
        case 'bottom':
          return { ...prev, bottomPiece: piece, bottomVariant: variant };
        case 'footwear':
          return { ...prev, footwearPiece: piece, footwearVariant: variant };
        case 'accessory':
          return { ...prev, accessoryPiece: piece, accessoryVariant: variant };
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
    const topVariant = topPiece?.variants.find((v) => v.variantId === preset.topVariantId);

    const bottomPiece = PIECES.find((p) => p.id === preset.bottomPieceId);
    const bottomVariant = bottomPiece?.variants.find((v) => v.variantId === preset.bottomVariantId);

    const footwearPiece = PIECES.find((p) => p.id === preset.footwearPieceId);
    const footwearVariant = footwearPiece?.variants.find((v) => v.variantId === preset.footwearVariantId);

    const accessoryPiece = preset.accessoryPieceId ? PIECES.find((p) => p.id === preset.accessoryPieceId) : undefined;
    const accessoryVariant = accessoryPiece?.variants.find((v) => v.variantId === preset.accessoryVariantId);

    const event = allEvents.find((e) => e.id === preset.eventId) || allEvents[0];

    setOutfit((prev) => ({
      ...prev,
      topPiece,
      topVariant,
      bottomPiece,
      bottomVariant,
      footwearPiece,
      footwearVariant,
      accessoryPiece,
      accessoryVariant,
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
      {/* LEFT COLUMN: Full Height 2D Canvas Stage with All Overlaid Controls */}
      <div className="w-full lg:w-1/2 xl:w-[52%] h-full relative overflow-hidden flex-shrink-0">
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
        />
      </div>

      {/* RIGHT COLUMN: Docked Pieces Selector + Integrated AI Overview with Zero Container Padding & Zero Gap */}
      <div className="w-full lg:w-1/2 xl:w-[48%] h-full flex flex-col border-t lg:border-t-0 lg:border-l border-lacquer-border bg-lacquer-card overflow-hidden">
        {/* Top: Piece Selector with Category Tabs and Swatches */}
        <PieceSelector
          pieces={PIECES}
          presets={PRESET_OUTFITS}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          styleFilter={outfit.styleFilter}
          onSelectStyle={handleSelectStyle}
          selectedPieces={{
            top: outfit.topVariant,
            bottom: outfit.bottomVariant,
            footwear: outfit.footwearVariant,
            accessory: outfit.accessoryVariant,
          }}
          onSelectVariant={handleSelectVariant}
          onClearAccessory={handleClearAccessory}
          onClearCategory={handleClearCategory}
          onSelectPreset={handleSelectPreset}
        />

        {/* Bottom: Docked AI Overview with Zero Gap */}
        <AIOverviewCard
          outfit={outfit}
          isLoggedIn={isLoggedIn}
          onLoginPrompt={onLoginPrompt}
        />
      </div>

      {/* Modals */}
      <AITryOnModal
        isOpen={isTryOnModalOpen}
        onClose={() => setIsTryOnModalOpen(false)}
        outfit={outfit}
        onSaveToLookbook={onSaveTryOnToLookbook}
      />

      <CustomEventModal
        isOpen={isCustomEventModalOpen}
        onClose={() => setIsCustomEventModalOpen(false)}
        onEventCreated={handleEventCreated}
      />
    </div>
  );
};
