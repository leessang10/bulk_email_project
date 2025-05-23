import { format } from "date-fns";
import type { EmailGroupStatus } from "./api/types";
import { StatusBadge } from "./components/StatusBadge";

export const STATUS_MAP = {
  PENDING: "대기",
  WAITING: "처리 대기",
  PROCESSING: "처리 중",
  COMPLETED: "완료",
  FAILED: "실패",
} as const;

export const REGION_MAP = {
  ABROAD: "해외",
  DOMESTIC: "국내",
} as const;

export const COLUMNS = [
  {
    key: "region",
    label: "지역",
    render: (value: string) => REGION_MAP[value as keyof typeof REGION_MAP],
    width: "10rem",
  },
  { key: "name", label: "그룹명" },
  {
    key: "addressCount",
    label: "이메일 수",
    render: (value: number) => value.toLocaleString(),
    width: "10rem",
  },
  {
    key: "createdAt",
    label: "생성일",
    render: (value: string) => format(new Date(value), "yyyy-MM-dd HH:mm:ss"),
    width: "10rem",
  },
  {
    key: "updatedAt",
    label: "수정일",
    render: (value: string) => format(new Date(value), "yyyy-MM-dd HH:mm:ss"),
    width: "10rem",
  },
  {
    key: "status",
    label: "상태",
    render: (value: EmailGroupStatus) => (
      <StatusBadge status={value}>{STATUS_MAP[value]}</StatusBadge>
    ),
  },
];

export const SORT_OPTIONS = [
  { value: "name", label: "그룹명" },
  { value: "addressCount", label: "이메일 수" },
  { value: "createdAt", label: "생성일" },
];
