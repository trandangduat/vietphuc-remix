import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { EventBackground } from '../types';
import { HeritageModal } from './heritage/HeritageFrame';

interface CustomEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (event: EventBackground) => void;
}

export const CustomEventModal: React.FC<CustomEventModalProps> = ({
  isOpen,
  onClose,
  onEventCreated,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const SUGGESTIONS = [
    'Quán cà phê phố cổ Hội An lúc hoàng hôn rực rỡ',
    'Triển lãm mỹ thuật đương đại Hà Nội ánh sáng tối giản',
    'Sân đình chùa Thầy cổ kính rêu phong mùa trẩy hội',
    'Con đường hoa phượng đỏ trường THPT Quốc Học Huế',
  ];

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      const newEvent: EventBackground = {
        id: `custom-event-${Date.now()}`,
        name: prompt.slice(0, 30),
        description: prompt,
        bgUrl: '/assets/events/bg-tet-pho-co.jpg',
        isCustom: true,
      };
      onEventCreated(newEvent);
      onClose();
    }, 1800);
  };

  return (
    <HeritageModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo Bối Cảnh Sự Kiện (AI)"
      subtitle="Nhập mô tả không gian để AI sinh một nền độc nhất cho Studio"
      icon={<Sparkles className="w-4 h-4 flex-shrink-0 text-[#C5A059]" />}
      badge="AI GENERATION"
      maxWidth="max-w-md"
    >
      <div className="space-y-4 font-sans text-xs">
        <div>
          <label className="block text-[11px] font-bold text-[#C5A059] mb-2 uppercase tracking-wider">
            Mô tả không gian hoặc bối cảnh:
          </label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ví dụ: Hoàng hôn bên dòng sông Hương, phố đèn lồng Hội An lung linh..."
            className="w-full p-3 rounded-[6px] bg-[#0D111A] border border-[#C5A059]/40 focus:border-[#D4AF37] text-xs sm:text-sm text-[#EDE5D8] placeholder-[#EDE5D8]/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors resize-none font-sans"
          />
        </div>

        <div>
          <span className="text-[11px] font-bold text-[#C5A059] block mb-2 uppercase tracking-wider">
            Gợi ý nhanh:
          </span>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(item)}
                className="px-2.5 py-1 rounded-[6px] text-xs bg-[#121622] border border-[#C5A059]/30 text-[#EDE5D8]/80 hover:text-[#D4AF37] hover:border-[#D4AF37]/60 transition-all text-left font-sans cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className={`w-full py-3 rounded-[6px] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
            prompt.trim() && !isGenerating
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8232] text-[#0A0D12] hover:brightness-110 shadow-[0_4px_16px_rgba(212,175,55,0.25)]'
              : 'bg-[#161B26] text-[#EDE5D8]/40 border border-[#C5A059]/25 cursor-not-allowed'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-[#0A0D12]/30 border-t-[#0A0D12] rounded-full animate-spin" />
              <span>AI đang vẽ bối cảnh...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#0A0D12]" />
              <span>Sinh Nền Event Mới & Áp dụng</span>
            </>
          )}
        </button>
      </div>
    </HeritageModal>
  );
};
