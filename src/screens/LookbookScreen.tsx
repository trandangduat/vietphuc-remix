import React, { useState } from 'react';
import { SavedOutfit } from '../types';
import { ComparisonModal } from '../components/ComparisonModal';
import { ShareModal } from '../components/ShareModal';
import {
  Layers,
  Sparkles,
  Share2,
  Trash2,
  Edit2,
  Check,
  ExternalLink,
  BookMarked,
  Eye,
  Lock,
} from 'lucide-react';

interface LookbookScreenProps {
  outfits: SavedOutfit[];
  isLoggedIn: boolean;
  onLoginPrompt: () => void;
  onLoadOutfitIntoStudio: (outfit: SavedOutfit) => void;
  onDeleteOutfit: (id: string) => void;
  onRenameOutfit: (id: string, newName: string) => void;
  onOpenStudio: () => void;
}

export const LookbookScreen: React.FC<LookbookScreenProps> = ({
  outfits,
  isLoggedIn,
  onLoginPrompt,
  onLoadOutfitIntoStudio,
  onDeleteOutfit,
  onRenameOutfit,
  onOpenStudio,
}) => {
  const [activeTab, setActiveTab] = useState<'2d' | 'tryon' | 'public_preview'>('2d');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Toggle selection for comparison
  const handleToggleSelectCompare = (id: string) => {
    setSelectedForCompare((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const handleStartRename = (outfit: SavedOutfit) => {
    setEditingId(outfit.id);
    setEditName(outfit.name);
  };

  const handleSaveRename = (id: string) => {
    if (editName.trim()) {
      onRenameOutfit(id, editName.trim());
    }
    setEditingId(null);
  };

  const tryOnOutfits = outfits.filter((o) => !!o.tryOnImage);
  const compareOutfitsList = outfits.filter((o) => selectedForCompare.includes(o.id));

  // GUEST STATE (SCR-03C)
  if (!isLoggedIn) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-10 py-10 font-sans">
        {/* Guest Session Notification Banner */}
        <div className="p-6 sm:p-8 rounded-none bg-lacquer-card border-2 border-imperial-gold shadow-xl mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-none bg-imperial-gold/20 text-imperial-gold flex items-center justify-center flex-shrink-0 border border-imperial-gold/40">
              <BookMarked className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-silk-ivory">
                Lookbook Phiên làm việc tạm thời
              </h2>
              <p className="text-sm text-silk-muted mt-1 leading-relaxed">
                Bạn đang có <strong className="text-imperial-gold">{outfits.length}</strong> outfit lưu tạm trong phiên này. Hãy đăng nhập để lưu trữ vĩnh viễn và tạo liên kết chia sẻ.
              </p>
            </div>
          </div>
          <button
            onClick={onLoginPrompt}
            className="py-3 px-6 rounded-none bg-imperial-gold hover:bg-imperial-gold-light text-lacquer font-bold text-sm shadow-md transition-all whitespace-nowrap uppercase tracking-wider"
          >
            Đăng nhập để lưu vĩnh viễn
          </button>
        </div>

        {/* List of session outfits */}
        {outfits.length === 0 ? (
          <div className="text-center py-20 p-8 rounded-none bg-lacquer-card border-2 border-lacquer-border">
            <Layers className="w-16 h-16 text-silk-muted mx-auto mb-4 opacity-40" />
            <h3 className="font-sans font-bold text-2xl text-silk-ivory mb-2">
              Chưa có outfit nào trong phiên
            </h3>
            <p className="text-sm text-silk-muted max-w-sm mx-auto mb-6">
              Hãy quay lại Studio để bắt đầu phối bộ trang phục đầu tiên của bạn!
            </p>
            <button
              onClick={onOpenStudio}
              className="py-3.5 px-7 rounded-none bg-imperial-gold text-lacquer font-bold text-sm uppercase tracking-wider hover:bg-imperial-gold-light"
            >
              Mở Studio phối đồ
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {outfits.map((outfit) => (
              <div
                key={outfit.id}
                className="p-5 rounded-none bg-lacquer-card border-2 border-lacquer-border flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[3/4] rounded-none overflow-hidden mb-4 border-2 border-lacquer-border bg-lacquer-surface relative">
                    <img
                      src={outfit.tryOnImage || outfit.top.variant.assetUrl}
                      alt={outfit.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-none bg-lacquer/90 backdrop-blur-md text-xs font-bold text-imperial-gold border border-imperial-gold/40 uppercase tracking-wider">
                      {outfit.event.name}
                    </span>
                  </div>
                  <h4 className="font-sans font-bold text-silk-ivory text-base sm:text-lg mb-1.5">{outfit.name}</h4>
                  <p className="text-xs sm:text-sm text-silk-muted mb-4 font-medium">{outfit.top.piece.name} • {outfit.bottom.piece.name}</p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t-2 border-lacquer-border">
                  <button
                    onClick={() => onLoadOutfitIntoStudio(outfit)}
                    className="flex-1 py-2.5 px-4 rounded-none bg-lacquer-surface border border-lacquer-border hover:border-imperial-gold text-xs sm:text-sm font-bold text-imperial-gold transition-all uppercase tracking-wider"
                  >
                    Mở lại trong Studio
                  </button>
                  <button
                    onClick={() => onDeleteOutfit(outfit.id)}
                    className="p-2.5 rounded-none text-silk-muted hover:text-imperial-red-bright hover:bg-imperial-red/10 border border-transparent hover:border-imperial-red/30 transition-all"
                    title="Xóa"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // LOGGED-IN STATE (SCR-03A & SCR-03B)
  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-10 font-sans">
      {/* Profile Header & Top Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-6 sm:p-8 rounded-none bg-lacquer-card border-2 border-lacquer-border shadow-lg mb-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-imperial-gold font-bold block mb-1">
            Bảng điều khiển cá nhân
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-silk-ivory">
            Lookbook của Minh Anh
          </h2>
          <div className="flex items-center gap-4 text-xs sm:text-sm text-silk-muted mt-2 font-medium">
            <span><strong>{outfits.length}</strong> Outfit 2D đã lưu</span>
            <span>•</span>
            <span><strong>{tryOnOutfits.length}</strong> Ảnh AI Try-on</span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onOpenStudio}
            className="py-3 px-5 rounded-none bg-imperial-gold hover:bg-imperial-gold-light text-lacquer font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 uppercase tracking-wider"
          >
            <Layers className="w-4 h-4" />
            <span>+ Phối bộ đồ mới</span>
          </button>

          <button
            onClick={() => setIsCompareModalOpen(true)}
            disabled={selectedForCompare.length < 2}
            className={`py-3 px-5 rounded-none text-xs sm:text-sm font-bold transition-all border uppercase tracking-wider ${
              selectedForCompare.length >= 2
                ? 'bg-lacquer-surface border-imperial-gold text-imperial-gold shadow-sm'
                : 'bg-lacquer-surface text-silk-muted border-lacquer-border opacity-50 cursor-not-allowed'
            }`}
          >
            So sánh ({selectedForCompare.length})
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="py-3 px-5 rounded-none bg-lacquer-surface border border-lacquer-border hover:border-imperial-gold text-silk-ivory text-xs sm:text-sm font-bold transition-all flex items-center gap-2 uppercase tracking-wider"
          >
            <Share2 className="w-4 h-4 text-imperial-gold" />
            <span>Cài đặt chia sẻ</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b-2 border-lacquer-border pb-4 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('2d')}
          className={`py-2.5 px-5 rounded-none text-xs sm:text-sm font-bold transition-all uppercase tracking-wider ${
            activeTab === '2d'
              ? 'bg-imperial-gold/20 text-imperial-gold border border-imperial-gold shadow-sm'
              : 'text-silk-muted hover:text-silk-ivory'
          }`}
        >
          Tất cả Outfit 2D ({outfits.length})
        </button>

        <button
          onClick={() => setActiveTab('tryon')}
          className={`py-2.5 px-5 rounded-none text-xs sm:text-sm font-bold transition-all flex items-center gap-2 uppercase tracking-wider ${
            activeTab === 'tryon'
              ? 'bg-imperial-gold/20 text-imperial-gold border border-imperial-gold shadow-sm'
              : 'text-silk-muted hover:text-silk-ivory'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Ảnh AI Try on ({tryOnOutfits.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('public_preview')}
          className={`py-2.5 px-5 rounded-none text-xs sm:text-sm font-bold transition-all flex items-center gap-2 uppercase tracking-wider ${
            activeTab === 'public_preview'
              ? 'bg-imperial-gold/20 text-imperial-gold border border-imperial-gold shadow-sm'
              : 'text-silk-muted hover:text-silk-ivory'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Xem thử giao diện công khai (SCR-03B)</span>
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === '2d' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {outfits.map((outfit) => {
            const isSelected = selectedForCompare.includes(outfit.id);

            return (
              <div
                key={outfit.id}
                className={`p-5 rounded-none bg-lacquer-card border-2 transition-all flex flex-col justify-between group ${
                  isSelected ? 'border-imperial-gold ring-1 ring-imperial-gold' : 'border-lacquer-border hover:border-silk-muted/60'
                }`}
              >
                <div>
                  {/* Image Stage */}
                  <div className="relative aspect-[3/4] rounded-none overflow-hidden border-2 border-lacquer-border bg-lacquer-surface mb-4">
                    <img
                      src={outfit.tryOnImage || outfit.top.variant.assetUrl}
                      alt={outfit.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Checkbox for compare */}
                    <div className="absolute top-3 right-3 z-10">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectCompare(outfit.id)}
                        className="w-5 h-5 rounded-none border-lacquer-border text-imperial-gold focus:ring-imperial-gold cursor-pointer"
                        title="Chọn để so sánh"
                      />
                    </div>

                    <span className="absolute top-3 left-3 px-3 py-1 rounded-none bg-lacquer/90 backdrop-blur-md text-xs font-bold text-imperial-gold border border-imperial-gold/40 uppercase tracking-wider">
                      {outfit.event.name}
                    </span>
                  </div>

                  {/* Title & Inline Edit */}
                  <div className="flex items-center justify-between mb-2">
                    {editingId === outfit.id ? (
                      <div className="flex items-center gap-1.5 w-full">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-lacquer-surface border-2 border-imperial-gold rounded-none px-2.5 py-1 text-sm text-silk-ivory flex-1 font-sans"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(outfit.id)}
                        />
                        <button
                          onClick={() => handleSaveRename(outfit.id)}
                          className="p-1.5 text-green-400 hover:bg-green-500/10 rounded-none border border-green-400/40"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-sans font-bold text-silk-ivory text-base sm:text-lg truncate">{outfit.name}</h4>
                        <button
                          onClick={() => handleStartRename(outfit)}
                          className="p-1.5 text-silk-muted hover:text-silk-ivory opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Đổi tên"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Piece chips */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="px-2.5 py-1 rounded-none bg-lacquer-surface border border-lacquer-border text-xs text-silk-muted font-medium">
                      {outfit.top.piece.name}
                    </span>
                    <span className="px-2.5 py-1 rounded-none bg-lacquer-surface border border-lacquer-border text-xs text-silk-muted font-medium">
                      {outfit.bottom.piece.name}
                    </span>
                    <span className="px-2.5 py-1 rounded-none bg-lacquer-surface border border-lacquer-border text-xs text-silk-muted font-medium">
                      {outfit.footwear.piece.name}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-3 pt-3.5 border-t-2 border-lacquer-border">
                  <button
                    onClick={() => onLoadOutfitIntoStudio(outfit)}
                    className="flex-1 py-2.5 px-4 rounded-none bg-lacquer-surface hover:bg-lacquer-hover border border-lacquer-border hover:border-imperial-gold text-xs sm:text-sm font-bold text-imperial-gold transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Mở trong Studio</span>
                  </button>
                  <button
                    onClick={() => onDeleteOutfit(outfit.id)}
                    className="p-2.5 rounded-none text-silk-muted hover:text-imperial-red-bright hover:bg-imperial-red/10 border border-transparent hover:border-imperial-red/30 transition-all"
                    title="Xóa outfit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: AI Try-on Photos */}
      {activeTab === 'tryon' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tryOnOutfits.length === 0 ? (
            <div className="col-span-full text-center py-20 p-8 rounded-none bg-lacquer-card border-2 border-lacquer-border">
              <Sparkles className="w-12 h-12 text-silk-muted mx-auto mb-3 opacity-50" />
              <p className="text-sm text-silk-muted font-medium">Chưa có ảnh AI Try on nào được lưu. Hãy mở Studio và bấm "⚡ AI Try on"!</p>
            </div>
          ) : (
            tryOnOutfits.map((outfit) => (
              <div key={outfit.id} className="p-5 rounded-none bg-lacquer-card border-2 border-lacquer-border">
                <div className="relative aspect-[3/4] rounded-none overflow-hidden mb-4 border-2 border-imperial-gold/40">
                  <img src={outfit.tryOnImage} alt="Try on" className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-none bg-lacquer/90 backdrop-blur-md text-xs font-bold text-teal-300 border border-teal-500/40 flex items-center gap-1.5 uppercase tracking-wider">
                    <Lock className="w-3 h-3" /> Riêng tư trong tài khoản
                  </span>
                </div>
                <h4 className="font-sans font-bold text-silk-ivory text-base mb-1">{outfit.name}</h4>
                <p className="text-xs sm:text-sm text-silk-muted font-medium">{outfit.event.name}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: Public Shared View Simulation (SCR-03B) */}
      {activeTab === 'public_preview' && (
        <div className="p-8 sm:p-10 rounded-none bg-lacquer-card border-2 border-imperial-gold shadow-2xl">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <span className="text-xs uppercase tracking-widest text-imperial-gold font-bold block mb-1">
              Giao diện người xem công khai (SCR-03B)
            </span>
            <h3 className="font-serif font-bold text-3xl text-silk-ivory mb-2">
              Bộ sưu tập Cổ phong đón Xuân 2026
            </h3>
            <p className="text-sm text-silk-muted">
              Tác giả: Minh Anh • 5 trang phục được công khai
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {outfits.slice(0, 3).map((outfit) => (
              <div key={outfit.id} className="p-5 rounded-none bg-lacquer-surface border-2 border-lacquer-border flex flex-col justify-between">
                <div>
                  <div className="aspect-[3/4] rounded-none overflow-hidden mb-4 border-2 border-lacquer-border bg-lacquer-card">
                    <img src={outfit.top.variant.assetUrl} alt={outfit.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-sans font-bold text-silk-ivory text-base mb-1.5">{outfit.name}</h4>
                  <p className="text-xs sm:text-sm text-silk-muted mb-4 font-medium">{outfit.event.name}</p>
                </div>

                {/* THE REMIX IN STUDIO BUTTON */}
                <button
                  onClick={() => onLoadOutfitIntoStudio(outfit)}
                  className="w-full py-3 px-4 rounded-none bg-gradient-to-r from-imperial-gold to-imperial-gold-light text-lacquer font-bold text-xs sm:text-sm hover:brightness-105 shadow-md flex items-center justify-center gap-2 transition-all uppercase tracking-wider"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>✨ Phối lại outfit này (Remix)</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        outfits={compareOutfitsList}
        onLoadOutfitIntoStudio={onLoadOutfitIntoStudio}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        outfits={outfits}
      />
    </div>
  );
};
