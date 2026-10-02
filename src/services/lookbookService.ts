import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Lookbook } from '../types';

const isUuid = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

/**
 * Chuyển đổi từ Supabase DB Row sang TypeScript Lookbook
 */
export const dbToLookbook = (row: any): Lookbook => {
  const outfitIds = Array.isArray(row.outfit_ids) ? row.outfit_ids : [];
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    subtitle: row.subtitle || 'Sắc son triều Nguyễn',
    lookNumber: row.look_number || 'LOOK 01',
    description: row.description || '',
    outfitId: row.outfit_id || outfitIds[0] || '',
    outfitIds,
    coverImageUrl: row.cover_image_url || '',
    verticalPoem: row.vertical_poem || 'Tết đến xuân về vạn sự như ý',
    decorStamp: row.decor_stamp || 'seal',
    isPublic: Boolean(row.is_public),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

/**
 * 1. Lấy danh sách lookbook của người dùng từ Supabase
 */
export const fetchUserLookbooks = async (userId: string): Promise<Lookbook[]> => {
  if (!isSupabaseConfigured) {
    try {
      const stored = localStorage.getItem(`vietphuc_lookbooks_${userId}`);
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore
    }
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('lookbooks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Lỗi tải danh sách lookbook từ Supabase:', error.message);
      // Fallback local
      try {
        const stored = localStorage.getItem(`vietphuc_lookbooks_${userId}`);
        if (stored) return JSON.parse(stored);
      } catch {
        // Ignore
      }
      return [];
    }

    return (data || []).map(dbToLookbook);
  } catch (err) {
    console.error('Exception khi tải lookbooks:', err);
    return [];
  }
};

/**
 * 2. Tạo lookbook mới trong Supabase (chọn 1 outfit duy nhất)
 */
export const createLookbookInDb = async (
  userId: string,
  lookbook: {
    title: string;
    subtitle?: string;
    lookNumber?: string;
    description: string;
    outfitId: string;
    coverImageUrl?: string;
    verticalPoem?: string;
    decorStamp?: 'blossom' | 'cloud' | 'moon' | 'seal';
    isPublic?: boolean;
  }
): Promise<Lookbook> => {
  const outfitIds = isUuid(lookbook.outfitId) ? [lookbook.outfitId] : [];

  if (!isSupabaseConfigured) {
    const newLookbook: Lookbook = {
      id: `lookbook-${Date.now()}`,
      userId,
      title: lookbook.title,
      subtitle: lookbook.subtitle || 'Sắc son triều Nguyễn',
      lookNumber: lookbook.lookNumber || 'LOOK 01',
      description: lookbook.description || '',
      outfitId: lookbook.outfitId,
      outfitIds: [lookbook.outfitId],
      coverImageUrl: lookbook.coverImageUrl || '',
      verticalPoem: lookbook.verticalPoem || 'Tết đến xuân về vạn sự như ý',
      decorStamp: lookbook.decorStamp || 'seal',
      isPublic: Boolean(lookbook.isPublic),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const existing = await fetchUserLookbooks(userId);
      const updated = [newLookbook, ...existing];
      localStorage.setItem(`vietphuc_lookbooks_${userId}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return newLookbook;
  }

  try {
    const payload: any = {
      user_id: userId,
      title: lookbook.title,
      description: lookbook.description || null,
      cover_image_url: lookbook.coverImageUrl || null,
      outfit_ids: outfitIds,
      is_public: Boolean(lookbook.isPublic),
    };

    const { data, error } = await supabase
      .from('lookbooks')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Lỗi khi lưu lookbook vào Supabase:', error.message);
      throw new Error(error.message);
    }

    const created = dbToLookbook(data);
    created.outfitId = lookbook.outfitId;
    created.subtitle = lookbook.subtitle || 'Sắc son triều Nguyễn';
    created.lookNumber = lookbook.lookNumber || 'LOOK 01';
    created.verticalPoem = lookbook.verticalPoem || 'Tết đến xuân về vạn sự như ý';
    created.decorStamp = lookbook.decorStamp || 'seal';
    return created;
  } catch (err: any) {
    console.error('Exception khi tạo lookbook:', err);
    throw err;
  }
};

/**
 * 3. Cập nhật lookbook trong Supabase
 */
export const updateLookbookInDb = async (
  lookbookId: string,
  updates: Partial<Lookbook>
): Promise<void> => {
  if (!isSupabaseConfigured) return;

  const dbUpdates: any = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.coverImageUrl !== undefined) dbUpdates.cover_image_url = updates.coverImageUrl;
  if (updates.outfitId !== undefined) {
    dbUpdates.outfit_ids = isUuid(updates.outfitId) ? [updates.outfitId] : [];
  }
  if (updates.isPublic !== undefined) dbUpdates.is_public = updates.isPublic;

  const { error } = await supabase
    .from('lookbooks')
    .update(dbUpdates)
    .eq('id', lookbookId);

  if (error) {
    console.error('Lỗi khi cập nhật lookbook:', error.message);
  }
};

/**
 * 4. Xóa lookbook khỏi Supabase
 */
export const deleteLookbookFromDb = async (lookbookId: string): Promise<void> => {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from('lookbooks')
    .delete()
    .eq('id', lookbookId);

  if (error) {
    console.error('Lỗi khi xóa lookbook:', error.message);
  }
};
