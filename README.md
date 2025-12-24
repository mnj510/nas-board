# NAS 게시판 사이트

NAS 서버에 구동되는 게시판 사이트입니다. GitHub를 통해 자동 배포되며, 모든 데이터는 NAS 서버의 PostgreSQL 데이터베이스에 직접 저장됩니다.

## 주요 기능

- ✅ 사용자 인증 (로그인/회원가입) - JWT 기반
- ✅ 5개 게시판 (공지사항, 경제, 부동산, 사업, 질문)
- ✅ 게시물 작성/수정/삭제
- ✅ 이미지 업로드 (드래그앤드롭, 썸네일) - NAS 파일 시스템 저장
- ✅ 댓글 및 대댓글 시스템
- ✅ 댓글 수정/삭제 (작성자 및 관리자)
- ✅ 관리자 페이지 (회원 관리, 관리자 임명)
- ✅ 사용자 프로필 (작성한 게시물/댓글 보기)
- ✅ 모바일 반응형 디자인

## 기술 스택

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (NAS 서버에 직접 연결)
- **Authentication**: JWT (JSON Web Token)
- **File Storage**: NAS 서버 파일 시스템
- **Deployment**: GitHub Actions → NAS 서버

## 설치 및 설정

### 1. 프로젝트 클론 및 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```env
# 데이터베이스 설정
DB_HOST=192.168.219.55
DB_PORT=5432
DB_NAME=nas_board
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false

# JWT 시크릿 키 (프로덕션에서는 반드시 변경!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# NAS 서버 URL
NAS_SERVER_URL=http://192.168.219.55:5001

# Node 환경
NODE_ENV=production
PORT=3000
```

### 3. PostgreSQL 데이터베이스 설정

1. NAS 서버에 PostgreSQL 설치 및 실행
2. 데이터베이스 생성:
   ```sql
   CREATE DATABASE nas_board;
   ```
3. `database-schema.sql` 파일의 내용을 실행하여 테이블 생성

### 4. 관리자 계정 생성

```bash
node scripts/create-admin.js
```

또는 PostgreSQL에서 직접 생성 (비밀번호 해시 필요)

### 5. 이미지 업로드 디렉토리 생성

```bash
mkdir -p public/uploads/thumbnails
chmod 755 public/uploads/thumbnails
```

### 6. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## NAS 서버 배포 설정

### 1. GitHub Actions 워크플로우 설정

`.github/workflows/deploy.yml` 파일이 자동으로 생성됩니다.

GitHub Secrets에 다음을 추가:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET`
- `NAS_HOST`, `NAS_USERNAME`, `NAS_SSH_KEY`, `NAS_PORT`

### 2. NAS 서버 초기 설정

NAS 서버에서 다음 명령어를 실행하세요:

```bash
# 프로젝트 디렉토리 생성
mkdir -p /volume1/web/nas-board
cd /volume1/web/nas-board

# Git 저장소 클론
git clone https://github.com/your-username/your-repo.git .

# 의존성 설치
npm install

# 환경 변수 설정 (.env.local 파일 생성)
nano .env.local

# 프로덕션 빌드
npm run build

# 이미지 디렉토리 생성
mkdir -p public/uploads/thumbnails

# PM2로 앱 실행
pm2 start npm --name "nas-board" -- start
pm2 save
pm2 startup
```

## 관리자 계정

기본 관리자 계정:
- 이메일: `mnj510@naver.com`
- 비밀번호: `asdf6014`

## 데이터 저장 위치

### 데이터베이스
- 모든 사용자, 게시물, 댓글 데이터는 **NAS 서버의 PostgreSQL 데이터베이스**에 저장됩니다
- 데이터베이스: `nas_board`
- 테이블: `profiles`, `posts`, `comments`

### 이미지 파일
- 업로드된 이미지는 **NAS 서버의 파일 시스템**에 저장됩니다
- 경로: `public/uploads/thumbnails/`

## 프로젝트 구조

```
site3/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # 인증 API
│   │   ├── posts/         # 게시물 API
│   │   ├── comments/      # 댓글 API
│   │   └── upload/        # 이미지 업로드 API
│   ├── auth/              # 인증 페이지
│   ├── board/             # 게시판 페이지
│   ├── admin/             # 관리자 페이지
│   └── profile/           # 프로필 페이지
├── components/            # React 컴포넌트
├── lib/                   # 유틸리티 함수
│   ├── db.ts             # PostgreSQL 연결
│   └── auth.ts            # JWT 인증
├── database-schema.sql    # 데이터베이스 스키마
├── scripts/               # 유틸리티 스크립트
└── README.md             # 이 파일
```

## 문제 해결

### 데이터베이스 연결 실패
- PostgreSQL이 실행 중인지 확인
- 방화벽에서 5432 포트 허용 확인
- `.env.local`의 데이터베이스 정보 확인

### 이미지가 표시되지 않는 경우
- `public/uploads/thumbnails/` 디렉토리 존재 및 권한 확인
- `NAS_SERVER_URL` 환경 변수 확인

### 배포가 실패하는 경우
- GitHub Actions 로그 확인
- NAS 서버의 Node.js 버전 확인 (18 이상 필요)
- 환경 변수가 올바르게 설정되었는지 확인

## 상세 가이드

- `NAS_DEPLOYMENT.md`: NAS 서버 배포 상세 가이드
- `database-schema.sql`: 데이터베이스 스키마

## 라이선스

MIT
