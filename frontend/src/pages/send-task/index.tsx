import { useState } from "react";
import styled from "styled-components";
import PageLayout from "../../common/components/PageLayout";
import Pagination from "../../common/components/Pagination";
import SearchFilter from "../../common/components/SearchFilter";
import Table from "../../common/components/Table";

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

interface SendTask {
  id: number;
  name: string;
  status: "pending" | "in_progress" | "completed" | "failed" | "paused";
  targetGroup: string;
  totalEmails: number;
  sentEmails: number;
  scheduledAt: string;
  createdAt: string;
}

// 임시 데이터
const MOCK_DATA: SendTask[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `발송 작업 ${i + 1}`,
  status: ["pending", "in_progress", "completed", "failed", "paused"][
    Math.floor(Math.random() * 5)
  ] as SendTask["status"],
  targetGroup: `이메일 그룹 ${Math.floor(Math.random() * 10) + 1}`,
  totalEmails: Math.floor(Math.random() * 10000),
  sentEmails: Math.floor(Math.random() * 10000),
  scheduledAt: new Date(
    Date.now() + Math.random() * 10000000000
  ).toLocaleDateString(),
  createdAt: new Date(
    Date.now() - Math.random() * 10000000000
  ).toLocaleDateString(),
}));

const COLUMNS = [
  { key: "name", label: "작업명" },
  { key: "status", label: "상태" },
  { key: "targetGroup", label: "대상 그룹" },
  { key: "totalEmails", label: "전체 이메일 수" },
  { key: "sentEmails", label: "발송된 이메일 수" },
  { key: "scheduledAt", label: "예약 발송 시간" },
  { key: "createdAt", label: "생성일" },
];

const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "최근 생성순" },
  { value: "createdAt_asc", label: "오래된 생성순" },
  { value: "scheduledAt_asc", label: "예약시간 빠른순" },
  { value: "scheduledAt_desc", label: "예약시간 늦은순" },
];

const FILTER_OPTIONS = [
  {
    name: "status",
    label: "상태",
    options: [
      { value: "all", label: "전체" },
      { value: "pending", label: "대기중" },
      { value: "in_progress", label: "진행중" },
      { value: "completed", label: "완료" },
      { value: "failed", label: "실패" },
      { value: "paused", label: "일시중지" },
    ],
  },
];

type SortField = keyof SendTask;

const SendTaskPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("createdAt_desc");
  const [statusFilter, setStatusFilter] = useState("all");

  // 실제로는 API 호출로 대체될 로직들
  const filteredData = MOCK_DATA.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
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
    <PageLayout
      title="이메일 발송 작업 관리"
      description="이메일 발송 작업을 생성하고 관리할 수 있습니다."
    >
      <ActionButtons>
        <Button>새 발송 작업 만들기</Button>
      </ActionButtons>

      <SearchFilter
        searchPlaceholder="작업명으로 검색"
        onSearchChange={setSearchTerm}
        onPerPageChange={setPerPage}
        onSortChange={setSortOption}
        sortOptions={SORT_OPTIONS}
        filters={[
          {
            ...FILTER_OPTIONS[0],
            onChange: setStatusFilter,
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
    </PageLayout>
  );
};

export default SendTaskPage;
