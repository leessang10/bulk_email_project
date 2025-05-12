import { useState } from "react";
import { useDrop } from "react-dnd";
import styled from "styled-components";
import type { LayoutItem, LayoutType } from "../types/editor";
import DraggableLayoutBox from "./DraggableLayoutBox";
import LayoutPanel from "./LayoutPanel";

type ViewMode = "editor" | "preview" | "code";
type DeviceMode = "desktop" | "mobile";

const TemplateEditor = () => {
  const [layouts, setLayouts] = useState<LayoutItem[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("editor");
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleLayoutAdd = (layoutType: LayoutType) => {
    setLayouts((prev) => [
      ...prev,
      {
        id: `layout-${Date.now()}`,
        type: layoutType,
        children: [],
      },
    ]);
  };

  const handleLayoutsReorder = (dragIndex: number, hoverIndex: number) => {
    setLayouts((prev) => {
      const newLayouts = [...prev];
      const [removed] = newLayouts.splice(dragIndex, 1);
      newLayouts.splice(hoverIndex, 0, removed);
      return newLayouts;
    });
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["layout", "layoutBox"],
    drop: (item: { type: string; layoutType?: LayoutType }, monitor) => {
      if (!monitor.didDrop()) {
        if (item.type === "layout" && item.layoutType) {
          handleLayoutAdd(item.layoutType);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }));

  return (
    <Container>
      <LeftPanel>
        <PanelTitle>레이아웃 / 컴포넌트</PanelTitle>
        <LayoutPanel />
      </LeftPanel>

      <CenterPanel>
        <Toolbar>
          <ToolGroup>
            <ToolButton
              $active={viewMode === "editor"}
              onClick={() => setViewMode("editor")}
            >
              에디터
            </ToolButton>
            <ToolButton
              $active={viewMode === "preview"}
              onClick={() => setViewMode("preview")}
            >
              미리보기
            </ToolButton>
            <ToolButton
              $active={viewMode === "code"}
              onClick={() => setViewMode("code")}
            >
              코드
            </ToolButton>
          </ToolGroup>
          <ToolGroup>
            <ToolButton
              $active={deviceMode === "desktop"}
              onClick={() => setDeviceMode("desktop")}
            >
              데스크톱
            </ToolButton>
            <ToolButton
              $active={deviceMode === "mobile"}
              onClick={() => setDeviceMode("mobile")}
            >
              모바일
            </ToolButton>
          </ToolGroup>
        </Toolbar>

        <EditorContent>
          <Canvas ref={drop} $isOver={isOver}>
            {layouts.map((layout, index) => (
              <DraggableLayoutBox
                key={layout.id}
                layout={layout}
                index={index}
                isSelected={selectedItemId === layout.id}
                onClick={() => setSelectedItemId(layout.id)}
                onReorder={handleLayoutsReorder}
              />
            ))}
            {layouts.length === 0 && (
              <EmptyMessage>
                레이아웃을 이곳에 드래그하여 추가하세요
              </EmptyMessage>
            )}
          </Canvas>
        </EditorContent>
      </CenterPanel>

      <RightPanel>
        <PanelTitle>속성</PanelTitle>
        {selectedItemId && <div>선택된 아이템: {selectedItemId}</div>}
      </RightPanel>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #fff;
`;

const PanelTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  margin: 0;
`;

const LeftPanel = styled.div`
  width: 280px;
  border-right: 1px solid #e0e0e0;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
`;

const CenterPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
`;

const RightPanel = styled.div`
  width: 300px;
  border-left: 1px solid #e0e0e0;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
`;

const Toolbar = styled.div`
  padding: 8px 16px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  gap: 16px;
`;

const ToolGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ToolButton = styled.button<{ $active?: boolean }>`
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: ${({ $active }) => ($active ? "#1a73e8" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#333")};
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: ${({ $active }) => ($active ? "#1557b0" : "#f5f5f5")};
  }
`;

const EditorContent = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`;

const Canvas = styled.div<{ $isOver?: boolean }>`
  min-height: 100%;
  background: ${({ $isOver }) => ($isOver ? "#f0f7ff" : "#f8f8f8")};
  border-radius: 8px;
  padding: 24px;
  transition: background-color 0.2s;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;

export default TemplateEditor;
