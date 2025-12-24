# SQLite 사용 가이드

PostgreSQL이나 Docker가 없는 NAS 서버에서 SQLite를 사용하는 방법입니다.

## SQLite의 장점

- ✅ 서버 설치 불필요
- ✅ 파일 기반 (단일 파일로 모든 데이터 저장)
- ✅ 설정 간단
- ✅ 빠른 성능

## 설치

의존성 설치:

```bash
cd /Users/nj/Downloads/site3
npm install
```

## 데이터베이스 파일 위치

데이터베이스 파일은 자동으로 생성됩니다:
- 경로: `data/nas_board.db`
- 프로젝트 루트의 `data` 폴더에 저장

## 초기화

데이터베이스는 자동으로 초기화됩니다. 서버를 실행하면:
1. `data` 폴더가 자동 생성
2. `nas_board.db` 파일이 자동 생성
3. 테이블이 자동 생성

## 관리자 계정 생성

서버 실행 후 회원가입 페이지에서:
- 이메일: `mnj510@naver.com`
- 비밀번호: `asdf6014`

또는 스크립트로 생성:

```bash
node scripts/create-admin-sqlite.js
```

## 데이터 백업

데이터베이스 파일을 복사하면 됩니다:

```bash
# 백업
cp data/nas_board.db data/nas_board_backup_$(date +%Y%m%d).db

# 복원
cp data/nas_board_backup_20241224.db data/nas_board.db
```

## 환경 변수

`.env.local` 파일이 필요 없습니다! (SQLite는 파일 기반이므로)

하지만 JWT 시크릿은 설정하세요:

```env
JWT_SECRET=your-secret-key-change-in-production
NAS_SERVER_URL=http://192.168.219.55:5001
```

## 문제 해결

### 데이터베이스 파일 권한 오류

```bash
chmod 644 data/nas_board.db
chmod 755 data
```

### 데이터베이스 파일이 생성되지 않는 경우

```bash
mkdir -p data
chmod 755 data
```

## PostgreSQL과의 차이점

- SQLite는 파일 기반이므로 네트워크 연결 불필요
- 동시 접속이 많으면 성능 저하 가능 (소규모 사이트에는 충분)
- 일부 고급 기능 제한 (하지만 이 프로젝트에는 충분)

## 다음 단계

1. `npm install` 실행
2. `npm run dev` 실행
3. 브라우저에서 http://localhost:3000 접속
4. 회원가입 또는 관리자 계정으로 로그인

