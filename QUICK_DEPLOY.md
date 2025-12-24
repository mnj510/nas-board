# 빠른 배포 가이드

## 방법 1: 홈 디렉토리 사용 (가장 간단)

NAS 서버에서:

```bash
# 홈 디렉토리에 프로젝트 폴더 생성
mkdir -p ~/nas-board
cd ~/nas-board
```

그 다음 로컬 컴퓨터에서:

```bash
cd /Users/nj/Downloads/site3
scp -r * guraud22@192.168.219.55:~/nas-board/
```

## 방법 2: 로컬에서 직접 복사

로컬 컴퓨터 터미널에서:

```bash
cd /Users/nj/Downloads/site3

# NAS 서버 홈 디렉토리에 복사
scp -r * guraud22@192.168.219.55:~/nas-board/
```

비밀번호 입력

## 방법 3: NAS File Station 사용 (추천)

1. 로컬에서 프로젝트 폴더 압축:
   ```bash
   cd /Users/nj/Downloads
   zip -r site3.zip site3
   ```

2. NAS 웹 인터페이스 접속: http://192.168.219.55:5000
3. **File Station** 열기
4. `homes/guraud22/` 폴더로 이동
5. `site3.zip` 파일 업로드
6. 업로드한 파일 우클릭 → **압축 해제**
7. 압축 해제된 `site3` 폴더 이름을 `nas-board`로 변경

## 방법 4: 직접 파일 생성

NAS 서버에서:

```bash
# 홈 디렉토리에 프로젝트 폴더 생성
mkdir -p ~/nas-board
cd ~/nas-board

# package.json부터 생성
nano package.json
```

로컬의 `package.json` 내용을 복사해 붙여넣기

