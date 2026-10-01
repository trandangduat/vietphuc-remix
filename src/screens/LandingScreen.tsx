import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Shield, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { EVENTS, PRESET_OUTFITS } from '../data/catalog';
import { EventBackground, PresetOutfit } from '../types';

interface LandingScreenProps {
  onOpenStudio: (preset?: PresetOutfit, event?: EventBackground) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onOpenStudio }) => {
  // Mini-preview animation cycling between sample outfits
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPreviewIndex((prev) => (prev + 1) % PRESET_OUTFITS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const activePreset = PRESET_OUTFITS[previewIndex];

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* 1. HERO SECTION */}
      <section className="relative pt-14 pb-24 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Subtle royal background glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-imperial-gold/10 to-transparent blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-7 text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-none bg-imperial-gold/15 border border-imperial-gold/40 text-imperial-gold text-xs sm:text-sm font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Nền tảng phối Việt phục phong cách Gen Z</span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-silk-ivory leading-[1.1] tracking-tight">
              Thổi hồn đương đại vào <span className="text-imperial-gold italic">di sản trang phục Việt</span>
            </h1>

            <p className="text-lg text-silk-muted max-w-2xl leading-relaxed font-normal">
              Khám phá vẻ đẹp chuẩn mực của Áo tấc, Áo ngũ thân triều Nguyễn kết hợp cùng Sneakers, Loafer và trang phục hiện đại. Thử đồ 2D tức thì, tra cứu văn hóa chuẩn xác và kiến tạo phong cách riêng của bạn.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={() => onOpenStudio()}
                className="py-4 px-8 rounded-none bg-imperial-gold hover:bg-imperial-gold-light text-lacquer font-extrabold text-base flex items-center gap-3 transition-all shadow-gold-glow uppercase tracking-wider"
              >
                <span>Bắt đầu phối đồ ngay</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#presets"
                className="py-4 px-7 rounded-none bg-lacquer-surface border-2 border-lacquer-border hover:border-imperial-gold text-silk-ivory text-base font-bold transition-all uppercase tracking-wider"
              >
                Xem gợi ý phối mẫu
              </a>
            </div>

            {/* Metrics Trust Bar */}
            <div className="pt-8 border-t-2 border-lacquer-border grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <span className="font-serif font-bold text-3xl sm:text-4xl text-imperial-gold block">40+</span>
                <span className="text-xs sm:text-sm text-silk-muted font-semibold uppercase tracking-wider">Mảnh phối tuyển chọn</span>
              </div>
              <div>
                <span className="font-serif font-bold text-3xl sm:text-4xl text-imperial-gold block">5</span>
                <span className="text-xs sm:text-sm text-silk-muted font-semibold uppercase tracking-wider">Bối cảnh văn hóa</span>
              </div>
              <div>
                <span className="font-serif font-bold text-3xl sm:text-4xl text-imperial-gold block">100%</span>
                <span className="text-xs sm:text-sm text-silk-muted font-semibold uppercase tracking-wider">Tư liệu kiểm chứng</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Interactive Mini-Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[360px] aspect-[3/4] rounded-none overflow-hidden border-2 border-imperial-gold shadow-atrium bg-lacquer-card p-1 group">
              <img
                src={previewIndex === 0 ? '/assets/test-composite-preview.png' : '/assets/pieces/tops/top-ao-tac-indigo.png'}
                alt="Mini Preview"
                className="w-full h-full object-cover rounded-none transition-all duration-700 bg-lacquer-surface"
              />

              {/* Floating Overlay Box */}
              <div className="absolute bottom-4 inset-x-4 p-4 rounded-none bg-lacquer/95 backdrop-blur-md border border-imperial-gold text-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-imperial-gold uppercase font-bold tracking-wider block">Gợi ý tiêu biểu</span>
                  <span className="font-sans font-bold text-base text-silk-ivory">{activePreset.name}</span>
                </div>
                <button
                  onClick={() => onOpenStudio(activePreset)}
                  className="px-4 py-2 rounded-none bg-imperial-gold text-lacquer hover:bg-imperial-gold-light text-xs font-bold transition-all uppercase tracking-wider"
                >
                  Thử ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS */}
      <section className="py-20 bg-lacquer-surface/40 border-y-2 border-lacquer-border px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-silk-ivory mb-3">
              Tại sao là Việt phục Remix?
            </h2>
            <p className="text-sm sm:text-base text-silk-muted font-medium">
              Kết hợp sự tôn trọng di sản lịch sử với công nghệ tương tác trực quan dành cho người trẻ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-none bg-lacquer-card border-2 border-lacquer-border hover:border-imperial-gold transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-none bg-imperial-gold/20 text-imperial-gold flex items-center justify-center mb-5 border border-imperial-gold/40">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-sans font-bold text-xl text-silk-ivory mb-2">
                  Tôn trọng giá trị văn hóa
                </h3>
                <p className="text-sm text-silk-muted leading-relaxed font-normal">
                  Mỗi chi tiết tà áo, nẹp cổ, kiểu dáng đều được đối chiếu từ bảo tàng uy tín và công trình nghiên cứu trang phục cổ Việt.
                </p>
              </div>
            </div>

            <div className="p-7 rounded-none bg-lacquer-card border-2 border-lacquer-border hover:border-imperial-gold transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-none bg-imperial-teal/20 text-teal-300 flex items-center justify-center mb-5 border border-imperial-teal/40">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="font-sans font-bold text-xl text-silk-ivory mb-2">
                  Phối đồ 2D thời gian thực
                </h3>
                <p className="text-sm text-silk-muted leading-relaxed font-normal">
                  Tự do thử nghiệm đổi màu swatch, xếp lớp z-index tức thì trên ma-nơ-canh chuẩn mà không cần chờ tải ảnh hay xử lý phức tạp.
                </p>
              </div>
            </div>

            <div className="p-7 rounded-none bg-lacquer-card border-2 border-lacquer-border hover:border-imperial-gold transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-none bg-imperial-red/20 text-imperial-red-bright flex items-center justify-center mb-5 border border-imperial-red/40">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-sans font-bold text-xl text-silk-ivory mb-2">
                  Trợ lý AI đồng hành
                </h3>
                <p className="text-sm text-silk-muted leading-relaxed font-normal">
                  AI Overview phân tích ngũ hành, độ phù hợp bối cảnh; AI Try on thử trang phục chân thực trên người thật với bảo mật tối đa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EVENT SHOWCASE */}
      <section className="py-20 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-silk-ivory mb-3">
              Một bộ trang phục, muôn vàn bối cảnh
            </h2>
            <p className="text-sm sm:text-base text-silk-muted font-medium">
              Chọn bối cảnh sự kiện để Studio tự động đồng bộ phông nền phía sau ma-nơ-canh
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {EVENTS.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className="group relative rounded-none overflow-hidden border-2 border-lacquer-border hover:border-imperial-gold transition-all shadow-lg flex flex-col aspect-[4/3] bg-lacquer-card"
            >
              <img
                src={event.bgUrl}
                alt={event.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-lacquer via-lacquer/50 to-transparent" />

              <div className="relative z-10 mt-auto p-6">
                <h3 className="font-sans font-bold text-xl text-silk-ivory mb-2">
                  {event.name}
                </h3>
                <p className="text-sm text-silk-muted line-clamp-2 mb-4 font-normal">
                  {event.description}
                </p>
                <button
                  onClick={() => onOpenStudio(undefined, event)}
                  className="inline-flex items-center gap-2 text-sm font-bold text-imperial-gold group-hover:text-imperial-gold-light uppercase tracking-wider transition-colors"
                >
                  <span>Phối đồ cho sự kiện này</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRESETS */}
      <section id="presets" className="py-20 bg-lacquer-surface/30 border-t-2 border-lacquer-border px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-silk-ivory mb-3">
              Bộ sưu tập gợi ý nổi bật
            </h2>
            <p className="text-sm sm:text-base text-silk-muted font-medium">
              Khám phá các tổ hợp trang phục do ban biên tập tuyển chọn, nạp vào Studio chỉ với 1 click
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {PRESET_OUTFITS.map((preset) => (
              <div
                key={preset.id}
                className="p-7 rounded-none bg-lacquer-card border-2 border-lacquer-border hover:border-imperial-gold transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-none bg-imperial-gold/20 text-imperial-gold border border-imperial-gold/40">
                      {preset.style}
                    </span>
                    <span className="text-xs text-silk-muted font-semibold uppercase tracking-wider">Dành cho {preset.gender === 'men' ? 'Nam' : 'Nữ'}</span>
                  </div>
                  <h3 className="font-sans font-bold text-2xl text-silk-ivory group-hover:text-imperial-gold transition-colors mb-3">
                    {preset.name}
                  </h3>
                  <p className="text-sm text-silk-muted leading-relaxed mb-6 font-normal">
                    {preset.description}
                  </p>
                </div>

                <button
                  onClick={() => onOpenStudio(preset)}
                  className="w-full py-4 rounded-none bg-lacquer-surface border-2 border-imperial-gold text-imperial-gold font-bold text-sm uppercase tracking-wider hover:bg-imperial-gold hover:text-lacquer transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Thử outfit này trong Studio</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRIVACY PLEDGE */}
      <section className="py-20 px-4 sm:px-6 lg:px-10 max-w-4xl mx-auto text-center">
        <div className="p-8 sm:p-10 rounded-none bg-lacquer-card border-2 border-lacquer-border relative overflow-hidden">
          <Shield className="w-12 h-12 text-teal-400 mx-auto mb-4" />
          <h3 className="font-serif font-bold text-2xl sm:text-3xl text-silk-ivory mb-3">
            Cam kết an toàn & Quyền riêng tư hình ảnh
          </h3>
          <p className="text-sm sm:text-base text-silk-muted max-w-xl mx-auto leading-relaxed mb-6 font-normal">
            Mọi hình ảnh chân dung tải lên đều được xóa khỏi bộ nhớ tạm ngay sau khi tạo kết quả. Hình ảnh khuôn mặt của bạn không bao giờ bị chia sẻ công khai trừ khi bạn chủ động xác nhận cho phép.
          </p>
          <div className="inline-flex items-center gap-2.5 text-sm text-teal-300 font-bold bg-imperial-teal/20 px-5 py-2.5 rounded-none border border-imperial-teal/40 uppercase tracking-wider">
            <CheckCircle2 className="w-5 h-5" />
            <span>Được bảo vệ theo chuẩn Quyền riêng tư Việt phục Remix</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto py-12 border-t-2 border-lacquer-border bg-lacquer text-xs sm:text-sm text-silk-muted px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Việt phục Remix. Dự án phi lợi nhuận tôn vinh di sản trang phục truyền thống Việt Nam.</p>
          <div className="flex gap-4">
            <span className="text-silk-ivory font-medium">Nguồn tham khảo: Bảo tàng Lịch sử Quốc gia & Bảo tàng Phụ nữ Nam Bộ</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
