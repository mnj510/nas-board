# NAS 서버 배포 가이드 (PostgreSQL 직접 연결)

이 문서는 Supabase 없이 NAS 서버의 PostgreSQL 데이터베이스에 직접 연결하여 사이트를 구동하는 방법을 안내합니다.

## 사전 준비 사항

### 1. NAS 서버 요구사항
- PostgreSQL 데이터베이스 설치 및 실행 중
- Node.js 18 이상 설치
- PM2 설치 (프로세스 관리)
- SSH 접근 가능

### 2. 데이터베이스 정보
- 호스트: `192.168.219.55` (또는 NAS 서버 IP)
- 포트: `5432` (기본값)
- 데이터베이스 이름: `nas_board` (원하는 이름)
- 사용자: `postgres` (또는 다른 사용자)
- 비밀번호: 설정한 비밀번호

## 단계별 설정

### 1단계: PostgreSQL 데이터베이스 생성

NAS 서버에 SSH 접속 후:

```bash
# PostgreSQL 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE nas_board;

# 데이터베이스 선택
\c nas_board

# 스키마 파일 실행
\i /path/to/database-schema.sql

# 또는 직접 SQL 실행
```

또는 `database-schema.sql` 파일의 내용을 복사하여 실행합니다.

### 2단계: 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```env
# 데이터베이스 설정
DB_HOST=192.168.219.55
DB_PORT=5432
DB_NAME=nas_board
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false

# JWT 시크릿 키 (프로덕션에서는 반드시 강력한 키로 변경!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars

# NAS 서버 URL
NAS_SERVER_URL=http://192.168.219.55:5001

# Node 환경
NODE_ENV=production
PORT=3000
```

### 3단계: 관리자 계정 생성

```bash
# 의존성 설치
npm install

# 관리자 계정 생성 스크립트 실행
node scripts/create-admin.js
```

또는 수동으로:

```sql
-- PostgreSQL에서 직접 실행
-- 비밀번호 해시는 bcrypt로 생성해야 함 (asdf6014)
INSERT INTO profiles (email, name, password_hash, is_admin)
VALUES ('mnj510@naver.com', '관리자', '$2a$10$...', true);
```

비밀번호 해시 생성 방법:
```javascript
const bcrypt = require('bcryptjs')
bcrypt.hash('asdf6014', 10).then(hash => console.log(hash))
```

### 4단계: 프로젝트 빌드 및 실행

```bash
# 의존성 설치
npm install

# 프로덕션 빌드
npm run build

# PM2로 실행
pm2 start npm --name "nas-board" -- start
pm2 save
pm2 startup
```

### 5단계: 이미지 업로드 디렉토리 생성

```bash
# 업로드 디렉토리 생성
mkdir -p public/uploads/thumbnails
chmod 755 public/uploads/thumbnails
```

### 6단계: 포트 및 방화벽 설정

- 앱은 3000번 포트에서 실행됩니다
- NAS 방화벽에서 3000번 포트 허용
- 리버스 프록시로 5001번 포트 연결 (선택사항)

## GitHub Actions 자동 배포 설정

`.github/workflows/deploy.yml` 파일이 이미 생성되어 있습니다.

GitHub Secrets에 다음을 추가하세요:
- `DB_HOST`: `192.168.219.55`
- `DB_PORT`: `5432`
- `DB_NAME`: `nas_board`
- `DB_USER`: `postgres`
- `DB_PASSWORD`: 데이터베이스 비밀번호
- `JWT_SECRET`: JWT 시크릿 키
- `NAS_HOST`: `192.168.219.55`
- `NAS_USERNAME`: SSH 사용자명
- `NAS_SSH_KEY`: SSH 개인 키
- `NAS_PORT`: SSH 포트 (기본값: 22)

## 데이터 저장 위치

### 데이터베이스
- 모든 사용자, 게시물, 댓글 데이터는 PostgreSQL에 저장됩니다
- 위치: NAS 서버의 PostgreSQL 데이터베이스

### 이미지 파일
- 업로드된 이미지는 `public/uploads/thumbnails/` 디렉토리에 저장됩니다
- 위치: NAS 서버의 프로젝트 디렉토리 내

## 문제 해결

### 데이터베이스 연결 실패
```bash
# PostgreSQL이 실행 중인지 확인
sudo systemctl status postgresql

# 방화벽에서 5432 포트 허용 확인
# pg_hba.conf에서 접근 권한 확인
```

### 이미지 업로드 실패
```bash
# 디렉토리 권한 확인
ls -la public/uploads/thumbnails

# 쓰기 권한 부여
chmod 755 public/uploads/thumbnails
```

### JWT 토큰 오류
- `.env.local`의 `JWT_SECRET`이 설정되어 있는지 확인
- 프로덕션에서는 반드시 강력한 시크릿 키 사용

## 백업

### 데이터베이스 백업
```bash
# PostgreSQL 백업
pg_dump -U postgres nas_board > backup_$(date +%Y%m%d).sql

# 복원
psql -U postgres nas_board < backup_20240101.sql
```

### 이미지 백업
```bash
# 이미지 디렉토리 백업
tar -czf images_backup_$(date +%Y%m%d).tar.gz public/uploads/
```

## 완료 체크리스트

- [ ] PostgreSQL 데이터베이스 생성 및 스키마 적용
- [ ] 환경 변수 파일 설정
- [ ] 관리자 계정 생성
- [ ] 프로젝트 빌드 및 실행
- [ ] 이미지 업로드 디렉토리 생성
- [ ] 포트 및 방화벽 설정
- [ ] 로그인 테스트
- [ ] 게시물 작성 테스트
- [ ] 이미지 업로드 테스트
- [ ] 댓글 작성 테스트

## 관리자 계정

- 이메일: `mnj510@naver.com`
- 비밀번호: `asdf6014`

첫 로그인 후 관리자 페이지에서 다른 사용자를 관리자로 임명할 수 있습니다.

