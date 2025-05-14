# Database Module

다중 데이터베이스 연결을 관리하는 모듈입니다.

## 연결 데이터베이스

1. `bulk_email`: 대량 메일 발송 관리 데이터베이스

2. `tlooto`: tlooto 서비스 데이터베이스

3. `jobs`: 잡스 서비스 데이터베이스

## 구조

```
src/database/
├── database.module.ts           # 데이터베이스 모듈 정의
├── decorators/                  # 커스텀 데코레이터
│   └── inject-repository.decorator.ts
└── entities/                    # 엔티티 정의
    ├── bulk-email/             # 대량 메일 발송 엔티티
    ├── tlooto/                 # Tlooto 서비스 엔티티
    └── jobs/                   # 채용 서비스 엔티티
```

## 설정

데이터베이스 설정은 `ConfigService`를 통해 관리됩니다. 설정 우선순위:

1. AWS Parameter Store (`/[service-name]/database/` 경로)
2. 환경 변수
3. 기본값

## 사용 방법

### 1. 모듈 임포트

```typescript
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule],
  // ...
})
```

### 2. 리포지토리 주입

각 데이터베이스의 리포지토리는 전용 데코레이터를 통해 주입합니다:

```typescript
import { InjectBulkEmailRepository } from './database/decorators/inject-repository.decorator';
import { EmailGroup } from './database/entities/bulk-email/email-group.entity';

@Injectable()
export class EmailGroupService {
  constructor(
    @InjectBulkEmailRepository(EmailGroup)
    private emailGroupRepository: Repository<EmailGroup>,
  ) {}
}
```

### 3. 엔티티 정의

```typescript
// entities/bulk-email/email-group.entity.ts
@Entity('email_groups')
export class EmailGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // ...
}
```

## 주의사항

1. 엔티티 동기

   - `synchronize: false` 설정으로 자동 스키마 동기화 비활성화 (상용 DB가 변경되므로 false로 고정)
   - 마이그레이션을 통한 스키마 관리 필요

2. 로깅

   - 개발 환경: SQL 쿼리 로깅 활성화
   - 운영 환경: 로깅 비활성화

3. 연결 관리
   - 각 데이터베이스 연결은 독립적으로 관리
   - 연결 실패 시 개별적으로 처리

## 마이그레이션

```bash
# 마이그레이션 생성
npm run migration:generate -- -n MigrationName -d src/database/migrations

# 마이그레이션 실행
npm run migration:run

# 마이그레이션 되돌리기
npm run migration:revert
```
