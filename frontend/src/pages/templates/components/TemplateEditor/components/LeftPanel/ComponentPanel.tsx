import { useDrag } from "react-dnd";
import styled from "styled-components";
import type { ComponentType } from "../../types/editor";

const COMPONENT_ITEMS: { type: ComponentType; label: string; icon: string }[] =
  [
    { type: "text", label: "텍스트", icon: "T" },
    { type: "image", label: "이미지", icon: "🖼" },
    { type: "button", label: "버튼", icon: "⬚" },
    { type: "link", label: "링크", icon: "⛓" },
  ];

interface DragItem {
  type: "component";
  componentType: ComponentType;
}

const ComponentPanel = () => {
  return (
    <Container>
      <ComponentList>
        {COMPONENT_ITEMS.map((item) => (
          <DraggableComponentItem
            key={item.type}
            type={item.type}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </ComponentList>
    </Container>
  );
};

interface DraggableComponentItemProps {
  type: ComponentType;
  label: string;
  icon: string;
}

const DraggableComponentItem = ({
  type,
  label,
  icon,
}: DraggableComponentItemProps) => {
  const [{ isDragging }, drag] = useDrag<
    DragItem,
    void,
    { isDragging: boolean }
  >(
    () => ({
      type: "component",
      item: { type: "component", componentType: type },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [type]
  );

  return (
    <ComponentItem ref={drag} $isDragging={isDragging}>
      <ComponentIcon>{icon}</ComponentIcon>
      <ComponentLabel>{label}</ComponentLabel>
    </ComponentItem>
  );
};

const Container = styled.div`
  padding: 0.5rem;
`;

const ComponentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const ComponentItem = styled.div<{ $isDragging: boolean }>`
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

const ComponentIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  font-size: 1rem;
  color: #666;
  line-height: 1;
`;

const ComponentLabel = styled.span`
  color: #333;
`;

export default ComponentPanel;
