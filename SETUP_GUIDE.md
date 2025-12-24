# Vercel + Supabase 배포 가이드

이 프로젝트는 Vercel과 Supabase를 사용하여 배포됩니다.

## 필요한 정보

다음 정보를 준비해주세요:

### 1. Supabase 정보

1. **Supabase 프로젝트 생성**
   - https://supabase.com 접속
   - 새 프로젝트 생성
   - 프로젝트 이름과 데이터베이스 비밀번호 설정

2. **필요한 정보**
   - `Project URL`: 프로젝트 설정 → API → Project URL
   - `anon public key`: 프로젝트 설정 → API → anon public key
   - `service_role key`: 프로젝트 설정 → API → service_role key (비밀!)

### 2. GitHub 정보

- GitHub 저장소 URL (예: `https://github.com/username/repo-name`)

### 3. Vercel 정보

- Vercel 계정 (GitHub로 로그인 가능)
- Vercel 프로젝트 생성 후 자동으로 생성되는 정보:
  - `VERCEL_TOKEN`: Vercel 설정 → Tokens에서 생성
  - `VERCEL_ORG_ID`: Vercel 대시보드에서 확인
  - `VERCEL_PROJECT_ID`: Vercel 프로젝트 설정에서 확인

## 설정 단계

### 1단계: Supabase 데이터베이스 설정

1. Supabase 대시보드에서 SQL Editor 열기
2. `supabase-schema.sql` 파일의 내용을 복사하여 실행
3. Storage에서 `images` 버킷 생성:
   - Storage → Create bucket
   - 이름: `images`
   - Public bucket: 체크
   - Policies 설정:
     - SELECT: 모든 사용자 허용
     - INSERT: 인증된 사용자만 허용

### 2단계: GitHub 저장소 설정

1. GitHub에 새 저장소 생성
2. 프로젝트를 GitHub에 푸시:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/repo-name.git
   git push -u origin main
   ```

### 3단계: GitHub Secrets 설정

GitHub 저장소 → Settings → Secrets and variables → Actions에서 다음 secrets 추가:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon public key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service_role key
- `VERCEL_TOKEN`: Vercel 토큰
- `VERCEL_ORG_ID`: Vercel Organization ID
- `VERCEL_PROJECT_ID`: Vercel Project ID

### 4단계: Vercel 프로젝트 생성

**방법 1: 자동 배포 (권장)**

1. Vercel 대시보드 접속: https://vercel.com
2. "Add New Project" 클릭
3. GitHub 저장소 선택
4. 환경 변수 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. "Deploy" 클릭

**방법 2: 수동 배포**

Vercel CLI 사용:
```bash
npm i -g vercel
vercel login
vercel
```

### 5단계: 관리자 계정 생성

배포 후 회원가입 페이지에서:
- 이메일: `mnj510@naver.com`
- 비밀번호: `asdf6014`

또는 Supabase 대시보드에서 직접:
```sql
UPDATE profiles 
SET is_admin = true 
WHERE email = 'mnj510@naver.com';
```

## 환경 변수 요약

### 로컬 개발용 (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Vercel 환경 변수

Vercel 대시보드 → Project Settings → Environment Variables에서 설정:
- Production, Preview, Development 모두에 동일하게 설정

## 배포 확인

배포가 완료되면:
1. Vercel에서 제공하는 URL로 접속
2. 회원가입/로그인 테스트
3. 게시물 작성/조회 테스트
4. 이미지 업로드 테스트

## 문제 해결

### Supabase 연결 오류
- 환경 변수가 올바르게 설정되었는지 확인
- Supabase 프로젝트가 활성화되어 있는지 확인

### 이미지 업로드 실패
- Supabase Storage에 `images` 버킷이 생성되었는지 확인
- 버킷 정책이 올바르게 설정되었는지 확인

### 인증 오류
- Supabase Auth 설정 확인
- RLS (Row Level Security) 정책 확인

## 추가 리소스

- [Supabase 문서](https://supabase.com/docs)
- [Vercel 문서](https://vercel.com/docs)
- [Next.js 문서](https://nextjs.org/docs)

