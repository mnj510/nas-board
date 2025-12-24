# NAS 서버 배포 가이드

이 문서는 NAS 서버에 사이트를 배포하고 데이터를 저장하는 전체 과정을 안내합니다.

## 사전 준비 사항

### 1. NAS 서버 정보
- NAS 서버 주소: `192.168.219.55:5001`
- SSH 접근 가능해야 함
- Node.js 18 이상 설치 필요

### 2. 필요한 계정
- Supabase 계정 (무료 플랜 가능)
- GitHub 계정

## 단계별 설정 가이드

### 1단계: Supabase 프로젝트 생성 및 설정

1. **Supabase 프로젝트 생성**
   - [https://supabase.com](https://supabase.com) 접속
   - 새 프로젝트 생성
   - 프로젝트 이름과 데이터베이스 비밀번호 설정

2. **데이터베이스 스키마 적용**
   - Supabase 대시보드 → SQL Editor 이동
   - `supabase-schema.sql` 파일의 전체 내용 복사
   - SQL Editor에 붙여넣고 실행

3. **Storage 버킷 생성**
   - Storage 메뉴로 이동
   - "New bucket" 클릭
   - 버킷 이름: `images`
   - Public bucket 체크 (공개 버킷)
   - 생성

4. **Storage 정책 설정**
   - 생성한 `images` 버킷 클릭
   - Policies 탭으로 이동
   - "New Policy" 클릭
   - 다음 정책 추가:
     - **읽기 정책**: 모든 사용자가 읽을 수 있음
     - **업로드 정책**: 인증된 사용자만 업로드 가능

5. **환경 변수 확인**
   - Settings → API 이동
   - `Project URL`과 `anon public` 키 복사
   - 이 값들을 `.env.local` 파일에 입력

### 2단계: 로컬 개발 환경 설정

1. **프로젝트 클론 및 설치**
   ```bash
   cd /Users/nj/Downloads/site3
   npm install
   ```

2. **환경 변수 파일 생성**
   ```bash
   cp .env.local.example .env.local
   ```
   
   `.env.local` 파일을 열고 Supabase 정보 입력:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NAS_SERVER_URL=http://192.168.219.55:5001
   ```

3. **로컬 테스트**
   ```bash
   npm run dev
   ```
   - 브라우저에서 http://localhost:3000 접속
   - 회원가입 및 로그인 테스트
   - 게시물 작성 테스트

### 3단계: GitHub 저장소 설정

1. **GitHub 저장소 생성**
   - GitHub에서 새 저장소 생성
   - 저장소 이름: `nas-board-site` (원하는 이름)

2. **코드 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/nas-board-site.git
   git push -u origin main
   ```

3. **GitHub Secrets 설정**
   - 저장소 → Settings → Secrets and variables → Actions
   - 다음 Secrets 추가:
     - `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key
     - `NAS_HOST`: `192.168.219.55`
     - `NAS_USERNAME`: NAS 서버 SSH 사용자명
     - `NAS_SSH_KEY`: NAS 서버 SSH 개인 키 (전체 내용)
     - `NAS_PORT`: SSH 포트 (기본값: 22)

### 4단계: NAS 서버 초기 설정

NAS 서버에 SSH로 접속하여 다음 작업 수행:

1. **필수 소프트웨어 설치 확인**
   ```bash
   # Node.js 버전 확인 (18 이상 필요)
   node --version
   
   # 없으면 설치 (Synology NAS의 경우)
   # Package Center에서 Node.js 설치
   ```

2. **PM2 설치**
   ```bash
   npm install -g pm2
   ```

3. **프로젝트 디렉토리 생성**
   ```bash
   mkdir -p /volume1/web/nas-board
   cd /volume1/web/nas-board
   ```

4. **환경 변수 파일 생성**
   ```bash
   nano .env.local
   ```
   
   다음 내용 입력:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NAS_SERVER_URL=http://192.168.219.55:5001
   NODE_ENV=production
   PORT=3000
   ```

5. **GitHub Actions로 자동 배포 설정**
   - GitHub 저장소의 Actions 탭에서 워크플로우가 자동 실행됨
   - 또는 수동으로 배포하려면:
     ```bash
     git clone https://github.com/your-username/nas-board-site.git .
     npm install
     npm run build
     pm2 start npm --name "nas-board" -- start
     pm2 save
     ```

### 5단계: NAS 서버에서 앱 실행

1. **PM2로 앱 시작**
   ```bash
   cd /volume1/web/nas-board
   pm2 start npm --name "nas-board" -- start
   pm2 save
   ```

2. **PM2 자동 시작 설정**
   ```bash
   pm2 startup
   # 출력된 명령어를 복사하여 실행
   ```

3. **상태 확인**
   ```bash
   pm2 status
   pm2 logs nas-board
   ```

### 6단계: 포트 및 방화벽 설정

1. **NAS 서버 포트 확인**
   - 앱이 3000번 포트에서 실행됨
   - NAS 서버의 방화벽에서 3000번 포트 허용

2. **리버스 프록시 설정 (선택사항)**
   - Nginx나 NAS의 리버스 프록시 기능 사용
   - 5001번 포트로 접속 시 3000번 포트로 프록시

### 7단계: 데이터 저장 확인

모든 데이터는 Supabase에 저장됩니다:

1. **데이터 확인**
   - Supabase 대시보드 → Table Editor
   - `profiles`, `posts`, `comments` 테이블 확인
   - 데이터가 정상적으로 저장되는지 확인

2. **이미지 저장 확인**
   - Supabase 대시보드 → Storage
   - `images` 버킷 확인
   - 업로드된 이미지 확인

## 자동 배포 작동 방식

1. **코드 푸시 시**
   - GitHub에 코드 푸시
   - GitHub Actions 워크플로우 자동 실행
   - 빌드 후 NAS 서버로 배포
   - PM2로 앱 재시작

2. **수동 배포**
   ```bash
   cd /volume1/web/nas-board
   git pull
   npm install
   npm run build
   pm2 restart nas-board
   ```

## 문제 해결

### 1. 배포가 실패하는 경우
- GitHub Actions 로그 확인
- NAS 서버 SSH 접속 가능한지 확인
- SSH 키가 올바르게 설정되었는지 확인

### 2. 앱이 실행되지 않는 경우
```bash
# PM2 로그 확인
pm2 logs nas-board

# 프로세스 재시작
pm2 restart nas-board

# 포트 확인
netstat -tuln | grep 3000
```

### 3. 데이터가 저장되지 않는 경우
- Supabase 연결 확인
- 환경 변수가 올바른지 확인
- Supabase RLS 정책 확인

### 4. 이미지가 표시되지 않는 경우
- Supabase Storage 버킷이 공개로 설정되었는지 확인
- 이미지 URL이 올바른지 확인
- `next.config.js`의 이미지 도메인 설정 확인

## 관리자 계정

기본 관리자 계정으로 로그인:
- 이메일: `mnj510@naver.com`
- 비밀번호: `asdf6014`

관리자 페이지에서 다른 사용자를 관리자로 임명할 수 있습니다.

## 추가 설정

### NAS 서버에 직접 데이터 저장하기

Supabase 대신 NAS 서버의 PostgreSQL을 사용하려면:

1. NAS 서버에 PostgreSQL 설치
2. `supabase-schema.sql` 실행
3. `.env.local`에서 Supabase URL을 NAS 서버의 PostgreSQL로 변경

### 백업 설정

Supabase 데이터를 NAS 서버로 주기적으로 백업:

```bash
# 백업 스크립트 생성
nano /volume1/web/nas-board/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
# Supabase 데이터 백업 (Supabase CLI 사용)
supabase db dump -f /volume1/backup/nas-board-$DATE.sql
```

## 완료 체크리스트

- [ ] Supabase 프로젝트 생성 및 스키마 적용
- [ ] Storage 버킷 생성 및 정책 설정
- [ ] 로컬 환경에서 테스트 완료
- [ ] GitHub 저장소 생성 및 코드 푸시
- [ ] GitHub Secrets 설정
- [ ] NAS 서버에 Node.js 및 PM2 설치
- [ ] NAS 서버에 프로젝트 배포
- [ ] PM2로 앱 실행 및 자동 시작 설정
- [ ] 포트 및 방화벽 설정
- [ ] 데이터 저장 확인
- [ ] 관리자 계정으로 로그인 테스트

## 지원

문제가 발생하면:
1. GitHub Issues에 문제 보고
2. 로그 파일 확인 (`pm2 logs nas-board`)
3. Supabase 대시보드에서 데이터 확인

