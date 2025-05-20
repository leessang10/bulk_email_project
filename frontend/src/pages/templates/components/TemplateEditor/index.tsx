import { Provider } from "jotai";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import EditorPanel from "./components/EditorPanel";
import PreviewPanel from "./components/PreviewPanel";
import SaveTemplateModal from "./components/SaveTemplateModal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fff;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &.back {
    background: transparent;
    color: #495057;

    &:hover {
      background: #e9ecef;
    }
  }

  &.save {
    background: #228be6;
    color: white;

    &:hover {
      background: #1c7ed6;
    }
  }
`;

const EditorContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const TemplateEditor = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBack = () => {
    navigate("/templates");
  };

  const handleSave = (data: {
    name: string;
    description: string;
    category: string;
  }) => {
    // TODO: 템플릿 저장 로직 구현
    console.log("Save template with data:", data);
    setIsModalOpen(false);
  };

  return (
    <Provider>
      <DndProvider backend={HTML5Backend}>
        <Container>
          <Header>
            <Button className="back" onClick={handleBack}>
              ← 목록으로
            </Button>
            <ButtonGroup>
              <Button className="save" onClick={() => setIsModalOpen(true)}>
                저장하기
              </Button>
            </ButtonGroup>
          </Header>
          <EditorContainer>
            <EditorPanel />
            <PreviewPanel />
          </EditorContainer>
          <SaveTemplateModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        </Container>
      </DndProvider>
    </Provider>
  );
};

export default TemplateEditor;
