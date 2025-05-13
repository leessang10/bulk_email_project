import { useState } from "react";
import styled from "styled-components";
import FileUpload from "../../../common/components/FileUpload";
import KeyValueInput from "../../../common/components/KeyValueInput";

interface EmailGroupFormProps {
  mode: "create" | "edit" | "view";
  initialData?: {
    id: number;
    name: string;
    emails: string[];
    status: "ready" | "uploading" | "completed" | "error";
    totalEmails: number;
    mergeFields?: { key: string; value: string }[];
  };
  onSubmit: (data: {
    name: string;
    file?: File;
    mergeFields?: { key: string; value: string }[];
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
  $status?: NonNullable<EmailGroupFormProps["initialData"]>["status"];
}>`
  font-size: 0.9375rem;
  font-weight: 600;
  ${({ $status }) => {
    if (!$status) return "color: #1a2230;";
    switch ($status) {
      case "ready":
        return "color: #475569;";
      case "uploading":
        return "color: #0369a1;";
      case "completed":
        return "color: #15803d;";
      case "error":
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

const EmailGroupForm = ({
  mode,
  initialData,
  onSubmit,
  onDelete,
  onAddEmails,
}: EmailGroupFormProps) => {
  const [name, setName] = useState(initialData?.name ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [emailSearchTerm, setEmailSearchTerm] = useState("");
  const [addEmailFile, setAddEmailFile] = useState<File | null>(null);
  const [mergeFields, setMergeFields] = useState<
    { key: string; value: string }[]
  >(initialData?.mergeFields ?? []);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      file: file ?? undefined,
      mergeFields: mergeFields.length > 0 ? mergeFields : undefined,
    });
  };

  const handleFileChange = (newFile: File) => {
    setFile(newFile);
  };

  const handleAddEmailFileChange = (newFile: File) => {
    setAddEmailFile(newFile);
    onAddEmails?.(newFile);
  };

  const filteredEmails =
    initialData?.emails
      .filter((email) =>
        email.toLowerCase().includes(emailSearchTerm.toLowerCase())
      )
      .slice(0, 5) ?? [];

  const isViewMode = mode === "view";

  const statusMap = {
    ready: "대기",
    uploading: "업로드 중",
    completed: "완료",
    error: "오류",
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="name">그룹명</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="그룹명을 입력하세요"
          readOnly={isViewMode && !isEditing}
        />
      </FormGroup>

      {isViewMode && initialData && (
        <>
          <FormGroup>
            <Label>상태 정보</Label>
            <StatusSection>
              <StatusGrid>
                <StatusItem>
                  <StatusLabel>상태</StatusLabel>
                  <StatusValue $status={initialData.status}>
                    {statusMap[initialData.status]}
                  </StatusValue>
                </StatusItem>
                <StatusItem>
                  <StatusLabel>총 이메일 수</StatusLabel>
                  <StatusValue>
                    {initialData.totalEmails.toLocaleString()}개
                  </StatusValue>
                </StatusItem>
              </StatusGrid>
            </StatusSection>
          </FormGroup>

          <FormGroup>
            <Label>메일 머지 필드</Label>
            {isEditing ? (
              <KeyValueInput onChange={setMergeFields} maxPairs={5} />
            ) : (
              <StatusSection>
                {mergeFields.length > 0 ? (
                  mergeFields.map((field, index) => (
                    <StatusItem key={index}>
                      <StatusLabel>{field.key}</StatusLabel>
                      <StatusValue>{field.value}</StatusValue>
                    </StatusItem>
                  ))
                ) : (
                  <NoResults>등록된 머지 필드가 없습니다.</NoResults>
                )}
              </StatusSection>
            )}
          </FormGroup>

          <FormGroup>
            <Label>이메일 목록</Label>
            <EmailSection>
              <FileUpload
                file={addEmailFile}
                onFileChange={handleAddEmailFileChange}
                id="add-email-input"
              />
              <SearchInput
                type="text"
                placeholder="이메일 검색 (최대 5개 표시)"
                value={emailSearchTerm}
                onChange={(e) => setEmailSearchTerm(e.target.value)}
              />
              <EmailList>
                {filteredEmails.length > 0 ? (
                  filteredEmails.map((email, index) => (
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
        </>
      )}

      {!isViewMode && (
        <>
          <FormGroup>
            <Label>메일 머지 필드</Label>
            <KeyValueInput onChange={setMergeFields} maxPairs={5} />
          </FormGroup>

          <FormGroup>
            <Label>이메일 목록 엑셀 파일</Label>
            <FileUpload
              file={file}
              onFileChange={handleFileChange}
              id="file-input"
            />
          </FormGroup>
        </>
      )}

      <ButtonGroup>
        {mode === "view" ? (
          <>
            <Button
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
              <Button variant="danger" onClick={onDelete}>
                삭제하기
              </Button>
            )}
            {isEditing && (
              <Button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setMergeFields(initialData?.mergeFields ?? []);
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
