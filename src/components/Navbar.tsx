import React, { useState, useRef, useEffect } from 'react';
import { BookMarked, User, LogOut, LogIn, ChevronDown, Sparkles, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentScreen: 'landing' | 'studio' | 'lookbook';
  onNavigate: (screen: 'landing' | 'studio' | 'lookbook') => void;
  sessionCount: number;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  sessionCount,
  onOpenAuth,
}) => {
  const { user, profile, signOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isUserMenuOpen]);

  // Compute initials from display name
  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Tài khoản';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'VP';

  const navItems = [
    { id: 'landing' as const, label: 'Trang chủ', requiresAuth: false },
    { id: 'studio' as const, label: 'Studio phối đồ', requiresAuth: false },
    { id: 'lookbook' as const, label: 'Bộ sưu tập', count: sessionCount, requiresAuth: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-lacquer/95 backdrop-blur-md border-b border-imperial-gold/20 shadow-lg font-sans select-none">
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

        {/* Center: Haute Couture Atelier Unified Nav Items (Zero Layout Shift) */}
        <nav className="h-full flex items-center gap-1 sm:gap-2 lg:gap-4">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            const isGated = Boolean(item.requiresAuth && !user);

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isGated) {
                    onOpenAuth();
                    return;
                  }
                  onNavigate(item.id);
                }}
                title={isGated ? 'Đăng nhập với Google để truy cập Bộ sưu tập' : undefined}
                /* Constant font-medium & fixed paddings to ensure zero horizontal shift */
                className={`relative h-full px-3 sm:px-4 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium tracking-wide transition-colors cursor-pointer ${
                  isActive
                    ? 'text-imperial-gold'
                    : 'text-silk-muted hover:text-silk-ivory hover:bg-lacquer-surface/40'
                }`}
              >
                <span>{item.label}</span>

                {/* Lock indicator for member-only screens */}
                {isGated && (
                  <Lock className="w-3 h-3 text-imperial-gold/70 stroke-[2.2]" />
                )}

                {/* Lookbook Count Badge */}
                {!isGated && item.count !== undefined && item.count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 text-[10px] font-bold rounded-none transition-colors ${
                      isActive
                        ? 'bg-imperial-gold text-lacquer shadow-sm'
                        : 'bg-imperial-gold/15 text-imperial-gold border border-imperial-gold/30'
                    }`}
                  >
                    {item.count}
                  </span>
                )}

                {/* Active Golden Hairline Indicator */}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-2 h-[2px] bg-imperial-gold shadow-[0_0_10px_rgba(198,155,86,0.9)] animate-fadeIn" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: User Profile (Avatar + Name + Chevron Toggle with Dropdown) */}
        <div ref={userMenuRef} className="relative flex items-center">
          {user ? (
            <div>
              {/* Trigger Button: Avatar + Name + Chevron */}
              <button
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 transition-all cursor-pointer rounded-md ${
                  isUserMenuOpen
                    ? 'bg-lacquer-surface text-imperial-gold'
                    : 'text-silk-ivory hover:bg-lacquer-surface/80'
                }`}
              >
                {/* Avatar image or monogram */}
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="w-7 h-7 rounded-full object-cover border border-imperial-gold/60 shadow-sm"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-imperial-gold/20 border border-imperial-gold/60 text-imperial-gold flex items-center justify-center text-xs font-serif font-bold shadow-sm">
                    {initials}
                  </div>
                )}

                {/* Name */}
                <span className="text-sm font-medium text-silk-ivory hidden sm:inline max-w-[120px] truncate">
                  {displayName}
                </span>

                {/* Chevron Toggle */}
                <ChevronDown
                  className={`w-4 h-4 text-silk-muted transition-transform duration-200 ${
                    isUserMenuOpen ? 'rotate-180 text-imperial-gold' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-lacquer-card border border-imperial-gold/60 shadow-2xl rounded-lg p-1.5 z-50 animate-fadeIn font-sans">
                  {/* User info banner */}
                  <div className="px-3 py-2 border-b border-lacquer-border/80 mb-1">
                    <p className="text-xs font-bold text-silk-ivory truncate">{displayName}</p>
                    <p className="text-[11px] text-silk-muted truncate">{user.email}</p>
                  </div>

                  {/* User Profile Action */}
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigate('lookbook');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium text-silk-ivory hover:text-imperial-gold hover:bg-lacquer-surface rounded-md transition-all text-left cursor-pointer"
                  >
                    <User className="w-4 h-4 text-imperial-gold flex-shrink-0" />
                    <span>Bộ sưu tập cá nhân</span>
                  </button>

                  <div className="my-1 border-t border-lacquer-border" />

                  {/* Logout Action */}
                  <button
                    onClick={async () => {
                      setIsUserMenuOpen(false);
                      await signOut();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium text-imperial-red-bright hover:bg-imperial-red/15 rounded-md transition-all text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Guest / Login Button */
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium bg-lacquer-surface border border-lacquer-border hover:border-imperial-gold/60 text-silk-muted hover:text-silk-ivory transition-all rounded-md cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-imperial-gold" />
              <span>Đăng nhập</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
export default Navbar;
