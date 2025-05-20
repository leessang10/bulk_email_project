import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sendTasksApi } from "../services/sendTasksApi.ts";
import type { CreateSendTaskDto, PaginationParams } from "../services/apiTypes.ts";

export const useSendTasks = (params: PaginationParams) => {
  const queryClient = useQueryClient();
  const queryKey = ["send-tasks", params];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => sendTasksApi.getList(params),
  });

  const createMutation = useMutation({
    mutationFn: (newTask: CreateSendTaskDto) => sendTasksApi.create(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["send-tasks"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: sendTasksApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["send-tasks"] });
    },
  });

  const pauseMutation = useMutation({
    mutationFn: sendTasksApi.pause,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["send-tasks"] });
    },
  });

  const resumeMutation = useMutation({
    mutationFn: sendTasksApi.resume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["send-tasks"] });
    },
  });

  return {
    tasks: data?.data ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    createTask: createMutation.mutate,
    deleteTask: deleteMutation.mutate,
    pauseTask: pauseMutation.mutate,
    resumeTask: resumeMutation.mutate,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isPausing: pauseMutation.isPending,
    isResuming: resumeMutation.isPending,
  };
};
