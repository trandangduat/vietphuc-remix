import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingScreen } from './screens/LandingScreen';
import { StudioScreen } from './screens/StudioScreen';
import { LookbookScreen } from './screens/LookbookScreen';
import { DevCalibratorScreen } from './screens/DevCalibratorScreen';
import { PIECES, EVENTS, PRESET_OUTFITS } from './data/catalog';
import {
  ActiveOutfitState,
  SavedOutfit,
  PresetOutfit,
  EventBackground,
} from './types';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'studio' | 'lookbook' | 'dev-calibrate'>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMigrateModal, setShowMigrateModal] = useState(false);

  // Dev-only hotkeys & URL params
  useEffect(() => {
    // Check URL query ?dev=calibrate or hash #calibrate
    if (window.location.search.includes('dev=calibrate') || window.location.hash === '#calibrate') {
      setCurrentScreen('dev-calibrate');
    }

    const handleDevShortcut = (e: KeyboardEvent) => {
      // Ctrl+Shift+D or Alt+C
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') || (e.altKey && e.key.toLowerCase() === 'c')) {
        e.preventDefault();
        setCurrentScreen((prev) => (prev === 'dev-calibrate' ? 'studio' : 'dev-calibrate'));
      }
    };
    window.addEventListener('keydown', handleDevShortcut);
    return () => window.removeEventListener('keydown', handleDevShortcut);
  }, []);

  // Initial active outfit state
  const initialTop = PIECES.find((p) => p.id === 'piece-ao-tac-do') || PIECES[0];
  const initialTopVariant = initialTop;

  const topXanh = PIECES.find((p) => p.id === 'piece-ao-tac-xanh') || initialTop;
  const bottomTay = PIECES.find((p) => p.id === 'piece-quan-tay');
  const footwearLoafer = PIECES.find((p) => p.id === 'piece-loafer');

  const initialBottom = PIECES.find((p) => p.id === 'piece-quan-lua');
  const initialBottomVariant = initialBottom;

  const initialFootwear = PIECES.find((p) => p.id === 'piece-hai-nhung');
  const initialFootwearVariant = initialFootwear;

  const initialAccessory = PIECES.find((p) => p.id === 'piece-non-la');
  const initialAccessoryVariant = initialAccessory;

  const [activeOutfit, setActiveOutfit] = useState<ActiveOutfitState>({
    topPiece: undefined,
    topVariant: undefined,
    bottomPiece: undefined,
    bottomVariant: undefined,
    footwearPiece: undefined,
    footwearVariant: undefined,
    accessoryPiece: undefined,
    accessoryVariant: undefined,
    event: EVENTS[0],
    mannequinGender: 'women',
    styleFilter: 'all',
  });

  // 6 Sample Outfits for Vintage Scrapbook Gallery (Matching Target Artwork)
  const sampleOutfits: SavedOutfit[] = [
    {
      id: 'outfit-default-1',
      name: 'Tết Nguyên Đán',
      conceptTag: 'Tết Nguyên Đán',
      createdAt: '2026-10-01T09:00:00',
      gender: 'women',
      top: { piece: initialTop!, variant: initialTopVariant! },
      bottom: { piece: initialBottom!, variant: initialBottomVariant! },
      footwear: { piece: initialFootwear!, variant: initialFootwearVariant! },
      accessory: { piece: initialAccessory!, variant: initialAccessoryVariant! },
      event: EVENTS[0],
      colorPalette: ['#8B1E1E', '#F7F4EE', '#9A7332'],
      tiltAngle: -1.5,
      decorStamp: 'blossom',
      isFavorite: false,
      aiAnalysis: {
        totalScore: 9.8,
        criteria: {
          colorHarmony: { name: 'Hài hòa màu sắc', score: 9.8, maxScore: 10, comment: 'Tương phản Đỏ gấm và Lụa trắng ngà hoàng tộc rực rỡ sắc xuân.' },
          eventFit: { name: 'Phù hợp sự kiện', score: 10.0, maxScore: 10, comment: 'Tuyệt đối trang nghiêm trong không khí Tết cổ truyền.' },
          culturalNorm: { name: 'Chuẩn mực lễ nghi', score: 9.7, maxScore: 10, comment: 'Đoan chính, tôn ti trật tự theo điển lễ triều Nguyễn.' },
        },
        colorHarmony: 'Tương phản Đỏ gấm và Lụa trắng ngà hoàng tộc.',
        eventFit: 'Tuyệt đối trang nghiêm trong không khí Tết cổ truyền.',
        culturalStatus: 'suitable',
        explanation: 'Bộ lễ phục áo tấc đi cùng quần lụa trắng và hài thêu thể hiện trọn vẹn nét trang trọng truyền thống của phụ nữ Việt.',
        source: 'Bảo tàng Lịch sử Quốc gia',
        mascotQuote: 'Tuyệt phẩm đầu xuân! Áo tấc đỏ gấm cùng lụa ngà tôn vinh phúc lộc hoàng triều!',
      },
    },
    {
      id: 'outfit-default-2',
      name: 'Hội An Cổ Phục',
      conceptTag: 'Hội An Cổ Phục',
      createdAt: '2026-09-30T09:00:00',
      gender: 'men',
      top: { piece: topXanh, variant: topXanh },
      bottom: { piece: initialBottom!, variant: initialBottomVariant! },
      footwear: { piece: initialFootwear!, variant: initialFootwearVariant! },
      event: EVENTS[0],
      colorPalette: ['#1A4B54', '#266D7A', '#F7F4EE'],
      tiltAngle: 1.2,
      decorStamp: 'cloud',
      isFavorite: true,
      aiAnalysis: {
        totalScore: 9.6,
        criteria: {
          colorHarmony: { name: 'Hài hòa màu sắc', score: 9.6, maxScore: 10, comment: 'Sắc xanh cổ vịt quý tộc đi cùng lụa ngà, toát lên vẻ đĩnh đạc.' },
          eventFit: { name: 'Phù hợp sự kiện', score: 9.5, maxScore: 10, comment: 'Trang nghiêm, thanh nhã cho du xuân đầu năm.' },
          culturalNorm: { name: 'Chuẩn mực lễ nghi', score: 9.6, maxScore: 10, comment: 'Chuẩn mực phong thái Nho gia triều Nguyễn.' },
        },
        colorHarmony: 'Sắc xanh cổ vịt quý tộc đi cùng lụa trắng ngà.',
        eventFit: 'Trang nghiêm, thanh nhã cho sự kiện văn hóa truyền thống.',
        culturalStatus: 'suitable',
        explanation: 'Sắc xanh cổ vịt quý tộc đem lại vẻ trầm tĩnh, trí thức của giới học giả xưa.',
        source: 'Bảo tàng Lịch sử Quốc gia',
        mascotQuote: 'Sắc xanh cổ vịt thanh tao, phong thái Nho gia đĩnh đạc trí thức uyên bác!',
      },
    },
    {
      id: 'outfit-default-3',
      name: 'Hoàng Triều Khai Xuân',
      conceptTag: '👑 Được yêu thích nhất',
      isFeatured: true,
      createdAt: '2026-10-01T09:00:00',
      gender: 'women',
      top: { piece: initialTop!, variant: initialTopVariant! },
      bottom: { piece: initialBottom!, variant: initialBottomVariant! },
      footwear: { piece: initialFootwear!, variant: initialFootwearVariant! },
      accessory: { piece: initialAccessory!, variant: initialAccessoryVariant! },
      event: EVENTS[0],
      colorPalette: ['#8B1E1E', '#C69B56', '#F7F4EE'],
      tiltAngle: 0,
      decorStamp: 'cloud',
      isFavorite: true,
      aiAnalysis: {
        totalScore: 9.9,
        criteria: {
          colorHarmony: { name: 'Hài hòa màu sắc', score: 9.9, maxScore: 10, comment: 'Sắc đỏ hoàng hôn kết hợp nón lá chóp bạc và lụa ngà cung đình.' },
          eventFit: { name: 'Phù hợp sự kiện', score: 10.0, maxScore: 10, comment: 'Tuyệt mỹ và trang nghiêm bậc nhất cho đại lễ cổ truyền.' },
          culturalNorm: { name: 'Chuẩn mực lễ nghi', score: 9.9, maxScore: 10, comment: 'Phụng chuẩn lễ nghi cung đình triều Nguyễn.' },
        },
        colorHarmony: 'Sắc đỏ gấm hoàng triều phối lụa ngà quý phái.',
        eventFit: 'Đại lễ cung đình và sự kiện văn hóa trọng đại.',
        culturalStatus: 'suitable',
        explanation: 'Bộ trang phục tiêu biểu và được yêu thích nhất trong bảo tàng phục sắc Việt Nam.',
        source: 'Cố Đô Huế & Bảo Tàng Cung Đình',
        mascotQuote: 'Đỉnh cao cổ phong hoàng triều! Bộ phục sức được ngợi ca nhiều nhất!',
      },
    },
    {
      id: 'outfit-default-4',
      name: 'Xuân Về',
      conceptTag: 'Xuân Về',
      createdAt: '2026-09-30T09:00:00',
      gender: 'men',
      top: { piece: topXanh, variant: topXanh },
      bottom: { piece: initialBottom!, variant: initialBottomVariant! },
      footwear: { piece: initialFootwear!, variant: initialFootwearVariant! },
      event: EVENTS[0],
      colorPalette: ['#1A4B54', '#484F58', '#F7F4EE'],
      tiltAngle: -1.0,
      decorStamp: 'blossom',
      isFavorite: false,
      aiAnalysis: {
        totalScore: 9.5,
        criteria: {
          colorHarmony: { name: 'Hài hòa màu sắc', score: 9.5, maxScore: 10, comment: 'Tươi tắn, trang nhã sắc lụa non đầu xuân.' },
          eventFit: { name: 'Phù hợp sự kiện', score: 9.5, maxScore: 10, comment: 'Nhã nhặn khi du xuân trẩy hội phố cổ.' },
          culturalNorm: { name: 'Chuẩn mực lễ nghi', score: 9.5, maxScore: 10, comment: 'Trang trọng thuần khiết phong cách xưa.' },
        },
        colorHarmony: 'Sắc xanh ngọc và lụa trắng thanh lịch.',
        eventFit: 'Dạo phố hoa và thưởng lãm trà xuân.',
        culturalStatus: 'suitable',
        explanation: 'Một nét phối đồ mang đậm khí tiết mùa xuân yên bình và hoài niệm.',
        source: 'Hội An Di Sản',
        mascotQuote: 'Xuân về phố cổ ngập tràn sắc đào, dáng áo xanh khoan thai tự tại!',
      },
    },
    {
      id: 'outfit-default-5',
      name: 'Thu Hà Nội',
      conceptTag: 'Thu Hà Nội',
      createdAt: '2026-09-28T09:00:00',
      gender: 'men',
      top: { piece: initialTop!, variant: initialTopVariant! },
      bottom: { piece: bottomTay || initialBottom!, variant: bottomTay || initialBottom! },
      footwear: { piece: footwearLoafer || initialFootwear!, variant: footwearLoafer || initialFootwear! },
      event: EVENTS[1] || EVENTS[0],
      colorPalette: ['#8B1E1E', '#374151', '#451A03'],
      tiltAngle: 1.5,
      decorStamp: 'seal',
      isFavorite: false,
      aiAnalysis: {
        totalScore: 9.1,
        criteria: {
          colorHarmony: { name: 'Hài hòa màu sắc', score: 9.3, maxScore: 10, comment: 'Áo tấc đỏ gấm nổi bật trên nền âu phục Tây phương tối màu.' },
          eventFit: { name: 'Phù hợp sự kiện', score: 9.4, maxScore: 10, comment: 'Độc đáo cho sự kiện giao lưu văn nghệ hoặc dạ hội thu.' },
          culturalNorm: { name: 'Chuẩn mực lễ nghi', score: 8.6, maxScore: 10, comment: 'Giao thoa hài hòa giữa phong vị cổ phong và hơi thở hiện đại.' },
        },
        colorHarmony: 'Phối màu Menswear hiện đại ấm áp sắc thu.',
        eventFit: 'Dạ tiệc nghệ thuật và lễ hội giao lưu văn hóa.',
        culturalStatus: 'suitable',
        explanation: 'Sự kết hợp tinh tế giữa tà áo tấc cổ truyền và quần âu đương đại đầy phong cách.',
        source: 'Tạp chí Mỹ thuật & Thời trang',
        mascotQuote: 'Gió thu heo may cùng nét remix tân cổ giao duyên vô cùng ấn tượng!',
      },
    },
    {
      id: 'outfit-default-6',
      name: 'Trung Thu',
      conceptTag: 'Trung Thu',
      createdAt: '2026-09-25T09:00:00',
      gender: 'women',
      top: { piece: topXanh, variant: topXanh },
      bottom: { piece: initialBottom!, variant: initialBottomVariant! },
      footwear: { piece: initialFootwear!, variant: initialFootwearVariant! },
      accessory: { piece: initialAccessory!, variant: initialAccessoryVariant! },
      event: EVENTS[0],
      colorPalette: ['#1A4B54', '#374151', '#8B1E1E'],
      tiltAngle: -0.8,
      decorStamp: 'moon',
      isFavorite: false,
      aiAnalysis: {
        totalScore: 9.7,
        criteria: {
          colorHarmony: { name: 'Hài hòa màu sắc', score: 9.7, maxScore: 10, comment: 'Nón lá chóp bạc đi cùng tà áo xanh dưới ánh trăng rằm.' },
          eventFit: { name: 'Phù hợp sự kiện', score: 9.8, maxScore: 10, comment: 'Lãng mạn và dịu dàng cho đêm rằm Trung thu phố cổ.' },
          culturalNorm: { name: 'Chuẩn mực lễ nghi', score: 9.6, maxScore: 10, comment: 'Duyên dáng đoan trang theo thuần phong mỹ tục.' },
        },
        colorHarmony: 'Sắc xanh đêm thu hòa cùng nón lá chóp bạc.',
        eventFit: 'Lễ hội hoa đăng và đêm rằm Trung thu cổ truyền.',
        culturalStatus: 'suitable',
        explanation: 'Trang phục tôn vinh vẻ đẹp kín đáo, thanh khiết của người phụ nữ dưới trăng rằm.',
        source: 'Bảo tàng Phụ nữ Nam Bộ',
        mascotQuote: 'Trăng rằm soi bóng nón nghiêng, tà áo thướt tha tựa tiên nữ giáng trần!',
      },
    },
  ];

  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>(sampleOutfits);
  const [sessionOutfits, setSessionOutfits] = useState<SavedOutfit[]>(sampleOutfits.slice(0, 2));

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Save active outfit
  const handleSaveOutfit = () => {
    if (!activeOutfit.topPiece || !activeOutfit.bottomPiece || !activeOutfit.footwearPiece) {
      showToast('⚠️ Vui lòng chọn đủ Áo, Quần và Giày để hoàn tất outfit!');
      return;
    }

    const newSaved: SavedOutfit = {
      id: `outfit-${Date.now()}`,
      name: `${activeOutfit.topPiece.name} • ${activeOutfit.event.name}`,
      createdAt: new Date().toISOString(),
      gender: activeOutfit.mannequinGender,
      top: { piece: activeOutfit.topPiece, variant: activeOutfit.topVariant || activeOutfit.topPiece },
      bottom: { piece: activeOutfit.bottomPiece, variant: activeOutfit.bottomVariant || activeOutfit.bottomPiece },
      footwear: { piece: activeOutfit.footwearPiece, variant: activeOutfit.footwearVariant || activeOutfit.footwearPiece },
      accessory: activeOutfit.accessoryPiece ? { piece: activeOutfit.accessoryPiece, variant: activeOutfit.accessoryVariant || activeOutfit.accessoryPiece } : undefined,
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
    if (!activeOutfit.topPiece || !activeOutfit.bottomPiece || !activeOutfit.footwearPiece) return;

    const tryOnOutfit: SavedOutfit = {
      id: `outfit-tryon-${Date.now()}`,
      name: `AI Try on: ${activeOutfit.topPiece.name}`,
      createdAt: new Date().toISOString(),
      gender: activeOutfit.mannequinGender,
      top: { piece: activeOutfit.topPiece, variant: activeOutfit.topVariant || activeOutfit.topPiece },
      bottom: { piece: activeOutfit.bottomPiece, variant: activeOutfit.bottomVariant || activeOutfit.bottomPiece },
      footwear: { piece: activeOutfit.footwearPiece, variant: activeOutfit.footwearVariant || activeOutfit.footwearPiece },
      accessory: activeOutfit.accessoryPiece ? { piece: activeOutfit.accessoryPiece, variant: activeOutfit.accessoryVariant || activeOutfit.accessoryPiece } : undefined,
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
      topVariant: saved.top.piece,
      bottomPiece: saved.bottom.piece,
      bottomVariant: saved.bottom.piece,
      footwearPiece: saved.footwear.piece,
      footwearVariant: saved.footwear.piece,
      accessoryPiece: saved.accessory?.piece,
      accessoryVariant: saved.accessory?.piece,
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
      const topVariant = topPiece;

      const bottomPiece = PIECES.find((p) => p.id === preset.bottomPieceId);
      const bottomVariant = bottomPiece;

      const footwearPiece = PIECES.find((p) => p.id === preset.footwearPieceId);
      const footwearVariant = footwearPiece;

      const accessoryPiece = preset.accessoryPieceId ? PIECES.find((p) => p.id === preset.accessoryPieceId) : undefined;
      const accessoryVariant = accessoryPiece;

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
      {/* Dev Calibrator Screen (Full workbench mode) */}
      {currentScreen === 'dev-calibrate' ? (
        <DevCalibratorScreen onExit={() => setCurrentScreen('studio')} />
      ) : (
        <>
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
                onToggleFavorite={(id) => {
                  setSavedOutfits((prev) =>
                    prev.map((o) => (o.id === id ? { ...o, isFavorite: !o.isFavorite } : o))
                  );
                  setSessionOutfits((prev) =>
                    prev.map((o) => (o.id === id ? { ...o, isFavorite: !o.isFavorite } : o))
                  );
                }}
                onOpenStudio={() => setCurrentScreen('studio')}
              />
            )}
          </main>
        </>
      )}

      {/* Floating Developer Calibrator Launcher (Only visible in DEV mode, never in production) */}
      {import.meta.env.DEV && currentScreen !== 'dev-calibrate' && (
        <button
          onClick={() => setCurrentScreen('dev-calibrate')}
          className="fixed bottom-3 left-3 z-50 px-3 py-1.5 bg-lacquer/95 hover:bg-lacquer-surface text-imperial-gold text-xs font-mono font-bold border-2 border-imperial-gold/60 shadow-2xl flex items-center gap-2 transition-all hover:scale-105 rounded-none"
          title="Mở Bộ Căn Chỉnh Piece (Dev Only - Phím tắt Ctrl+Shift+D)"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>🛠️ Dev Calibrator</span>
          <span className="text-[10px] text-silk-muted px-1 py-0.5 bg-lacquer border border-lacquer-border">Ctrl+Shift+D</span>
        </button>
      )}

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
                className="py-3 px-4 rounded-none bg-lacquer-surface border-2 border-lacquer-border text-sm font-bold text-silk-muted hover:text-silk-ivory uppercase tracking-wider"
              >
                Bỏ qua
              </button>
              <button
                onClick={() => handleConfirmMigration(true)}
                className="py-3 px-4 rounded-none bg-imperial-gold text-lacquer font-bold text-sm hover:bg-imperial-gold-light shadow-md uppercase tracking-wider"
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
