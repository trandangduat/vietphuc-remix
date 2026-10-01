import React from 'react';
import { Sparkles, Layers, BookMarked, UserCheck, LogIn, Heart } from 'lucide-react';

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
  return (
    <header className="sticky top-0 z-50 bg-lacquer/90 backdrop-blur-md border-b border-lacquer-border transition-all">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-imperial-red to-lacquer border border-imperial-gold/40 flex items-center justify-center shadow-gold-glow group-hover:border-imperial-gold transition-all">
            <span className="font-serif text-lg font-bold text-imperial-gold">VP</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg tracking-wide text-silk-ivory">Việt phục Remix</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-imperial-gold/15 text-imperial-gold border border-imperial-gold/30">
                Atelier 2D
              </span>
            </div>
            <p className="text-xs text-silk-muted hidden sm:block">Di sản cung đình gặp thời trang Gen Z</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onNavigate('landing')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentScreen === 'landing'
                ? 'bg-lacquer-card text-imperial-gold border border-imperial-gold/30'
                : 'text-silk-muted hover:text-silk-ivory hover:bg-lacquer-surface'
            }`}
          >
            Trang chủ
          </button>

          <button
            onClick={() => onNavigate('studio')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentScreen === 'studio'
                ? 'bg-imperial-gold/15 text-imperial-gold border border-imperial-gold/40 shadow-sm'
                : 'text-silk-muted hover:text-silk-ivory hover:bg-lacquer-surface'
            }`}
          >
            <Layers className="w-4 h-4 text-imperial-gold" />
            <span>Studio phối đồ</span>
          </button>

          <button
            onClick={() => onNavigate('lookbook')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all relative ${
              currentScreen === 'lookbook'
                ? 'bg-lacquer-card text-imperial-gold border border-imperial-gold/30'
                : 'text-silk-muted hover:text-silk-ivory hover:bg-lacquer-surface'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>Lookbook</span>
            {sessionCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-imperial-red-bright text-white">
                {sessionCount}
              </span>
            )}
          </button>
        </nav>

        {/* User Status / Auth Simulation */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleAuth}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isLoggedIn
                ? 'bg-imperial-teal/30 text-teal-200 border-imperial-teal-light/50 hover:bg-imperial-teal/40'
                : 'bg-lacquer-surface text-silk-muted border-lacquer-border hover:text-silk-ivory hover:border-imperial-gold/40'
            }`}
            title="Nhấn để đổi trạng thái Đăng nhập để kiểm tra phân quyền"
          >
            {isLoggedIn ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">Thành viên: Minh Anh</span>
                <span className="sm:hidden">Đã login</span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5 text-imperial-gold" />
                <span>Khách (Đăng nhập)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
