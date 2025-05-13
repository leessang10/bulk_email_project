import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
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
import EditorPanel from "./EditorPanel";
import PreviewPanel from "./PreviewPanel";

const CenterPanel = () => {
  const navigate = useNavigate();
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

  const renderContent = () => {
    switch (viewMode) {
      case "preview":
        return <PreviewPanel layouts={layouts} deviceMode={deviceMode} />;
      case "code":
        return <CodePanel layouts={layouts} />;
      default:
        return (
          <EditorPanel
            layouts={layouts}
            deviceMode={deviceMode}
            selectedItemId={selectedItemId}
            onLayoutAdd={handleLayoutAdd}
            onLayoutsReorder={handleLayoutsReorder}
            onAddComponent={handleAddComponent}
            onSelectComponent={setSelectedItemId}
            onUpdateProperties={handleUpdateProperties}
            onUpdateContent={handleUpdateContent}
            onSelectLayout={setSelectedItemId}
          />
        );
    }
  };

  return (
    <Container>
      <Toolbar>
        <ToolGroup>
          <BackButton onClick={() => navigate(-1)}>
            <span>←</span>
            <span>뒤로</span>
          </BackButton>
        </ToolGroup>
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
  gap: 0.75rem;
  padding: 0.375rem 0.75rem;
  background: white;
  border-bottom: 0.0625rem solid #e0e0e0;
  align-items: center;
`;

const ToolGroup = styled.div`
  display: flex;
  gap: 0.25rem;

  &:not(:first-child) {
    margin-left: 0.5rem;
    padding-left: 0.5rem;
    border-left: 0.0625rem solid #e0e0e0;
  }
`;

const BaseButton = styled.button`
  padding: 0.375rem 0.625rem;
  border: 0.0625rem solid #e0e0e0;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s;

  &:hover {
    background: #f0f0f0;
  }
`;

const BackButton = styled(BaseButton)`
  background: white;
  color: #666;

  span:first-child {
    font-size: 1rem;
    line-height: 1;
  }
`;

const ToolButton = styled(BaseButton)<{ $active: boolean }>`
  background: ${(props) => (props.$active ? "#e0e0e0" : "white")};
  font-weight: ${(props) => (props.$active ? "500" : "normal")};
`;

const EditorContent = styled.div`
  flex: 1;
  overflow: auto;
`;

export default CenterPanel;
