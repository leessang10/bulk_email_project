import { useAtom } from "jotai";
import React, { useState } from "react";
import styled from "styled-components";
import { emailTemplatesApi } from "../../../api/templates";
import { editorStateAtom, templateContentAtom } from "../atoms/editor";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h2`
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #343a40;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  color: #495057;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #228be6;
  }
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: #228be6;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  background: ${(props) =>
    props.variant === "primary" ? "#228be6" : "#e9ecef"};
  color: ${(props) => (props.variant === "primary" ? "white" : "#495057")};

  &:hover {
    background: ${(props) =>
      props.variant === "primary" ? "#1c7ed6" : "#dee2e6"};
  }
`;

const ErrorMessage = styled.div`
  color: #e03131;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [editorState] = useAtom(editorStateAtom);
  const [templateContent] = useAtom(templateContentAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await emailTemplatesApi.create({
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        content: templateContent.html,
        subject: formData.get("subject") as string,
      });

      onSave?.();
      onClose();
    } catch (err) {
      setError("템플릿 저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
      console.error("Failed to save template:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>템플릿 저장</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">템플릿 이름</Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="템플릿 이름을 입력하세요"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="subject">이메일 제목</Label>
            <Input
              id="subject"
              name="subject"
              required
              placeholder="이메일 제목을 입력하세요"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="category">카테고리</Label>
            <Input
              id="category"
              name="category"
              required
              placeholder="카테고리를 입력하세요"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="description">설명</Label>
            <TextArea
              id="description"
              name="description"
              placeholder="템플릿에 대한 설명을 입력하세요"
            />
          </FormGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <ButtonGroup>
            <Button type="button" onClick={onClose} disabled={isLoading}>
              취소
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? "저장 중..." : "저장"}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SaveTemplateModal;
