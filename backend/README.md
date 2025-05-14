# 대량 메일 발송 시스템 - 백엔드

## 기술 스택

- 프레임워크: **NestJS**
- 데이터베이스: **MySQL**
- ORM: **TypeORM**
- 이메일 발송: **AWS SES (Simple Email Service)**
- 작업 큐: **Bull**
- API 문서: **Swagger**

## 주요 기능

### 1. 이메일 발송 통계 API

- 일/주/월/년 단위 메일 발송량 통계
- 발송 성공/실패 비율 통계
- 시계열 데이터 집계

### 2. 이메일 그룹 관리 API

- 이메일 그룹 CRUD
- 엑셀 파일을 통한 대량 이메일 등록
- 이메일 유효성 검증
- 중복 이메일 처리

### 3. 이메일 템플릿 관리 API

- 템플릿 CRUD
- MJML 템플릿 HTML 변환
- 템플릿 변수 처리
- 미리보기 생성

### 4. 이메일 발송 작업 관리 API

- 발송 작업 생성 및 관리
- 대량 메일 발송 큐 처리
- 발송 상태 모니터링
- 예약 발송 처리
- 발송 일시중지/재개

### 5. 수신거부 관리 API

- 수신거부 처리
- 바운스 메일 자동 처리
- 수신거부 목록 관리

## 프로젝트 구조

```backend/
├── src/
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── utils/
│   ├── config/
│   ├── modules/
│   │   ├── statistics/
│   │   ├── email-groups/
│   │   ├── templates/
│   │   ├── send-task/
│   │   └── unsubscribes/
│   ├── database/
│   │   ├── entities/
│   │   └── migrations/
│   └── jobs/
└── test/
```

## 환경 설정

1. 필수 환경 변수

```env
# Database
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=bulk_email_db
MYSQL_USER=user
MYSQL_PASSWORD=password

# Redis
REDIS_URL=redis://localhost:6379

# AWS
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_SES_FROM_EMAIL=no-reply@yourdomain.com
```

2. AWS SES 설정

- AWS SES 서비스 활성화
- 발신자 이메일 도메인 인증
- SES 발송 한도 확인

1. 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run start:dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm run start:prod
```

## API 문서

- 개발 서버: `http://localhost:3000/api-docs`
- Swagger UI를 통해 API 테스트 가능

## 데이터베이스 마이그레이션

```bash
# 마이그레이션 생성
npm run migration:generate

# 마이그레이션 실행
npm run migration:run

# 마이그레이션 되돌리기
npm run migration:revert
```
