import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { emailGroupsApi } from "../api/emailGroups";
import type {
  CreateEmailGroupData,
  EmailGroup,
  EmailGroupsParams,
  UpdateEmailGroupData,
} from "../api/types";

export const useEmailGroups = (initialParams?: Partial<EmailGroupsParams>) => {
  const queryClient = useQueryClient();

  // 목록 조회
  const { data: listData, ...listQuery } = useQuery({
    queryKey: ["email-groups", initialParams],
    queryFn: () => emailGroupsApi.getList(initialParams || {}),
  });

  // 생성
  const createMutation = useMutation({
    mutationFn: (data: CreateEmailGroupData) => emailGroupsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-groups"] });
    },
  });

  // 수정
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEmailGroupData }) =>
      emailGroupsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["email-groups"] });
      queryClient.invalidateQueries({
        queryKey: ["email-groups", variables.id],
      });
    },
  });

  // 삭제
  const deleteMutation = useMutation({
    mutationFn: emailGroupsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-groups"] });
    },
  });

  // 이메일 추가
  const addEmailsMutation = useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      emailGroupsApi.addEmails(id, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["email-groups"] });
      queryClient.invalidateQueries({
        queryKey: ["email-groups", variables.id],
      });
    },
  });

  const handleDataRequest = async (params: Partial<EmailGroupsParams>) => {
    return emailGroupsApi.getList(params);
  };

  const handleSubmit = async (data: CreateEmailGroupData) => {
    await createMutation.mutateAsync(data);
  };

  const handleAddEmails = async (id: number, file: File) => {
    await addEmailsMutation.mutateAsync({ id, file });
  };

  const handleDelete = async (group: EmailGroup) => {
    if (window.confirm(`'${group.name}' 이메일 그룹을 삭제하시겠습니까?`)) {
      await deleteMutation.mutateAsync(group.id);
    }
  };

  return {
    data: listData?.items || [],
    totalItems: listData?.total || 0,
    isLoading: listQuery.isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
    getEmailGroup: emailGroupsApi.getOne,
    handleDataRequest,
    handleSubmit,
    handleAddEmails,
    handleDelete,
  };
};
