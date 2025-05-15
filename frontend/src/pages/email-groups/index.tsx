import { useAtom } from "jotai";
import { useMemo } from "react";
import PageLayout from "../../common/components/PageLayout";
import TableV2 from "../../common/components/TableV2";
import { createTableAtom } from "../../common/components/TableV2/atoms";
import EmailGroupForm from "./components/EmailGroupForm";
import { COLUMNS, SORT_OPTIONS } from "./constants";
import { useEmailGroups } from "./hooks/useEmailGroups";

const EmailGroupsPage = () => {
  const atoms = useMemo(() => createTableAtom("email-groups"), []);
  const [, setCreateDrawerOpen] = useAtom(atoms.createDrawerAtom);
  const {
    data,
    totalItems,
    createMutation,
    updateMutation,
    deleteMutation,
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
