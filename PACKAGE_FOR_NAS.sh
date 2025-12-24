#!/bin/bash
# NAS 배포를 위한 전체 패키지 압축 스크립트

echo "📦 NAS 배포용 패키지 생성 중..."
echo ""

# 프로젝트 디렉토리로 이동
cd /Users/nj/Downloads/site3

# 1단계: 로컬에서 깨끗하게 설치
echo "1️⃣ 로컬에서 의존성 설치 중..."
if [ -d "node_modules" ]; then
    echo "   기존 node_modules 삭제 중..."
    rm -rf node_modules
fi

npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install 실패!"
    exit 1
fi

echo "✅ 설치 완료!"
echo ""

# 2단계: 압축 파일 생성
echo "2️⃣ 압축 파일 생성 중..."
cd /Users/nj/Downloads

# 기존 압축 파일이 있으면 삭제
if [ -f "site3_full.zip" ]; then
    echo "   기존 site3_full.zip 삭제 중..."
    rm -f site3_full.zip
fi

# node_modules 포함하여 압축 (하지만 .next는 제외)
zip -r site3_full.zip site3 \
    -x "site3/.next/*" \
    -x "site3/.git/*" \
    -x "site3/.DS_Store" \
    -x "site3/node_modules/.cache/*" \
    -x "site3/*.log"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 압축 완료!"
    echo ""
    echo "📁 생성된 파일: /Users/nj/Downloads/site3_full.zip"
    echo ""
    echo "📋 파일 크기:"
    ls -lh /Users/nj/Downloads/site3_full.zip
    echo ""
    echo "다음 단계:"
    echo "1. File Station에서 /volume1/site3/ 폴더로 이동"
    echo "2. 기존 nas-board 폴더를 삭제하거나 이름 변경"
    echo "3. site3_full.zip을 업로드"
    echo "4. 압축 해제 후 폴더 이름을 nas-board로 변경"
    echo "5. SSH로 접속하여 테스트:"
    echo "   ssh guraud22@192.168.219.55"
    echo "   cd /volume1/site3/nas-board"
    echo "   npm run dev"
else
    echo "❌ 압축 실패!"
    exit 1
fi

