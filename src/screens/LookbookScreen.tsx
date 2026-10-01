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
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  BookMarked,
  Download,
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
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
        {/* Guest Session Notification Banner */}
        <div className="p-6 rounded-2xl bg-lacquer-card border border-imperial-gold/40 shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-imperial-gold/15 text-imperial-gold flex items-center justify-center flex-shrink-0">
              <BookMarked className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-silk-ivory">
                Lookbook Phiên làm việc tạm thời
              </h2>
              <p className="text-xs text-silk-muted">
                Bạn đang có <strong className="text-imperial-gold">{outfits.length}</strong> outfit lưu tạm trong phiên này. Hãy đăng nhập để lưu trữ vĩnh viễn và tạo liên kết chia sẻ.
              </p>
            </div>
          </div>
          <button
            onClick={onLoginPrompt}
            className="py-2.5 px-6 rounded-xl bg-imperial-gold hover:bg-imperial-gold-light text-lacquer font-bold text-xs shadow-md transition-all whitespace-nowrap"
          >
            Đăng nhập để lưu vĩnh viễn
          </button>
        </div>

        {/* List of session outfits */}
        {outfits.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-2xl bg-lacquer-card border border-lacquer-border">
            <Layers className="w-12 h-12 text-silk-muted mx-auto mb-3 opacity-40" />
            <h3 className="font-serif font-bold text-lg text-silk-ivory mb-1">
              Chưa có outfit nào trong phiên
            </h3>
            <p className="text-xs text-silk-muted max-w-sm mx-auto mb-4">
              Hãy quay lại Studio để bắt đầu phối bộ trang phục đầu tiên của bạn!
            </p>
            <button
              onClick={onOpenStudio}
              className="py-2.5 px-6 rounded-xl bg-imperial-gold text-lacquer font-bold text-xs hover:bg-imperial-gold-light"
            >
              Mở Studio phối đồ
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {outfits.map((outfit) => (
              <div
                key={outfit.id}
                className="p-4 rounded-2xl bg-lacquer-card border border-lacquer-border flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 border border-lacquer-border/60 bg-lacquer-surface relative">
                    <img
                      src={outfit.tryOnImage || outfit.top.variant.assetUrl}
                      alt={outfit.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-lacquer/80 backdrop-blur-md text-[10px] font-semibold text-imperial-gold border border-imperial-gold/30">
                      {outfit.event.name}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-silk-ivory text-sm mb-1">{outfit.name}</h4>
                  <p className="text-xs text-silk-muted mb-3">{outfit.top.piece.name} • {outfit.bottom.piece.name}</p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-lacquer-border/40">
                  <button
                    onClick={() => onLoadOutfitIntoStudio(outfit)}
                    className="flex-1 py-2 px-3 rounded-lg bg-lacquer-surface border border-lacquer-border hover:border-imperial-gold/40 text-xs font-semibold text-imperial-gold transition-all"
                  >
                    Mở lại trong Studio
                  </button>
                  <button
                    onClick={() => onDeleteOutfit(outfit.id)}
                    className="p-2 rounded-lg text-silk-muted hover:text-imperial-red-bright hover:bg-imperial-red/10 transition-all"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
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
    <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
      {/* Profile Header & Top Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-lacquer-card border border-lacquer-border shadow-lg mb-8">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-imperial-gold font-bold block mb-1">
            Bảng điều khiển cá nhân
          </span>
          <h2 className="font-serif font-bold text-2xl text-silk-ivory">
            Lookbook của Minh Anh
          </h2>
          <div className="flex items-center gap-4 text-xs text-silk-muted mt-2">
            <span><strong>{outfits.length}</strong> Outfit 2D đã lưu</span>
            <span>•</span>
            <span><strong>{tryOnOutfits.length}</strong> Ảnh AI Try-on</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenStudio}
            className="py-2.5 px-4 rounded-xl bg-imperial-gold hover:bg-imperial-gold-light text-lacquer font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            <span>+ Phối bộ đồ mới</span>
          </button>

          <button
            onClick={() => setIsCompareModalOpen(true)}
            disabled={selectedForCompare.length < 2}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
              selectedForCompare.length >= 2
                ? 'bg-lacquer-surface border-imperial-gold text-imperial-gold shadow-sm'
                : 'bg-lacquer-surface text-silk-muted border-lacquer-border opacity-50 cursor-not-allowed'
            }`}
          >
            So sánh ({selectedForCompare.length})
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-lacquer-surface border border-lacquer-border hover:border-imperial-gold/50 text-silk-ivory text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4 text-imperial-gold" />
            <span>Cài đặt chia sẻ</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-lacquer-border pb-4 mb-6">
        <button
          onClick={() => setActiveTab('2d')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === '2d'
              ? 'bg-imperial-gold/20 text-imperial-gold border border-imperial-gold/40 shadow-sm'
              : 'text-silk-muted hover:text-silk-ivory'
          }`}
        >
          Tất cả Outfit 2D ({outfits.length})
        </button>

        <button
          onClick={() => setActiveTab('tryon')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'tryon'
              ? 'bg-imperial-gold/20 text-imperial-gold border border-imperial-gold/40 shadow-sm'
              : 'text-silk-muted hover:text-silk-ivory'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ảnh AI Try on ({tryOnOutfits.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('public_preview')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'public_preview'
              ? 'bg-imperial-gold/20 text-imperial-gold border border-imperial-gold/40 shadow-sm'
              : 'text-silk-muted hover:text-silk-ivory'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
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
                className={`p-4 rounded-2xl bg-lacquer-card border transition-all flex flex-col justify-between group ${
                  isSelected ? 'border-imperial-gold ring-2 ring-imperial-gold/20' : 'border-lacquer-border hover:border-lacquer-border/90'
                }`}
              >
                <div>
                  {/* Image Stage */}
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-lacquer-border/60 bg-lacquer-surface mb-3">
                    <img
                      src={outfit.tryOnImage || outfit.top.variant.assetUrl}
                      alt={outfit.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Checkbox for compare */}
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectCompare(outfit.id)}
                        className="w-4 h-4 rounded border-lacquer-border text-imperial-gold focus:ring-imperial-gold cursor-pointer"
                        title="Chọn để so sánh"
                      />
                    </div>

                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-lacquer/80 backdrop-blur-md text-[10px] font-semibold text-imperial-gold border border-imperial-gold/30">
                      {outfit.event.name}
                    </span>
                  </div>

                  {/* Title & Inline Edit */}
                  <div className="flex items-center justify-between mb-1.5">
                    {editingId === outfit.id ? (
                      <div className="flex items-center gap-1 w-full">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-lacquer-surface border border-imperial-gold rounded px-2 py-0.5 text-xs text-silk-ivory flex-1"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(outfit.id)}
                        />
                        <button
                          onClick={() => handleSaveRename(outfit.id)}
                          className="p-1 text-green-400 hover:bg-green-500/10 rounded"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-serif font-bold text-silk-ivory text-sm truncate">{outfit.name}</h4>
                        <button
                          onClick={() => handleStartRename(outfit)}
                          className="p-1 text-silk-muted hover:text-silk-ivory opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Đổi tên"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Piece chips */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="px-2 py-0.5 rounded bg-lacquer-surface border border-lacquer-border text-[10px] text-silk-muted">
                      {outfit.top.piece.name}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-lacquer-surface border border-lacquer-border text-[10px] text-silk-muted">
                      {outfit.bottom.piece.name}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-lacquer-surface border border-lacquer-border text-[10px] text-silk-muted">
                      {outfit.footwear.piece.name}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-lacquer-border/50">
                  <button
                    onClick={() => onLoadOutfitIntoStudio(outfit)}
                    className="flex-1 py-2 px-3 rounded-lg bg-lacquer-surface hover:bg-lacquer-hover border border-lacquer-border hover:border-imperial-gold/40 text-xs font-semibold text-imperial-gold transition-all flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Mở trong Studio</span>
                  </button>
                  <button
                    onClick={() => onDeleteOutfit(outfit.id)}
                    className="p-2 rounded-lg text-silk-muted hover:text-imperial-red-bright hover:bg-imperial-red/10 transition-all"
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
            <div className="col-span-full text-center py-16 p-8 rounded-2xl bg-lacquer-card border border-lacquer-border">
              <Sparkles className="w-10 h-10 text-silk-muted mx-auto mb-2 opacity-50" />
              <p className="text-xs text-silk-muted">Chưa có ảnh AI Try on nào được lưu. Hãy mở Studio và bấm "⚡ AI Try on"!</p>
            </div>
          ) : (
            tryOnOutfits.map((outfit) => (
              <div key={outfit.id} className="p-4 rounded-2xl bg-lacquer-card border border-lacquer-border">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 border border-imperial-gold/30">
                  <img src={outfit.tryOnImage} alt="Try on" className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-lacquer/80 backdrop-blur-md text-[10px] font-semibold text-teal-300 border border-teal-500/30 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Riêng tư trong tài khoản
                  </span>
                </div>
                <h4 className="font-serif font-bold text-silk-ivory text-sm mb-1">{outfit.name}</h4>
                <p className="text-xs text-silk-muted">{outfit.event.name}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: Public Shared View Simulation (SCR-03B) */}
      {activeTab === 'public_preview' && (
        <div className="p-8 rounded-3xl bg-lacquer-card border border-imperial-gold/40 shadow-2xl">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <span className="text-xs uppercase tracking-wider text-imperial-gold font-bold block mb-1">
              Giao diện người xem công khai (SCR-03B)
            </span>
            <h3 className="font-serif font-bold text-2xl text-silk-ivory mb-2">
              Bộ sưu tập Cổ phong đón Xuân 2026
            </h3>
            <p className="text-xs text-silk-muted">
              Tác giả: Minh Anh • 5 trang phục được công khai
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {outfits.slice(0, 3).map((outfit) => (
              <div key={outfit.id} className="p-4 rounded-2xl bg-lacquer-surface border border-lacquer-border flex flex-col justify-between">
                <div>
                  <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 border border-lacquer-border bg-lacquer-card">
                    <img src={outfit.top.variant.assetUrl} alt={outfit.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-serif font-bold text-silk-ivory text-sm mb-1">{outfit.name}</h4>
                  <p className="text-xs text-silk-muted mb-3">{outfit.event.name}</p>
                </div>

                {/* THE REMIX IN STUDIO BUTTON */}
                <button
                  onClick={() => onLoadOutfitIntoStudio(outfit)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-imperial-gold to-imperial-gold-light text-lacquer font-bold text-xs hover:brightness-105 shadow-md flex items-center justify-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
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
