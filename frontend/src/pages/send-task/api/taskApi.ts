import axios from "axios";

export interface CreateTaskRequest {
  templateId: number;
  groupIds: number[];
  scheduledAt: Date;
}

export interface Task {
  id: number;
  name: string;
  status: "pending" | "in_progress" | "completed" | "failed" | "paused";
  targetGroup: string;
  totalEmails: number;
  sentEmails: number;
  scheduledAt: string;
  createdAt: string;
}

export interface Template {
  id: number;
  name: string;
  subject: string;
  content: string;
  createdAt: string;
}

export interface Group {
  id: number;
  name: string;
  emailCount: number;
  createdAt: string;
}

export const taskApi = {
  // 작업 생성
  createTasks: async (data: CreateTaskRequest): Promise<Task[]> => {
    const response = await axios.post("/api/tasks", data);
    return response.data;
  },

  // 작업 삭제
  deleteTask: async (taskId: number): Promise<void> => {
    await axios.delete(`/api/tasks/${taskId}`);
  },

  // 작업 일시중지
  pauseTask: async (taskId: number): Promise<void> => {
    await axios.post(`/api/tasks/${taskId}/pause`);
  },

  // 작업 재개
  resumeTask: async (taskId: number): Promise<void> => {
    await axios.post(`/api/tasks/${taskId}/resume`);
  },

  // 작업 목록 조회
  getTasks: async (params: {
    page: number;
    perPage: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
  }): Promise<{ data: Task[]; total: number }> => {
    const response = await axios.get("/api/tasks", { params });
    return response.data;
  },

  // 템플릿 목록 조회
  getTemplates: async (): Promise<Template[]> => {
    const response = await axios.get("/api/templates");
    return response.data;
  },

  // 그룹 목록 조회
  getGroups: async (): Promise<Group[]> => {
    const response = await axios.get("/api/groups");
    return response.data;
  },
};
