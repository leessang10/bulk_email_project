import axiosInstance from "../../../common/services/axiosInstance.ts";
import type {
  Unsubscribe,
  UnsubscribeListParams,
  UnsubscribeListResponse,
} from "../types/unsubscribeTypes.ts";

export const unsubscribesApi = {
  getList: async (
    params: UnsubscribeListParams
  ): Promise<UnsubscribeListResponse> => {
    const response = await axiosInstance.get<UnsubscribeListResponse>(
      "/unsubscribes",
      {
        params,
      }
    );
    console.log("unsubscribesApi Response:", response);
    return response.data;
  },

  getById: (id: number) =>
    axiosInstance.get<Unsubscribe>(`/unsubscribes/${id}`),

  delete: (id: number) => axiosInstance.delete(`/unsubscribes/${id}`),
};
