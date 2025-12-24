# NAS 서버에 PostgreSQL 설치 가이드

Synology NAS에 PostgreSQL을 설치하고 설정하는 방법입니다.

## 방법 1: Package Center에서 설치 (가장 간단)

### 1단계: Package Center 열기
1. NAS 웹 인터페이스 접속: http://192.168.219.55:5000
2. **Package Center** 클릭
3. 검색창에 "PostgreSQL" 입력

### 2단계: PostgreSQL 설치
1. **PostgreSQL** 패키지 찾기
2. **설치** 버튼 클릭
3. 설치 완료 대기

### 3단계: PostgreSQL 설정
1. **Main Menu** → **PostgreSQL** 클릭
2. 데이터베이스 비밀번호 설정
3. 포트 확인 (기본값: 5432)

## 방법 2: Docker로 설치 (Package Center에 없을 경우)

### 1단계: Docker 설치
1. Package Center에서 **Docker** 검색 및 설치

### 2단계: PostgreSQL 컨테이너 실행
1. **Docker** 앱 열기
2. **Registry** 탭에서 "postgres" 검색
3. **postgres:11** 또는 **postgres:13** 선택 후 **Download**
4. **Image** 탭에서 다운로드된 이미지 선택
5. **Launch** 클릭
6. 컨테이너 이름: `postgres-nas`
7. **Advanced Settings** 클릭:
   - **Volume** 탭: `/volume1/docker/postgres/data` → `/var/lib/postgresql/data` 마운트
   - **Port Settings** 탭: 로컬 포트 `5432` → 컨테이너 포트 `5432`
   - **Environment** 탭:
     - `POSTGRES_PASSWORD`: 원하는 비밀번호 설정
     - `POSTGRES_DB`: `nas_board` (선택사항)
8. **Apply** → **Next** → **Done**

## 방법 3: SSH로 직접 설치 (고급)

### 1단계: SSH 접속
```bash
ssh guraud22@192.168.219.55
```

### 2단계: PostgreSQL 설치 확인
```bash
which psql
postgres --version
```

### 3단계: 설치되어 있지 않다면
Synology는 기본적으로 PostgreSQL을 포함하지 않을 수 있습니다. 이 경우:
- **방법 1 (Package Center)** 또는 **방법 2 (Docker)** 사용 권장

## PostgreSQL 설치 확인

### SSH로 확인
```bash
# PostgreSQL 프로세스 확인
ps aux | grep postgres

# PostgreSQL 포트 확인
netstat -tuln | grep 5432
```

### Package Center에서 확인
- **Main Menu** → **PostgreSQL** 앱이 보이면 설치됨

## 데이터베이스 생성

PostgreSQL이 설치되면:

```bash
# SSH 접속
ssh guraud22@192.168.219.55

# PostgreSQL 접속 (설치 방법에 따라 다름)
# Package Center 설치인 경우:
sudo -u postgres psql

# Docker 설치인 경우:
docker exec -it postgres-nas psql -U postgres
```

데이터베이스 생성:
```sql
CREATE DATABASE nas_board;
\q
```

## 문제 해결

### PostgreSQL을 찾을 수 없는 경우
1. Package Center에서 "PostgreSQL" 검색
2. 없다면 Docker로 설치
3. 또는 Synology 버전이 PostgreSQL을 지원하지 않을 수 있음

### 포트 충돌
- 다른 포트 사용 (예: 5433)
- 환경 변수에서 `DB_PORT` 변경

### 권한 문제
```bash
sudo chmod 755 /var/lib/postgresql
sudo chown postgres:postgres /var/lib/postgresql
```

## 다음 단계

PostgreSQL이 설치되고 데이터베이스가 생성되면:
1. 스키마 실행
2. 관리자 계정 생성
3. 환경 변수 설정

