export enum EmailGroupRegion {
  DOMESTIC = "DOMESTIC",
  OVERSEAS = "OVERSEAS",
}

export enum EmailGroupStatus {
  PENDING = "PENDING",
  WAITING = "WAITING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

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

export interface EmailGroupListParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  search?: string;
  region?: EmailGroupRegion;
  status?: EmailGroupStatus;
}

export interface EmailGroupListResponse {
  items: EmailGroup[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateEmailGroupDto {
  name: string;
  region: EmailGroupRegion;
  mailMergeData?: Record<string, any>;
  file?: File;
}

export interface UpdateEmailGroupDto {
  name: string;
  region: EmailGroupRegion;
  mailMergeData?: Record<string, any>;
  file?: File;
}
