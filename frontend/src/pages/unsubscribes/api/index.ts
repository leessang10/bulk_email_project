import instance from "../../../common/lib/axios";
import type { UnsubscribeListParams, UnsubscribeListResponse } from "../types";

const validateParams = (params: UnsubscribeListParams) => {
  const validatedParams: UnsubscribeListParams = {
    page: Math.max(1, params.page || 1),
    pageSize: Math.max(1, Math.min(100, params.pageSize || 10)),
    sortBy: params.sortBy || "createdAt",
    sortOrder: params.sortOrder || "DESC",
  };

  if (params.email?.trim()) {
    validatedParams.email = params.email.trim();
  }

  return validatedParams;
};

export const getUnsubscribeList = async (params: UnsubscribeListParams) => {
  const validatedParams = validateParams(params);
  const { data } = await instance.get<UnsubscribeListResponse>(
    "api/v1/unsubscribes",
    {
      params: validatedParams,
    }
  );
  return data;
};
