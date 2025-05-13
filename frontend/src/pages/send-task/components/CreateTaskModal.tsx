import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "../../../common/components/Button";
import { DateTimePicker } from "../../../common/components/DateTimePicker";
import { Modal } from "../../../common/components/Modal";
import { Select } from "../../../common/components/Select";
import type { Group, Template } from "../api/taskApi";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    templateId: number;
    groupIds: number[];
    scheduledAt: Date;
  }) => void;
  templates: Template[];
  groups: Group[];
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Description = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
`;

const SelectedCount = styled.span`
  color: #4a90e2;
  font-weight: 600;
`;

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  templates,
  groups,
}) => {
  const [templateId, setTemplateId] = useState<number | null>(null);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (templateId && selectedGroups.length > 0 && scheduledAt) {
      onSubmit({
        templateId,
        groupIds: selectedGroups,
        scheduledAt,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="새 발송 작업 만들기">
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>이메일 템플릿</Label>
          <Description>발송할 이메일의 템플릿을 선택하세요.</Description>
          <Select
            value={templateId}
            onChange={(value) => setTemplateId(value as number)}
            options={
              Array.isArray(templates)
                ? templates.map((t) => ({
                    value: t.id,
                    label: `${t.name} (${t.subject})`,
                  }))
                : []
            }
            placeholder="템플릿을 선택하세요"
          />
        </FormGroup>

        <FormGroup>
          <Label>대상 그룹</Label>
          <Description>
            선택한 각 그룹마다 별도의 발송 작업이 생성됩니다.{" "}
            <SelectedCount>
              {selectedGroups.length > 0
                ? `${selectedGroups.length}개의 작업이 생성됩니다.`
                : ""}
            </SelectedCount>
          </Description>
          <Select
            value={selectedGroups}
            onChange={(values) => setSelectedGroups(values as number[])}
            options={
              Array.isArray(groups)
                ? groups.map((g) => ({
                    value: g.id,
                    label: `${g.name} (${g.emailCount}명)`,
                  }))
                : []
            }
            isMulti
            placeholder="그룹을 선택하세요"
          />
        </FormGroup>

        <FormGroup>
          <Label>예약 발송 시간</Label>
          <Description>
            설정한 시간에 이메일이 발송됩니다. 현재 시간 이후로만 설정
            가능합니다.
          </Description>
          <DateTimePicker
            value={scheduledAt}
            onChange={setScheduledAt}
            minDate={new Date()}
          />
        </FormGroup>

        <Button
          type="submit"
          disabled={!templateId || selectedGroups.length === 0 || !scheduledAt}
        >
          {selectedGroups.length > 0
            ? `${selectedGroups.length}개의 작업 생성`
            : "작업 생성"}
        </Button>
      </Form>
    </Modal>
  );
};
