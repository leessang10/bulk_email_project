import React from "react";
import Table from "../../../common/components/Table";
import type { Task } from "../api/taskApi";
import { SendTaskActions } from "./SendTaskActions";

interface SendTaskTableProps {
  tasks: Task[];
  sortKey: string;
  sortDirection: "asc" | "desc";
  onSort: (key: string) => void;
  onPauseTask: (taskId: number) => void;
  onResumeTask: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
}

export const SendTaskTable: React.FC<SendTaskTableProps> = ({
  tasks,
  sortKey,
  sortDirection,
  onSort,
  onPauseTask,
  onResumeTask,
  onDeleteTask,
}) => {
  return (
    <Table
      columns={[
        { key: "name", label: "작업명" },
        { key: "status", label: "상태" },
        { key: "targetGroup", label: "대상 그룹" },
        { key: "totalEmails", label: "전체 이메일 수" },
        { key: "sentEmails", label: "발송된 이메일 수" },
        { key: "scheduledAt", label: "예약 발송 시간" },
        { key: "createdAt", label: "생성일" },
        {
          key: "actions",
          label: "작업",
          render: (task: Task) => (
            <SendTaskActions
              task={task}
              onPauseTask={onPauseTask}
              onResumeTask={onResumeTask}
              onDeleteTask={onDeleteTask}
            />
          ),
        },
      ]}
      data={tasks}
      sortKey={sortKey}
      sortDirection={sortDirection}
      onSort={onSort}
    />
  );
};
