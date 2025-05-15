export type EmailGroupStatus =
  | "PENDING"
  | "WAITING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";
export type EmailGroupRegion = "DOMESTIC" | "OVERSEAS";

export interface EmailGroup {
  id: number;
  name: string;
  region: EmailGroupRegion;
  status: EmailGroupStatus;
  addressCount: number;
  mailMergeData?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface EmailGroupsResponse {
  items: EmailGroup[];
  total: number;
  page: number;
  pageSize: number;
}

export interface EmailGroupsParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface CreateEmailGroupData {
  name: string;
  region?: EmailGroupRegion;
  file?: File;
  mailMergeData?: Record<string, any>;
}

export interface UpdateEmailGroupData {
  name?: string;
  region?: EmailGroupRegion;
  mailMergeData?: Record<string, any>;
}
