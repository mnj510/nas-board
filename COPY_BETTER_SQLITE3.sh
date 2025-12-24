#!/bin/bash
# better-sqlite3를 로컬에서 빌드 후 NAS로 복사하는 스크립트

echo "🔧 better-sqlite3 빌드 및 복사 스크립트"
echo ""

# 프로젝트 디렉토리로 이동
cd /Users/nj/Downloads/site3

# 로컬에서 npm install (이미 되어 있을 수 있음)
echo "📦 로컬에서 의존성 설치 중..."
npm install

# NAS 서버 정보
NAS_USER="guraud22"
NAS_HOST="192.168.219.55"
NAS_PATH="/volume1/site3/nas-board"

echo ""
echo "📤 NAS로 better-sqlite3 복사 중..."
echo "   대상: ${NAS_USER}@${NAS_HOST}:${NAS_PATH}/node_modules/"

# better-sqlite3 모듈 전체 복사
scp -r node_modules/better-sqlite3 ${NAS_USER}@${NAS_HOST}:${NAS_PATH}/node_modules/

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 복사 완료!"
    echo ""
    echo "다음 단계:"
    echo "1. SSH로 NAS에 접속:"
    echo "   ssh ${NAS_USER}@${NAS_HOST}"
    echo ""
    echo "2. 프로젝트 디렉토리로 이동:"
    echo "   cd ${NAS_PATH}"
    echo ""
    echo "3. 나머지 패키지 설치:"
    echo "   npm install --ignore-scripts"
    echo ""
    echo "4. 또는 better-sqlite3만 제외하고 설치:"
    echo "   npm install --ignore-scripts --no-optional"
else
    echo ""
    echo "❌ 복사 실패!"
    echo "   SSH 연결을 확인하세요."
fi

