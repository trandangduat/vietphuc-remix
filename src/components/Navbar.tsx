import React from 'react';
import { BookMarked, UserCheck, LogIn, ChevronRight } from 'lucide-react';

interface NavbarProps {
  currentScreen: 'landing' | 'studio' | 'lookbook';
  onNavigate: (screen: 'landing' | 'studio' | 'lookbook') => void;
  sessionCount: number;
  isLoggedIn: boolean;
  onToggleAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  sessionCount,
  isLoggedIn,
  onToggleAuth,
}) => {
  const navItems = [
    { id: 'landing' as const, label: 'Trang chủ' },
    { id: 'studio' as const, label: 'Studio phối đồ' },
    { id: 'lookbook' as const, label: 'Lookbook', count: sessionCount },
  ];

  return (
    <header className="sticky top-0 z-50 bg-lacquer/95 backdrop-blur-md border-b border-imperial-gold/20 shadow-lg transition-all font-sans select-none">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand Identity: Haute Couture Maison Style */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group py-1"
        >
          {/* Imperial Vermilion & Gold Monogram Seal */}
          <div className="w-8 h-8 rounded-none bg-gradient-to-br from-imperial-red/80 via-lacquer to-lacquer border border-imperial-gold flex items-center justify-center shadow-gold-glow group-hover:border-imperial-gold-light group-hover:scale-105 transition-all flex-shrink-0">
            <span className="font-serif text-sm font-bold text-imperial-gold tracking-widest">VP</span>
          </div>

          {/* Typographic Wordmark & Haute Atelier Tag */}
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-silk-ivory group-hover:text-imperial-gold transition-colors">
              Việt phục Remix
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] px-2 py-0.5 rounded-none bg-imperial-gold/10 text-imperial-gold border border-imperial-gold/30 hidden xs:inline-block">
              Atelier 2D
            </span>
          </div>
        </div>

        {/* Center: Haute Couture Atelier Unified Nav Items */}
        <nav className="h-full flex items-center gap-1 sm:gap-2 lg:gap-4">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative h-full px-2.5 sm:px-4 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium tracking-wide transition-all ${
                  isActive
                    ? 'text-imperial-gold font-semibold'
                    : 'text-silk-muted hover:text-silk-ivory hover:bg-lacquer-surface/40'
                }`}
              >
                <span>{item.label}</span>

                {/* Refined Count Pill for Lookbook */}
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 text-[10px] font-bold rounded-none transition-all ${
                      isActive
                        ? 'bg-imperial-gold text-lacquer shadow-sm font-extrabold'
                        : 'bg-imperial-gold/15 text-imperial-gold border border-imperial-gold/30'
                    }`}
                  >
                    {item.count}
                  </span>
                )}

                {/* Active Golden Hairline Indicator */}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-imperial-gold shadow-[0_0_10px_rgba(198,155,86,0.9)] animate-fadeIn" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Atelier Member / Guest Profile (Lacquer & Gold Heritage Palette) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleAuth}
            className={`flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-none text-xs sm:text-sm font-medium border transition-all ${
              isLoggedIn
                ? 'bg-lacquer-surface border-imperial-gold/50 text-silk-ivory hover:border-imperial-gold hover:bg-lacquer-hover'
                : 'bg-lacquer-surface/70 border-lacquer-border text-silk-muted hover:text-silk-ivory hover:border-imperial-gold/40'
            }`}
            title="Nhấp để chuyển đổi trạng thái Đăng nhập / Khách để thử nghiệm"
          >
            {isLoggedIn ? (
              <>
                {/* Monogram Avatar Badge */}
                <div className="w-5 h-5 rounded-none bg-imperial-gold/20 border border-imperial-gold/60 text-imperial-gold flex items-center justify-center text-[10px] font-serif font-bold">
                  MA
                </div>
                <span className="hidden sm:inline font-medium text-silk-ivory">Minh Anh</span>
                <span className="text-[10px] uppercase font-bold text-imperial-gold px-1.5 py-0.2 bg-imperial-gold/15 border border-imperial-gold/30 hidden md:inline">
                  Thành viên
                </span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5 text-imperial-gold" />
                <span className="text-silk-ivory">Đăng nhập</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
