# better-sqlite3 수동 복사 가이드

SCP가 실패하는 경우, File Station을 통해 수동으로 복사할 수 있습니다.

## 방법 1: File Station 사용 (권장)

1. **로컬 Mac에서**:
   - Finder에서 `/Users/nj/Downloads/site3/node_modules/better-sqlite3` 폴더를 찾습니다
   - 이 폴더를 압축합니다 (우클릭 → "압축")

2. **NAS File Station에서**:
   - `/volume1/site3/nas-board/node_modules/` 폴더로 이동
   - 압축 파일 업로드
   - 압축 해제
   - 폴더 이름이 `better-sqlite3`인지 확인

## 방법 2: tar 파일 사용

로컬에서 생성된 `better-sqlite3.tar.gz` 파일을:
1. File Station을 통해 `/volume1/site3/nas-board/node_modules/`에 업로드
2. SSH로 접속하여 압축 해제:

```bash
ssh guraud22@192.168.219.55
cd /volume1/site3/nas-board/node_modules
tar -xzf better-sqlite3.tar.gz
```

## 방법 3: sql.js로 변경 (가장 안정적)

위 방법들이 작동하지 않으면, `sql.js`로 변경하는 것을 권장합니다.
WebAssembly 기반이므로 컴파일이 필요 없고 모든 플랫폼에서 작동합니다.

