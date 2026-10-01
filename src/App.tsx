import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingScreen } from './screens/LandingScreen';
import { StudioScreen } from './screens/StudioScreen';
import { LookbookScreen } from './screens/LookbookScreen';
import { PIECES, EVENTS, PRESET_OUTFITS } from './data/catalog';
import {
  ActiveOutfitState,
  SavedOutfit,
  PresetOutfit,
  EventBackground,
} from './types';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'studio' | 'lookbook'>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMigrateModal, setShowMigrateModal] = useState(false);

  // Initial active outfit state
  const initialTop = PIECES.find((p) => p.id === 'piece-ao-tac');
  const initialTopVariant = initialTop?.variants[0];

  const initialBottom = PIECES.find((p) => p.id === 'piece-quan-lua');
  const initialBottomVariant = initialBottom?.variants[0];

  const initialFootwear = PIECES.find((p) => p.id === 'piece-hai-nhung');
  const initialFootwearVariant = initialFootwear?.variants[0];

  const initialAccessory = PIECES.find((p) => p.id === 'piece-non-la');
  const initialAccessoryVariant = initialAccessory?.variants[0];

  const [activeOutfit, setActiveOutfit] = useState<ActiveOutfitState>({
    topPiece: initialTop,
    topVariant: initialTopVariant,
    bottomPiece: initialBottom,
    bottomVariant: initialBottomVariant,
    footwearPiece: initialFootwear,
    footwearVariant: initialFootwearVariant,
    accessoryPiece: initialAccessory,
    accessoryVariant: initialAccessoryVariant,
    event: EVENTS[0],
    mannequinGender: 'women',
    styleFilter: 'all',
  });

  // Saved outfits (starts with 1 initial sample in lookbook for exploration)
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([
    {
      id: 'outfit-default-1',
      name: 'Lễ Hội Cung Đình Huế',
      createdAt: '2026-10-01',
      gender: 'women',
      top: { piece: initialTop!, variant: initialTopVariant! },
      bottom: { piece: initialBottom!, variant: initialBottomVariant! },
      footwear: { piece: initialFootwear!, variant: initialFootwearVariant! },
      accessory: { piece: initialAccessory!, variant: initialAccessoryVariant! },
      event: EVENTS[0],
      aiAnalysis: {
        totalScore: 9.6,
        criteria: {
          colorHarmony: { name: 'Hài hòa màu sắc', score: 9.5, maxScore: 10, comment: 'Tương phản Đỏ gấm và Lụa trắng ngà hoàng tộc.' },
          eventFit: { name: 'Phù hợp sự kiện', score: 10.0, maxScore: 10, comment: 'Tuyệt đối trang nghiêm trong không khí Tết cổ truyền.' },
          culturalNorm: { name: 'Chuẩn mực lễ nghi', score: 9.3, maxScore: 10, comment: 'Đoan chính, tôn ti trật tự theo điển lễ triều Nguyễn.' }
        },
        colorHarmony: 'Tương phản Đỏ gấm và Lụa trắng ngà hoàng tộc.',
        eventFit: 'Tuyệt đối trang nghiêm trong không khí Tết cổ truyền.',
        culturalStatus: 'suitable',
        explanation: 'Bộ lễ phục áo tấc đi cùng quần lụa trắng và hài thêu thể hiện trọn vẹn nét trang trọng truyền thống của phụ nữ Việt.',
        source: 'Bảo tàng Lịch sử Quốc gia',
      },
    },
  ]);

  // Session outfits (saved when guest)
  const [sessionOutfits, setSessionOutfits] = useState<SavedOutfit[]>([]);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Save active outfit
  const handleSaveOutfit = () => {
    if (!activeOutfit.topPiece || !activeOutfit.topVariant || !activeOutfit.bottomPiece || !activeOutfit.bottomVariant || !activeOutfit.footwearPiece || !activeOutfit.footwearVariant) {
      showToast('⚠️ Vui lòng chọn đủ Áo, Quần và Giày để hoàn tất outfit!');
      return;
    }

    const newSaved: SavedOutfit = {
      id: `outfit-${Date.now()}`,
      name: `${activeOutfit.topPiece.name} • ${activeOutfit.event.name}`,
      createdAt: new Date().toISOString().split('T')[0],
      gender: activeOutfit.mannequinGender,
      top: { piece: activeOutfit.topPiece, variant: activeOutfit.topVariant },
      bottom: { piece: activeOutfit.bottomPiece, variant: activeOutfit.bottomVariant },
      footwear: { piece: activeOutfit.footwearPiece, variant: activeOutfit.footwearVariant },
      accessory: activeOutfit.accessoryPiece && activeOutfit.accessoryVariant ? { piece: activeOutfit.accessoryPiece, variant: activeOutfit.accessoryVariant } : undefined,
      event: activeOutfit.event,
    };

    if (isLoggedIn) {
      setSavedOutfits((prev) => [newSaved, ...prev]);
      showToast('✨ Đã lưu outfit thành công vào Lookbook cá nhân!');
    } else {
      setSessionOutfits((prev) => [newSaved, ...prev]);
      showToast('📌 Đã lưu tạm outfit vào phiên làm việc hiện tại!');
    }
  };

  // Save AI Try-on image into Lookbook
  const handleSaveTryOnToLookbook = (tryOnImgUrl: string) => {
    if (!activeOutfit.topPiece || !activeOutfit.topVariant || !activeOutfit.bottomPiece || !activeOutfit.bottomVariant || !activeOutfit.footwearPiece || !activeOutfit.footwearVariant) return;

    const tryOnOutfit: SavedOutfit = {
      id: `outfit-tryon-${Date.now()}`,
      name: `AI Try on: ${activeOutfit.topPiece.name}`,
      createdAt: new Date().toISOString().split('T')[0],
      gender: activeOutfit.mannequinGender,
      top: { piece: activeOutfit.topPiece, variant: activeOutfit.topVariant },
      bottom: { piece: activeOutfit.bottomPiece, variant: activeOutfit.bottomVariant },
      footwear: { piece: activeOutfit.footwearPiece, variant: activeOutfit.footwearVariant },
      accessory: activeOutfit.accessoryPiece && activeOutfit.accessoryVariant ? { piece: activeOutfit.accessoryPiece, variant: activeOutfit.accessoryVariant } : undefined,
      event: activeOutfit.event,
      tryOnImage: tryOnImgUrl,
    };

    setSavedOutfits((prev) => [tryOnOutfit, ...prev]);
    showToast('✨ Ảnh AI Try on đã được lưu vào Lookbook cá nhân!');
  };

  // Load a saved outfit into studio for editing / remixing
  const handleLoadOutfitIntoStudio = (saved: SavedOutfit) => {
    setActiveOutfit({
      topPiece: saved.top.piece,
      topVariant: saved.top.variant,
      bottomPiece: saved.bottom.piece,
      bottomVariant: saved.bottom.variant,
      footwearPiece: saved.footwear.piece,
      footwearVariant: saved.footwear.variant,
      accessoryPiece: saved.accessory?.piece,
      accessoryVariant: saved.accessory?.variant,
      event: saved.event,
      mannequinGender: saved.gender,
      styleFilter: 'all',
    });
    setCurrentScreen('studio');
    showToast(`✨ Đã nạp "${saved.name}" vào Studio!`);
  };

  // Open Studio from landing with optional preset or event
  const handleOpenStudio = (preset?: PresetOutfit, event?: EventBackground) => {
    if (preset) {
      const topPiece = PIECES.find((p) => p.id === preset.topPieceId);
      const topVariant = topPiece?.variants.find((v) => v.variantId === preset.topVariantId);

      const bottomPiece = PIECES.find((p) => p.id === preset.bottomPieceId);
      const bottomVariant = bottomPiece?.variants.find((v) => v.variantId === preset.bottomVariantId);

      const footwearPiece = PIECES.find((p) => p.id === preset.footwearPieceId);
      const footwearVariant = footwearPiece?.variants.find((v) => v.variantId === preset.footwearVariantId);

      const accessoryPiece = preset.accessoryPieceId ? PIECES.find((p) => p.id === preset.accessoryPieceId) : undefined;
      const accessoryVariant = accessoryPiece?.variants.find((v) => v.variantId === preset.accessoryVariantId);

      const presetEvent = EVENTS.find((e) => e.id === preset.eventId) || EVENTS[0];

      setActiveOutfit({
        topPiece,
        topVariant,
        bottomPiece,
        bottomVariant,
        footwearPiece,
        footwearVariant,
        accessoryPiece,
        accessoryVariant,
        event: presetEvent,
        mannequinGender: preset.gender,
        styleFilter: 'all',
      });
    } else if (event) {
      setActiveOutfit((prev) => ({ ...prev, event }));
    }
    setCurrentScreen('studio');
  };

  // Toggle Auth with session migration detection (FR-02)
  const handleToggleAuth = () => {
    if (!isLoggedIn) {
      if (sessionOutfits.length > 0) {
        setShowMigrateModal(true);
      } else {
        setIsLoggedIn(true);
        showToast('Chào mừng bạn quay lại, Minh Anh!');
      }
    } else {
      setIsLoggedIn(false);
      showToast('Đã đăng xuất. Bạn đang ở chế độ Khách.');
    }
  };

  const handleConfirmMigration = (migrate: boolean) => {
    setIsLoggedIn(true);
    if (migrate && sessionOutfits.length > 0) {
      setSavedOutfits((prev) => [...sessionOutfits, ...prev]);
      setSessionOutfits([]);
      showToast(`Đã chuyển thành công ${sessionOutfits.length} outfit vào Lookbook!`);
    } else {
      showToast('Đăng nhập thành công!');
    }
    setShowMigrateModal(false);
  };

  const currentDisplayOutfits = isLoggedIn ? savedOutfits : sessionOutfits;

  return (
    <div className="min-h-screen flex flex-col bg-lacquer text-silk-ivory">
      {/* Global Navbar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        sessionCount={isLoggedIn ? savedOutfits.length : sessionOutfits.length}
        isLoggedIn={isLoggedIn}
        onToggleAuth={handleToggleAuth}
      />

      {/* Screen Routing */}
      <main className="flex-1 flex flex-col">
        {currentScreen === 'landing' && (
          <LandingScreen onOpenStudio={handleOpenStudio} />
        )}

        {currentScreen === 'studio' && (
          <StudioScreen
            outfit={activeOutfit}
            setOutfit={setActiveOutfit}
            isLoggedIn={isLoggedIn}
            onLoginPrompt={() => handleToggleAuth()}
            onSaveOutfit={handleSaveOutfit}
            onSaveTryOnToLookbook={handleSaveTryOnToLookbook}
          />
        )}

        {currentScreen === 'lookbook' && (
          <LookbookScreen
            outfits={currentDisplayOutfits}
            isLoggedIn={isLoggedIn}
            onLoginPrompt={() => handleToggleAuth()}
            onLoadOutfitIntoStudio={handleLoadOutfitIntoStudio}
            onDeleteOutfit={(id) => {
              if (isLoggedIn) {
                setSavedOutfits((prev) => prev.filter((o) => o.id !== id));
              } else {
                setSessionOutfits((prev) => prev.filter((o) => o.id !== id));
              }
              showToast('Đã xóa outfit');
            }}
            onRenameOutfit={(id, newName) => {
              setSavedOutfits((prev) =>
                prev.map((o) => (o.id === id ? { ...o, name: newName } : o))
              );
            }}
            onOpenStudio={() => setCurrentScreen('studio')}
          />
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 py-3.5 px-6 rounded-none bg-lacquer-card border-2 border-imperial-gold shadow-2xl text-sm font-bold text-silk-ivory flex items-center gap-2.5 font-sans animate-bounce">
          <Sparkles className="w-5 h-5 text-imperial-gold" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Session Migration Dialog (FR-02 & AC-08) */}
      {showMigrateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lacquer/90 backdrop-blur-md font-sans">
          <div className="max-w-md w-full bg-lacquer-card border-2 border-imperial-gold rounded-none p-7 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-none bg-imperial-gold/20 text-imperial-gold flex items-center justify-center mx-auto mb-4 border border-imperial-gold/40">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-silk-ivory mb-2">
              Đồng bộ trang phục vào Lookbook?
            </h3>
            <p className="text-sm text-silk-muted leading-relaxed mb-6">
              Bạn đang có <strong className="text-imperial-gold font-bold">{sessionOutfits.length} bộ trang phục</strong> đã phối trong phiên làm việc này. Bạn có muốn chuyển các bộ trang phục này vào Lookbook cá nhân vĩnh viễn không?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleConfirmMigration(false)}
                className="py-3 px-4 rounded-none bg-lacquer-surface border-2 border-lacquer-border text-xs sm:text-sm font-bold text-silk-muted hover:text-silk-ivory uppercase tracking-wider"
              >
                Bỏ qua
              </button>
              <button
                onClick={() => handleConfirmMigration(true)}
                className="py-3 px-4 rounded-none bg-imperial-gold text-lacquer font-bold text-xs sm:text-sm hover:bg-imperial-gold-light shadow-md uppercase tracking-wider"
              >
                Đồng ý lưu vào Lookbook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
