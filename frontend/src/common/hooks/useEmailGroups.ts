import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { emailGroupsApi } from "../services/emailGroupsApi.ts";
import type { CreateEmailGroupDto, PaginationParams } from "../services/apiTypes.ts";

export const useEmailGroups = (params: PaginationParams) => {
  const queryClient = useQueryClient();
  const queryKey = ["email-groups", params];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => emailGroupsApi.getList(params),
  });

  const createMutation = useMutation({
    mutationFn: (newGroup: CreateEmailGroupDto) =>
      emailGroupsApi.create(newGroup),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-groups"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateEmailGroupDto>;
    }) => emailGroupsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-groups"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: emailGroupsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-groups"] });
    },
  });

  const addEmailsMutation = useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      emailGroupsApi.addEmails(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-groups"] });
    },
  });

  return {
    groups: data?.data ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    createGroup: createMutation.mutate,
    updateGroup: updateMutation.mutate,
    deleteGroup: deleteMutation.mutate,
    addEmails: addEmailsMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isAddingEmails: addEmailsMutation.isPending,
  };
};
