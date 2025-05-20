import axios from "axios";
import type {
  CreateEmailTemplateData,
  EmailTemplate,
  EmailTemplatesParams,
  EmailTemplatesResponse,
  UpdateEmailTemplateData,
} from "./types";

const API_BASE_URL = "http://localhost:11001/api/v1/email-templates";

const DEFAULT_PARAMS: Partial<EmailTemplatesParams> = {
  page: 1,
  pageSize: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
  isActive: true,
};

export const emailTemplatesApi = {
  getList: async (
    params: Partial<EmailTemplatesParams>
  ): Promise<EmailTemplatesResponse> => {
    const { data } = await axios.get<EmailTemplatesResponse>(API_BASE_URL, {
      params: {
        ...DEFAULT_PARAMS,
        ...params,
        // 빈 문자열이나 undefined인 경우 기본값 사용
        sortBy: params.sortBy || DEFAULT_PARAMS.sortBy,
        sortOrder: params.sortOrder || DEFAULT_PARAMS.sortOrder,
        isActive:
          typeof params.isActive === "boolean"
            ? params.isActive
            : DEFAULT_PARAMS.isActive,
      },
    });
    return data;
  },

  getOne: async (id: number): Promise<EmailTemplate> => {
    const { data } = await axios.get<EmailTemplate>(`${API_BASE_URL}/${id}`);
    return data;
  },

  create: async (
    createData: CreateEmailTemplateData
  ): Promise<EmailTemplate> => {
    const { data } = await axios.post<EmailTemplate>(API_BASE_URL, createData);
    return data;
  },

  update: async (
    id: number,
    updateData: UpdateEmailTemplateData
  ): Promise<EmailTemplate> => {
    const { data } = await axios.patch<EmailTemplate>(
      `${API_BASE_URL}/${id}`,
      updateData
    );
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`);
  },

  permanentDelete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}/permanent`);
  },
};
