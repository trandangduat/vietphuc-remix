import React, { useState } from 'react';
import { Sparkles, BookOpen, ArrowRight, Check, Compass } from 'lucide-react';
import { PIECES, PRESET_OUTFITS } from '../../data/catalog';
import { PresetOutfit } from '../../types';
import { AncientCloudDivider } from '../heritage/HeritageDecorations';

interface RemixComparisonSliderProps {
  onOpenStudio: (preset?: PresetOutfit) => void;
}

export const RemixComparisonSlider: React.FC<RemixComparisonSliderProps> = ({ onOpenStudio }) => {
  const [activeTab, setActiveTab] = useState<'traditional' | 'remix'>('traditional');
  const [selectedPieceId, setSelectedPieceId] = useState<string>('piece-ao-tac-do');

  const selectedPiece = PIECES.find((p) => p.id === selectedPieceId) || PIECES[0];

  const traditionalPreset = PRESET_OUTFITS[0];
  const remixPreset = PRESET_OUTFITS[1];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full" aria-label="So sánh phong cách">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-imperial-gold/30 bg-imperial-gold/10 text-imperial-gold text-xs font-semibold uppercase tracking-widest mb-4">
          <Compass className="w-3.5 h-3.5" />
          <span>Đối chiếu phong cách</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-silk-ivory mb-4 [text-wrap:balance]">
          Từ điển lệ hoàng triều đến nhịp sống đương đại
        </h2>
        <p className="text-sm sm:text-base text-silk-muted font-normal [text-wrap:pretty] leading-relaxed">
          Tìm hiểu cấu trúc trang phục cổ phong nguyên bản và cách người trẻ chuyển hóa linh hoạt cùng thời trang ứng dụng ngày nay.
        </p>
      </div>

      <AncientCloudDivider className="mb-12 opacity-40 max-w-md mx-auto" />

      {/* Segmented Control */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex p-1 bg-[#12161F] border border-lacquer-border">
          <button
            onClick={() => {
              setActiveTab('traditional');
              setSelectedPieceId('piece-ao-tac-do');
            }}
            className={`px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'traditional'
                ? 'bg-imperial-gold text-lacquer shadow-gold-glow'
                : 'text-silk-muted hover:text-silk-ivory'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#7A1C1C]" />
            <span>Phục dựng Cổ điển</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('remix');
              setSelectedPieceId('piece-ao-tac-xanh');
            }}
            className={`px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'remix'
                ? 'bg-imperial-gold text-lacquer shadow-gold-glow'
                : 'text-silk-muted hover:text-silk-ivory'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#1A4B54]" />
            <span>Phối ngẫu Đương đại</span>
          </button>
        </div>
      </div>

      {/* Main Comparative Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Card: Visual Exhibit */}
        <div className="lg:col-span-7 bg-[#12161F] border-2 border-lacquer-border p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-lacquer-border">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-imperial-gold block">
                  {activeTab === 'traditional' ? 'Quy chế triều Nguyễn' : 'Phong cách Campus & Streetwear'}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-silk-ivory mt-1">
                  {activeTab === 'traditional' ? 'Áo tấc đỏ gấm & Hài nhung thêu' : 'Áo tấc lam sắc & Quần âu Loafer'}
                </h3>
              </div>
              <div className="px-3 py-1.5 border border-imperial-gold/40 bg-imperial-gold/10 text-imperial-gold text-xs font-bold uppercase">
                {activeTab === 'traditional' ? 'Điểm hài hòa: 9.8' : 'Điểm hài hòa: 9.4'}
              </div>
            </div>

            {/* Visual breakdown with selectable pills */}
            <p className="text-xs text-silk-muted mb-3 font-semibold uppercase tracking-wider">
              Nhấn vào từng mảnh để tra cứu khảo cứu lịch sử:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {activeTab === 'traditional' ? (
                <>
                  <button
                    onClick={() => setSelectedPieceId('piece-ao-tac-do')}
                    className={`p-3 text-left border transition-all ${
                      selectedPieceId === 'piece-ao-tac-do'
                        ? 'border-imperial-gold bg-imperial-gold/15 text-silk-ivory'
                        : 'border-lacquer-border bg-[#181E29] text-silk-muted hover:text-silk-ivory'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold text-imperial-gold block">Áo chính</span>
                    <span className="text-xs font-bold block mt-0.5">Áo tấc đỏ đô</span>
                    <span className="text-[11px] text-silk-muted">Gấm dệt thủy ba</span>
                  </button>

                  <button
                    onClick={() => setSelectedPieceId('piece-quan-lua')}
                    className={`p-3 text-left border transition-all ${
                      selectedPieceId === 'piece-quan-lua'
                        ? 'border-imperial-gold bg-imperial-gold/15 text-silk-ivory'
                        : 'border-lacquer-border bg-[#181E29] text-silk-muted hover:text-silk-ivory'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold text-imperial-gold block">Hạ y</span>
                    <span className="text-xs font-bold block mt-0.5">Quần lụa trắng ngà</span>
                    <span className="text-[11px] text-silk-muted">Tơ tằm tự nhiên</span>
                  </button>

                  <button
                    onClick={() => setSelectedPieceId('piece-hai-nhung')}
                    className={`p-3 text-left border transition-all ${
                      selectedPieceId === 'piece-hai-nhung'
                        ? 'border-imperial-gold bg-imperial-gold/15 text-silk-ivory'
                        : 'border-lacquer-border bg-[#181E29] text-silk-muted hover:text-silk-ivory'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold text-imperial-gold block">Lý hài</span>
                    <span className="text-xs font-bold block mt-0.5">Hài nhung thêu</span>
                    <span className="text-[11px] text-silk-muted">Chỉ kim tuyến</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setSelectedPieceId('piece-ao-tac-xanh')}
                    className={`p-3 text-left border transition-all ${
                      selectedPieceId === 'piece-ao-tac-xanh'
                        ? 'border-imperial-gold bg-imperial-gold/15 text-silk-ivory'
                        : 'border-lacquer-border bg-[#181E29] text-silk-muted hover:text-silk-ivory'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold text-imperial-gold block">Áo chính</span>
                    <span className="text-xs font-bold block mt-0.5">Áo tấc xanh cổ vịt</span>
                    <span className="text-[11px] text-silk-muted">Khí chất thanh cao</span>
                  </button>

                  <button
                    onClick={() => setSelectedPieceId('piece-quan-tay')}
                    className={`p-3 text-left border transition-all ${
                      selectedPieceId === 'piece-quan-tay'
                        ? 'border-imperial-gold bg-imperial-gold/15 text-silk-ivory'
                        : 'border-lacquer-border bg-[#181E29] text-silk-muted hover:text-silk-ivory'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold text-imperial-gold block">Hiện đại</span>
                    <span className="text-xs font-bold block mt-0.5">Quần âu than chì</span>
                    <span className="text-[11px] text-silk-muted">Dáng suông xếp ly</span>
                  </button>

                  <button
                    onClick={() => setSelectedPieceId('piece-loafer')}
                    className={`p-3 text-left border transition-all ${
                      selectedPieceId === 'piece-loafer'
                        ? 'border-imperial-gold bg-imperial-gold/15 text-silk-ivory'
                        : 'border-lacquer-border bg-[#181E29] text-silk-muted hover:text-silk-ivory'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold text-imperial-gold block">Hiện đại</span>
                    <span className="text-xs font-bold block mt-0.5">Giày Loafer da</span>
                    <span className="text-[11px] text-silk-muted">Nâu bóng trang nhã</span>
                  </button>
                </>
              )}
            </div>

            {/* Characteristic notes */}
            <div className="space-y-3 pt-4 border-t border-lacquer-border text-xs sm:text-sm text-silk-muted leading-relaxed">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-imperial-gold flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-silk-ivory">Quy tắc nẹp cổ:</strong> Giữ nguyên chuẩn mực cổ đứng năm khuy cài kín đáo, tượng trưng cho ngũ thường (Nhân, Lễ, Nghĩa, Trí, Tín).
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-imperial-gold flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-silk-ivory">Ứng dụng thực tế:</strong>{' '}
                  {activeTab === 'traditional'
                    ? 'Thích hợp cho ngày Tết Nguyên Đán, nghi lễ bái tổ, đám cưới gia đình trang nghiêm.'
                    : 'Phù hợp dạ hội Prom, buổi bảo vệ khóa luận kiến trúc mỹ thuật, dạo phố du xuân.'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-lacquer-border">
            <button
              onClick={() => onOpenStudio(activeTab === 'traditional' ? traditionalPreset : remixPreset)}
              className="py-3 px-6 bg-imperial-gold hover:bg-imperial-gold-light text-lacquer font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <span>Thử phong cách này trong Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Card: Cultural Inspector Box */}
        <div className="lg:col-span-5 bg-[#181E29] border-2 border-imperial-gold/40 p-6 sm:p-7 relative">
          <div className="flex items-center gap-2 text-xs font-bold text-imperial-gold uppercase tracking-wider mb-4 pb-3 border-b border-lacquer-border">
            <BookOpen className="w-4 h-4" />
            <span>Hồ sơ khảo cứu hiện vật</span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs uppercase font-bold text-silk-muted block">Tên mảnh phục trang</span>
              <h4 className="font-serif text-2xl font-bold text-silk-ivory mt-0.5">
                {selectedPiece.name}
              </h4>
              <span className="inline-block mt-2 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-imperial-gold/30 bg-imperial-gold/10 text-imperial-gold">
                {selectedPiece.style === 'traditional' ? 'Cổ phong hoàng triều' : 'Trang phục hiện đại'}
              </span>
            </div>

            {selectedPiece.culturalInfo && (
              <>
                <div className="pt-2">
                  <span className="text-xs uppercase font-bold text-imperial-gold block">
                    Thời kỳ lịch sử:
                  </span>
                  <p className="text-xs sm:text-sm text-silk-ivory mt-1 leading-relaxed">
                    {selectedPiece.culturalInfo.period}
                  </p>
                </div>

                <div>
                  <span className="text-xs uppercase font-bold text-imperial-gold block">
                    Ý nghĩa biểu trưng:
                  </span>
                  <p className="text-xs sm:text-sm text-silk-muted mt-1 leading-relaxed">
                    {selectedPiece.culturalInfo.meaning}
                  </p>
                </div>

                <div>
                  <span className="text-xs uppercase font-bold text-imperial-gold block">
                    Bối cảnh sử dụng:
                  </span>
                  <p className="text-xs sm:text-sm text-silk-muted mt-1 leading-relaxed">
                    {selectedPiece.culturalInfo.context}
                  </p>
                </div>

                <div className="pt-4 border-t border-lacquer-border text-[11px] text-silk-muted">
                  <span className="font-semibold text-imperial-gold">Nguồn khảo cứu:</span>{' '}
                  {selectedPiece.culturalInfo.source}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
