import { useAtom } from "jotai";
import { useDrop } from "react-dnd";
import styled from "styled-components";
import {
  deviceModeAtom,
  layoutsAtom,
  selectedItemIdAtom,
  viewModeAtom,
} from "../../atoms";
import {
  getDefaultContent,
  getDefaultProperties,
} from "../../constants/defaultProperties";
import type { ComponentType, LayoutType } from "../../types/editor";
import CodePanel from "./CodePanel";
import DraggableLayoutBox from "./DraggableLayoutBox";
import PreviewPanel from "./PreviewPanel";

const CenterPanel = () => {
  const [layouts, setLayouts] = useAtom(layoutsAtom);
  const [viewMode, setViewMode] = useAtom(viewModeAtom);
  const [deviceMode, setDeviceMode] = useAtom(deviceModeAtom);
  const [selectedItemId, setSelectedItemId] = useAtom(selectedItemIdAtom);

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

  const handleAddComponent = (
    layoutId: string,
    componentType: ComponentType
  ) => {
    setLayouts((prev) =>
      prev.map((layout) => {
        if (layout.id === layoutId) {
          return {
            ...layout,
            children: [
              ...layout.children,
              {
                id: `component-${Date.now()}`,
                type: componentType,
                content: getDefaultContent(componentType),
                properties: getDefaultProperties(componentType),
              },
            ],
          };
        }
        return layout;
      })
    );
  };

  const handleUpdateProperties = (
    componentId: string,
    properties: Record<string, any>
  ) => {
    setLayouts((prev) =>
      prev.map((layout) => {
        const updatedChildren = layout.children.map((component) => {
          if (component.id === componentId) {
            return {
              ...component,
              properties: { ...component.properties, ...properties },
            };
          }
          return component;
        });
        return { ...layout, children: updatedChildren };
      })
    );
  };

  const handleUpdateContent = (componentId: string, content: string) => {
    setLayouts((prev) =>
      prev.map((layout) => {
        const updatedChildren = layout.children.map((component) => {
          if (component.id === componentId) {
            return { ...component, content };
          }
          return component;
        });
        return { ...layout, children: updatedChildren };
      })
    );
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

  const renderContent = () => {
    switch (viewMode) {
      case "preview":
        return <PreviewPanel layouts={layouts} deviceMode={deviceMode} />;
      case "code":
        return <CodePanel layouts={layouts} />;
      default:
        return (
          <EditorWrapper $deviceMode={deviceMode}>
            <Canvas ref={drop} $isOver={isOver}>
              {layouts.map((layout, index) => (
                <DraggableLayoutBox
                  key={layout.id}
                  layout={layout}
                  index={index}
                  isSelected={selectedItemId === layout.id}
                  onClick={() => setSelectedItemId(layout.id)}
                  onReorder={handleLayoutsReorder}
                  onAddComponent={handleAddComponent}
                  onSelectComponent={setSelectedItemId}
                  selectedComponentId={selectedItemId}
                  onUpdateProperties={handleUpdateProperties}
                  onUpdateContent={handleUpdateContent}
                />
              ))}
              {layouts.length === 0 && (
                <EmptyMessage>
                  레이아웃을 이곳에 드래그하여 추가하세요
                </EmptyMessage>
              )}
            </Canvas>
          </EditorWrapper>
        );
    }
  };

  return (
    <Container>
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

      <EditorContent>{renderContent()}</EditorContent>
    </Container>
  );
};

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 16px;
  padding: 8px 16px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
`;

const ToolGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ToolButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: ${(props) => (props.$active ? "#e0e0e0" : "white")};
  cursor: pointer;

  &:hover {
    background: #f0f0f0;
  }
`;

const EditorContent = styled.div`
  flex: 1;
  overflow: auto;
  padding: 24px;
`;

const EditorWrapper = styled.div<{ $deviceMode: "desktop" | "mobile" }>`
  max-width: ${(props) => (props.$deviceMode === "desktop" ? "100%" : "375px")};
  margin: 0 auto;
`;

const Canvas = styled.div<{ $isOver: boolean }>`
  min-height: 500px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
  border: 2px dashed ${(props) => (props.$isOver ? "#2196f3" : "transparent")};
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

export default CenterPanel;
