import type { ColumnDef } from "../../common/components/TableV2/types";
import type { Unsubscribe } from "./types";

export const COLUMNS: ColumnDef<Unsubscribe>[] = [
  {
    key: "email",
    label: "이메일 주소",
  },
  {
    key: "reason",
    label: "수신거부 사유",
  },
  {
    key: "createdAt",
    label: "수신거부 일시",
    render: (value: string) => new Date(value).toLocaleString(),
  },
];

export const SORT_OPTIONS = [
  {
    value: "createdAt",
    label: "수신거부 일시",
  },
  {
    value: "email",
    label: "이메일 주소",
  },
];
