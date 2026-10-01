import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
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
        bgUrl: '/assets/events/bg-tet-pho-co.jpg',
        isCustom: true,
      };
      onEventCreated(newEvent);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lacquer/90 backdrop-blur-md font-sans">
      <div className="max-w-md w-full bg-lacquer-card border-2 border-imperial-gold rounded-none p-6 sm:p-7 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-none text-silk-muted hover:text-silk-ivory hover:bg-lacquer-surface transition-all border border-lacquer-border"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-none bg-imperial-gold/20 text-imperial-gold border border-imperial-gold/40">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-2xl text-silk-ivory">
              Tạo Bối cảnh Event bằng AI
            </h3>
            <p className="text-sm text-silk-muted mt-0.5">
              Nhập mô tả không gian để AI sinh một nền độc nhất cho Studio
            </p>
          </div>
        </div>

        <div className="space-y-4 my-5">
          <div>
            <label className="block text-xs font-bold text-silk-ivory mb-2 uppercase tracking-wider">
              Mô tả không gian hoặc bối cảnh:
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ví dụ: Hoàng hôn bên dòng sông Hương, phố đèn lồng Hội An lung linh..."
              className="w-full p-3.5 rounded-none bg-lacquer-surface border-2 border-lacquer-border text-sm text-silk-ivory placeholder:text-silk-muted/60 focus:outline-none focus:border-imperial-gold transition-colors resize-none font-sans"
            />
          </div>

          <div>
            <span className="text-xs font-bold text-silk-muted block mb-2 uppercase tracking-wider">Gợi ý nhanh:</span>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(item)}
                  className="px-3 py-1.5 rounded-none text-xs bg-lacquer-surface border border-lacquer-border text-silk-muted hover:text-imperial-gold hover:border-imperial-gold transition-all text-left font-medium"
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
          className={`w-full py-3.5 rounded-none font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-md ${
            prompt.trim() && !isGenerating
              ? 'bg-imperial-gold text-lacquer hover:bg-imperial-gold-light'
              : 'bg-lacquer-surface text-silk-muted border border-lacquer-border cursor-not-allowed opacity-60'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-lacquer/30 border-t-lacquer rounded-none animate-spin" />
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
