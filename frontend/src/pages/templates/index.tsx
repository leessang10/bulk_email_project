import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TableV2 from "../../common/components/TableV2";
import type {
  ColumnDef,
  TableParams,
} from "../../common/components/TableV2/types";
import { emailTemplatesApi } from "./api/templates";
import type { EmailTemplate } from "./api/types";

const columns: ColumnDef<EmailTemplate>[] = [
  {
    key: "name",
    label: "템플릿명",
    sortable: true,
  },
  {
    key: "description",
    label: "설명",
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
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [total, setTotal] = useState(0);

  const handleDataRequest = useCallback(async (params: TableParams) => {
    try {
      setIsLoading(true);
      const response = await emailTemplatesApi.getList(params);
      setTemplates(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
      // TODO: 에러 처리
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <Container>
      <TableV2
        tableId="templates"
        columns={columns}
        data={templates}
        totalItems={total}
        sortOptions={sortOptions}
        onDataRequest={handleDataRequest}
        onRowClick={(row) => navigate(`/templates/${row.id}`)}
        actions={[
          {
            label: "새 템플릿",
            onClick: () => navigate("/templates/new"),
            variant: "primary",
          },
        ]}
        isLoading={isLoading}
      />
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
`;

export default TemplatesPage;
