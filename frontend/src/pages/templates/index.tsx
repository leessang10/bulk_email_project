import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TableV2 from "../../common/components/TableV2";
import type {
  ColumnDef,
  TableParams,
} from "../../common/components/TableV2/types";

interface TemplateItem {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  thumbnail?: string;
}

// 임시 데이터
const MOCK_TEMPLATES: TemplateItem[] = [
  {
    id: "1",
    name: "기본 뉴스레터",
    description: "기본적인 뉴스레터 템플릿입니다.",
    updatedAt: "2024-03-15",
    thumbnail: "https://via.placeholder.com/300x200",
  },
  {
    id: "2",
    name: "프로모션 안내",
    description: "상품 프로모션 안내용 템플릿입니다.",
    updatedAt: "2024-03-14",
    thumbnail: "https://via.placeholder.com/300x200",
  },
];

const columns: ColumnDef<TemplateItem>[] = [
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
    key: "updatedAt",
    label: "마지막 수정일",
    sortable: true,
  },
];

const sortOptions = [
  { value: "name", label: "템플릿명" },
  { value: "updatedAt", label: "마지막 수정일" },
];

const TemplatesPage = () => {
  const navigate = useNavigate();

  const handleDataRequest = (params: TableParams) => {
    // TODO: API 연동 시 실제 데이터 요청 구현
    console.log("Data request params:", params);
  };

  return (
    <Container>
      <TableV2
        tableId="templates"
        columns={columns}
        data={MOCK_TEMPLATES}
        totalItems={MOCK_TEMPLATES.length}
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
      />
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
`;

export default TemplatesPage;
