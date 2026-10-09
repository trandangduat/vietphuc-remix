import React, { useEffect, useRef, useState } from 'react';

interface TaglineScrollRevealProps {
  className?: string;
}

/**
 * Mandatory Tagline Reveal Section (Rule B11 of landing-page-design):
 * - Minimum 2 lines of text
 * - Large type (text-4xl to text-6xl)
 * - Max width capped with meaningful line breaks
 * - Words start at 30% opacity
 * - Words activate one by one as they cross the trigger line via throttled requestAnimationFrame
 * - Uses custom cubic-bezier(0.32, 0.72, 0, 1) easing
 */
export const TaglineScrollReveal: React.FC<TaglineScrollRevealProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Line 1: Di sản không phải là cổ vật nằm yên trong tủ kính.
  // Line 2: Di sản là hơi thở của hôm nay khi bạn tự hào khoác lên mình.
  const lines = [
    ['Di sản', 'không phải', 'là cổ vật', 'nằm yên', 'trong tủ kính.'],
    ['Di sản', 'là hơi thở', 'của hôm nay', 'khi bạn', 'tự hào', 'khoác lên mình.']
  ];

  const totalWords = lines.reduce((acc, line) => acc + line.length, 0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // When top enters lower viewport (80%), start revealing.
          // Complete reveal when center reaches 40% of viewport.
          const startTrigger = windowHeight * 0.85;
          const endTrigger = windowHeight * 0.35;

          const progress = Math.min(
            1,
            Math.max(0, (startTrigger - rect.top) / (startTrigger - endTrigger))
          );
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  let globalWordIndex = 0;

  return (
    <section
      ref={containerRef}
      className={`py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-y-2 border-lacquer-border bg-[#0E131B] relative overflow-hidden ${className}`}
      aria-label="Tuyên ngôn di sản"
    >
      {/* Decorative imperial watermark in background */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5 select-none">
        <span className="font-serif text-[18vw] font-bold text-imperial-gold tracking-widest uppercase">
          DI SẢN
        </span>
      </div>

      <div className="max-w-[760px] mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-imperial-gold/30 bg-imperial-gold/10 text-imperial-gold text-xs font-semibold uppercase tracking-widest mb-8">
          <span>Triết lý sáng tạo</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.25] tracking-tight space-y-3 sm:space-y-4">
          {lines.map((lineWords, lineIndex) => (
            <div key={lineIndex} className="block [text-wrap:balance]">
              {lineWords.map((word, wIdx) => {
                const currentIdx = globalWordIndex++;
                // Calculate threshold for this word
                const wordThreshold = (currentIdx + 0.5) / totalWords;
                const isActivated = scrollProgress >= wordThreshold;

                return (
                  <span
                    key={wIdx}
                    className={`inline-block mr-[0.3em] last:mr-0 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      isActivated
                        ? lineIndex === 1 && wIdx >= 4
                          ? 'text-imperial-gold font-bold scale-100 opacity-100 drop-shadow-[0_0_20px_rgba(198,155,86,0.3)]'
                          : 'text-silk-ivory opacity-100 scale-100'
                        : 'text-silk-ivory/30 opacity-30 scale-[0.98]'
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          ))}
        </h2>

        <p className="mt-8 text-sm sm:text-base text-silk-muted max-w-xl mx-auto [text-wrap:pretty] font-normal leading-relaxed">
          Giao thoa giữa lòng tự tôn nguồn cội và tư duy thẩm mỹ không giới hạn của thế hệ trẻ Việt Nam.
        </p>
      </div>
    </section>
  );
};
