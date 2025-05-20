import type {
  CreateEmailTemplateDto,
  EmailTemplate,
  PaginatedResponse,
  PaginationParams,
} from "./apiTypes.ts";
import axiosInstance from "./axiosInstance.ts";

export const emailTemplatesApi = {
  getList: (params: PaginationParams) =>
    axiosInstance.get<PaginatedResponse<EmailTemplate>>("/email-templates", { params }),

  getById: (id: number) => axiosInstance.get<EmailTemplate>(`/email-templates/${id}`),

  create: (data: CreateEmailTemplateDto) =>
    axiosInstance.post<EmailTemplate>("/email-templates", data),

  update: (id: number, data: Partial<CreateEmailTemplateDto>) =>
    axiosInstance.patch<EmailTemplate>(`/email-templates/${id}`, data),

  delete: (id: number) => axiosInstance.delete(`/email-templates/${id}`),
};
