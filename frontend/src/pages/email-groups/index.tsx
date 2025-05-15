import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import React, { useState } from "react";
import styled from "styled-components";
import PageLayout from "../../common/components/PageLayout";
import TableV2 from "../../common/components/TableV2";
import { createTableAtom } from "../../common/components/TableV2/atoms";
import { emailGroupsApi } from "./api/emailGroups";
import type { EmailGroup, EmailGroupStatus } from "./api/types";
import EmailGroupForm from "./components/EmailGroupForm";

const StatusBadge = styled.span<{ status: EmailGroupStatus }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;

  ${({ status }) => {
    switch (status) {
      case "PENDING":
        return `
          background-color: #f1f5f9;
          color: #475569;
        `;
      case "WAITING":
        return `
          background-color: #fef9c3;
          color: #854d0e;
        `;
      case "PROCESSING":
        return `
          background-color: #e0f2fe;
          color: #0369a1;
        `;
      case "COMPLETED":
        return `
          background-color: #dcfce7;
          color: #15803d;
        `;
      case "FAILED":
        return `
          background-color: #fee2e2;
          color: #b91c1c;
        `;
    }
  }}
`;

const COLUMNS = [
  { key: "name", label: "그룹명" },
  { key: "addressCount", label: "이메일 수" },
  {
    key: "status",
    label: "상태",
    render: (value: EmailGroupStatus) => {
      const statusMap = {
        PENDING: "대기",
        WAITING: "처리 대기",
        PROCESSING: "처리 중",
        COMPLETED: "완료",
        FAILED: "실패",
      };
      return <StatusBadge status={value}>{statusMap[value]}</StatusBadge>;
    },
  },
  { key: "createdAt", label: "생성일" },
  { key: "updatedAt", label: "수정일" },
];

const SORT_OPTIONS = [
  { value: "name", label: "그룹명" },
  { value: "addressCount", label: "이메일 수" },
  { value: "createdAt", label: "생성일" },
];

const EmailGroupsPage = () => {
  const [data, setData] = useState<EmailGroup[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const atoms = React.useMemo(() => createTableAtom("email-groups"), []);
  const [, setCreateDrawerOpen] = useAtom(atoms.createDrawerAtom);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: emailGroupsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailGroups"] });
      setCreateDrawerOpen(false);
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

  return (
    <PageLayout
      title="이메일 그룹 관리"
      description="이메일 그룹을 생성하고 관리할 수 있습니다."
    >
      <TableV2
        tableId="email-groups"
        columns={COLUMNS}
        data={data}
        totalItems={totalItems}
        sortOptions={SORT_OPTIONS}
        onDataRequest={handleDataRequest}
        actions={[
          {
            label: "새 그룹 만들기",
            onClick: () => setCreateDrawerOpen(true),
            variant: "primary",
          },
        ]}
        DetailDrawerContent={({ data, onClose }) => (
          <EmailGroupForm
            mode="view"
            initialData={data}
            onSubmit={(formData) =>
              updateMutation.mutate({ id: data.id, data: formData })
            }
            onDelete={() => handleDelete(data)}
            onAddEmails={(file) => handleAddEmails(data.id, file)}
          />
        )}
        CreateDrawerContent={({ onClose }) => (
          <EmailGroupForm
            mode="create"
            onSubmit={(data) => {
              handleSubmit(data);
              onClose?.();
            }}
          />
        )}
      />
    </PageLayout>
  );
};

export default EmailGroupsPage;
