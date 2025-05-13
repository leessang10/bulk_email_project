import { useDrag } from "react-dnd";
import styled from "styled-components";
import type { LayoutType } from "../../types/editor";

const LAYOUT_ITEMS: { type: LayoutType; label: string }[] = [
  { type: "1-column", label: "1열 레이아웃" },
  { type: "2-column", label: "2열 레이아웃" },
  { type: "3-column", label: "3열 레이아웃" },
  { type: "4-column", label: "4열 레이아웃" },
  { type: "footer", label: "푸터" },
];

interface DragItem {
  type: "layout";
  layoutType: LayoutType;
}

const LayoutPanel = () => {
  return (
    <Container>
      <Title>레이아웃</Title>
      <LayoutList>
        {LAYOUT_ITEMS.map((item) => (
          <DraggableLayoutItem
            key={item.type}
            type={item.type}
            label={item.label}
          />
        ))}
      </LayoutList>
    </Container>
  );
};

const DraggableLayoutItem = ({
  type,
  label,
}: {
  type: LayoutType;
  label: string;
}) => {
  const [{ isDragging }, drag] = useDrag<
    DragItem,
    void,
    { isDragging: boolean }
  >(() => ({
    type: "layout",
    item: { type: "layout", layoutType: type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <LayoutItem ref={drag} $isDragging={isDragging}>
      {label}
    </LayoutItem>
  );
};

const Container = styled.div`
  background: #f5f5f5;
  padding: 0.75rem;
  border-right: 0.0625rem solid #e0e0e0;
`;

const Title = styled.h2`
  font-size: 1rem;
  margin-bottom: 0.75rem;
`;

const LayoutList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const LayoutItem = styled.div<{ $isDragging: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: white;
  border: 0.0625rem solid #e0e0e0;
  border-radius: 0.25rem;
  cursor: move;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};

  &:hover {
    background: #f8f8f8;
  }
`;

export default LayoutPanel;
