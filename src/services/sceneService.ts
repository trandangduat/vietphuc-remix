import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { EventBackground } from '../types';

const localKey = (userId: string) => `vietphuc_scenes_${userId}`;

function rowToScene(row: {
  id: string;
  name: string;
  description: string;
  image_url: string;
}): EventBackground {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    bgUrl: row.image_url,
    isCustom: true,
  };
}

function readLocalScenes(userId: string): EventBackground[] {
  try {
    const stored = localStorage.getItem(localKey(userId));
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)?.[1] || 'image/png';
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

async function uploadSceneImage(userId: string, imageDataUrl: string): Promise<string> {
  const blob = dataUrlToBlob(imageDataUrl);
  const filename = `${userId}/scenes/${Date.now()}.png`;
  const { error } = await supabase.storage.from('outfit-media').upload(filename, blob, {
    contentType: blob.type || 'image/png',
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('outfit-media').getPublicUrl(filename);
  if (!data?.publicUrl) throw new Error('Không lấy được đường dẫn ảnh bối cảnh.');
  return data.publicUrl;
}

export async function fetchUserScenes(userId: string): Promise<EventBackground[]> {
  if (!isSupabaseConfigured) return readLocalScenes(userId);

  const { data, error } = await supabase
    .from('scene_backgrounds')
    .select('id, name, description, image_url')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Lỗi tải bối cảnh:', error.message);
    return [];
  }

  return (data || []).map(rowToScene);
}

export async function saveUserScene(
  userId: string,
  scene: { name: string; description: string; imageDataUrl: string }
): Promise<EventBackground> {
  const name = scene.name.trim();
  const description = scene.description.trim();

  if (!isSupabaseConfigured) {
    const saved: EventBackground = {
      id: `custom-event-${Date.now()}`,
      name,
      description,
      bgUrl: scene.imageDataUrl,
      isCustom: true,
    };
    const next = [...readLocalScenes(userId), saved];
    localStorage.setItem(localKey(userId), JSON.stringify(next));
    return saved;
  }

  const { data: authData } = await supabase.auth.getUser();
  const sessionUserId = authData.user?.id;
  if (!sessionUserId) {
    throw new Error('Phiên đăng nhập không hợp lệ. Hãy đăng nhập lại rồi lưu.');
  }

  let imageUrl = scene.imageDataUrl;
  try {
    imageUrl = await uploadSceneImage(sessionUserId, scene.imageDataUrl);
  } catch (err) {
    console.warn('Không tải được ảnh lên Storage, lưu trực tiếp vào bảng:', err);
  }

  const id = crypto.randomUUID();
  const { error } = await supabase.from('scene_backgrounds').insert({
    id,
    user_id: sessionUserId,
    name,
    description,
    image_url: imageUrl,
  });

  if (error) {
    if (error.message.toLowerCase().includes('row-level security') || error.message.toLowerCase().includes('row level security')) {
      throw new Error(
        'Database chưa cho phép lưu bối cảnh. Hãy chạy lại phần policy scene_backgrounds trong supabase/schema.sql.'
      );
    }
    throw new Error(error.message);
  }

  return {
    id,
    name,
    description,
    bgUrl: imageUrl,
    isCustom: true,
  };
}
