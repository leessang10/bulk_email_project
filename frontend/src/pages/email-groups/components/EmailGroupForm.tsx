import { useState } from "react";
import styled from "styled-components";
import FileUpload from "../../../common/components/FileUpload";
import KeyValueInput from "../../../common/components/KeyValueInput";
import type {
  EmailGroup,
  EmailGroupRegion,
  EmailGroupStatus,
} from "../api/types";

interface EmailGroupFormProps {
  mode: "create" | "edit" | "view";
  initialData?: EmailGroup;
  onSubmit: (data: {
    name: string;
    region?: EmailGroupRegion;
    file?: File;
    mailMergeData?: Record<string, any>;
  }) => void;
  onDelete?: () => void;
  onAddEmails?: (file: File) => void;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #1a2230;
  font-size: 0.9375rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }

  &:read-only {
    background-color: #f8fafc;
  }
`;

const StatusSection = styled.div`
  background-color: #f8fafc;
  border-radius: 0.5rem;
  padding: 1.25rem;
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const StatusItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StatusLabel = styled.span`
  font-size: 0.8125rem;
  color: #64748b;
`;

const StatusValue = styled.span<{
  $status?: EmailGroupStatus;
}>`
  font-size: 0.9375rem;
  font-weight: 600;
  ${({ $status }) => {
    if (!$status) return "color: #1a2230;";
    switch ($status) {
      case "PENDING":
        return "color: #475569;";
      case "WAITING":
        return "color: #854d0e;";
      case "PROCESSING":
        return "color: #0369a1;";
      case "COMPLETED":
        return "color: #15803d;";
      case "FAILED":
        return "color: #b91c1c;";
    }
  }}
`;

const EmailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SearchInput = styled(Input)`
  margin-bottom: 0.5rem;
`;

const EmailList = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const EmailItem = styled.div`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: #475569;
  font-size: 0.875rem;

  &:last-child {
    border-bottom: none;
  }
`;

const NoResults = styled.div`
  padding: 1.5rem;
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const Button = styled.button<{ variant?: "primary" | "danger" }>`
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;

  ${({ variant }) =>
    variant === "danger"
      ? `
    background-color: #fff;
    color: #dc2626;
    border: 1px solid #dc2626;
    
    &:hover {
      background-color: #dc2626;
      color: white;
    }
  `
      : variant === "primary"
      ? `
    background-color: #4a90e2;
    color: white;
    border: none;
    
    &:hover {
      background-color: #357abd;
    }
  `
      : `
    background-color: #fff;
    color: #1a2230;
    border: 1px solid #e2e8f0;
    
    &:hover {
      background-color: #f8fafc;
    }
  `}
`;

const EmailGroupForm: React.FC<EmailGroupFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onDelete,
  onAddEmails,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    region: initialData?.region || ("DOMESTIC" as EmailGroupRegion),
    file: null as File | null,
    mailMergeData: initialData?.mailMergeData || {},
  });
  const [emailSearchTerm, setEmailSearchTerm] = useState("");
  const [addEmailFile, setAddEmailFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [emailList, setEmailList] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      region: formData.region,
      file: formData.file || undefined,
      mailMergeData: formData.mailMergeData,
    });
  };

  const handleFileChange = (newFile: File) => {
    setFormData({ ...formData, file: newFile });
  };

  const handleAddEmailFileChange = (newFile: File) => {
    setAddEmailFile(newFile);
    onAddEmails?.(newFile);
  };

  const filteredEmails = emailList
    .filter((email: string) =>
      email.toLowerCase().includes(emailSearchTerm.toLowerCase())
    )
    .slice(0, 5);

  const isViewMode = mode === "view";

  const statusLabels: Record<EmailGroupStatus, string> = {
    PENDING: "대기 중",
    WAITING: "처리 대기",
    PROCESSING: "처리 중",
    COMPLETED: "완료",
    FAILED: "실패",
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>그룹명</Label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          readOnly={isViewMode && !isEditing}
        />
      </FormGroup>

      {isViewMode && initialData && (
        <StatusSection>
          <StatusGrid>
            <StatusItem>
              <StatusLabel>상태</StatusLabel>
              <StatusValue $status={initialData.status}>
                {statusLabels[initialData.status]}
              </StatusValue>
            </StatusItem>
            <StatusItem>
              <StatusLabel>이메일 수</StatusLabel>
              <StatusValue>{initialData.addressCount}</StatusValue>
            </StatusItem>
          </StatusGrid>
        </StatusSection>
      )}

      {mode !== "view" && (
        <FormGroup>
          <Label>이메일 파일</Label>
          <FileUpload
            file={formData.file}
            onFileChange={handleFileChange}
            accept=".csv,.xlsx"
            id="email-file-upload"
          />
        </FormGroup>
      )}

      <FormGroup>
        <Label>머지 필드</Label>
        <KeyValueInput
          onChange={(pairs) => {
            const newMergeData = pairs.reduce((acc, { key, value }) => {
              acc[key] = value;
              return acc;
            }, {} as Record<string, any>);
            setFormData({ ...formData, mailMergeData: newMergeData });
          }}
          maxPairs={5}
        />
      </FormGroup>

      {isViewMode && (
        <FormGroup>
          <Label>이메일 목록</Label>
          <EmailSection>
            <FileUpload
              file={addEmailFile}
              onFileChange={handleAddEmailFileChange}
              id="add-email-input"
              accept=".csv,.xlsx"
            />
            <SearchInput
              type="text"
              placeholder="이메일 검색 (최대 5개 표시)"
              value={emailSearchTerm}
              onChange={(e) => setEmailSearchTerm(e.target.value)}
            />
            <EmailList>
              {filteredEmails.length > 0 ? (
                filteredEmails.map((email: string, index: number) => (
                  <EmailItem key={index}>{email}</EmailItem>
                ))
              ) : (
                <NoResults>
                  {emailSearchTerm
                    ? "검색 결과가 없습니다."
                    : "검색어를 입력하세요."}
                </NoResults>
              )}
            </EmailList>
          </EmailSection>
        </FormGroup>
      )}

      <ButtonGroup>
        {mode === "view" ? (
          <>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                if (isEditing) {
                  handleSubmit(new Event("submit") as any);
                }
                setIsEditing(!isEditing);
              }}
            >
              {isEditing ? "저장하기" : "수정하기"}
            </Button>
            {onDelete && (
              <Button type="button" variant="danger" onClick={onDelete}>
                삭제하기
              </Button>
            )}
            {isEditing && (
              <Button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    ...formData,
                    mailMergeData: initialData?.mailMergeData || {},
                  });
                }}
              >
                취소
              </Button>
            )}
          </>
        ) : (
          <>
            <Button variant="primary" type="submit">
              {mode === "create" ? "생성하기" : "저장하기"}
            </Button>
            <Button type="button" onClick={() => {}}>
              취소
            </Button>
          </>
        )}
      </ButtonGroup>
    </Form>
  );
};

export default EmailGroupForm;
