import { useState } from "react";
import { useDrop } from "react-dnd";
import styled from "styled-components";
import ComponentList from "./ComponentList";

const EditorContainer = styled.div`
  display: flex;
  height: calc(100vh - 80px);
  background: #fff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
`;

const LeftPanel = styled.div`
  width: 280px;
  border-right: 1px solid var(--gray-200);
  background: var(--gray-50);
  padding: var(--spacing-5);
  overflow-y: auto;
`;

const CenterPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
`;

const RightPanel = styled.div`
  width: 300px;
  border-left: 1px solid var(--gray-200);
  background: var(--gray-50);
  padding: var(--spacing-5);
  overflow-y: auto;
`;

const Toolbar = styled.div`
  padding: var(--spacing-3) var(--spacing-5);
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  gap: var(--spacing-3);
`;

const ToolbarButton = styled.button<{ $active?: boolean }>`
  padding: var(--spacing-2) var(--spacing-4);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-base);
  background: ${({ $active }) => ($active ? "var(--primary)" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "var(--gray-700)")};
  font-size: var(--font-size-sm);
  transition: all 0.2s;

  &:hover {
    background: ${({ $active }) =>
      $active ? "var(--primary)" : "var(--gray-100)"};
  }
`;

const EditorContent = styled.div`
  flex: 1;
  padding: var(--spacing-5);
  overflow-y: auto;
`;

const DropZone = styled.div<{ $isOver?: boolean }>`
  min-height: 200px;
  border: 2px dashed
    ${({ $isOver }) => ($isOver ? "var(--primary)" : "var(--gray-300)")};
  border-radius: var(--radius-lg);
  margin: var(--spacing-5) 0;
  padding: var(--spacing-5);
  background: ${({ $isOver }) =>
    $isOver ? "var(--primary-light)" : "var(--gray-50)"};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-600);
  font-size: var(--font-size-base);
`;

type ViewMode = "editor" | "preview" | "code";
type DeviceMode = "desktop" | "mobile";

interface DroppedItem {
  type: "component" | "layout";
  id: string;
}

const TemplateEditor = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("editor");
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [droppedItems, setDroppedItems] = useState<DroppedItem[]>([]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["component", "layout"],
    drop: (item: DroppedItem) => {
      setDroppedItems((prev) => [...prev, item]);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <EditorContainer>
      <LeftPanel>
        <ComponentList />
      </LeftPanel>

      <CenterPanel>
        <Toolbar>
          <div>
            <ToolbarButton
              $active={viewMode === "editor"}
              onClick={() => setViewMode("editor")}
            >
              에디터
            </ToolbarButton>
            <ToolbarButton
              $active={viewMode === "preview"}
              onClick={() => setViewMode("preview")}
            >
              미리보기
            </ToolbarButton>
            <ToolbarButton
              $active={viewMode === "code"}
              onClick={() => setViewMode("code")}
            >
              코드
            </ToolbarButton>
          </div>
          <div>
            <ToolbarButton
              $active={deviceMode === "desktop"}
              onClick={() => setDeviceMode("desktop")}
            >
              데스크톱
            </ToolbarButton>
            <ToolbarButton
              $active={deviceMode === "mobile"}
              onClick={() => setDeviceMode("mobile")}
            >
              모바일
            </ToolbarButton>
          </div>
        </Toolbar>
        <EditorContent>
          <DropZone ref={drop} $isOver={isOver}>
            {droppedItems.length === 0 ? (
              "여기에 컴포넌트나 레이아웃을 드래그하여 놓으세요"
            ) : (
              <div>
                {droppedItems.map((item, index) => (
                  <div key={index}>
                    {item.type}: {item.id}
                  </div>
                ))}
              </div>
            )}
          </DropZone>
        </EditorContent>
      </CenterPanel>

      <RightPanel>
        <h3>속성</h3>
        {/* 선택된 요소의 속성을 여기에 표시 */}
      </RightPanel>
    </EditorContainer>
  );
};

export default TemplateEditor;
