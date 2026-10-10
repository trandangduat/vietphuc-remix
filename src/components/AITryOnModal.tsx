import React, { useState, useRef, useEffect } from 'react';
import {
  Shirt,
  Sparkles,
  Upload,
  Download,
  Check,
  CheckCircle2,
  X,
  Lock,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { ActiveOutfitState } from '../types';
import { HeritageModal } from './heritage/HeritageFrame';
import {
  callAITryOnService,
  renderStudioPreviewCanvas,
  getSavedPollinationsApiKey,
} from '../services/tryOnService';

interface AITryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfit: ActiveOutfitState;
  onSaveToLookbook: (tryOnResultUrl: string) => void;
  isLoggedIn?: boolean;
  onLoginPrompt?: () => void;
}

/** Column is exactly the 3:4 plate width, so labels and captions share the image edges. */
const PREVIEW_COLUMN = 'flex w-[min(100%,calc(min(48dvh,480px)*0.75))] flex-col';
const PREVIEW_TILE =
  'relative aspect-[3/4] w-full overflow-hidden bg-[radial-gradient(ellipse_at_50%_38%,_#1c2433_0%,_#10141c_48%,_#0a0d12_100%)] ring-1 ring-inset ring-imperial-gold/25';

function SlotMeta({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="min-w-0 pt-2">
      <p className="truncate text-[15px] font-medium leading-snug text-silk-ivory">{title}</p>
      <p className="mt-0.5 truncate text-[13px] leading-snug text-silk-muted">{subtitle}</p>
    </div>
  );
}

function primaryActionClass(active: boolean, busy?: boolean) {
  return [
    'flex min-h-[3rem] w-full items-center justify-center gap-2 px-5 text-[15px] font-semibold transition-[color,background-color,transform,box-shadow] duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-imperial-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-lacquer',
    active
      ? `border border-imperial-gold bg-imperial-gold text-lacquer shadow-gold-glow hover:bg-imperial-gold-light active:scale-[0.99] ${busy ? 'cursor-wait' : 'cursor-pointer'}`
      : 'cursor-not-allowed border border-imperial-gold/25 bg-transparent text-silk-muted',
  ].join(' ');
}

export const AITryOnModal: React.FC<AITryOnModalProps> = ({
  isOpen,
  onClose,
  outfit,
  onSaveToLookbook,
  isLoggedIn = false,
  onLoginPrompt,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string>('');
  const [studioPreview, setStudioPreview] = useState<string | null>(null);
  const [isMinorConsent, setIsMinorConsent] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-render the exact Studio canvas preview whenever modal opens or outfit changes
  useEffect(() => {
    if (isOpen) {
      renderStudioPreviewCanvas(outfit)
        .then((dataUrl) => setStudioPreview(dataUrl))
        .catch((err) => console.warn('Could not pre-render studio preview:', err));
    }
  }, [isOpen, outfit]);

  // Handle file upload from device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WebP).');
        return;
      }
      setErrorMessage(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedPhoto(event.target?.result as string);
        setPhotoName(file.name);
        setGeneratedResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger Multimodal AI Virtual Try-On
  const handleStartGeneration = async () => {
    if (!selectedPhoto) {
      setErrorMessage('Vui lòng tải lên ảnh chân dung của bạn.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const apiKey = getSavedPollinationsApiKey();
      const response = await callAITryOnService(
        {
          faceImage: selectedPhoto,
          studioPreviewImage: studioPreview || undefined,
          outfit,
          apiKey: apiKey.trim() || undefined,
        },
      );

      if (response.status === 'success' && response.imageUrl) {
        setGeneratedResult(response.imageUrl);
      } else {
        setErrorMessage(response.errorMessage || 'Lỗi khi tạo ảnh. Vui lòng thử lại.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Không thể kết nối dịch vụ. Vui lòng thử lại sau.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Download high-resolution PNG
  const handleDownload = () => {
    if (!generatedResult) return;
    const link = document.createElement('a');
    link.download = `vietphuc-tryon-${Date.now()}.png`;
    link.href = generatedResult;
    link.click();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const topName = outfit.topPiece?.name || outfit.topVariant?.name || 'Áo tấc truyền thống';
  const eventName = outfit.event.name || 'Không gian cổ kính';

  const canStart = Boolean(selectedPhoto) && isMinorConsent;

  return (
    <HeritageModal
      isOpen={isOpen}
      onClose={onClose}
      title="Thử Trang Phục"
      subtitle="Bản phối Studio và ảnh chân dung của bạn."
      icon={<Shirt className="h-6 w-6 flex-shrink-0 text-imperial-gold" fill="currentColor" strokeWidth={0} />}
      bareIcon
      maxWidth="max-w-4xl"
      contentClassName="overflow-hidden"
    >
      <div className="font-sans text-silk-ivory">
        {errorMessage && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 border border-rose-400/35 bg-rose-950/40 px-3 py-2 text-[13px] leading-relaxed text-rose-100"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-300" />
            <p className="min-w-0 flex-1 pt-px">{errorMessage}</p>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              aria-label="Đóng thông báo"
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center text-rose-300 hover:text-silk-ivory cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {!generatedResult ? (
          <div className="flex flex-col gap-4">
            <div className="mx-auto grid w-full grid-cols-1 justify-items-center gap-y-4 sm:grid-cols-2 sm:gap-x-8">
              <section className={PREVIEW_COLUMN}>
                <h4 className="mb-2 text-[13px] font-medium text-silk-muted">Trang phục đã chọn</h4>
                <div className={PREVIEW_TILE}>
                  {studioPreview ? (
                    <img
                      src={studioPreview}
                      alt="Trang phục đã chọn"
                      className="h-full w-full object-contain object-center"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-[13px] text-silk-muted">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-imperial-gold/30 border-t-imperial-gold" />
                      <span>Đang tải trang phục</span>
                    </div>
                  )}
                </div>
                <div className="min-h-[2.75rem]">
                  {studioPreview && <SlotMeta title={topName} subtitle={eventName} />}
                </div>
              </section>

              <section className={PREVIEW_COLUMN}>
                <div className="mb-2 flex min-h-[1.25rem] items-center justify-between gap-3">
                  <h4 className="text-[13px] font-medium text-silk-muted">Ảnh chân dung</h4>
                  {selectedPhoto && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[13px] font-medium text-imperial-gold-light transition-colors hover:text-silk-ivory cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-imperial-gold"
                    >
                      Đổi ảnh
                    </button>
                  )}
                </div>

                {selectedPhoto ? (
                  <div className={PREVIEW_TILE}>
                    <img
                      src={selectedPhoto}
                      alt={photoName ? `Ảnh chân dung ${photoName}` : 'Ảnh chân dung đã chọn'}
                      className="h-full w-full object-cover object-[center_22%]"
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`${PREVIEW_TILE} flex cursor-pointer flex-col items-center justify-center gap-3 text-center transition-colors hover:bg-imperial-gold/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-imperial-gold`}
                  >
                    <span className="flex h-11 w-11 items-center justify-center border border-imperial-gold/40 bg-imperial-gold/[0.07]">
                      <Upload className="h-5 w-5 text-imperial-gold" strokeWidth={1.5} />
                    </span>
                    <span className="text-[15px] font-medium text-silk-ivory">Tải ảnh chân dung</span>
                  </button>
                )}

                <div className="min-h-[2.75rem]">
                  {selectedPhoto && (
                    <SlotMeta title={photoName || 'Ảnh đã chọn'} subtitle="Sẵn sàng để thử" />
                  )}
                </div>
              </section>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              className="sr-only"
              onChange={handleFileChange}
            />

            <div className="flex flex-col gap-3 border-t border-imperial-gold/15 pt-4">
              <label className="flex min-h-11 cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={isMinorConsent}
                  onChange={(e) => setIsMinorConsent(e.target.checked)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center border border-imperial-gold/50 text-lacquer peer-checked:border-imperial-gold peer-checked:bg-imperial-gold peer-focus-visible:ring-2 peer-focus-visible:ring-imperial-gold-light peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-lacquer"
                >
                  {isMinorConsent && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                </span>
                <span className="text-[13px] leading-relaxed text-silk-ivory/75">
                  Dưới 16 tuổi: xác nhận đã có sự đồng ý của phụ huynh hoặc người giám hộ.
                </span>
              </label>

              <button
                type="button"
                onClick={handleStartGeneration}
                disabled={!canStart || isGenerating}
                aria-busy={isGenerating}
                aria-label={isGenerating ? 'Đang thử trang phục' : 'Thử trang phục'}
                className={primaryActionClass(canStart, isGenerating)}
              >
                {isGenerating ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-lacquer/30 border-t-lacquer" />
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Thử trang phục</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 sm:gap-5">
            <div className="mx-auto w-[min(100%,calc(min(52dvh,460px)*0.75))]">
              <div className={PREVIEW_TILE}>
                <img
                  src={generatedResult}
                  alt="Ảnh thử trang phục"
                  className="h-full w-full object-cover object-[center_20%]"
                />
              </div>
            </div>

            <p className="max-w-md text-center text-[15px] leading-relaxed text-silk-muted">
              Ảnh đã sẵn sàng — tải về hoặc lưu vào bộ sưu tập.
            </p>

            <div className="flex w-full max-w-sm flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (!isLoggedIn) {
                    onLoginPrompt?.();
                    return;
                  }
                  onSaveToLookbook(generatedResult);
                  onClose();
                }}
                className={primaryActionClass(true)}
              >
                {!isLoggedIn && <Lock className="h-4 w-4" />}
                <span>{isLoggedIn ? 'Lưu vào bộ sưu tập' : 'Đăng nhập để lưu'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 border border-imperial-gold/30 bg-black/20 px-4 text-[15px] font-medium text-silk-ivory transition-colors hover:border-imperial-gold/60 hover:bg-imperial-gold/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-imperial-gold"
              >
                {downloadSuccess ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-imperial-gold-light" />
                    <span>Đã tải về máy</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Tải về máy</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setGeneratedResult(null);
                  setSelectedPhoto(null);
                  setPhotoName('');
                  setErrorMessage(null);
                }}
                className="flex min-h-10 w-full cursor-pointer items-center justify-center gap-2 text-[14px] font-medium text-silk-muted transition-colors hover:text-silk-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-imperial-gold"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Thử ảnh khác</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </HeritageModal>
  );
};
