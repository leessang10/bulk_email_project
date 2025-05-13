import { useState } from "react";
import styled from "styled-components";
import PageLayout from "../../common/components/PageLayout";
import Pagination from "../../common/components/Pagination";
import SearchFilter from "../../common/components/SearchFilter";
import Table from "../../common/components/Table";

interface EmailGroup {
  id: number;
  name: string;
  totalEmails: number;
  createdAt: string;
  updatedAt: string;
}

// 임시 데이터
const MOCK_DATA: EmailGroup[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `이메일 그룹 ${i + 1}`,
  totalEmails: Math.floor(Math.random() * 1000),
  createdAt: new Date(
    Date.now() - Math.random() * 10000000000
  ).toLocaleDateString(),
  updatedAt: new Date(
    Date.now() - Math.random() * 1000000000
  ).toLocaleDateString(),
}));

const COLUMNS = [
  { key: "name", label: "그룹명" },
  { key: "totalEmails", label: "이메일 수" },
  { key: "createdAt", label: "생성일" },
  { key: "updatedAt", label: "수정일" },
];

const SORT_OPTIONS = [
  { value: "name_asc", label: "그룹명 오름차순" },
  { value: "name_desc", label: "그룹명 내림차순" },
  { value: "totalEmails_asc", label: "이메일 수 오름차순" },
  { value: "totalEmails_desc", label: "이메일 수 내림차순" },
  { value: "createdAt_desc", label: "최근 생성순" },
  { value: "createdAt_asc", label: "오래된 생성순" },
];

type SortField = keyof EmailGroup;

const EmailGroupsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("createdAt_desc");

  // 실제로는 API 호출로 대체될 로직들
  const filteredData = MOCK_DATA.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const [field, direction] = sortOption.split("_");
    const sortField = field as SortField;
    if (direction === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    }
    return a[sortField] < b[sortField] ? 1 : -1;
  });

  const paginatedData = sortedData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const totalPages = Math.ceil(filteredData.length / perPage);

  return (
    <PageLayout
      title="이메일 그룹 관리"
      description="이메일 그룹을 생성하고 관리할 수 있습니다."
    >
      <ActionButtons>
        <Button>새 그룹 만들기</Button>
        <Button>엑셀 일괄 등록</Button>
      </ActionButtons>

      <SearchFilter
        searchPlaceholder="그룹명으로 검색"
        onSearchChange={setSearchTerm}
        onPerPageChange={setPerPage}
        onSortChange={setSortOption}
        sortOptions={SORT_OPTIONS}
      />

      <Table
        columns={COLUMNS}
        data={paginatedData}
        sortKey={sortOption.split("_")[0]}
        sortDirection={sortOption.split("_")[1] as "asc" | "desc"}
        onSort={(key) => {
          const currentDirection = sortOption.split("_")[1];
          const newDirection = currentDirection === "asc" ? "desc" : "asc";
          setSortOption(`${key}_${newDirection}`);
        }}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </PageLayout>
  );
};

export default EmailGroupsPage;

const ActionButtons = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357abd;
  }

  &:active {
    background-color: #2d6da3;
  }
`;
