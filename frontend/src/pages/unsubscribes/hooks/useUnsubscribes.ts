import { useQuery } from "@tanstack/react-query";
import { unsubscribesApi } from "../api/unsubscribesApi.ts";
import type { UnsubscribeListParams } from "../types/unsubscribeTypes.ts";

export const useUnsubscribes = (params: UnsubscribeListParams) => {
  const queryKey = ["unsubscribes", params];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => unsubscribesApi.getList(params),
  });

  console.log("useUnsubscribes", data);

  return {
    unsubscribes: data?.items ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
  };
};
