import React, { useState } from 'react';
import { X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { EventBackground } from '../types';

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

  if (!isOpen) return null;

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
        bgUrl: '/assets/events/bg-tet-pho-co.jpg', // in prototype, use rich sample
        isCustom: true,
      };
      onEventCreated(newEvent);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lacquer/85 backdrop-blur-md">
      <div className="max-w-md w-full bg-lacquer-card border border-imperial-gold/40 rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-silk-muted hover:text-silk-ivory hover:bg-lacquer-surface transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-imperial-gold/15 text-imperial-gold border border-imperial-gold/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-silk-ivory">
              Tạo Bối cảnh Event bằng AI
            </h3>
            <p className="text-xs text-silk-muted">
              Nhập mô tả không gian để AI sinh một nền độc nhất cho Studio
            </p>
          </div>
        </div>

        <div className="space-y-4 my-4">
          <div>
            <label className="block text-xs font-semibold text-silk-ivory mb-1.5">
              Mô tả không gian hoặc bối cảnh:
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ví dụ: Hoàng hôn bên dòng sông Hương, phố đèn lồng Hội An lung linh..."
              className="w-full p-3 rounded-xl bg-lacquer-surface border border-lacquer-border text-xs text-silk-ivory placeholder:text-silk-muted/60 focus:outline-none focus:border-imperial-gold transition-colors resize-none"
            />
          </div>

          <div>
            <span className="text-[11px] text-silk-muted block mb-1.5">Gợi ý nhanh:</span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(item)}
                  className="px-2.5 py-1 rounded-lg text-[11px] bg-lacquer-surface border border-lacquer-border text-silk-muted hover:text-imperial-gold hover:border-imperial-gold/40 transition-all text-left"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            prompt.trim() && !isGenerating
              ? 'bg-imperial-gold text-lacquer hover:bg-imperial-gold-light shadow-md'
              : 'bg-lacquer-surface text-silk-muted border border-lacquer-border cursor-not-allowed opacity-60'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-lacquer/30 border-t-lacquer rounded-full animate-spin" />
              <span>AI đang vẽ bối cảnh...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Sinh Nền Event Mới & Áp dụng</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
