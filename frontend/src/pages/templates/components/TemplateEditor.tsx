import { useState } from "react";
import { useDrop } from "react-dnd";
import styled from "styled-components";
import { EDITOR_CONSTANTS } from "../constants/styles";
import type {
  ComponentItem,
  ComponentType,
  LayoutItem,
  LayoutType,
} from "../types/editor";
import CodePanel from "./CodePanel";
import ComponentPanel from "./ComponentPanel";
import DraggableLayoutBox from "./DraggableLayoutBox";
import LayoutPanel from "./LayoutPanel";
import PreviewPanel from "./PreviewPanel";
import PropertyPanel from "./PropertyPanel/index";

type ViewMode = "editor" | "preview" | "code";
type DeviceMode = "desktop" | "mobile";

const TemplateEditor = () => {
  const [layouts, setLayouts] = useState<LayoutItem[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("editor");
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const selectedItem = selectedItemId
    ? layouts.reduce<ComponentItem | LayoutItem | null>((found, layout) => {
        if (found) return found;
        if (layout.id === selectedItemId) return layout;
        const component = layout.children.find((c) => c.id === selectedItemId);
        return component || null;
      }, null)
    : null;

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

  const handleUpdateProperties = (properties: Record<string, any>) => {
    if (!selectedItemId) return;

    setLayouts((prev) =>
      prev.map((layout) => {
        const updatedChildren = layout.children.map((component) => {
          if (component.id === selectedItemId) {
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

  const handleUpdateContent = (content: string) => {
    if (!selectedItemId) return;

    setLayouts((prev) =>
      prev.map((layout) => {
        const updatedChildren = layout.children.map((component) => {
          if (component.id === selectedItemId) {
            return { ...component, content };
          }
          return component;
        });
        return { ...layout, children: updatedChildren };
      })
    );
  };

  const handleDeleteComponent = (componentId: string) => {
    setLayouts((prev) =>
      prev.map((layout) => ({
        ...layout,
        children: layout.children.filter(
          (component) => component.id !== componentId
        ),
      }))
    );
    setSelectedItemId(null);
  };

  const handleDeleteLayout = (layoutId: string) => {
    setLayouts((prev) => prev.filter((layout) => layout.id !== layoutId));
    setSelectedItemId(null);
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
      <LeftPanel>
        <PanelTitle>레이아웃 / 컴포넌트</PanelTitle>
        <TabContainer>
          <LayoutPanel />
          <ComponentPanel />
        </TabContainer>
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

        <EditorContent>{renderContent()}</EditorContent>
      </CenterPanel>

      <RightPanel>
        <PropertyPanel
          selectedItem={selectedItem}
          onUpdateProperties={handleUpdateProperties}
          onUpdateContent={handleUpdateContent}
          onDeleteComponent={handleDeleteComponent}
          onDeleteLayout={handleDeleteLayout}
        />
      </RightPanel>
    </Container>
  );
};

const getDefaultContent = (type: ComponentType): string => {
  switch (type) {
    case "text":
      return "텍스트를 입력하세요";
    case "button":
      return "버튼";
    case "link":
      return "링크";
    default:
      return "";
  }
};

const getDefaultProperties = (type: ComponentType): Record<string, any> => {
  switch (type) {
    case "text":
      return {
        color: "#333333",
        fontSize: "16px",
        textAlign: "center",
        fontWeight: "normal",
        lineHeight: "1.5",
        margin: "0px",
        padding: "0px",
      };
    case "image":
      return {
        src: "https://via.placeholder.com/300x200",
        alt: "이미지 설명",
        width: "80%",
        height: "auto",
        margin: "0 auto",
        display: "block",
        borderRadius: "4px",
      };
    case "button":
      return {
        backgroundColor: "#1a73e8",
        color: "#ffffff",
        padding: "12px 24px",
        borderRadius: "4px",
        fontSize: "16px",
        textAlign: "center",
        textDecoration: "none",
        display: "inline-block",
        margin: "0 auto",
        border: "none",
        width: "auto",
        minWidth: "120px",
      };
    case "link":
      return {
        color: "#1a73e8",
        href: "#",
        textDecoration: "none",
        fontSize: "16px",
        textAlign: "center",
        display: "block",
        margin: "0 auto",
        padding: "8px 0",
      };
    default:
      return {};
  }
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
  padding: ${EDITOR_CONSTANTS.contentPadding};
  overflow-y: auto;
  display: flex;
  justify-content: center;
  background: ${EDITOR_CONSTANTS.backgroundColor};
`;

const EditorWrapper = styled.div<{ $deviceMode: DeviceMode }>`
  width: 100%;
  max-width: ${({ $deviceMode }) =>
    $deviceMode === "desktop"
      ? EDITOR_CONSTANTS.maxWidth
      : EDITOR_CONSTANTS.mobileWidth};
  display: flex;
  flex-direction: column;
`;

const Canvas = styled.div<{ $isOver?: boolean }>`
  width: 100%;
  min-height: calc(
    100vh - ${EDITOR_CONSTANTS.toolbarHeight} -
      ${EDITOR_CONSTANTS.contentPadding} * 2
  );
  background: ${({ $isOver }) => ($isOver ? "#f0f7ff" : "white")};
  border-radius: ${EDITOR_CONSTANTS.borderRadius};
  padding: ${EDITOR_CONSTANTS.contentPadding};
  transition: background-color 0.2s;
  border: 1px solid ${EDITOR_CONSTANTS.borderColor};
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;

const TabContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export default TemplateEditor;
