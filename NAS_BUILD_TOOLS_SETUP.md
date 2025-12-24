# NAS 빌드 도구 설치 가이드

`better-sqlite3` 설치를 위해 NAS에 빌드 도구가 필요합니다.

## 문제 원인

- `better-sqlite3`는 네이티브 모듈로 C++ 컴파일이 필요합니다
- NAS에 `make`, `gcc` 등의 빌드 도구가 없어서 설치 실패

## 해결 방법 1: Synology 패키지 센터에서 설치 (권장)

### 1단계: 패키지 센터 열기
- Synology DSM에 로그인
- 패키지 센터 열기

### 2단계: 개발 도구 설치
1. 패키지 센터에서 "개발자 도구" 또는 "Development Tools" 검색
2. 다음 중 하나 설치:
   - **Tool Chain** (가장 권장)
   - **GCC Compiler**
   - **Build Tools**

### 3단계: SSH로 확인
```bash
ssh guraud22@192.168.219.55

# make 확인
which make
make --version

# gcc 확인
which gcc
gcc --version
```

### 4단계: npm install 재시도
```bash
cd /volume1/site3/nas-board
npm install
```

## 해결 방법 2: 수동 설치 (패키지 센터에 없을 경우)

### 1단계: SSH 접속
```bash
ssh guraud22@192.168.219.55
```

### 2단계: 빌드 도구 설치 시도
```bash
# Synology의 경우 ipkg 사용 가능 여부 확인
which ipkg

# 또는 opkg (일부 NAS)
which opkg
```

### 3단계: 설치 (ipkg가 있는 경우)
```bash
sudo ipkg update
sudo ipkg install make
sudo ipkg install gcc
```

## 해결 방법 3: 로컬에서 빌드 후 복사 (임시 해결책)

로컬 Mac에서 빌드된 모듈을 NAS로 복사:

```bash
# 로컬에서
cd /Users/nj/Downloads/site3
npm install

# 빌드된 better-sqlite3 복사
scp -r node_modules/better-sqlite3 guraud22@192.168.219.55:/volume1/site3/nas-board/node_modules/
```

**주의**: 이 방법은 아키텍처가 같을 때만 작동합니다 (Mac ARM64 vs NAS ARM64)

## 해결 방법 4: sql.js로 변경 (대안)

빌드 도구 설치가 어려운 경우, WebAssembly 기반 `sql.js`로 변경할 수 있습니다.
이 경우 코드 수정이 필요합니다.

## 확인 방법

설치 후 확인:
```bash
cd /volume1/site3/nas-board
npm install --verbose 2>&1 | grep better-sqlite3
```

성공하면:
```
better-sqlite3@9.6.0 install: node_modules/better-sqlite3
```

## 문제 해결

### "make: command not found"
→ 빌드 도구가 설치되지 않았습니다. 방법 1 또는 2를 시도하세요.

### "GLIBC version not found"
→ NAS의 GLIBC 버전이 낮습니다. 방법 3(로컬 빌드) 또는 방법 4(sql.js)를 시도하세요.

### "Permission denied"
→ 권한 문제입니다:
```bash
sudo chown -R guraud22:users /volume1/site3/nas-board
```

