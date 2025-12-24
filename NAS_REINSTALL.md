# NAS에서 의존성 재설치 가이드

Next.js 모듈이 누락된 경우, NAS에서 의존성을 다시 설치해야 합니다.

## 해결 방법

NAS에서 다음 명령어를 순서대로 실행하세요:

```bash
ssh guraud22@192.168.219.55
cd /volume1/site3/nas-board

# 1. 기존 node_modules 백업 (선택사항)
mv node_modules node_modules.backup

# 2. package-lock.json도 백업
mv package-lock.json package-lock.json.backup

# 3. 모든 패키지 재설치 (빌드 스크립트 제외)
npm install --ignore-scripts

# 4. better-sqlite3는 나중에 처리하거나 sql.js로 변경
```

## better-sqlite3 처리

### 옵션 A: File Station으로 복사
1. 로컬 Mac에서 `/Users/nj/Downloads/site3/node_modules/better-sqlite3` 폴더를 압축
2. File Station으로 `/volume1/site3/nas-board/node_modules/`에 업로드 및 압축 해제

### 옵션 B: sql.js로 변경 (권장)
더 안정적이고 플랫폼 독립적입니다.

## 테스트

설치 후:
```bash
npm run dev
```

