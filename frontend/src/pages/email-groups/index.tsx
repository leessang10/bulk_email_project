import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useMemo } from "react";
import PageLayout from "../../common/components/PageLayout";
import TableV2 from "../../common/components/TableV2";
import { createTableAtom } from "../../common/components/TableV2/atoms";
import type { ColumnDef } from "../../common/components/TableV2/types";
import type { EmailGroup } from "./api/types";
import EmailGroupForm from "./components/EmailGroupForm";
import { COLUMNS, SORT_OPTIONS } from "./constants";
import { useEmailGroups } from "./hooks/useEmailGroups";

const EmailGroupsPage = () => {
  const atoms = useMemo(() => createTableAtom("email-groups"), []);
  const [, setCreateDrawerOpen] = useAtom(atoms.createDrawerAtom);

  const {
    data,
    totalItems,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
    getEmailGroup,
    handleDataRequest,
    handleSubmit,
    handleAddEmails,
    handleDelete,
  } = useEmailGroups();

  return (
    <PageLayout
      title="이메일 그룹 관리"
      description="이메일 그룹을 생성하고 관리할 수 있습니다."
    >
      <TableV2
        tableId="email-groups"
        columns={COLUMNS as ColumnDef<EmailGroup>[]}
        data={data}
        totalItems={totalItems}
        sortOptions={SORT_OPTIONS}
        onDataRequest={handleDataRequest}
        isLoading={isLoading}
        actions={[
          {
            label: "새 그룹 만들기",
            onClick: () => setCreateDrawerOpen(true),
            variant: "primary",
          },
        ]}
        DetailDrawerContent={({ data: rowData, onClose }) => {
          const { data: detailData, isLoading: isDetailLoading } = useQuery({
            queryKey: ["email-groups", rowData.id],
            queryFn: () => getEmailGroup(rowData.id),
            enabled: !!rowData.id,
          });

          if (isDetailLoading) return <div>로딩 중...</div>;
          if (!detailData) return null;

          return (
            <EmailGroupForm
              mode="view"
              initialData={detailData}
              onSubmit={(formData) =>
                updateMutation.mutate(
                  {
                    id: detailData.id,
                    data: {
                      name: formData.name,
                      mailMergeData: formData.mailMergeData,
                    },
                  },
                  {
                    onSuccess: () => {
                      onClose?.();
                    },
                  }
                )
              }
              onDelete={() => {
                handleDelete(detailData);
                onClose?.();
              }}
              onAddEmails={(file) => handleAddEmails(detailData.id, file)}
            />
          );
        }}
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
