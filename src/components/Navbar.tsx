import React from 'react';
import { Layers, BookMarked, UserCheck, LogIn } from 'lucide-react';

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
    <header className="sticky top-0 z-50 bg-lacquer/95 backdrop-blur-md border-b-2 border-lacquer-border transition-all">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-none bg-gradient-to-br from-imperial-red to-lacquer border-2 border-imperial-gold flex items-center justify-center shadow-gold-glow group-hover:border-imperial-gold-light transition-all">
            <span className="font-serif text-xl font-bold text-imperial-gold">VP</span>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-serif font-bold text-xl tracking-tight text-silk-ivory">Việt phục Remix</span>
              <span className="text-xs uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-none bg-imperial-gold/15 text-imperial-gold border border-imperial-gold/40 font-sans">
                Atelier 2D
              </span>
            </div>
            <p className="text-xs sm:text-sm text-silk-muted hidden sm:block font-sans font-medium">Di sản cung đình gặp thời trang đương đại</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 sm:gap-3 font-sans">
          <button
            onClick={() => onNavigate('landing')}
            className={`px-4 py-2 rounded-none text-sm sm:text-base font-semibold transition-all border ${
              currentScreen === 'landing'
                ? 'bg-lacquer-card text-imperial-gold border-imperial-gold/50 shadow-sm'
                : 'border-transparent text-silk-muted hover:text-silk-ivory hover:bg-lacquer-surface'
            }`}
          >
            Trang chủ
          </button>

          <button
            onClick={() => onNavigate('studio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-none text-sm sm:text-base font-semibold transition-all border ${
              currentScreen === 'studio'
                ? 'bg-imperial-gold/20 text-imperial-gold border-imperial-gold shadow-sm font-bold'
                : 'border-transparent text-silk-muted hover:text-silk-ivory hover:bg-lacquer-surface'
            }`}
          >
            <Layers className="w-4 h-4 text-imperial-gold" />
            <span>Studio phối đồ</span>
          </button>

          <button
            onClick={() => onNavigate('lookbook')}
            className={`flex items-center gap-2 px-4 py-2 rounded-none text-sm sm:text-base font-semibold transition-all relative border ${
              currentScreen === 'lookbook'
                ? 'bg-lacquer-card text-imperial-gold border-imperial-gold/50 shadow-sm'
                : 'border-transparent text-silk-muted hover:text-silk-ivory hover:bg-lacquer-surface'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>Lookbook</span>
            {sessionCount > 0 && (
              <span className="ml-1.5 px-2 py-0.5 text-xs font-bold rounded-none bg-imperial-red text-silk-ivory border border-imperial-red-bright">
                {sessionCount}
              </span>
            )}
          </button>
        </nav>

        {/* User Status / Auth Simulation */}
        <div className="flex items-center gap-3 font-sans">
          <button
            onClick={onToggleAuth}
            className={`flex items-center gap-2 px-4 py-2 rounded-none text-xs sm:text-sm font-semibold border transition-all ${
              isLoggedIn
                ? 'bg-imperial-teal/30 text-teal-200 border-imperial-teal-light/60 hover:bg-imperial-teal/40'
                : 'bg-lacquer-surface text-silk-muted border-lacquer-border hover:text-silk-ivory hover:border-imperial-gold/50'
            }`}
            title="Nhấn để đổi trạng thái Đăng nhập để kiểm tra phân quyền"
          >
            {isLoggedIn ? (
              <>
                <UserCheck className="w-4 h-4 text-teal-400" />
                <span className="hidden sm:inline">Thành viên: Minh Anh</span>
                <span className="sm:hidden">Đã login</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-imperial-gold" />
                <span>Khách (Đăng nhập)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
