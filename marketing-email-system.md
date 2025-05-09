# 마케팅 대량 메일 발송 시스템 설계 문서

## 📌 사용 기술 스택

### ✅ 백엔드
- Nest.js
- TypeORM
- MySQL
- Redis + BullMQ + BullBoard
- AWS SES (이메일 발송)
- AWS S3 (템플릿 이미지/파일 저장)
- mjml, handlebars (템플릿 및 메일 머지 처리)

### ✅ 프론트엔드
- Next.js (또는 Vite + React)
- UI 라이브러리: Ant Design 또는 Mantine
- MJML 에디터: [easy-email-editor](https://github.com/zalify/easy-email-editor)

---

## ✅ 기능 목록

- AWS SES를 통한 이메일 발송
- MJML 기반 템플릿 에디터 및 저장
- 메일 머지 기능 (`{{name}}`, `{{company}}` 등 수신자별 바인딩)
- 주소록 및 주소록 그룹 관리
- 예약 발송 (BullMQ + Redis)
- 발송 작업 중지/재개 기능
- 수신 거부 기능
- 발송 이력 저장 및 수신자별 상태 추적
- 오픈율/클릭률 등 통계 수집
- BullBoard를 통한 큐 상태 시각화

---

## 🧩 ERD 설계

[email_address]
- id (PK)
- email
- name (nullable)
- company (nullable)
- phone (nullable)
- custom_fields (JSON) ✅ 메일 머지용 확장 데이터
- created_at

[email_address_group]
- id (PK)
- name
- created_at

[email_address_group_map]
- id (PK)
- group_id (FK) → email_address_group
- email_address_id (FK) → email_address

[email_template]
- id (PK)
- name
- mjml
- compiled_html
- created_at

[send_task]
- id (PK)
- subject
- template_id (FK) → email_template
- group_id (FK) → email_address_group
- scheduled_at (nullable)
- status: PENDING | PAUSED | IN_PROGRESS | COMPLETED | FAILED
- created_at

[send_task_log]
- id (PK)
- task_id (FK) → send_task
- email_address_id (FK) → email_address
- status: WAITING | SENT | FAILED | OPENED | CLICKED
- sent_at
- opened_at
- clicked_at
- bounce_reason (nullable)

[unsubscribe]
- id (PK)
- email
- reason (nullable)
- created_at

---

## 🔁 큐 처리 흐름도 (BullMQ)

사용자 예약 발송 요청
        ↓
send_task 생성 (status = PENDING)
        ↓
BullMQ Queue에 delay 작업 등록
        ↓
시간 도달 시 Job 실행 → 메일 발송
        ↓
send_task_log 저장 + 상태 갱신

### 작업 중지/재개 흐름

중지: 
- BullMQ job 삭제
- send_task.status = PAUSED

재개:
- BullMQ job 재등록 (delay 포함)
- send_task.status = PENDING

---

## 🛠️ API 목록

### 📩 이메일 템플릿

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET    | /email-templates           | 템플릿 목록 조회 |
| POST   | /email-templates           | 템플릿 생성 |
| GET    | /email-templates/:id       | 단일 템플릿 조회 |
| PUT    | /email-templates/:id       | 템플릿 수정 |
| DELETE | /email-templates/:id       | 템플릿 삭제 |

---

### 👥 주소록 및 그룹

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET    | /email-addresses                   | 주소록 목록 조회 |
| POST   | /email-addresses                   | 주소 추가 |
| GET    | /email-address-groups              | 그룹 목록 조회 |
| POST   | /email-address-groups              | 그룹 생성 |
| POST   | /email-address-groups/:id/addresses| 그룹에 주소록 추가 |

---

### 📆 예약 발송 작업

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET    | /send-tasks             | 발송 작업 목록 조회 |
| POST   | /send-tasks             | 발송 작업 생성 |
| GET    | /send-tasks/:id         | 단일 작업 상세 조회 |
| PATCH  | /send-tasks/:id/pause   | 발송 작업 중지 |
| PATCH  | /send-tasks/:id/resume  | 발송 작업 재개 |
| DELETE | /send-tasks/:id         | 발송 작업 삭제 |

---

### 📄 발송 이력 및 통계

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | /send-tasks/:id/logs        | 수신자별 발송 로그 |
| GET | /send-tasks/:id/statistics  | 오픈/클릭 통계 |

---

### 🚫 수신 거부

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | /unsubscribe                  | 수신 거부 등록 |
| GET  | /unsubscribe/check?email=xxx  | 수신 거부 여부 조회 |

---

## 🧠 MJML + 메일 머지 처리 방식

MJML은 템플릿 문법만 지원하며, **변수 바인딩은 백엔드에서 별도 처리**해야 함.

### 예시

```ts
import mjml2html from 'mjml';
import Handlebars from 'handlebars';

const rawMjml = `<mjml><mj-body><mj-text>Hello {{name}}!</mj-text></mj-body></mjml>`;
const compiled = Handlebars.compile(rawMjml);
const mergedMjml = compiled({ name: '이상문' });

const { html } = mjml2html(mergedMjml);
```

이후 `html`을 AWS SES로 전송.

---

## ✅ 향후 추가 고려 사항

- 수신자별 첨부파일
- A/B 테스트 기능
- 발송 실패 자동 재시도 로직
- 관리자 권한/로그인

---