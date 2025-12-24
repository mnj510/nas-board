# NAS 서버 배포 단계별 가이드

## 1단계: 프로젝트를 NAS 서버로 복사

### 방법 A: SCP 사용 (로컬에서)

로컬 컴퓨터 터미널에서:

```bash
cd /Users/nj/Downloads/site3

# NAS 서버로 전체 프로젝트 복사
scp -r . guraud22@192.168.219.55:/volume1/web/nas-board/
```

비밀번호 입력 필요

### 방법 B: Git 사용 (추천)

#### 로컬에서:
```bash
cd /Users/nj/Downloads/site3
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/nas-board.git
git push -u origin main
```

#### NAS 서버에서:
```bash
cd /volume1/web
git clone https://github.com/your-username/nas-board.git
cd nas-board
```

### 방법 C: NAS File Station 사용

1. NAS 웹 인터페이스 접속: http://192.168.219.55:5000
2. **File Station** 열기
3. `/volume1/web/` 폴더로 이동 (없으면 생성)
4. 로컬의 `site3` 폴더 전체를 압축하여 업로드
5. NAS에서 압축 해제

## 2단계: NAS 서버에서 프로젝트 디렉토리로 이동

SSH 접속 후:

```bash
ssh guraud22@192.168.219.55

# 프로젝트 디렉토리로 이동
cd /volume1/web/nas-board

# 또는 직접 생성한 경로로 이동
cd /volume1/site3
```

## 3단계: 의존성 설치

```bash
# 프로젝트 디렉토리에서
npm install
```

## 4단계: 환경 변수 설정

```bash
# .env.local 파일 생성
nano .env.local
```

다음 내용 입력:

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
NAS_SERVER_URL=http://192.168.219.55:5001
NODE_ENV=production
PORT=3000
```

저장: `Ctrl+O`, `Enter`, `Ctrl+X`

## 5단계: 데이터 디렉토리 생성

```bash
mkdir -p data
mkdir -p public/uploads/thumbnails
chmod 755 data
chmod 755 public/uploads/thumbnails
```

## 6단계: 개발 서버 실행

```bash
npm run dev
```

또는 프로덕션 모드:

```bash
npm run build
npm start
```

## 7단계: PM2로 백그라운드 실행 (선택사항)

```bash
# PM2 설치 (없다면)
npm install -g pm2

# PM2로 실행
pm2 start npm --name "nas-board" -- start
pm2 save
pm2 startup
```

## 문제 해결

### package.json을 찾을 수 없는 경우

```bash
# 현재 위치 확인
pwd

# 프로젝트 디렉토리로 이동
cd /volume1/web/nas-board

# 또는 프로젝트 위치 찾기
find /volume1 -name "package.json" -type f
```

### 권한 오류

```bash
# 프로젝트 디렉토리 권한 설정
sudo chown -R guraud22:users /volume1/web/nas-board
chmod -R 755 /volume1/web/nas-board
```

### Node.js가 없는 경우

```bash
# Node.js 버전 확인
node --version

# 없다면 Package Center에서 Node.js 설치
```

