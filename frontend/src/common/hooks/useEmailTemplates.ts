import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { emailTemplatesApi } from "../services/emailTemplatesApi.ts";
import type { CreateEmailTemplateDto, PaginationParams } from "../services/apiTypes.ts";

export const useEmailTemplates = (params: PaginationParams) => {
  const queryClient = useQueryClient();
  const queryKey = ["email-templates", params];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => emailTemplatesApi.getList(params),
  });

  const createMutation = useMutation({
    mutationFn: (newTemplate: CreateEmailTemplateDto) =>
      emailTemplatesApi.create(newTemplate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateEmailTemplateDto>;
    }) => emailTemplatesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: emailTemplatesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
    },
  });

  return {
    templates: data?.data ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    createTemplate: createMutation.mutate,
    updateTemplate: updateMutation.mutate,
    deleteTemplate: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
