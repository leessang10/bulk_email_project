import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { emailGroupsApi } from "../api/emailGroupsApi";
import type {
  EmailGroupListParams,
  UpdateEmailGroupDto,
} from "../types/emailGroupsTypes";

export const useEmailGroups = (params: EmailGroupListParams) => {
  const queryClient = useQueryClient();
  const queryKey = ["emailGroups", params];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => emailGroupsApi.getList(params),
  });

  const createMutation = useMutation({
    mutationFn: emailGroupsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailGroups"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEmailGroupDto }) =>
      emailGroupsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailGroups"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: emailGroupsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailGroups"] });
    },
  });

  return {
    emailGroups: data?.items ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    createEmailGroup: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateEmailGroup: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteEmailGroup: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
