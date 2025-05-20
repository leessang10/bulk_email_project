# TemplateEditor 컴포넌트

이메일 템플릿을 편집할 수 있는 드래그 앤 드롭 기반의 에디터 컴포넌트입니다.

## 주요 기능

- 드래그 앤 드롭으로 컴포넌트 배치
- 텍스트, 버튼, 이미지 컴포넌트 지원
- 데스크톱/모바일 미리보기 모드
- 실시간 HTML/CSS 생성

## 파일 구조

```
TemplateEditor/
├── index.tsx        # 메인 컴포넌트
├── atoms.ts         # Jotai 기반 상태 관리
├── types.ts         # 타입 정의
├── mockData.ts      # 테스트용 더미 데이터
└── components/      # 하위 컴포넌트
    ├── EditorPanel  # 편집 패널
    └── Index # 미리보기 패널
```

## 컴포넌트 구조

### 1. 컴포넌트 블록 타입

- `TextBlock`: 텍스트 컴포넌트
- `ButtonBlock`: 버튼 컴포넌트
- `ImageBlock`: 이미지 컴포넌트

### 2. 레이아웃 구조

- `Layout`: 여러 개의 컬럼을 포함하는 레이아웃
- `ColumnBlock`: 각 컴포넌트가 배치되는 컬럼

## 상태 관리 (atoms.ts)

### 주요 상태

- `editorStateAtom`: 전체 에디터 상태 관리
- `viewModeAtom`: 데스크톱/모바일 뷰 모드
- `templateContentAtom`: 생성된 HTML/CSS 관리

### 선택 상태 관리

- `selectedLayoutIdAtom`
- `selectedColumnBlockIdAtom`
- `selectedComponentBlockIdAtom`

## 사용 기술

- React
- TypeScript
- Jotai (상태 관리)
- react-dnd (드래그 앤 드롭)
- styled-components (스타일링)
