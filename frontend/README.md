# Bulk Email Project (Frontend)

이 프로젝트는 대량 이메일 마케팅 시스템의 프론트엔드(Next.js 기반)입니다.

## 주요 기능

- 이메일 그룹 관리 (tb_email_address_group)
- 이메일 주소록 관리 (tb_email_address)
- 그룹별 상세/주소록 목록 Drawer
- 검색, 다중 선택, 일괄 삭제 등

## 테이블 컬럼 구조

### 📁 tb_email_address_group (이메일 그룹)

| 컬럼명          | 설명            |
| --------------- | --------------- |
| id              | PK              |
| name            | 그룹명          |
| region          | 지역            |
| status          | 상태            |
| address_count   | 주소 수         |
| created_at      | 생성일          |
| updated_at      | 수정일          |
| mail_merge_data | 머지 확장데이터 |

### 👤 tb_email_address (주소록)

| 컬럼명           | 설명            |
| ---------------- | --------------- |
| id               | PK              |
| address_type     | 타입            |
| email            | 이메일          |
| name             | 이름            |
| is_subscribed    | 구독여부        |
| memo             | 메모            |
| created_at       | 생성일          |
| updated_at       | 수정일          |
| address_group_id | 그룹ID(FK)      |
| mail_merge_data  | 머지 확장데이터 |

## 개발/실행

```bash
npm run dev
```

- http://localhost:3000 접속
- 주요 페이지: `src/app/emailGroups/page.tsx`

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
