-- ==============================================================================
-- CƠ SỞ DỮ LIỆU VIỆT PHỤC REMIX - SUPABASE DATABASE SCHEMA
-- ==============================================================================

-- 1. BẢNG PROFILES (HỒ SƠ NGƯỜI DÙNG)
-- Tự động liên kết với auth.users của Supabase
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Tự động tạo hồ sơ profile khi người dùng đăng ký tài khoản mới qua Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger chạy sau khi người dùng đăng ký auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 2. BẢNG OUTFITS (LƯU CÁC BẢN PHỐI ĐỒ VIỆT PHỤC)
CREATE TABLE IF NOT EXISTS public.outfits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  concept_tag TEXT,
  gender TEXT DEFAULT 'women',
  top_piece JSONB NOT NULL,
  bottom_piece JSONB NOT NULL,
  footwear_piece JSONB,
  accessory_piece JSONB,
  event JSONB NOT NULL,
  color_palette TEXT[] DEFAULT ARRAY['#8B1E1E', '#F7F4EE', '#9A7332'],
  tilt_angle NUMERIC DEFAULT 0,
  decor_stamp TEXT DEFAULT 'blossom',
  is_favorite BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  try_on_image TEXT,
  try_on_images TEXT[] DEFAULT ARRAY[]::TEXT[],
  ai_analysis JSONB,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE TRIGGER outfits_updated_at
  BEFORE UPDATE ON public.outfits
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_outfits_user_id ON public.outfits(user_id);
CREATE INDEX IF NOT EXISTS idx_outfits_created_at ON public.outfits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_outfits_is_favorite ON public.outfits(is_favorite);

-- 3. BẢNG LOOKBOOKS (BỘ SƯU TẬP TẬP HỢP NHIỀU BỘ ĐỒ)
CREATE TABLE IF NOT EXISTS public.lookbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  outfit_ids UUID[] DEFAULT ARRAY[]::UUID[],
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE TRIGGER lookbooks_updated_at
  BEFORE UPDATE ON public.lookbooks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_lookbooks_user_id ON public.lookbooks(user_id);

-- ==============================================================================
-- BẢO MẬT PHÂN QUYỀN HÀNG (ROW LEVEL SECURITY - RLS)
-- ==============================================================================

-- Bật RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lookbooks ENABLE ROW LEVEL SECURITY;

-- 1. Policies cho Profiles
CREATE POLICY "Mọi người có thể xem hồ sơ công khai"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Người dùng chỉ có thể cập nhật hồ sơ của chính mình"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Policies cho Outfits
CREATE POLICY "Người dùng xem outfit của mình hoặc outfit công khai"
  ON public.outfits FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Người dùng có thể tạo outfit cho chính mình"
  ON public.outfits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Người dùng có thể cập nhật outfit của chính mình"
  ON public.outfits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Người dùng có thể xóa outfit của chính mình"
  ON public.outfits FOR DELETE
  USING (auth.uid() = user_id);

-- 3. Policies cho Lookbooks
CREATE POLICY "Xem lookbook của mình hoặc lookbook công khai"
  ON public.lookbooks FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Tạo lookbook cho chính mình"
  ON public.lookbooks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Cập nhật lookbook của chính mình"
  ON public.lookbooks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Xóa lookbook của chính mình"
  ON public.lookbooks FOR DELETE
  USING (auth.uid() = user_id);

-- ==============================================================================
-- STORAGE BUCKET: outfit-media (LƯU TRỮ ẢNH AI TRY-ON VÀ ẢNH TẢI LÊN)
-- ==============================================================================
-- Chú ý: Bạn có thể tạo Bucket 'outfit-media' trực tiếp trên Supabase Dashboard -> Storage -> New Bucket
-- Đặt tên: 'outfit-media' (Public Bucket)
