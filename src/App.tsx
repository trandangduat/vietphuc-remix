import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingScreen } from './screens/LandingScreen';
import { StudioScreen } from './screens/StudioScreen';
import { LookbookScreen } from './screens/LookbookScreen';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import {
  fetchUserOutfits,
  saveOutfitToDb,
  updateOutfitInDb,
  deleteOutfitFromDb,
} from './services/outfitService';
import {
  fetchUserLookbooks,
  createLookbookInDb,
  deleteLookbookFromDb,
} from './services/lookbookService';
import { PIECES, EVENTS, PRESET_OUTFITS } from './data/catalog';
import {
  ActiveOutfitState,
  SavedOutfit,
  PresetOutfit,
  EventBackground,
  Lookbook,
} from './types';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'studio' | 'lookbook'>('landing');
  const { user, profile } = useAuth();
  const isLoggedIn = Boolean(user);
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  const [lookbooks, setLookbooks] = useState<Lookbook[]>([]);

  // Sync outfits and lookbooks with Supabase when user logs in
  useEffect(() => {
    if (user) {
      fetchUserOutfits(user.id).then((dbOutfits) => {
        if (dbOutfits) {
          setSavedOutfits(dbOutfits);
        }
      });
      fetchUserLookbooks(user.id).then((dbLookbooks) => {
        if (dbLookbooks) {
          setLookbooks(dbLookbooks);
        }
      });
    } else {
      setSavedOutfits([]);
      setLookbooks([]);
    }
  }, [user?.id]);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Save active outfit (Requires login)
  const handleSaveOutfit = async () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      showToast('🔒 Vui lòng đăng nhập với Google để lưu outfit vào bộ sưu tập cá nhân!');
      return;
    }

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
      colorPalette: ['#8B1E1E', '#F7F4EE', '#9A7332'],
      decorStamp: 'blossom',
      tiltAngle: 0,
      isFavorite: false,
    };

    try {
      const persisted = await saveOutfitToDb(user!.id, newSaved);
      setSavedOutfits((prev) => [persisted, ...prev]);
      showToast('✨ Đã lưu outfit thành công vào Database cá nhân!');
    } catch (e: any) {
      setSavedOutfits((prev) => [newSaved, ...prev]);
      showToast('✨ Đã lưu outfit vào Lookbook!');
    }
  };

  // Save AI Try-on image into Lookbook (Requires login)
  const handleSaveTryOnToLookbook = async (tryOnImgUrl: string) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      showToast('🔒 Vui lòng đăng nhập với Google để lưu ảnh AI vào Lookbook cá nhân!');
      return;
    }

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
      tryOnImages: [tryOnImgUrl],
      colorPalette: ['#8B1E1E', '#F7F4EE', '#9A7332'],
      decorStamp: 'moon',
      tiltAngle: 1.5,
      isFavorite: false,
    };

    try {
      const persisted = await saveOutfitToDb(user!.id, tryOnOutfit);
      setSavedOutfits((prev) => [persisted, ...prev]);
      showToast('✨ Ảnh AI Try on đã được lưu vào Database!');
    } catch {
      setSavedOutfits((prev) => [tryOnOutfit, ...prev]);
      showToast('✨ Ảnh AI Try on đã được lưu vào Lookbook cá nhân!');
    }
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


  // Navigation handler with auth gate for Lookbook
  const handleNavigate = (screen: 'landing' | 'studio' | 'lookbook') => {
    if (screen === 'lookbook' && !isLoggedIn) {
      setShowAuthModal(true);
      showToast('🔒 Vui lòng đăng nhập với Google để truy cập Bộ sưu tập!');
      return;
    }
    setCurrentScreen(screen);
  };

  // Enforce auth gate for Lookbook: kick unauthenticated visitors out to studio
  useEffect(() => {
    if (currentScreen === 'lookbook' && !isLoggedIn) {
      setCurrentScreen('studio');
      setShowAuthModal(true);
      showToast('🔒 Bạn cần đăng nhập với Google để truy cập trang Bộ sưu tập.');
    }
  }, [currentScreen, isLoggedIn]);

  // Create Lookbook
  const handleCreateLookbook = async (data: {
    title: string;
    description: string;
    coverImageUrl: string;
    coverOutfitId: string;
    outfitIds: string[];
    decorStamp: 'blossom' | 'cloud' | 'moon' | 'seal';
  }) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    const created = await createLookbookInDb(user.id, data);
    setLookbooks((prev) => [created, ...prev]);
    showToast(`✨ Đã tạo bộ sưu tập "${created.title}" thành công!`);
  };

  // Delete Lookbook
  const handleDeleteLookbook = async (id: string) => {
    if (!user) return;
    await deleteLookbookFromDb(id);
    setLookbooks((prev) => prev.filter((l) => l.id !== id));
    showToast('Đã xóa bộ sưu tập');
  };

  return (
    <div className="min-h-screen flex flex-col bg-lacquer text-silk-ivory">
      {/* Global Navbar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        sessionCount={isLoggedIn ? savedOutfits.length : 0}
        onOpenAuth={() => setShowAuthModal(true)}
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
            onLoginPrompt={() => setShowAuthModal(true)}
            onSaveOutfit={handleSaveOutfit}
            onSaveTryOnToLookbook={handleSaveTryOnToLookbook}
          />
        )}

        {currentScreen === 'lookbook' && isLoggedIn && (
          <LookbookScreen
            outfits={savedOutfits}
            lookbooks={lookbooks}
            isLoggedIn={isLoggedIn}
            onLoginPrompt={() => setShowAuthModal(true)}
            onLoadOutfitIntoStudio={handleLoadOutfitIntoStudio}
            onDeleteOutfit={(id) => {
              if (user) {
                deleteOutfitFromDb(id);
                setSavedOutfits((prev) => prev.filter((o) => o.id !== id));
                showToast('Đã xóa outfit khỏi bộ sưu tập');
              }
            }}
            onRenameOutfit={(id, newName) => {
              if (user) {
                setSavedOutfits((prev) =>
                  prev.map((o) => (o.id === id ? { ...o, name: newName } : o))
                );
                updateOutfitInDb(id, { name: newName });
              }
            }}
            onToggleFavorite={(id) => {
              if (user) {
                setSavedOutfits((prev) =>
                  prev.map((o) => {
                    if (o.id === id) {
                      const newFav = !o.isFavorite;
                      updateOutfitInDb(id, { isFavorite: newFav });
                      return { ...o, isFavorite: newFav };
                    }
                    return o;
                  })
                );
              }
            }}
            onOpenStudio={() => setCurrentScreen('studio')}
            onCreateLookbook={handleCreateLookbook}
            onDeleteLookbook={handleDeleteLookbook}
            showToast={showToast}
          />
        )}
      </main>

      {/* Real Supabase Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          showToast(`✨ Chào mừng bạn, ${profile?.display_name || 'Đăng nhập thành công!'}!`);
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 py-3.5 px-6 rounded-none bg-lacquer-card border-2 border-imperial-gold shadow-2xl text-sm font-bold text-silk-ivory flex items-center gap-2.5 font-sans animate-bounce">
          <Sparkles className="w-5 h-5 text-imperial-gold" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
export default App;
