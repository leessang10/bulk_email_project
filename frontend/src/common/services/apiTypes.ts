export type SortOrder = "ASC" | "DESC";

// 공통 페이지네이션 타입
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 이메일 그룹 타입
export interface EmailGroup {
  id: number;
  name: string;
  totalEmails: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmailGroupDto {
  name: string;
  file?: File;
  mailMergeData?: Record<string, any>;
}

// 이메일 템플릿 타입
export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmailTemplateDto {
  name: string;
  subject: string;
  content: string;
  category: string;
}

// 발송 작업 타입
export interface SendTask {
  id: number;
  templateId: number;
  groupIds: number[];
  status: "pending" | "in_progress" | "completed" | "failed" | "paused";
  totalCount: number;
  successCount: number;
  failureCount: number;
  scheduledAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSendTaskDto {
  templateId: number;
  groupIds: number[];
  scheduledAt: string;
}
