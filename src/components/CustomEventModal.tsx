import React, { useEffect, useState } from 'react';
import { AlertCircle, Check, Sparkles, X } from 'lucide-react';
import { EventBackground } from '../types';
import { HeritageModal } from './heritage/HeritageFrame';
import { generateSceneBackground } from '../services/tryOnService';
import { saveUserScene } from '../services/sceneService';

interface CustomEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  onEventCreated: (event: EventBackground) => void;
}

function SceneTitleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-imperial-gold" aria-hidden>
      <circle cx="16.2" cy="7.2" r="2.15" fill="currentColor" />
      <path
        fill="currentColor"
        d="M2.8 17.2 7.6 11.4c.35-.42.98-.44 1.36-.04L11.6 14l3.15-3.7c.34-.4.96-.42 1.33-.04L21.2 15.6V19a1.2 1.2 0 0 1-1.2 1.2H4A1.2 1.2 0 0 1 2.8 19v-1.8Z"
      />
    </svg>
  );
}

function shortSceneName(description: string): string {
  const words = description.trim().split(/\s+/).slice(0, 4).join(' ');
  return words.length > 28 ? `${words.slice(0, 28).trim()}` : words;
}

export const CustomEventModal: React.FC<CustomEventModalProps> = ({
  isOpen,
  onClose,
  userId,
  onEventCreated,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pending, setPending] = useState<{ description: string; imageUrl: string } | null>(null);
  const [sceneName, setSceneName] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setPending(null);
      setSceneName('');
      setErrorMessage(null);
      setIsGenerating(false);
      setIsSaving(false);
    }
  }, [isOpen]);

  const SUGGESTIONS = [
    'Quán cà phê phố cổ Hội An lúc hoàng hôn rực rỡ',
    'Triển lãm mỹ thuật đương đại Hà Nội ánh sáng tối giản',
    'Sân đình chùa Thầy cổ kính rêu phong mùa trẩy hội',
    'Con đường hoa phượng đỏ trường THPT Quốc Học Huế',
  ];

  const handleGenerate = async () => {
    const description = prompt.trim();
    if (!description || isGenerating) return;
    setIsGenerating(true);
    setErrorMessage(null);

    const response = await generateSceneBackground(description);
    setIsGenerating(false);

    if (response.status !== 'success' || !response.imageUrl) {
      setErrorMessage(response.errorMessage || 'Không tạo được bối cảnh. Vui lòng thử lại.');
      return;
    }

    setPending({ description, imageUrl: response.imageUrl });
    setSceneName(shortSceneName(description));
  };

  const discardScene = () => {
    setPending(null);
    setSceneName('');
    setPrompt('');
    onClose();
  };

  const saveScene = async () => {
    if (!pending || isSaving) return;
    const name = sceneName.trim();
    if (!name) {
      setErrorMessage('Hãy đặt một tên ngắn cho bối cảnh.');
      return;
    }
    if (!userId) {
      setErrorMessage('Cần đăng nhập để lưu bối cảnh.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    try {
      const saved = await saveUserScene(userId, {
        name,
        description: pending.description,
        imageDataUrl: pending.imageUrl,
      });
      onEventCreated(saved);
      setPrompt('');
      setPending(null);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không lưu được bối cảnh. Vui lòng thử lại.';
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  const canCreate = Boolean(prompt.trim());

  return (
    <HeritageModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo Bối Cảnh"
      subtitle="Mô tả không gian để có một nền riêng cho Studio"
      icon={<SceneTitleIcon />}
      bareIcon
      maxWidth="max-w-3xl"
      contentClassName="overflow-hidden !pb-8 sm:!pb-10"
    >
      <div className="flex flex-col gap-4 font-sans sm:gap-5">
        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-3 border border-rose-400/35 bg-rose-950/40 px-3 py-2 text-[13px] leading-relaxed text-rose-100"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-300" />
            <p className="min-w-0 flex-1 pt-px">{errorMessage}</p>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              aria-label="Đóng thông báo"
              className="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center text-rose-300 hover:text-silk-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {pending ? (
          <div className="flex flex-col gap-4">
            <div className="mx-auto w-full overflow-hidden bg-black/30 ring-1 ring-inset ring-imperial-gold/25">
              <img
                src={pending.imageUrl}
                alt="Bối cảnh vừa tạo"
                className="mx-auto max-h-[min(38dvh,360px)] w-full object-contain"
              />
            </div>
            <p className="text-center text-[15px] leading-relaxed text-silk-ivory">Lưu bối cảnh này để dùng lại lần sau?</p>
            <label className="flex flex-col gap-2">
              <span className="text-[13px] font-medium text-silk-muted">Tên bối cảnh</span>
              <input
                value={sceneName}
                maxLength={32}
                onChange={(e) => setSceneName(e.target.value)}
                className="w-full border border-imperial-gold/25 bg-black/30 px-3.5 py-2.5 text-[15px] text-silk-ivory focus:border-imperial-gold-light focus:outline-none"
              />
            </label>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={discardScene}
                disabled={isSaving}
                className="flex min-h-12 cursor-pointer items-center justify-center border border-imperial-gold/30 px-3 text-[15px] font-medium text-silk-ivory hover:border-imperial-gold/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-imperial-gold disabled:cursor-not-allowed disabled:opacity-60"
              >
                Không lưu
              </button>
              <button
                type="button"
                onClick={saveScene}
                disabled={isSaving || !sceneName.trim()}
                className="flex min-h-12 cursor-pointer items-center justify-center border border-imperial-gold bg-imperial-gold px-3 text-[15px] font-semibold text-lacquer hover:bg-imperial-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-imperial-gold-light disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? 'Đang lưu' : 'Lưu'}
              </button>
            </div>
          </div>
        ) : (
          <>
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

            <p className="text-center text-[13px] leading-relaxed text-silk-muted">
              Giai đoạn này có thể mất vài phút.
            </p>

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
                  <span>Tạo bối cảnh</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </HeritageModal>
  );
};
