-- NAS 서버 PostgreSQL 11 호환 스키마
-- UUID는 Node.js에서 생성하여 TEXT로 저장

-- 프로필 테이블
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 게시물 테이블
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  board_type TEXT NOT NULL CHECK (board_type IN ('notice', 'economy', 'real_estate', 'business', 'question')),
  author_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  thumbnail_url TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 댓글 테이블
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  post_id TEXT REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  author_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id TEXT REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_posts_board_type ON posts(board_type);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment_view_count(post_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE posts SET view_count = view_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;
