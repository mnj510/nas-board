#!/bin/bash
# NAS에서 의존성 재설치 스크립트 (better-sqlite3 제외)

echo "🔧 NAS에서 의존성 재설치 중..."
echo ""

# better-sqlite3를 임시로 제거
echo "1️⃣ better-sqlite3 임시 제거..."
sed -i.bak 's/"better-sqlite3":.*//' package.json
sed -i.bak '/^[[:space:]]*$/d' package.json

# 나머지 패키지 설치 (스크립트 실행 없이)
echo "2️⃣ 나머지 패키지 설치 중..."
npm install --ignore-scripts

# better-sqlite3 복원
echo "3️⃣ better-sqlite3 복원..."
mv package.json.bak package.json

echo ""
echo "✅ 완료!"
echo ""
echo "다음 단계:"
echo "1. 로컬 Mac에서 better-sqlite3 빌드된 파일만 복사"
echo "2. 또는 sql.js로 변경"

