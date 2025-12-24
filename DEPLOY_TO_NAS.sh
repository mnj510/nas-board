#!/bin/bash

# NAS 서버 배포 스크립트
# 사용법: ./DEPLOY_TO_NAS.sh

echo "🚀 NAS 서버로 프로젝트 배포 시작..."

# NAS 서버 정보
NAS_USER="guraud22"
NAS_HOST="192.168.219.55"
NAS_PATH="/volume1/web/nas-board"

# 로컬 프로젝트 경로
LOCAL_PATH="/Users/nj/Downloads/site3"

echo "📦 프로젝트 파일 복사 중..."
scp -r "$LOCAL_PATH"/* "$NAS_USER@$NAS_HOST:$NAS_PATH/"

if [ $? -eq 0 ]; then
    echo "✅ 파일 복사 완료!"
    echo ""
    echo "다음 단계:"
    echo "1. SSH 접속: ssh $NAS_USER@$NAS_HOST"
    echo "2. 프로젝트 디렉토리로 이동: cd $NAS_PATH"
    echo "3. 의존성 설치: npm install"
    echo "4. 환경 변수 설정: nano .env.local"
    echo "5. 서버 실행: npm run dev"
else
    echo "❌ 파일 복사 실패"
    exit 1
fi

