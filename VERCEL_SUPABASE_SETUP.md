# 🚀 Vercel + Supabase 배포 완료 가이드

프로젝트가 Vercel과 Supabase를 사용하도록 완전히 전환되었습니다!

## ✅ 완료된 작업

1. ✅ Supabase 클라이언트 설정
2. ✅ 인증 시스템을 Supabase Auth로 변경
3. ✅ 모든 API routes를 Supabase로 전환
4. ✅ 이미지 업로드를 Supabase Storage로 변경
5. ✅ Vercel 배포 설정 추가
6. ✅ GitHub Actions 자동 배포 워크플로우 설정

## 📋 필요한 정보

다음 정보를 제공해주시면 자동 배포를 설정해드리겠습니다:

### 1. Supabase 정보 (필수)

Supabase 대시보드 (https://supabase.com/dashboard)에서:

1. **Project URL**
   - 위치: Settings → API → Project URL
   - 예: `https://xxxxxxxxxxxxx.supabase.co`

2. **anon public key**
   - 위치: Settings → API → anon public key
   - 예: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **service_role key** (비밀!)
   - 위치: Settings → API → service_role key
   - 예: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - ⚠️ 이 키는 절대 공개하지 마세요!

### 2. GitHub 정보

- GitHub 저장소 URL (예: `https://github.com/username/repo-name`)
- 또는 새 저장소를 생성하시겠습니까?

### 3. Vercel 정보 (자동 생성 가능)

Vercel 프로젝트 생성 후:
- `VERCEL_TOKEN`: Vercel 설정 → Tokens에서 생성
- `VERCEL_ORG_ID`: Vercel 대시보드에서 확인
- `VERCEL_PROJECT_ID`: Vercel 프로젝트 설정에서 확인

## 🔧 설정 단계

### 1단계: Supabase 프로젝트 생성 및 설정

1. https://supabase.com 접속
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - Name: 원하는 이름
   - Database Password: 강력한 비밀번호 (기억해두세요!)
   - Region: 가장 가까운 지역 선택
4. 프로젝트 생성 완료 대기 (약 2분)

### 2단계: Supabase 데이터베이스 스키마 실행

1. Supabase 대시보드 → SQL Editor
2. `supabase-schema.sql` 파일 내용 복사
3. SQL Editor에 붙여넣기
4. "Run" 클릭하여 실행

### 3단계: Supabase Storage 설정

1. Supabase 대시보드 → Storage
2. "Create bucket" 클릭
3. 설정:
   - Name: `images`
   - Public bucket: ✅ 체크
4. Policies 설정:
   - SELECT: 모든 사용자 허용
   - INSERT: 인증된 사용자만 허용

### 4단계: GitHub 저장소 생성 및 푸시

```bash
cd /Users/nj/Downloads/site3
git init
git add .
git commit -m "Initial commit: Vercel + Supabase setup"
git branch -M main
git remote add origin https://github.com/username/repo-name.git
git push -u origin main
```

### 5단계: GitHub Secrets 설정

GitHub 저장소 → Settings → Secrets and variables → Actions → New repository secret:

다음 6개의 secrets를 추가하세요:

1. `NEXT_PUBLIC_SUPABASE_URL` = Supabase Project URL
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Supabase anon public key
3. `SUPABASE_SERVICE_ROLE_KEY` = Supabase service_role key
4. `VERCEL_TOKEN` = Vercel 토큰 (Vercel 설정에서 생성)
5. `VERCEL_ORG_ID` = Vercel Organization ID
6. `VERCEL_PROJECT_ID` = Vercel Project ID

### 6단계: Vercel 프로젝트 생성

**방법 1: Vercel 대시보드에서 (권장)**

1. https://vercel.com 접속
2. "Add New Project" 클릭
3. GitHub 저장소 선택
4. 환경 변수 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. "Deploy" 클릭

**방법 2: Vercel CLI 사용**

```bash
npm i -g vercel
vercel login
vercel
```

환경 변수 입력:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 7단계: 관리자 계정 생성

배포 완료 후:

1. 사이트 접속
2. 회원가입 페이지에서:
   - 이메일: `mnj510@naver.com`
   - 비밀번호: `asdf6014`
   - 이름: 원하는 이름
3. Supabase 대시보드 → SQL Editor에서:
   ```sql
   UPDATE profiles 
   SET is_admin = true 
   WHERE email = 'mnj510@naver.com';
   ```

## 📝 환경 변수 요약

### 로컬 개발용 (.env.local)

프로젝트 루트에 `.env.local` 파일 생성:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Vercel 환경 변수

Vercel 대시보드 → Project Settings → Environment Variables:
- Production, Preview, Development 모두에 설정

## 🎉 배포 완료 확인

1. Vercel에서 제공하는 URL로 접속
2. 회원가입/로그인 테스트
3. 게시물 작성/조회 테스트
4. 이미지 업로드 테스트
5. 관리자 페이지 접근 테스트

## 🔗 유용한 링크

- **Supabase 대시보드**: https://supabase.com/dashboard
- **Vercel 대시보드**: https://vercel.com/dashboard
- **GitHub Actions**: 저장소 → Actions 탭

## ❓ 문제 해결

### Supabase 연결 오류
- 환경 변수가 올바르게 설정되었는지 확인
- Supabase 프로젝트가 활성화되어 있는지 확인

### 이미지 업로드 실패
- Supabase Storage에 `images` 버킷이 생성되었는지 확인
- 버킷이 Public으로 설정되었는지 확인

### 인증 오류
- Supabase Auth 설정 확인
- RLS 정책이 올바르게 설정되었는지 확인

## 📞 다음 단계

위 정보를 제공해주시면:
1. GitHub Secrets 자동 설정
2. Vercel 프로젝트 자동 생성
3. 자동 배포 설정 완료

준비되면 알려주세요! 🚀

