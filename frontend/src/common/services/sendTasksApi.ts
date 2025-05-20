import type {
  CreateSendTaskDto,
  PaginatedResponse,
  PaginationParams,
  SendTask,
} from "./apiTypes.ts";
import axios from "./axiosInstance.ts";

export const sendTasksApi = {
  getList: (params: PaginationParams) =>
    axios.get<PaginatedResponse<SendTask>>("/send-tasks", { params }),

  getById: (id: number) => axios.get<SendTask>(`/send-tasks/${id}`),

  create: (data: CreateSendTaskDto) =>
    axios.post<SendTask>("/send-tasks", data),

  delete: (id: number) => axios.delete(`/send-tasks/${id}`),

  pause: (id: number) => axios.post<SendTask>(`/send-tasks/${id}/pause`),

  resume: (id: number) => axios.post<SendTask>(`/send-tasks/${id}/resume`),
};
