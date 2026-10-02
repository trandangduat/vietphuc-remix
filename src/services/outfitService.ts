import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SavedOutfit } from '../types';

/**
 * Chuyển đổi từ Supabase DB Row sang TypeScript SavedOutfit
 */
export const dbToOutfit = (row: any): SavedOutfit => {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    gender: row.gender || 'women',
    top: row.top_piece,
    bottom: row.bottom_piece,
    footwear: row.footwear_piece,
    accessory: row.accessory_piece,
    event: row.event,
    aiAnalysis: row.ai_analysis,
    tryOnImage: row.try_on_image,
    tryOnImages: row.try_on_images || [],
    conceptTag: row.concept_tag || row.name,
    isFeatured: row.is_featured || false,
    isFavorite: row.is_favorite || false,
    colorPalette: row.color_palette || ['#8B1E1E', '#F7F4EE', '#9A7332'],
    decorStamp: row.decor_stamp || 'blossom',
    tiltAngle: row.tilt_angle ? Number(row.tilt_angle) : 0,
  };
};

/**
 * Chuyển đổi từ SavedOutfit sang Supabase DB Row
 */
export const outfitToDb = (userId: string, outfit: SavedOutfit) => {
  return {
    user_id: userId,
    name: outfit.name,
    concept_tag: outfit.conceptTag || outfit.name,
    gender: outfit.gender,
    top_piece: outfit.top,
    bottom_piece: outfit.bottom,
    footwear_piece: outfit.footwear || null,
    accessory_piece: outfit.accessory || null,
    event: outfit.event,
    color_palette: outfit.colorPalette || ['#8B1E1E', '#F7F4EE', '#9A7332'],
    tilt_angle: outfit.tiltAngle || 0,
    decor_stamp: outfit.decorStamp || 'blossom',
    is_favorite: Boolean(outfit.isFavorite),
    is_featured: Boolean(outfit.isFeatured),
    try_on_image: outfit.tryOnImage || null,
    try_on_images: outfit.tryOnImages || [],
    ai_analysis: outfit.aiAnalysis || null,
  };
};

/**
 * 1. Lấy danh sách outfit của người dùng từ Supabase
 */
export const fetchUserOutfits = async (userId: string): Promise<SavedOutfit[]> => {
  if (!isSupabaseConfigured) {
    // Offline local storage fallback
    try {
      const stored = localStorage.getItem(`vietphuc_outfits_${userId}`);
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore
    }
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('outfits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Lỗi tải danh sách outfit từ Supabase:', error.message);
      return [];
    }

    return (data || []).map(dbToOutfit);
  } catch (err) {
    console.error('Exception khi tải outfit:', err);
    return [];
  }
};

/**
 * 2. Lưu outfit mới vào Supabase
 */
export const saveOutfitToDb = async (userId: string, outfit: SavedOutfit): Promise<SavedOutfit> => {
  if (!isSupabaseConfigured) {
    // Lưu local
    try {
      const current = await fetchUserOutfits(userId);
      const updated = [outfit, ...current];
      localStorage.setItem(`vietphuc_outfits_${userId}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return outfit;
  }

  const payload = outfitToDb(userId, outfit);
  const { data, error } = await supabase
    .from('outfits')
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return dbToOutfit(data);
};

/**
 * 3. Cập nhật outfit trong Supabase (đổi tên, toggle favorite, thêm ảnh AI)
 */
export const updateOutfitInDb = async (outfitId: string, updates: Partial<SavedOutfit>): Promise<void> => {
  if (!isSupabaseConfigured) return;

  const dbUpdates: any = {};
  if (updates.name !== undefined) {
    dbUpdates.name = updates.name;
    dbUpdates.concept_tag = updates.conceptTag || updates.name;
  }
  if (updates.isFavorite !== undefined) dbUpdates.is_favorite = updates.isFavorite;
  if (updates.tryOnImage !== undefined) dbUpdates.try_on_image = updates.tryOnImage;
  if (updates.tryOnImages !== undefined) dbUpdates.try_on_images = updates.tryOnImages;

  const { error } = await supabase
    .from('outfits')
    .update(dbUpdates)
    .eq('id', outfitId);

  if (error) {
    console.error('Lỗi khi cập nhật outfit:', error.message);
  }
};

/**
 * 4. Xóa outfit khỏi Supabase
 */
export const deleteOutfitFromDb = async (outfitId: string): Promise<void> => {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from('outfits')
    .delete()
    .eq('id', outfitId);

  if (error) {
    console.error('Lỗi khi xóa outfit:', error.message);
  }
};

/**
 * 5. Tải ảnh AI try-on lên Supabase Storage (Bucket: outfit-media)
 */
export const uploadOutfitImage = async (
  userId: string,
  outfitId: string,
  imageBlob: Blob
): Promise<string | null> => {
  if (!isSupabaseConfigured) return null;

  try {
    const filename = `${userId}/${outfitId}-${Date.now()}.png`;
    const { error: uploadError } = await supabase.storage
      .from('outfit-media')
      .upload(filename, imageBlob, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.warn('Lưu ảnh vào Storage thất bại (kiểm tra bucket outfit-media):', uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from('outfit-media').getPublicUrl(filename);
    return data?.publicUrl || null;
  } catch (err) {
    console.error('Exception khi tải ảnh lên Storage:', err);
    return null;
  }
};

/**
 * 6. Di chuyển (migrate) outfit từ phiên khách sang tài khoản Supabase sau khi đăng nhập
 */
export const migrateGuestOutfitsToDb = async (
  userId: string,
  guestOutfits: SavedOutfit[]
): Promise<SavedOutfit[]> => {
  if (guestOutfits.length === 0) return [];
  if (!isSupabaseConfigured) return guestOutfits;

  try {
    const payloads = guestOutfits.map((o) => outfitToDb(userId, o));
    const { data, error } = await supabase
      .from('outfits')
      .insert(payloads)
      .select();

    if (error) {
      console.error('Lỗi di chuyển outfit sang Supabase:', error.message);
      return [];
    }

    return (data || []).map(dbToOutfit);
  } catch (e) {
    console.error('Exception di chuyển outfit:', e);
    return [];
  }
};
