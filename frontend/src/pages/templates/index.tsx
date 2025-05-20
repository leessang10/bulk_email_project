import { useMemo } from "react";
import PageLayout from "../../common/components/PageLayout";
import TableV2, { createTableAtom } from "../../common/components/TableV2";
import type { ColumnDef } from "../../common/components/TableV2/types";
import type { EmailTemplate } from "./api/types";
import { useEmailTemplates } from "./hooks/useEmailTemplates";

const columns: ColumnDef<EmailTemplate>[] = [
  {
    key: "name",
    label: "템플릿명",
    sortable: true,
  },
  {
    key: "category",
    label: "카테고리",
    sortable: true,
  },
  {
    key: "updatedAt",
    label: "마지막 수정일",
    sortable: true,
    render: (value) => {
      if (typeof value === "string") {
        return new Date(value).toLocaleDateString();
      }
      return "";
    },
  },
];

const sortOptions = [
  { value: "name", label: "템플릿명" },
  { value: "category", label: "카테고리" },
  { value: "updatedAt", label: "마지막 수정일" },
];

const TemplatesPage = () => {
  const atoms = useMemo(() => createTableAtom("templates"), []);

  const { data, totalItems, handleDataRequest } = useEmailTemplates(atoms);

  return (
    <PageLayout
      title="수신거부 이메일 관리"
      description="수신거부된 이메일 주소와 사유를 관리할 수 있습니다."
    >
      <TableV2<EmailTemplate>
        tableId="templates"
        columns={columns}
        data={data}
        totalItems={totalItems}
        sortOptions={sortOptions}
        onDataRequest={handleDataRequest}
      />
    </PageLayout>
  );
};

export default TemplatesPage;
