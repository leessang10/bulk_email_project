import { useDrop } from "react-dnd";
import styled from "styled-components";
import { EDITOR_CONSTANTS } from "../../constants/styles";
import type { ComponentType, LayoutItem, LayoutType } from "../../types/editor";
import DraggableLayoutBox from "./DraggableLayoutBox";

interface EditorPanelProps {
  layouts: LayoutItem[];
  deviceMode: "desktop" | "mobile";
  selectedItemId: string | null;
  onLayoutAdd: (layoutType: LayoutType) => void;
  onLayoutsReorder: (dragIndex: number, hoverIndex: number) => void;
  onAddComponent: (layoutId: string, componentType: ComponentType) => void;
  onSelectComponent: (componentId: string) => void;
  onUpdateProperties: (
    componentId: string,
    properties: Record<string, any>
  ) => void;
  onUpdateContent: (componentId: string, content: string) => void;
  onSelectLayout: (layoutId: string) => void;
}

const EditorPanel = ({
  layouts,
  deviceMode,
  selectedItemId,
  onLayoutAdd,
  onLayoutsReorder,
  onAddComponent,
  onSelectComponent,
  onUpdateProperties,
  onUpdateContent,
  onSelectLayout,
}: EditorPanelProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["layout", "layoutBox"],
    drop: (item: { type: string; layoutType?: LayoutType }, monitor) => {
      if (!monitor.didDrop()) {
        if (item.type === "layout" && item.layoutType) {
          onLayoutAdd(item.layoutType);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }));

  return (
    <Container>
      <EditorWrapper $deviceMode={deviceMode}>
        <Canvas ref={drop} $isOver={isOver}>
          {layouts.map((layout, index) => (
            <DraggableLayoutBox
              key={layout.id}
              layout={layout}
              index={index}
              isSelected={selectedItemId === layout.id}
              onClick={() => onSelectLayout(layout.id)}
              onReorder={onLayoutsReorder}
              onAddComponent={onAddComponent}
              onSelectComponent={onSelectComponent}
              selectedComponentId={selectedItemId}
              onUpdateProperties={onUpdateProperties}
              onUpdateContent={onUpdateContent}
            />
          ))}
          {layouts.length === 0 && (
            <EmptyMessage>레이아웃을 이곳에 드래그하여 추가하세요</EmptyMessage>
          )}
        </Canvas>
      </EditorWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  background: ${EDITOR_CONSTANTS.backgroundColor};
  padding: ${EDITOR_CONSTANTS.contentPadding};
  overflow: auto;
`;

const EditorWrapper = styled.div<{ $deviceMode: "desktop" | "mobile" }>`
  width: 100%;
  max-width: ${(props) =>
    props.$deviceMode === "desktop"
      ? EDITOR_CONSTANTS.maxWidth
      : EDITOR_CONSTANTS.mobileWidth};
`;

const Canvas = styled.div<{ $isOver: boolean }>`
  min-height: 50rem;
  background: white;
  border-radius: ${EDITOR_CONSTANTS.borderRadius};
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
  padding: ${EDITOR_CONSTANTS.contentPadding};
  border: 0.125rem dashed
    ${(props) => (props.$isOver ? "#2196f3" : "transparent")};
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2.5rem;
  color: #666;
`;

export default EditorPanel;
