import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";
import type { LayoutItem, LayoutType } from "../types/editor";

interface EditorPanelProps {
  layouts: LayoutItem[];
  onLayoutAdd: (layoutType: LayoutType) => void;
  onLayoutsReorder: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  type: "layoutBox";
  id: string;
  index: number;
}

const EditorPanel = ({
  layouts,
  onLayoutAdd,
  onLayoutsReorder,
}: EditorPanelProps) => {
  const [, drop] = useDrop(() => ({
    accept: ["layout", "layoutBox"],
    drop: (
      item: { type: string; layoutType?: string; index?: number },
      monitor
    ) => {
      if (item.type === "layout" && item.layoutType) {
        onLayoutAdd(item.layoutType as LayoutType);
      }
    },
  }));

  return (
    <Container ref={drop}>
      <LayoutContainer>
        {layouts.map((layout, index) => (
          <DraggableLayoutBox
            key={layout.id}
            id={layout.id}
            index={index}
            type={layout.type}
            onReorder={onLayoutsReorder}
          />
        ))}
      </LayoutContainer>
      {layouts.length === 0 && (
        <EmptyMessage>레이아웃을 이곳에 드래그하여 추가하세요</EmptyMessage>
      )}
    </Container>
  );
};

interface DraggableLayoutBoxProps {
  id: string;
  index: number;
  type: string;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
}

const DraggableLayoutBox = ({
  id,
  index,
  type,
  onReorder,
}: DraggableLayoutBoxProps) => {
  const [{ isDragging }, drag] = useDrag<
    DragItem,
    void,
    { isDragging: boolean }
  >(() => ({
    type: "layoutBox",
    item: { type: "layoutBox", id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop<DragItem>(() => ({
    accept: "layoutBox",
    hover: (item, monitor) => {
      if (!monitor.isOver({ shallow: true })) return;
      if (item.index === index) return;

      onReorder(item.index, index);
      item.index = index;
    },
  }));

  return (
    <LayoutBox ref={(node) => drag(drop(node))} isDragging={isDragging}>
      {type} 레이아웃
    </LayoutBox>
  );
};

const Container = styled.div`
  flex: 1;
  background: white;
  padding: 20px;
  min-height: 100vh;
  position: relative;
`;

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LayoutBox = styled.div<{ isDragging: boolean }>`
  padding: 20px;
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: move;
  opacity: ${({ isDragging }) => (isDragging ? 0.5 : 1)};
`;

const EmptyMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #999;
  font-size: 16px;
`;

export default EditorPanel;
