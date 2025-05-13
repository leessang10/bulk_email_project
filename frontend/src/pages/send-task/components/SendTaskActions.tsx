import React from "react";
import styled from "styled-components";
import { Button } from "../../../common/components/Button";
import type { Task } from "../api/taskApi";

interface SendTaskActionsProps {
  task: Task;
  onPauseTask: (taskId: number) => void;
  onResumeTask: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
}

const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

export const SendTaskActions: React.FC<SendTaskActionsProps> = ({
  task,
  onPauseTask,
  onResumeTask,
  onDeleteTask,
}) => {
  return (
    <ActionsContainer>
      {task.status === "in_progress" && (
        <Button onClick={() => onPauseTask(task.id)}>일시중지</Button>
      )}
      {task.status === "paused" && (
        <Button onClick={() => onResumeTask(task.id)}>재개</Button>
      )}
      <Button onClick={() => onDeleteTask(task.id)} variant="danger">
        삭제
      </Button>
    </ActionsContainer>
  );
};
