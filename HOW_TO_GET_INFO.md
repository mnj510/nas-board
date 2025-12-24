# 📋 필요한 정보 찾는 방법 (단계별 가이드)

## 1. Supabase 정보 찾기

### 1-1. Supabase 프로젝트 생성 (아직 없다면)

1. **Supabase 접속**
   - https://supabase.com 접속
   - "Start your project" 또는 "Sign in" 클릭
   - GitHub 계정으로 로그인 (권장)

2. **새 프로젝트 생성**
   - "New Project" 클릭
   - 프로젝트 정보 입력:
     - **Name**: 원하는 프로젝트 이름 (예: `nas-board`)
     - **Database Password**: 강력한 비밀번호 입력 (기억해두세요!)
     - **Region**: 가장 가까운 지역 선택 (예: `Northeast Asia (Seoul)`)
   - "Create new project" 클릭
   - 프로젝트 생성 완료 대기 (약 2분)

### 1-2. Project URL 찾기

1. Supabase 대시보드에서 프로젝트 선택
2. 왼쪽 사이드바에서 **"Settings"** (⚙️ 아이콘) 클릭
3. **"API"** 메뉴 클릭
4. **"Project URL"** 섹션에서 URL 복사
   - 예: `https://abcdefghijklmnop.supabase.co`
   - 이 URL이 `NEXT_PUBLIC_SUPABASE_URL`입니다

### 1-3. anon public key 찾기

1. 같은 페이지 (Settings → API)에서
2. **"Project API keys"** 섹션 찾기
3. **"anon public"** 키 옆의 **"Copy"** 버튼 클릭
   - 예: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - 이 키가 `NEXT_PUBLIC_SUPABASE_ANON_KEY`입니다

### 1-4. service_role key 찾기

1. 같은 페이지 (Settings → API)에서
2. **"Project API keys"** 섹션에서
3. **"service_role"** 키 옆의 **"Copy"** 버튼 클릭
   - ⚠️ **주의**: 이 키는 절대 공개하지 마세요! 서버 사이드에서만 사용합니다.
   - 예: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE5MzE4MTUwMjJ9.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy`
   - 이 키가 `SUPABASE_SERVICE_ROLE_KEY`입니다

---

## 2. GitHub 정보 찾기

### 2-1. GitHub 저장소 생성 (아직 없다면)

1. **GitHub 접속**
   - https://github.com 접속
   - 로그인

2. **새 저장소 생성**
   - 오른쪽 상단 "+" 아이콘 클릭 → "New repository" 클릭
   - 또는 https://github.com/new 접속
   - 저장소 정보 입력:
     - **Repository name**: 원하는 이름 (예: `nas-board`)
     - **Description**: 설명 (선택사항)
     - **Visibility**: Public 또는 Private 선택
     - **Initialize this repository with**: 체크하지 않기 (이미 코드가 있으므로)
   - "Create repository" 클릭

3. **저장소 URL 확인**
   - 생성 후 나타나는 페이지에서 URL 확인
   - 예: `https://github.com/your-username/nas-board`
   - 또는 `git@github.com:your-username/nas-board.git`

### 2-2. 코드를 GitHub에 푸시

터미널에서 다음 명령어 실행:

```bash
cd /Users/nj/Downloads/site3

# Git 초기화 (아직 안 했다면)
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: Vercel + Supabase setup"

# 브랜치 이름을 main으로 변경
git branch -M main

# GitHub 저장소 연결 (위에서 확인한 URL 사용)
git remote add origin https://github.com/your-username/nas-board.git

# 코드 푸시
git push -u origin main
```

---

## 3. Vercel 정보 찾기

### 3-1. Vercel 계정 생성/로그인

1. **Vercel 접속**
   - https://vercel.com 접속
   - "Sign Up" 또는 "Log In" 클릭
   - **"Continue with GitHub"** 클릭 (권장)
   - GitHub 계정으로 로그인

### 3-2. Vercel 프로젝트 생성

**방법 1: Vercel 대시보드에서 (권장)**

1. Vercel 대시보드 접속: https://vercel.com/dashboard
2. **"Add New..."** → **"Project"** 클릭
3. GitHub 저장소 선택 (위에서 만든 저장소)
4. 프로젝트 설정:
   - **Project Name**: 원하는 이름 (기본값 사용 가능)
   - **Framework Preset**: Next.js (자동 감지됨)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (기본값)
   - **Output Directory**: `.next` (기본값)
   - **Install Command**: `npm install` (기본값)
5. **"Environment Variables"** 섹션에서 다음 3개 추가:
   - `NEXT_PUBLIC_SUPABASE_URL` = 위에서 복사한 Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = 위에서 복사한 anon public key
   - `SUPABASE_SERVICE_ROLE_KEY` = 위에서 복사한 service_role key
6. **"Deploy"** 클릭
7. 배포 완료 대기 (약 2-3분)

**방법 2: Vercel CLI 사용**

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 프로젝트 배포
cd /Users/nj/Downloads/site3
vercel

# 질문에 답변:
# - Set up and deploy? Y
# - Which scope? (기본값 선택)
# - Link to existing project? N
# - Project name? (기본값 또는 원하는 이름)
# - Directory? ./
# - Override settings? N

# 환경 변수 입력 (각각 입력):
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
```

### 3-3. VERCEL_TOKEN 찾기 (GitHub Actions용)

1. Vercel 대시보드 접속: https://vercel.com/dashboard
2. 오른쪽 상단 프로필 아이콘 클릭 → **"Settings"** 클릭
3. 왼쪽 사이드바에서 **"Tokens"** 클릭
4. **"Create Token"** 클릭
5. 토큰 정보 입력:
   - **Token Name**: `github-actions-deploy` (또는 원하는 이름)
   - **Expiration**: 원하는 기간 선택
6. **"Create Token"** 클릭
7. **토큰 복사** (한 번만 보여줍니다!)
   - 예: `vercel_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - 이 토큰이 `VERCEL_TOKEN`입니다

### 3-4. VERCEL_ORG_ID 찾기

1. Vercel 대시보드 접속: https://vercel.com/dashboard
2. 프로젝트 선택
3. **"Settings"** 탭 클릭
4. **"General"** 섹션에서
5. **"Organization ID"** 또는 URL에서 확인
   - URL 예: `https://vercel.com/your-org/project-name`
   - `your-org` 부분이 Organization ID입니다
   - 또는 API에서 확인: `https://vercel.com/api/user` (브라우저에서 열기)

### 3-5. VERCEL_PROJECT_ID 찾기

1. Vercel 대시보드 접속: https://vercel.com/dashboard
2. 프로젝트 선택
3. **"Settings"** 탭 클릭
4. **"General"** 섹션에서
5. **"Project ID"** 확인
   - 또는 프로젝트 URL에서 확인
   - 예: `prj_xxxxxxxxxxxxxxxxxxxxxxxx`

---

## 📝 정보 정리 템플릿

다음 형식으로 정보를 정리해주세요:

```
=== Supabase 정보 ===
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

=== GitHub 정보 ===
저장소 URL: https://github.com/your-username/nas-board

=== Vercel 정보 ===
VERCEL_TOKEN: vercel_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VERCEL_ORG_ID: your-org-name
VERCEL_PROJECT_ID: prj_xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🎯 빠른 체크리스트

- [ ] Supabase 프로젝트 생성 완료
- [ ] Supabase Project URL 복사
- [ ] Supabase anon public key 복사
- [ ] Supabase service_role key 복사
- [ ] GitHub 저장소 생성 완료
- [ ] 코드를 GitHub에 푸시 완료
- [ ] Vercel 계정 생성/로그인 완료
- [ ] Vercel 프로젝트 생성 완료
- [ ] Vercel 환경 변수 설정 완료
- [ ] VERCEL_TOKEN 생성 완료
- [ ] VERCEL_ORG_ID 확인 완료
- [ ] VERCEL_PROJECT_ID 확인 완료

---

## 💡 팁

1. **Supabase 키는 안전하게 보관**: service_role key는 절대 공개하지 마세요
2. **환경 변수 확인**: Vercel에서 환경 변수가 올바르게 설정되었는지 확인하세요
3. **배포 로그 확인**: Vercel 대시보드에서 배포 로그를 확인하여 오류를 찾을 수 있습니다

준비되면 위 정보를 알려주세요! 🚀

