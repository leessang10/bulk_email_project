import { useState } from "react";
import styled from "styled-components";
import Pagination from "../../common/components/Pagination";
import SearchFilter from "../../common/components/SearchFilter";
import Table from "../../common/components/Table";

const UnsubscribesContainer = styled.div`
  padding: 20px;
`;

interface UnsubscribeEmail {
  id: number;
  email: string;
  reason: string;
  unsubscribedAt: string;
  source: "user" | "bounce";
}

// 임시 데이터
const MOCK_DATA: UnsubscribeEmail[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  email: `user${i + 1}@example.com`,
  reason: Math.random() > 0.5 ? "수신거부 요청" : "이메일 반송",
  unsubscribedAt: new Date(
    Date.now() - Math.random() * 10000000000
  ).toLocaleDateString(),
  source: Math.random() > 0.5 ? "user" : "bounce",
}));

const COLUMNS = [
  { key: "email", label: "이메일 주소" },
  { key: "reason", label: "수신거부 사유" },
  { key: "unsubscribedAt", label: "수신거부 일시" },
  { key: "source", label: "수신거부 출처" },
];

const SORT_OPTIONS = [
  { value: "email_asc", label: "이메일 오름차순" },
  { value: "email_desc", label: "이메일 내림차순" },
  { value: "unsubscribedAt_desc", label: "최근 수신거부순" },
  { value: "unsubscribedAt_asc", label: "오래된 수신거부순" },
];

const FILTER_OPTIONS = [
  {
    name: "source",
    label: "수신거부 출처",
    options: [
      { value: "all", label: "전체" },
      { value: "user", label: "사용자 요청" },
      { value: "bounce", label: "이메일 반송" },
    ],
  },
];

type SortField = keyof UnsubscribeEmail;

const UnsubscribesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("unsubscribedAt_desc");
  const [sourceFilter, setSourceFilter] = useState("all");

  // 실제로는 API 호출로 대체될 로직들
  const filteredData = MOCK_DATA.filter((item) => {
    const matchesSearch = item.email
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSource =
      sourceFilter === "all" || item.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

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
    <UnsubscribesContainer>
      <h1>수신거부 이메일 관리</h1>

      <SearchFilter
        searchPlaceholder="이메일 주소로 검색"
        onSearchChange={setSearchTerm}
        onPerPageChange={setPerPage}
        onSortChange={setSortOption}
        sortOptions={SORT_OPTIONS}
        filters={[
          {
            ...FILTER_OPTIONS[0],
            onChange: setSourceFilter,
          },
        ]}
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
    </UnsubscribesContainer>
  );
};

export default UnsubscribesPage;
