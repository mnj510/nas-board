# ⚡ 빠른 시작 가이드

## 5분 안에 배포하기

### 1단계: Supabase 설정 (2분)

1. https://supabase.com → "New Project"
2. 프로젝트 생성 후:
   - Settings → API → Project URL 복사
   - Settings → API → anon public key 복사
   - Settings → API → service_role key 복사

### 2단계: GitHub 설정 (1분)

1. https://github.com → 새 저장소 생성
2. 터미널에서:
   ```bash
   cd /Users/nj/Downloads/site3
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/repo-name.git
   git push -u origin main
   ```

### 3단계: Vercel 배포 (2분)

1. https://vercel.com → "Add New Project"
2. GitHub 저장소 선택
3. 환경 변수 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. "Deploy" 클릭

### 4단계: Supabase 데이터베이스 설정

1. Supabase → SQL Editor
2. `supabase-schema.sql` 파일 내용 복사하여 실행
3. Storage → Create bucket → 이름: `images` → Public 체크

### 5단계: 관리자 계정 생성

1. 배포된 사이트 접속
2. 회원가입: `mnj510@naver.com` / `asdf6014`
3. Supabase → SQL Editor:
   ```sql
   UPDATE profiles SET is_admin = true WHERE email = 'mnj510@naver.com';
   ```

완료! 🎉

