import { useState } from "react";
import styled from "styled-components";
import Drawer from "../../common/components/Drawer";
import PageLayout from "../../common/components/PageLayout";
import Pagination from "../../common/components/Pagination";
import SearchFilter from "../../common/components/SearchFilter";
import Table from "../../common/components/Table";
import EmailGroupForm from "./components/EmailGroupForm";

const StatusBadge = styled.span<{ status: EmailGroup["status"] }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;

  ${({ status }) => {
    switch (status) {
      case "ready":
        return `
          background-color: #f1f5f9;
          color: #475569;
        `;
      case "uploading":
        return `
          background-color: #e0f2fe;
          color: #0369a1;
        `;
      case "completed":
        return `
          background-color: #dcfce7;
          color: #15803d;
        `;
      case "error":
        return `
          background-color: #fee2e2;
          color: #b91c1c;
        `;
    }
  }}
`;

interface EmailGroup {
  id: number;
  name: string;
  totalEmails: number;
  status: "ready" | "uploading" | "completed" | "error";
  createdAt: string;
  updatedAt: string;
  emails: string[];
}

// 임시 데이터
const MOCK_DATA: EmailGroup[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `이메일 그룹 ${i + 1}`,
  totalEmails: Math.floor(Math.random() * 1000),
  status: ["ready", "uploading", "completed", "error"][
    Math.floor(Math.random() * 4)
  ] as EmailGroup["status"],
  createdAt: new Date(
    Date.now() - Math.random() * 10000000000
  ).toLocaleDateString(),
  updatedAt: new Date(
    Date.now() - Math.random() * 1000000000
  ).toLocaleDateString(),
  emails: Array.from(
    { length: Math.floor(Math.random() * 10) },
    (_, j) => `user${j + 1}@example.com`
  ),
}));

const COLUMNS = [
  { key: "name", label: "그룹명" },
  { key: "totalEmails", label: "이메일 수" },
  {
    key: "status",
    label: "상태",
    render: (value: EmailGroup["status"]) => {
      const statusMap = {
        ready: "대기",
        uploading: "업로드 중",
        completed: "완료",
        error: "오류",
      };
      return <StatusBadge status={value}>{statusMap[value]}</StatusBadge>;
    },
  },
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

  // 드로워 상태 관리
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [selectedGroup, setSelectedGroup] = useState<EmailGroup | null>(null);

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

  const handleCreateGroup = () => {
    setDrawerMode("create");
    setSelectedGroup(null);
    setIsDrawerOpen(true);
  };

  const handleViewGroup = (group: EmailGroup) => {
    setDrawerMode("view");
    setSelectedGroup(group);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedGroup(null);
  };

  const handleSubmit = async (data: { name: string; file?: File }) => {
    try {
      // TODO: API 호출
      // 1. 이메일 그룹 생성
      console.log("Create group:", data.name);

      // 2. 엑셀 파일이 있다면 업로드
      if (data.file) {
        console.log("Upload file:", data.file);
      }

      handleCloseDrawer();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddEmails = async (file: File) => {
    try {
      if (!selectedGroup) return;

      // TODO: API 호출
      // 1. 엑셀 파일 업로드 및 이메일 추가
      console.log("Add emails to group:", selectedGroup.id, file);

      // 2. 그룹 정보 업데이트
      const updatedGroup = {
        ...selectedGroup,
        status: "uploading" as const,
      };
      setSelectedGroup(updatedGroup);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = () => {
    if (selectedGroup) {
      // TODO: API 호출
      console.log("Delete:", selectedGroup.id);
      handleCloseDrawer();
    }
  };

  return (
    <PageLayout
      title="이메일 그룹 관리"
      description="이메일 그룹을 생성하고 관리할 수 있습니다."
    >
      <ActionButtons>
        <Button onClick={handleCreateGroup}>새 그룹 만들기</Button>
      </ActionButtons>

      <SearchFilter
        searchPlaceholder="그룹명으로 검색"
        onSearchChange={setSearchTerm}
        onPerPageChange={setPerPage}
        onSortChange={setSortOption}
        sortOptions={SORT_OPTIONS}
      />

      <Table<EmailGroup>
        columns={COLUMNS}
        data={paginatedData}
        sortKey={sortOption.split("_")[0]}
        sortDirection={sortOption.split("_")[1] as "asc" | "desc"}
        onSort={(key) => {
          const currentDirection = sortOption.split("_")[1];
          const newDirection = currentDirection === "asc" ? "desc" : "asc";
          setSortOption(`${key}_${newDirection}`);
        }}
        onRowClick={handleViewGroup}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={
          drawerMode === "create"
            ? "새 이메일 그룹"
            : drawerMode === "edit"
            ? "이메일 그룹 수정"
            : "이메일 그룹 상세"
        }
        width="700px"
      >
        <EmailGroupForm
          mode={drawerMode}
          initialData={selectedGroup ?? undefined}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onAddEmails={handleAddEmails}
        />
      </Drawer>
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
