import { useDrag } from "react-dnd";
import styled from "styled-components";
import type { LayoutType } from "../../types/editor";

const LAYOUT_ITEMS: { type: LayoutType; label: string; icon: string }[] = [
  { type: "1-column", label: "1열", icon: "❘" },
  { type: "2-column", label: "2열", icon: "❘❘" },
  { type: "3-column", label: "3열", icon: "❘❘❘" },
  { type: "4-column", label: "4열", icon: "❘❘❘❘" },
  { type: "footer", label: "푸터", icon: "⚊" },
];

interface DragItem {
  type: "layout";
  layoutType: LayoutType;
}

const LayoutPanel = () => {
  return (
    <Container>
      <LayoutList>
        {LAYOUT_ITEMS.map((item) => (
          <DraggableLayoutItem
            key={item.type}
            type={item.type}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </LayoutList>
    </Container>
  );
};

interface DraggableLayoutItemProps {
  type: LayoutType;
  label: string;
  icon: string;
}

const DraggableLayoutItem = ({
  type,
  label,
  icon,
}: DraggableLayoutItemProps) => {
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
      <LayoutIcon>{icon}</LayoutIcon>
      <LayoutLabel>{label}</LayoutLabel>
    </LayoutItem>
  );
};

const Container = styled.div`
  padding: 0.5rem;
`;

const LayoutList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const LayoutItem = styled.div<{ $isDragging: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: white;
  border: 0.0625rem solid #e0e0e0;
  border-radius: 0.25rem;
  cursor: move;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};
  font-size: 0.875rem;
  transition: all 0.2s;

  &:hover {
    background: #f8f8f8;
    border-color: #1a73e8;
  }
`;

const LayoutIcon = styled.span`
  font-size: 1rem;
  color: #666;
  line-height: 1;
`;

const LayoutLabel = styled.span`
  color: #333;
`;

export default LayoutPanel;
