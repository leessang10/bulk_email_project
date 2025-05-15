import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Button } from "../../common/components/Button";
import PageLayout from "../../common/components/PageLayout";
import Pagination from "../../common/components/TableV2/Pagination";
import SearchFilter from "../../common/components/TableV2/SearchFilter";
import type { Group, Task, Template } from "./api/taskApi";
import { taskApi } from "./api/taskApi";
import { CreateTaskModal } from "./components/CreateTaskModal";
import { SendTaskTable } from "./components/SendTaskTable";

const ActionButtons = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
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

const SendTaskPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("createdAt_desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  const fetchTemplatesAndGroups = async () => {
    try {
      const [templatesResponse, groupsResponse] = await Promise.all([
        taskApi.getTemplates(),
        taskApi.getGroups(),
      ]);

      // API 응답이 배열인지 확인하고 설정
      setTemplates(Array.isArray(templatesResponse) ? templatesResponse : []);
      setGroups(Array.isArray(groupsResponse) ? groupsResponse : []);
    } catch (error) {
      console.error("API Error:", error);
      toast.error("템플릿과 그룹 목록을 불러오는데 실패했습니다.");
      // 오류 발생 시 빈 배열로 초기화
      setTemplates([]);
      setGroups([]);
    }
  };

  useEffect(() => {
    fetchTemplatesAndGroups();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const [field, direction] = sortOption.split("_");
      const response = await taskApi.getTasks({
        page: currentPage,
        perPage,
        search: searchTerm,
        status: statusFilter !== "all" ? statusFilter : undefined,
        sortBy: field,
        sortDirection: direction as "asc" | "desc",
      });
      setTasks(response.data);
      setTotalTasks(response.total);
    } catch (error) {
      toast.error("작업 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [currentPage, perPage, searchTerm, sortOption, statusFilter]);

  const handleCreateTasks = async (data: {
    templateId: number;
    groupIds: number[];
    scheduledAt: Date;
  }) => {
    try {
      await taskApi.createTasks(data);
      toast.success(`${data.groupIds.length}개의 작업이 생성되었습니다.`);
      setIsCreateModalOpen(false);
      fetchTasks();
    } catch (error) {
      toast.error("작업 생성에 실패했습니다.");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm("정말로 이 작업을 삭제하시겠습니까?")) return;

    try {
      await taskApi.deleteTask(taskId);
      toast.success("작업이 삭제되었습니다.");
      fetchTasks();
    } catch (error) {
      toast.error("작업 삭제에 실패했습니다.");
    }
  };

  const handlePauseTask = async (taskId: number) => {
    try {
      await taskApi.pauseTask(taskId);
      toast.success("작업이 일시중지되었습니다.");
      fetchTasks();
    } catch (error) {
      toast.error("작업 일시중지에 실패했습니다.");
    }
  };

  const handleResumeTask = async (taskId: number) => {
    try {
      await taskApi.resumeTask(taskId);
      toast.success("작업이 재개되었습니다.");
      fetchTasks();
    } catch (error) {
      toast.error("작업 재개에 실패했습니다.");
    }
  };

  const totalPages = Math.ceil(totalTasks / perPage);

  return (
    <PageLayout
      title="이메일 발송 작업 관리"
      description="이메일 발송 작업을 생성하고 관리할 수 있습니다."
    >
      <ActionButtons>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          새 발송 작업 만들기
        </Button>
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

      <SendTaskTable
        tasks={tasks}
        sortKey={sortOption.split("_")[0]}
        sortDirection={sortOption.split("_")[1] as "asc" | "desc"}
        onSort={(key) => {
          const currentDirection = sortOption.split("_")[1];
          const newDirection = currentDirection === "asc" ? "desc" : "asc";
          setSortOption(`${key}_${newDirection}`);
        }}
        onPauseTask={handlePauseTask}
        onResumeTask={handleResumeTask}
        onDeleteTask={handleDeleteTask}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTasks}
        templates={templates}
        groups={groups}
      />
    </PageLayout>
  );
};

export default SendTaskPage;
