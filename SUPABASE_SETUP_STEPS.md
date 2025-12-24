# Supabase 설정 단계별 가이드

## ✅ 1단계: 데이터베이스 스키마 실행

1. **Supabase 대시보드 접속**
   - https://supabase.com/dashboard
   - 프로젝트 선택: `cdhtazsusgfyfucnfbfe`

2. **SQL Editor 열기**
   - 왼쪽 사이드바에서 "SQL Editor" 클릭
   - "New query" 클릭

3. **스키마 실행**
   - 아래 `supabase-schema.sql` 파일의 전체 내용을 복사
   - SQL Editor에 붙여넣기
   - "Run" 버튼 클릭 (또는 Ctrl+Enter)
   - 성공 메시지 확인

## ✅ 2단계: Storage 버킷 생성

1. **Storage 메뉴로 이동**
   - 왼쪽 사이드바에서 "Storage" 클릭

2. **버킷 생성**
   - "Create bucket" 버튼 클릭
   - 설정:
     - **Name**: `images`
     - **Public bucket**: ✅ 체크 (중요!)
   - "Create bucket" 클릭

3. **정책 설정**
   - 생성된 `images` 버킷 클릭
   - "Policies" 탭 클릭
   - "New Policy" 클릭
   - **SELECT 정책** (모든 사용자가 읽기 가능):
     - Policy name: `Public read access`
     - Allowed operation: `SELECT`
     - Target roles: `public`
     - Policy definition: `true`
   - "Save policy" 클릭
   - **INSERT 정책** (인증된 사용자만 업로드 가능):
     - Policy name: `Authenticated upload`
     - Allowed operation: `INSERT`
     - Target roles: `authenticated`
     - Policy definition: `true`
   - "Save policy" 클릭

## ✅ 3단계: 관리자 계정 설정

배포 후 회원가입을 하면, 다음 SQL로 관리자 권한 부여:

```sql
UPDATE profiles 
SET is_admin = true 
WHERE email = 'mnj510@naver.com';
```

또는 Supabase 대시보드 → SQL Editor에서 실행

---

## 📋 다음 단계

1. ✅ Supabase 설정 완료 (위 단계 완료)
2. ⏳ GitHub 저장소 생성 및 코드 푸시
3. ⏳ Vercel 프로젝트 생성 및 배포

준비되면 알려주세요!

