import axiosInstance from "../../../common/services/axiosInstance";
import type {
  CreateEmailGroupDto,
  EmailGroup,
  EmailGroupListParams,
  EmailGroupListResponse,
  UpdateEmailGroupDto,
} from "../types/emailGroupsTypes";

const BASE_URL = "/email-address-groups";

export const emailGroupsApi = {
  // 이메일 그룹 목록 조회
  getList: async (
    params: EmailGroupListParams
  ): Promise<EmailGroupListResponse> => {
    const response = await axiosInstance.get<EmailGroupListResponse>(BASE_URL, {
      params,
    });
    return response.data;
  },

  // 이메일 그룹 상세 조회
  getById: async (id: number): Promise<EmailGroup> => {
    const response = await axiosInstance.get<EmailGroup>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // 이메일 그룹 생성
  create: async (data: CreateEmailGroupDto): Promise<EmailGroup> => {
    let formData: FormData | CreateEmailGroupDto = data;

    if (data.file) {
      formData = new FormData();
      formData.append("name", data.name);
      formData.append("region", data.region);
      formData.append("file", data.file);
      if (data.mailMergeData) {
        formData.append("mailMergeData", JSON.stringify(data.mailMergeData));
      }
    }

    const response = await axiosInstance.post<EmailGroup>(BASE_URL, formData, {
      headers: data.file
        ? {
            "Content-Type": "multipart/form-data",
          }
        : undefined,
    });
    return response.data;
  },

  // 이메일 그룹 수정
  update: async (
    id: number,
    data: UpdateEmailGroupDto
  ): Promise<EmailGroup> => {
    let formData: FormData | UpdateEmailGroupDto = data;

    if (data.file) {
      formData = new FormData();
      formData.append("name", data.name);
      formData.append("region", data.region);
      formData.append("file", data.file);
      if (data.mailMergeData) {
        formData.append("mailMergeData", JSON.stringify(data.mailMergeData));
      }
    }

    const response = await axiosInstance.patch<EmailGroup>(
      `${BASE_URL}/${id}`,
      formData,
      {
        headers: data.file
          ? {
              "Content-Type": "multipart/form-data",
            }
          : undefined,
      }
    );
    return response.data;
  },

  // 이메일 그룹 삭제
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/${id}`);
  },
};
