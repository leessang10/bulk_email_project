# Frontend README

> 대량 마케팅 메일 발송 시스템 – 프론트엔드 프로젝트

## 🧱 기술 스택

| 분류                 | 선택 기술                 | 비고                                                         |
| -------------------- | ------------------------- | ------------------------------------------------------------ |
| 프레임워크           | Next.js 14 (Pages Router) | App Router는 `easy-email-editor` 호환성 이슈로 사용하지 않음 |
| UI 라이브러리        | Ant Design                | `easy-email-editor` 포함 전체 UI 통일                        |
| 이메일 템플릿 에디터 | easy-email-editor         | MJML 기반 이메일 드래그&드롭 빌더                            |
| 스타일               | CSS Modules               | 컴포넌트 스코프 스타일링                                     |
| API 통신             | Axios + React Query       | 서버 상태 동기화 및 캐싱 관리                                |
| 전역 상태            | Zustand                   | 간결하고 유연한 상태 관리                                    |
| 인증                 | NextAuth.js               | 관리자 인증 처리 (Prisma Adapter)                            |
| 번들러               | Webpack (Next.js 기본)    | 기본 설정 사용                                               |

---

## 📁 프로젝트 구조

```
src/
├── features/                    # 피처 기반 구조
│   ├── email-templates/         # 이메일 템플릿 관리
│   │   ├── components/         # 템플릿 관련 컴포넌트
│   │   ├── hooks/             # 템플릿 관련 훅
│   │   ├── services/          # 템플릿 API 서비스
│   │   └── types/             # 템플릿 관련 타입
│   │
│   ├── email-addresses/        # 주소록 관리
│   │   ├── components/        # 주소록 관련 컴포넌트
│   │   ├── hooks/            # 주소록 관련 훅
│   │   ├── services/         # 주소록 API 서비스
│   │   └── types/            # 주소록 관련 타입
│   │
│   ├── email-address-groups/   # 주소록 그룹 관리
│   │   ├── components/       # 그룹 관련 컴포넌트
│   │   ├── hooks/           # 그룹 관련 훅
│   │   ├── services/        # 그룹 API 서비스
│   │   └── types/           # 그룹 관련 타입
│   │
│   ├── send-tasks/            # 발송 작업 관리
│   │   ├── components/       # 발송 작업 관련 컴포넌트
│   │   ├── hooks/           # 발송 작업 관련 훅
│   │   ├── services/        # 발송 작업 API 서비스
│   │   └── types/           # 발송 작업 관련 타입
│   │
│   └── unsubscribes/          # 수신 거부 관리
│       ├── components/      # 수신 거부 관련 컴포넌트
│       ├── hooks/          # 수신 거부 관련 훅
│       ├── services/       # 수신 거부 API 서비스
│       └── types/          # 수신 거부 관련 타입
│
├── pages/                     # Next.js 페이지
│   ├── email-templates/      # 템플릿 관리 페이지
│   ├── email-addresses/      # 주소록 관리 페이지
│   ├── email-address-groups/ # 그룹 관리 페이지
│   ├── send-tasks/          # 발송 작업 관리 페이지
│   └── unsubscribes/         # 수신 거부 관리 페이지
│
├── shared/                    # 공통 모듈
│   ├── components/           # 공통 컴포넌트
│   ├── hooks/               # 공통 훅
│   ├── services/            # 공통 서비스
│   ├── types/               # 공통 타입
│   └── utils/               # 유틸리티 함수
│
└── styles/                    # 전역 스타일
    └── globals.css          # 전역 스타일
```

---

## ⚠️ 주의 사항

### ✅ React 버전

- `React 18`로 고정 필요
- `easy-email-editor`는 현재 `React 19`와 호환되지 않음
- `peerDependencies`: `"react": "^17.0.0 || ^18.0.0"`

### ✅ 스타일

- Ant Design의 기본 스타일 사용
- CSS Modules를 통한 컴포넌트 스코프 스타일링
- Tailwind 등 추가적인 스타일 프레임워크는 사용하지 않음 (복잡도 증가 방지)

### ✅ App Router 사용 금지

- `easy-email-editor`는 SSR 환경 및 Server Components와 충돌 발생 가능
- `Pages Router` (Next.js 13 이하 방식)만 사용

---

## 🛠 주요 설정

### 스타일 import (\_app.tsx)

```tsx
import 'antd/dist/reset.css';
import '@/styles/globals.css';
```

---

## 🔧 설치 및 실행

```bash
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 빌드 후 실행
pnpm start
```

---

## ✨ 향후 개선 고려 사항

- React 19 대응 여부 확인 후 업그레이드 검토
- `easy-email-editor` 이슈 추적: https://github.com/zalify/easy-email-editor/issues
- 필요시 `editor` 영역만 iframe 또는 별도 SPA로 분리 고려 가능
