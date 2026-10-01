import React from 'react';
import { ActiveOutfitState, AIOverviewResult } from '../types';
import { Sparkles, ShieldCheck, AlertTriangle, AlertCircle, BookCheck, Lock } from 'lucide-react';

interface AIOverviewCardProps {
  outfit: ActiveOutfitState;
  isLoggedIn: boolean;
  onLoginPrompt: () => void;
}

export const AIOverviewCard: React.FC<AIOverviewCardProps> = ({
  outfit,
  isLoggedIn,
  onLoginPrompt,
}) => {
  // Compute cultural analysis based on verified catalog rules
  const getAnalysis = (): AIOverviewResult => {
    const isAoTac = outfit.topPiece?.id === 'piece-ao-tac';
    const isQuanLua = outfit.bottomPiece?.id === 'piece-quan-lua';
    const isQuanTay = outfit.bottomPiece?.id === 'piece-quan-tay';
    const isHaiNhung = outfit.footwearPiece?.id === 'piece-hai-nhung';
    const isLoafer = outfit.footwearPiece?.id === 'piece-loafer';
    const isEventTet = outfit.event.id === 'event-tet';

    // Case 1: Pure Traditional Royal (Áo tấc + Quần lụa + Hài nhung)
    if (isAoTac && isQuanLua && isHaiNhung) {
      return {
        colorHarmony: 'Tương phản Cung đình Huế (Đỏ/Xanh tấc đi cùng lụa trắng ngà).',
        eventFit: isEventTet ? 'Tuyệt đối phù hợp với không khí trang trọng ngày Tết cổ truyền.' : 'Rất trang trọng, phù hợp đại lễ và nghi thức cổ điển.',
        culturalStatus: 'suitable',
        explanation: 'Bộ trang phục bảo toàn trọn vẹn quy thức lễ nghi thời Nguyễn. Áo tấc đi cùng quần lụa trắng và hài thêu thể hiện sự đoan chính, lễ giáo tôn ti trật tự.',
        source: 'Bảo tàng Lịch sử Quốc gia & "Ngàn năm áo mũ" (Trần Quang Đức)',
      };
    }

    // Case 2: Heritage Remix (Áo tấc + Quần tây / Loafer)
    if (isAoTac && (isQuanTay || isLoafer)) {
      return {
        colorHarmony: 'Phối màu Menswear hiện đại (Áo tấc gấm nổi bật trên nền quần âu tối màu).',
        eventFit: 'Rất ấn tượng cho dạ hội học sinh (Prom), sự kiện trường học hoặc dạo phố nghệ thuật.',
        culturalStatus: 'caution',
        explanation: 'Cách phối Remix sáng tạo giữa tà áo thụng triều Nguyễn và âu phục Tây phương. Vẫn giữ được phẩm cách của cổ phục nhưng mang hơi thở trí thức đương đại. Lưu ý không nên diện vào các nghi thức tế lễ tôn nghiêm cổ truyền.',
        suggestion: 'Nếu tham gia lễ gia tiên trang trọng, bạn có thể chuyển sang Quần lụa trắng và Hài thêu.',
        source: 'Chuyên khảo Văn hóa Mặc đương đại & Bảo tàng Phụ nữ Nam Bộ',
      };
    }

    // Default Fallback
    return {
      colorHarmony: 'Màu sắc phối hợp tự nhiên, thể hiện phong cách tự do của người mặc.',
      eventFit: `Phù hợp khám phá cho bối cảnh ${outfit.event.name}.`,
      culturalStatus: 'suitable',
      explanation: 'Tổ hợp trang phục đem lại diện mạo mới mẻ, tôn vinh nét đẹp trang phục truyền thống Việt Nam.',
      source: 'Hệ thống tri thức văn hóa Việt phục Remix',
    };
  };

  const analysis = getAnalysis();

  if (!isLoggedIn) {
    return (
      <div className="border-t-2 border-lacquer-border bg-lacquer-surface/95 backdrop-blur-md p-4 sm:p-5 flex-shrink-0 text-center relative overflow-hidden font-sans">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-imperial-gold" />
            <h4 className="font-sans font-bold text-xs sm:text-sm uppercase tracking-wider text-silk-ivory">
              AI Overview (Cố vấn Văn hóa)
            </h4>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-none bg-imperial-gold/20 text-imperial-gold font-bold border border-imperial-gold/40 uppercase">
            Khóa tính năng
          </span>
        </div>
        <p className="text-xs sm:text-sm text-silk-muted mb-3.5 leading-relaxed max-w-lg mx-auto">
          Đăng nhập để nhận đánh giá chi tiết về độ hài hòa màu sắc, tính trang trọng với bối cảnh và chuẩn mực lễ nghi trích xuất từ bảo tàng.
        </p>
        <button
          onClick={onLoginPrompt}
          className="py-2.5 px-6 rounded-none bg-imperial-gold text-lacquer font-bold text-xs sm:text-sm hover:bg-imperial-gold-light transition-all shadow-md uppercase tracking-wider"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  return (
    <div className="border-t-2 border-lacquer-border bg-lacquer-surface/95 backdrop-blur-md p-4 sm:p-5 flex-shrink-0 relative overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-lacquer-border">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-imperial-gold" />
          <h4 className="font-sans font-bold text-sm sm:text-base text-silk-ivory uppercase tracking-wider">
            AI Overview (Đánh giá văn hóa)
          </h4>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {analysis.culturalStatus === 'suitable' && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-none text-xs font-bold uppercase tracking-wider bg-green-500/15 text-green-400 border border-green-500/40">
              <ShieldCheck className="w-3.5 h-3.5" /> Phù hợp
            </span>
          )}
          {analysis.culturalStatus === 'caution' && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-none text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/40">
              <AlertTriangle className="w-3.5 h-3.5" /> Cần lưu ý
            </span>
          )}
          {analysis.culturalStatus === 'not-recommended' && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-none text-xs font-bold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/40">
              <AlertCircle className="w-3.5 h-3.5" /> Chưa khuyến nghị
            </span>
          )}
        </div>
      </div>

      {/* Analysis Details */}
      <div className="space-y-2.5 text-xs sm:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="p-2.5 rounded-none bg-lacquer border border-lacquer-border">
            <span className="font-bold text-silk-muted block text-xs uppercase tracking-wider">Hài hòa màu sắc:</span>
            <p className="text-silk-ivory font-semibold mt-1">
              {analysis.colorHarmony}
            </p>
          </div>

          <div className="p-2.5 rounded-none bg-lacquer border border-lacquer-border">
            <span className="font-bold text-silk-muted block text-xs uppercase tracking-wider">Phù hợp sự kiện:</span>
            <p className="text-silk-ivory font-semibold mt-1">
              {analysis.eventFit}
            </p>
          </div>
        </div>

        <div className="p-3 rounded-none bg-lacquer/60 border border-lacquer-border text-silk-muted leading-relaxed">
          <p className="text-silk-ivory font-medium leading-relaxed">{analysis.explanation}</p>
          {analysis.suggestion && (
            <p className="mt-2 text-imperial-gold font-bold">💡 Gợi ý: {analysis.suggestion}</p>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-silk-muted pt-1 font-medium">
          <BookCheck className="w-4 h-4 text-imperial-gold flex-shrink-0" />
          <span className="truncate">Nguồn kiểm chứng: {analysis.source}</span>
        </div>
      </div>
    </div>
  );
};
