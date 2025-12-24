# NAS 서버 데이터베이스 설정 가이드

PostgreSQL 11에서 발생하는 UUID 오류를 해결하기 위한 가이드입니다.

## 문제 해결

PostgreSQL 11에서는 `gen_random_uuid()` 함수가 기본적으로 제공되지 않습니다. 대신 Node.js에서 UUID를 생성하여 TEXT 타입으로 저장하도록 변경했습니다.

## 단계별 설정

### 1단계: 새로운 스키마 파일 사용

NAS 서버에 `database-schema-nas.sql` 파일을 업로드하거나, 다음 명령어로 직접 실행하세요:

```bash
# NAS 서버에 SSH 접속 후
sudo -u postgres psql -d nas_board
```

### 2단계: 스키마 실행

PostgreSQL 프롬프트에서:

```sql
-- 기존 테이블이 있다면 삭제 (주의: 모든 데이터가 삭제됩니다!)
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 새로운 스키마 실행
\i /volume1/site3/database-schema-nas.sql
```

또는 파일 내용을 직접 복사하여 붙여넣기:

```sql
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
```

### 3단계: 관리자 계정 생성

Node.js 스크립트를 사용하거나, 직접 SQL로 생성:

```sql
-- 비밀번호 해시는 Node.js에서 생성해야 함
-- 임시로 간단한 해시 사용 (실제로는 bcrypt 사용)
-- 먼저 Node.js 스크립트 실행 권장
```

또는 로컬에서 스크립트 실행:

```bash
# 로컬 컴퓨터에서
cd /Users/nj/Downloads/site3
node scripts/create-admin.js
```

### 4단계: 확인

```sql
-- 테이블 확인
\dt

-- 인덱스 확인
\di

-- 함수 확인
\df increment_view_count
```

## 파일 업로드 방법

### 방법 1: SCP 사용

로컬 컴퓨터에서:

```bash
scp database-schema-nas.sql guraud22@192.168.219.55:/volume1/site3/
```

### 방법 2: 직접 복사

1. `database-schema-nas.sql` 파일 내용 복사
2. NAS 서버에 SSH 접속
3. 파일 생성:
   ```bash
   nano /volume1/site3/database-schema-nas.sql
   ```
4. 내용 붙여넣기 후 저장 (Ctrl+O, Enter, Ctrl+X)

### 방법 3: Git 사용

프로젝트를 Git으로 관리하는 경우:

```bash
# NAS 서버에서
cd /volume1/site3
git pull
```

## 완료 후

스키마가 성공적으로 생성되면:

1. 환경 변수 확인 (`.env.local`)
2. 관리자 계정 생성
3. 개발 서버 실행 및 테스트

## 문제 해결

### 테이블이 이미 존재하는 경우

```sql
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
```

그 후 스키마 다시 실행

### 권한 오류

```bash
sudo chmod 644 /volume1/site3/database-schema-nas.sql
sudo chown postgres:postgres /volume1/site3/database-schema-nas.sql
```

### 파일을 찾을 수 없는 경우

파일 경로 확인:
```bash
find /volume1 -name "database-schema-nas.sql"
```

