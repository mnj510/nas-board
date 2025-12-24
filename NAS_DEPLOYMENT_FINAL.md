# NAS 최종 배포 가이드 (better-sqlite3 해결)

## 문제 상황
- NAS에 빌드 도구(`make`, `gcc`)가 없어서 `better-sqlite3` 설치 실패
- Tool Chain 패키지도 없음

## 해결 방법: 로컬 빌드 후 복사

Mac에서 빌드한 `node_modules`를 통째로 NAS로 복사합니다.

## 배포 단계

### 1단계: 로컬에서 패키지 생성

```bash
cd /Users/nj/Downloads/site3
./PACKAGE_FOR_NAS.sh
```

또는 수동으로:

```bash
cd /Users/nj/Downloads/site3
rm -rf node_modules
npm install
cd /Users/nj/Downloads
zip -r site3_full.zip site3 -x "site3/.next/*" "site3/.git/*"
```

### 2단계: NAS에 업로드

1. **File Station** 열기
2. `/volume1/site3/` 폴더로 이동
3. 기존 `nas-board` 폴더 삭제 또는 이름 변경 (예: `nas-board-old`)
4. `site3_full.zip` 업로드
5. 압축 해제
6. 폴더 이름을 `nas-board`로 변경

### 3단계: NAS에서 테스트

SSH로 접속:

```bash
ssh guraud22@192.168.219.55
cd /volume1/site3/nas-board
```

데이터베이스 디렉토리 생성:

```bash
mkdir -p data
chmod 755 data
```

환경 변수 설정 (필요한 경우):

```bash
# .env.local 파일 생성 (선택사항)
echo "JWT_SECRET=your-secret-key-change-in-production" > .env.local
```

서버 실행:

```bash
npm run dev
```

또는 프로덕션 모드:

```bash
npm run build
npm start
```

## 문제 해결

### "better_sqlite3.node: cannot open shared object file"

Mac과 NAS의 아키텍처가 다를 수 있습니다. 확인:

```bash
# Mac에서
uname -m  # arm64

# NAS에서
ssh guraud22@192.168.219.55
uname -m  # 확인
```

다르면 `sql.js`로 변경이 필요합니다.

### "GLIBC version not found"

NAS의 GLIBC 버전이 낮을 수 있습니다. `sql.js`로 변경 필요.

### 데이터베이스 파일 권한 오류

```bash
chmod 755 data
chmod 644 data/nas_board.db
```

## 대안: sql.js 사용

위 방법이 작동하지 않으면 `sql.js`로 변경할 수 있습니다.
WebAssembly 기반이므로 컴파일이 필요 없고 모든 플랫폼에서 작동합니다.

## 확인 사항

배포 후 확인:

1. 서버가 정상 실행되는지
2. 데이터베이스 파일이 생성되는지 (`data/nas_board.db`)
3. 로그인/회원가입이 작동하는지
4. 게시물 작성/조회가 작동하는지

