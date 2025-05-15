import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { emailGroupsApi } from "../api/emailGroups";
import type { EmailGroup } from "../api/types";

export const useEmailGroups = () => {
  const [data, setData] = useState<EmailGroup[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: emailGroupsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailGroups"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
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

  const addEmailsMutation = useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      emailGroupsApi.addEmails(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailGroups"] });
    },
  });

  const handleDataRequest = async ({
    page,
    perPage,
    sortKey,
    sortDirection,
    searchQuery,
  }: {
    page: number;
    perPage: number;
    sortKey: string;
    sortDirection: "asc" | "desc";
    searchQuery: string;
  }) => {
    try {
      const response = await emailGroupsApi.getList({
        page,
        pageSize: perPage,
        sortBy: sortKey || undefined,
        sortOrder: sortDirection,
        search: searchQuery || undefined,
      });

      setData(response.items);
      setTotalItems(response.total);
    } catch (error) {
      console.error("Failed to fetch email groups:", error);
    }
  };

  const handleSubmit = async (data: { name: string; file?: File }) => {
    try {
      await createMutation.mutateAsync(data);
    } catch (error) {
      console.error("Failed to create email group:", error);
    }
  };

  const handleAddEmails = async (id: number, file: File) => {
    try {
      await addEmailsMutation.mutateAsync({ id, file });
    } catch (error) {
      console.error("Failed to add emails:", error);
    }
  };

  const handleDelete = async (group: EmailGroup) => {
    try {
      await deleteMutation.mutateAsync(group.id);
    } catch (error) {
      console.error("Failed to delete email group:", error);
    }
  };

  return {
    data,
    totalItems,
    createMutation,
    updateMutation,
    deleteMutation,
    addEmailsMutation,
    handleDataRequest,
    handleSubmit,
    handleAddEmails,
    handleDelete,
  };
};
