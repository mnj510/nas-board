# 데이터베이스 스키마 실행 가이드

NAS 서버에서 PostgreSQL 스키마를 실행하는 방법입니다.

## 방법 1: 파일을 직접 복사하여 실행 (추천)

### 1단계: NAS 서버에 SSH 접속

```bash
ssh guraud22@192.168.219.55
```

### 2단계: PostgreSQL 접속

```bash
sudo -u postgres psql -d nas_board
```

비밀번호 입력 후 PostgreSQL 프롬프트(`nas_board=#`)가 나타납니다.

### 3단계: 스키마 SQL 직접 입력

PostgreSQL 프롬프트에서 다음을 복사하여 붙여넣기:

```sql
-- 기존 테이블이 있다면 삭제
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

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

### 4단계: 확인

```sql
-- 테이블 목록 확인
\dt

-- 함수 확인
\df increment_view_count

-- 종료
\q
```

## 방법 2: 파일을 업로드하여 실행

### 1단계: 로컬에서 파일을 NAS 서버로 복사

로컬 컴퓨터 터미널에서:

```bash
cd /Users/nj/Downloads/site3
scp database-schema-nas.sql guraud22@192.168.219.55:/tmp/
```

### 2단계: NAS 서버에서 파일 권한 설정

NAS 서버에 SSH 접속 후:

```bash
sudo chmod 644 /tmp/database-schema-nas.sql
sudo chown postgres:postgres /tmp/database-schema-nas.sql
```

### 3단계: PostgreSQL에서 파일 실행

```bash
sudo -u postgres psql -d nas_board -f /tmp/database-schema-nas.sql
```

## 방법 3: 파일을 NAS 공유 폴더에 업로드

### 1단계: 파일을 NAS 공유 폴더에 업로드

- NAS의 파일 관리자 또는 웹 인터페이스 사용
- `/volume1/site3/` 폴더에 `database-schema-nas.sql` 업로드

### 2단계: PostgreSQL에서 실행

```bash
sudo -u postgres psql -d nas_board
```

```sql
\i /volume1/site3/database-schema-nas.sql
```

## 실행 결과 확인

성공하면 다음과 같은 메시지가 나타납니다:

```
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE INDEX
CREATE INDEX
...
CREATE FUNCTION
```

## 오류 발생 시

### "relation already exists" 오류

기존 테이블이 있는 경우:

```sql
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
```

그 후 다시 스키마 실행

### "permission denied" 오류

파일 권한 문제:

```bash
sudo chmod 644 /path/to/database-schema-nas.sql
sudo chown postgres:postgres /path/to/database-schema-nas.sql
```

### "No such file or directory" 오류

파일 경로 확인:

```bash
find /volume1 -name "database-schema-nas.sql"
ls -la /volume1/site3/
```

## 다음 단계

스키마가 성공적으로 생성되면:

1. 관리자 계정 생성
2. 환경 변수 설정
3. 개발 서버 실행

