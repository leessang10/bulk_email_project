# Config Module

설정 관리를 위한 모듈입니다. AWS Parameter Store와 환경 변수(.env)를 통합하여 관리합니다.

## 구조

```
src/config/
├── config.module.ts              # 설정 모듈 정의
└── services/
    ├── config.service.ts         # 통합 설정 서비스 (메인)
    ├── aws-param-store.service.ts # AWS Parameter Store 처리
    └── dot-env.service.ts        # 환경 변수 처리
```

## 설정 우선순위

1. AWS Parameter Store
2. 환경 변수 (.env)
3. 기본값 (설정된 경우)

## 사용 방법

### 1. 모듈 임포트

```typescript
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/services/config.service';

@Module({
  imports: [ConfigModule],
  // ...
})
```

### 2. 서비스 주입

```typescript
@Injectable()
export class SomeService {
  constructor(private configService: ConfigService) {}
}
```

### 3. 설정값 가져오기

```typescript
// 일반 설정값
const value = await this.configService.get<string>('SOME_KEY');

// 필수 설정값 (없으면 에러)
const required = await this.configService.getOrThrow<string>('REQUIRED_KEY');

// AWS Parameter Store 경로의 모든 설정값
const params = await this.configService.getByPath('/some/path/');

// 데이터베이스 설정
const dbConfig = await this.configService.getDatabaseConfig();
```

## AWS Parameter Store 설정

### 필수 파라미터 경로

```
/bulk-email/database/
  ├── host
  ├── database
  ├── username
  └── password

/tlooto/database/
  ├── host
  ├── database
  ├── username
  └── password

/jobs/database/
  ├── host
  ├── database
  ├── username
  └── password
```

## 환경 변수 설정

```env
# AWS
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

## 캐싱

- 모든 설정값은 메모리에 캐시됨
- 애플리케이션 재시작 시 캐시 초기화
- AWS Parameter Store 요청 최소화
