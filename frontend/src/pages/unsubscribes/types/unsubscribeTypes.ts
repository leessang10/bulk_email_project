import type { SortOrder } from "../../../common/services/apiTypes";

export interface Unsubscribe {
  id: number;
  email: string;
  reason: string | null;
  createdAt: string;
}

export interface UnsubscribeListResponse {
  items: Unsubscribe[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UnsubscribeListParams {
  email?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "email" | "createdAt";
  sortOrder?: SortOrder;
}
