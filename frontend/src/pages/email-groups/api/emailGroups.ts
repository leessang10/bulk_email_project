import axios from "axios";
import type {
  CreateEmailGroupData,
  EmailGroup,
  EmailGroupsParams,
  EmailGroupsResponse,
  UpdateEmailGroupData,
} from "./types";

const API_BASE_URL = "http://localhost:11001/email-address-groups";

const DEFAULT_PARAMS: Partial<EmailGroupsParams> = {
  page: 1,
  pageSize: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
};

export const emailGroupsApi = {
  getList: async (
    params: Partial<EmailGroupsParams>
  ): Promise<EmailGroupsResponse> => {
    const { data } = await axios.get<EmailGroupsResponse>(API_BASE_URL, {
      params: {
        ...DEFAULT_PARAMS,
        ...params,
        // 빈 문자열이나 undefined인 경우 기본값 사용
        sortBy: params.sortBy || DEFAULT_PARAMS.sortBy,
        sortOrder: params.sortOrder || DEFAULT_PARAMS.sortOrder,
      },
    });
    return data;
  },

  getOne: async (id: number): Promise<EmailGroup> => {
    const { data } = await axios.get<EmailGroup>(`${API_BASE_URL}/${id}`);
    return data;
  },

  create: async (createData: CreateEmailGroupData): Promise<EmailGroup> => {
    const formData = new FormData();
    formData.append("name", createData.name);
    if (createData.file) {
      formData.append("file", createData.file);
    }

    const { data } = await axios.post<EmailGroup>(API_BASE_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  update: async (
    id: number,
    updateData: UpdateEmailGroupData
  ): Promise<EmailGroup> => {
    const { data } = await axios.put<EmailGroup>(
      `${API_BASE_URL}/${id}`,
      updateData
    );
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`);
  },

  addEmails: async (id: number, file: File): Promise<EmailGroup> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axios.post<EmailGroup>(
      `${API_BASE_URL}/${id}/emails`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },
};
