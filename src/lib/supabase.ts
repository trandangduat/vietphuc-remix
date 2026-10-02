import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Kiểm tra xem Supabase đã được cấu hình trong .env chưa
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id')
);

/**
 * Khởi tạo client Supabase
 * Sử dụng dummy fallback khi chưa có env để không làm gián đoạn frontend
 */
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : (createClient(
      'https://dummy-placeholder.supabase.co',
      'dummy-anon-key-placeholder',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    ) as SupabaseClient);
