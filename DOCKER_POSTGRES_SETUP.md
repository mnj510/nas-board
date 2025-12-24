# Docker로 PostgreSQL 설치하기

Synology NAS에 Docker를 사용하여 PostgreSQL을 설치하는 방법입니다.

## 1단계: Docker 설치

1. **Package Center** 열기
2. "Docker" 검색
3. **Docker** 패키지 설치
4. 설치 완료 대기

## 2단계: PostgreSQL 컨테이너 생성

### 방법 A: Docker GUI 사용 (추천)

1. **Docker** 앱 열기
2. **Registry** 탭 클릭
3. 검색창에 "postgres" 입력
4. **postgres** (공식 이미지) 선택
5. **Download** 클릭
6. 버전 선택: **11** 또는 **13** (안정적)
7. 다운로드 완료 대기

8. **Image** 탭으로 이동
9. 다운로드된 **postgres** 이미지 선택
10. **Launch** 클릭

11. 컨테이너 설정:
    - **Container Name**: `postgres-nas`
    - **Enable auto-restart** 체크

12. **Advanced Settings** 클릭:
    
    **Volume 탭:**
    - **Add Folder** 클릭
    - 폴더 선택: `/volume1/docker/postgres` (없으면 생성)
    - 마운트 경로: `/var/lib/postgresql/data`
    
    **Port Settings 탭:**
    - **Container Port**: `5432`
    - **Local Port**: `5432` (또는 원하는 포트)
    
    **Environment 탭:**
    - `POSTGRES_PASSWORD`: 원하는 비밀번호 입력 (예: `your_password`)
    - `POSTGRES_DB`: `nas_board` (선택사항, 나중에 생성 가능)
    - `POSTGRES_USER`: `postgres` (기본값)

13. **Apply** 클릭
14. **Next** → **Done**

### 방법 B: SSH로 Docker 명령어 사용

SSH 접속 후:

```bash
# PostgreSQL 데이터 디렉토리 생성
sudo mkdir -p /volume1/docker/postgres
sudo chmod 755 /volume1/docker/postgres

# PostgreSQL 컨테이너 실행
sudo docker run -d \
  --name postgres-nas \
  --restart unless-stopped \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=nas_board \
  -e POSTGRES_USER=postgres \
  -p 5432:5432 \
  -v /volume1/docker/postgres:/var/lib/postgresql/data \
  postgres:11
```

비밀번호는 원하는 값으로 변경하세요.

## 3단계: PostgreSQL 접속 확인

SSH 접속 후:

```bash
# 컨테이너 실행 확인
sudo docker ps | grep postgres

# PostgreSQL 접속 테스트
sudo docker exec -it postgres-nas psql -U postgres
```

접속되면:
```sql
-- 데이터베이스 목록 확인
\l

-- 종료
\q
```

## 4단계: 데이터베이스 생성

```bash
sudo docker exec -it postgres-nas psql -U postgres
```

```sql
CREATE DATABASE nas_board;
\l
\q
```

## 5단계: 스키마 실행

```bash
# SQL 파일을 컨테이너로 복사 (필요시)
# 또는 직접 SQL 실행

sudo docker exec -it postgres-nas psql -U postgres -d nas_board
```

그 다음 SQL을 붙여넣기:

```sql
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE posts (
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

CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  post_id TEXT REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  author_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id TEXT REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_posts_board_type ON posts(board_type);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_profiles_email ON profiles(email);

CREATE OR REPLACE FUNCTION increment_view_count(post_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE posts SET view_count = view_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;
```

## 환경 변수 설정

`.env.local` 파일:

```env
DB_HOST=192.168.219.55
DB_PORT=5432
DB_NAME=nas_board
DB_USER=postgres
DB_PASSWORD=your_password  # Docker에서 설정한 비밀번호
DB_SSL=false
```

## 문제 해결

### 컨테이너가 시작되지 않는 경우
```bash
# 로그 확인
sudo docker logs postgres-nas

# 컨테이너 재시작
sudo docker restart postgres-nas
```

### 포트 충돌
다른 포트 사용 (예: 5433):
```bash
# 컨테이너 삭제 후 재생성
sudo docker stop postgres-nas
sudo docker rm postgres-nas

# 포트 변경하여 재생성
sudo docker run -d \
  --name postgres-nas \
  -p 5433:5432 \
  ...
```

환경 변수도 변경:
```env
DB_PORT=5433
```

### 데이터 백업
```bash
# 데이터베이스 백업
sudo docker exec postgres-nas pg_dump -U postgres nas_board > backup.sql

# 복원
sudo docker exec -i postgres-nas psql -U postgres nas_board < backup.sql
```

