export interface EmailTemplate {
  id: number;
  name: string;
  description?: string;
  category?: string;
  subject: string;
  content: string;
  mailMergeFields?: string[];
  testData?: Record<string, any>;
  isActive: boolean;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplatesResponse {
  items: EmailTemplate[];
  total: number;
  page: number;
  pageSize: number;
}

export interface EmailTemplatesParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  category?: string;
  isActive?: boolean;
}

export interface CreateEmailTemplateData {
  name: string;
  description?: string;
  category?: string;
  subject: string;
  content: string;
  mailMergeFields?: string[];
  testData?: Record<string, any>;
  isActive?: boolean;
}

export interface UpdateEmailTemplateData {
  name?: string;
  description?: string;
  category?: string;
  subject?: string;
  content?: string;
  mailMergeFields?: string[];
  testData?: Record<string, any>;
  isActive?: boolean;
}
