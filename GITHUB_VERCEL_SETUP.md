# GitHub + Vercel 설정 가이드

## ✅ Supabase 설정 완료!

다음 정보가 설정되었습니다:
- Project URL: `https://cdhtazsusgfyfucnfbfe.supabase.co`
- anon key: 설정 완료
- service_role key: 설정 완료

## 📋 다음 단계

### 1. GitHub 저장소 생성 및 코드 푸시

#### 1-1. GitHub 저장소 생성

1. https://github.com 접속
2. 오른쪽 상단 "+" → "New repository" 클릭
3. 저장소 정보 입력:
   - **Repository name**: 원하는 이름 (예: `nas-board`)
   - **Description**: 선택사항
   - **Visibility**: Public 또는 Private 선택
   - **Initialize this repository with**: 체크하지 않기
4. "Create repository" 클릭

#### 1-2. 코드 푸시

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

# GitHub 저장소 연결 (위에서 만든 저장소 URL 사용)
git remote add origin https://github.com/your-username/repo-name.git

# 코드 푸시
git push -u origin main
```

**저장소 URL을 알려주시면 정확한 명령어를 제공하겠습니다!**

---

### 2. Vercel 프로젝트 생성 및 배포

#### 2-1. Vercel 계정 생성/로그인

1. https://vercel.com 접속
2. "Sign Up" 또는 "Log In" 클릭
3. **"Continue with GitHub"** 클릭 (권장)

#### 2-2. 프로젝트 생성

1. Vercel 대시보드에서 "Add New..." → "Project" 클릭
2. GitHub 저장소 선택 (위에서 만든 저장소)
3. 프로젝트 설정:
   - **Framework Preset**: Next.js (자동 감지)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

#### 2-3. 환경 변수 설정

**"Environment Variables"** 섹션에서 다음 3개 추가:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Value: `https://cdhtazsusgfyfucnfbfe.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkaHRhenN1c2dmeWZ1Y25mYmZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NTg1MTEsImV4cCI6MjA4MjEzNDUxMX0.fpze92RiEGfncezD6I4PqegyX71iRX4rJUV56hNc1JE`

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkaHRhenN1c2dmeWZ1Y25mYmZlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjU1ODUxMSwiZXhwIjoyMDgyMTM0NTExfQ.9jl5nAQqvVJv8KtSO-1Cz195uFEGnBp6MAx5vzjNIrc`
   - ⚠️ Environment: Production, Preview, Development 모두 선택

4. "Deploy" 클릭

#### 2-4. 배포 완료 확인

- 배포 완료 후 Vercel에서 제공하는 URL로 접속
- 예: `https://your-project.vercel.app`

---

### 3. GitHub Actions 자동 배포 설정 (선택사항)

자동 배포를 원하시면 다음 정보가 필요합니다:

1. **VERCEL_TOKEN**
   - Vercel → Settings → Tokens → Create Token

2. **VERCEL_ORG_ID**
   - Vercel 프로젝트 Settings → General → Organization ID

3. **VERCEL_PROJECT_ID**
   - Vercel 프로젝트 Settings → General → Project ID

이 정보를 GitHub Secrets에 추가하면 자동 배포가 설정됩니다.

---

## 🎯 체크리스트

- [x] Supabase 프로젝트 생성 완료
- [x] Supabase 환경 변수 설정 완료
- [ ] GitHub 저장소 생성 완료
- [ ] 코드를 GitHub에 푸시 완료
- [ ] Vercel 계정 생성/로그인 완료
- [ ] Vercel 프로젝트 생성 완료
- [ ] Vercel 환경 변수 설정 완료
- [ ] 배포 완료 확인

---

## 📝 다음에 알려주실 정보

1. **GitHub 저장소 URL** (생성 후)
2. **Vercel 배포 완료 여부**
3. **자동 배포 설정 원하시는지** (선택사항)

준비되면 알려주세요! 🚀

