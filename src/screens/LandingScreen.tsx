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
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Subtle royal background glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-imperial-gold/10 to-transparent blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-imperial-gold/15 border border-imperial-gold/30 text-imperial-gold text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nền tảng phối Việt phục phong cách Gen Z</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-silk-ivory leading-[1.15] tracking-tight">
              Thổi hồn đương đại vào <span className="text-imperial-gold italic">di sản trang phục Việt</span>
            </h1>

            <p className="text-base text-silk-muted max-w-2xl leading-relaxed">
              Khám phá vẻ đẹp chuẩn mực của Áo tấc, Áo ngũ thân triều Nguyễn kết hợp cùng Sneakers, Loafer và trang phục hiện đại. Thử đồ 2D tức thì, tra cứu văn hóa chuẩn xác và kiến tạo phong cách riêng của bạn.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onOpenStudio()}
                className="py-3.5 px-8 rounded-xl bg-imperial-gold hover:bg-imperial-gold-light text-lacquer font-bold text-sm flex items-center gap-2.5 transition-all shadow-gold-glow group"
              >
                <span>Bắt đầu phối đồ ngay</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#presets"
                className="py-3.5 px-6 rounded-xl bg-lacquer-surface border border-lacquer-border hover:border-imperial-gold/50 text-silk-ivory text-sm font-semibold transition-all"
              >
                Xem gợi ý phối mẫu
              </a>
            </div>

            {/* Metrics Trust Bar */}
            <div className="pt-8 border-t border-lacquer-border/60 grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <span className="font-serif font-bold text-2xl text-imperial-gold block">40+</span>
                <span className="text-xs text-silk-muted">Mảnh phối tuyển chọn</span>
              </div>
              <div>
                <span className="font-serif font-bold text-2xl text-imperial-gold block">5</span>
                <span className="text-xs text-silk-muted">Bối cảnh văn hóa</span>
              </div>
              <div>
                <span className="font-serif font-bold text-2xl text-imperial-gold block">100%</span>
                <span className="text-xs text-silk-muted">Tư liệu kiểm chứng</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Interactive Mini-Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] aspect-[3/4] rounded-2xl overflow-hidden border border-imperial-gold/40 shadow-atrium bg-lacquer-card p-1 group">
              <img
                src={previewIndex === 0 ? '/assets/test-composite-preview.png' : '/assets/pieces/tops/top-ao-tac-indigo.png'}
                alt="Mini Preview"
                className="w-full h-full object-cover rounded-xl transition-all duration-700 bg-lacquer-surface"
              />

              {/* Floating Overlay Pill */}
              <div className="absolute bottom-4 inset-x-4 p-3 rounded-xl bg-lacquer/90 backdrop-blur-md border border-lacquer-border text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-imperial-gold uppercase font-bold tracking-wider block">Gợi ý tiêu biểu</span>
                  <span className="font-serif font-bold text-silk-ivory">{activePreset.name}</span>
                </div>
                <button
                  onClick={() => onOpenStudio(activePreset)}
                  className="px-3 py-1.5 rounded-lg bg-imperial-gold/20 text-imperial-gold hover:bg-imperial-gold hover:text-lacquer text-[11px] font-bold transition-all border border-imperial-gold/40"
                >
                  Thử ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS */}
      <section className="py-16 bg-lacquer-surface/40 border-y border-lacquer-border px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-silk-ivory mb-2">
              Tại sao là Việt phục Remix?
            </h2>
            <p className="text-xs sm:text-sm text-silk-muted">
              Kết hợp sự tôn trọng di sản lịch sử với công nghệ tương tác trực quan dành cho người trẻ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-lacquer-card border border-lacquer-border hover:border-imperial-gold/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-imperial-gold/15 text-imperial-gold flex items-center justify-center mb-4">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-silk-ivory mb-2">
                  Tôn trọng giá trị văn hóa
                </h3>
                <p className="text-xs text-silk-muted leading-relaxed">
                  Mỗi chi tiết tà áo, nẹp cổ, kiểu dáng đều được đối chiếu từ bảo tàng uy tín và công trình nghiên cứu trang phục cổ Việt.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-lacquer-card border border-lacquer-border hover:border-imperial-gold/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-imperial-teal/20 text-teal-300 flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-silk-ivory mb-2">
                  Phối đồ 2D thời gian thực
                </h3>
                <p className="text-xs text-silk-muted leading-relaxed">
                  Tự do thử nghiệm đổi màu swatch, xếp lớp z-index tức thì trên ma-nơ-canh chuẩn mà không cần chờ tải ảnh hay xử lý phức tạp.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-lacquer-card border border-lacquer-border hover:border-imperial-gold/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-imperial-red/20 text-imperial-red-bright flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-silk-ivory mb-2">
                  Trợ lý AI đồng hành
                </h3>
                <p className="text-xs text-silk-muted leading-relaxed">
                  AI Overview phân tích ngũ hành, độ phù hợp bối cảnh; AI Try on thử trang phục chân thực trên người thật với bảo mật tối đa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EVENT SHOWCASE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="font-serif text-3xl font-bold text-silk-ivory mb-2">
              Một bộ trang phục, muôn vàn bối cảnh
            </h2>
            <p className="text-xs sm:text-sm text-silk-muted">
              Chọn bối cảnh sự kiện để Studio tự động đồng bộ phông nền phía sau ma-nơ-canh
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {EVENTS.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className="group relative rounded-2xl overflow-hidden border border-lacquer-border hover:border-imperial-gold/50 transition-all shadow-lg flex flex-col aspect-[4/3] bg-lacquer-card"
            >
              <img
                src={event.bgUrl}
                alt={event.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-lacquer via-lacquer/40 to-transparent" />

              <div className="relative z-10 mt-auto p-5">
                <h3 className="font-serif font-bold text-lg text-silk-ivory mb-1">
                  {event.name}
                </h3>
                <p className="text-xs text-silk-muted line-clamp-2 mb-3">
                  {event.description}
                </p>
                <button
                  onClick={() => onOpenStudio(undefined, event)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-imperial-gold group-hover:text-imperial-gold-light transition-colors"
                >
                  <span>Phối đồ cho sự kiện này</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRESETS */}
      <section id="presets" className="py-16 bg-lacquer-surface/30 border-t border-lacquer-border px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl font-bold text-silk-ivory mb-2">
              Bộ sưu tập gợi ý nổi bật
            </h2>
            <p className="text-xs sm:text-sm text-silk-muted">
              Khám phá các tổ hợp trang phục do ban biên tập tuyển chọn, nạp vào Studio chỉ với 1 click
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {PRESET_OUTFITS.map((preset) => (
              <div
                key={preset.id}
                className="p-6 rounded-2xl bg-lacquer-card border border-lacquer-border hover:border-imperial-gold/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-imperial-gold/15 text-imperial-gold border border-imperial-gold/30">
                      {preset.style}
                    </span>
                    <span className="text-xs text-silk-muted">Dành cho {preset.gender === 'men' ? 'Nam' : 'Nữ'}</span>
                  </div>
                  <h3 className="font-serif font-bold text-xl text-silk-ivory group-hover:text-imperial-gold transition-colors mb-2">
                    {preset.name}
                  </h3>
                  <p className="text-xs text-silk-muted leading-relaxed mb-6">
                    {preset.description}
                  </p>
                </div>

                <button
                  onClick={() => onOpenStudio(preset)}
                  className="w-full py-3 rounded-xl bg-lacquer-surface border border-imperial-gold/40 text-imperial-gold font-bold text-xs hover:bg-imperial-gold hover:text-lacquer transition-all flex items-center justify-center gap-2"
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="p-8 rounded-3xl bg-lacquer-card border border-lacquer-border relative overflow-hidden">
          <Shield className="w-10 h-10 text-teal-400 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-xl text-silk-ivory mb-2">
            Cam kết an toàn & Quyền riêng tư hình ảnh
          </h3>
          <p className="text-xs sm:text-sm text-silk-muted max-w-xl mx-auto leading-relaxed mb-6">
            Mọi hình ảnh chân dung tải lên đều được xóa khỏi bộ nhớ tạm ngay sau khi tạo kết quả. Hình ảnh khuôn mặt của bạn không bao giờ bị chia sẻ công khai trừ khi bạn chủ động xác nhận cho phép.
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-teal-300 font-semibold bg-imperial-teal/20 px-4 py-2 rounded-full border border-imperial-teal/40">
            <CheckCircle2 className="w-4 h-4" />
            <span>Được bảo vệ theo chuẩn Quyền riêng tư Việt phục Remix</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto py-12 border-t border-lacquer-border bg-lacquer text-xs text-silk-muted px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Việt phục Remix. Dự án phi lợi nhuận tôn vinh di sản trang phục truyền thống Việt Nam.</p>
          <div className="flex gap-4">
            <span className="text-silk-ivory">Nguồn tham khảo: Bảo tàng Lịch sử Quốc gia & Bảo tàng Phụ nữ Nam Bộ</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
