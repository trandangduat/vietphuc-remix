import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
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
        bgUrl: '/assets/events/bg-tet-pho-co.png',
        isCustom: true,
      };
      onEventCreated(newEvent);
      onClose();
    }, 1800);
  };

  const canCreate = Boolean(prompt.trim());

  return (
    <HeritageModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo Bối Cảnh"
      subtitle="Mô tả không gian để có một nền riêng cho Studio"
      icon={<Sparkles className="w-4 h-4 flex-shrink-0 text-imperial-gold" />}
      maxWidth="max-w-lg"
      contentClassName="overflow-hidden"
    >
      <div className="flex flex-col gap-4 font-sans sm:gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="custom-event-prompt" className="text-[13px] font-medium text-silk-muted">
            Mô tả không gian
          </label>
          <textarea
            id="custom-event-prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Hoàng hôn bên sông Hương, phố đèn lồng Hội An…"
            className="w-full resize-none border border-imperial-gold/25 bg-black/30 px-4 py-3.5 text-[15px] leading-relaxed text-silk-ivory placeholder:text-silk-muted/80 focus:border-imperial-gold-light focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-medium text-silk-muted">Gợi ý</span>
          <div className="border border-imperial-gold/20">
            {SUGGESTIONS.map((item) => {
              const selected = prompt === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPrompt(item)}
                  aria-pressed={selected}
                  className={`flex min-h-11 w-full cursor-pointer items-center gap-3 border-b border-imperial-gold/15 px-3.5 py-2.5 text-left text-[13px] leading-snug last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-imperial-gold ${
                    selected
                      ? 'bg-imperial-gold/10 text-imperial-gold-light'
                      : 'text-silk-ivory/85 hover:bg-white/[0.04] hover:text-silk-ivory'
                  }`}
                >
                  <span className="min-w-0 flex-1">{item}</span>
                  {selected && <Check className="h-4 w-4 flex-shrink-0 text-imperial-gold" strokeWidth={2.5} />}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={!canCreate || isGenerating}
          aria-busy={isGenerating}
          className={`flex min-h-12 w-full items-center justify-center gap-2 border px-4 text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-imperial-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-lacquer ${
            canCreate
              ? `border-imperial-gold bg-imperial-gold text-lacquer shadow-gold-glow hover:bg-imperial-gold-light active:scale-[0.99] ${isGenerating ? 'cursor-wait' : 'cursor-pointer'}`
              : 'cursor-not-allowed border-imperial-gold/25 bg-transparent text-silk-muted'
          }`}
        >
          {isGenerating ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-lacquer/30 border-t-lacquer" />
              <span>Đang tạo bối cảnh</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Tạo và áp dụng</span>
            </>
          )}
        </button>
      </div>
    </HeritageModal>
  );
};
