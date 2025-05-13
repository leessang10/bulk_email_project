import { useDrag } from "react-dnd";
import styled from "styled-components";
import type { ComponentType } from "../../types/editor";

const COMPONENT_ITEMS: { type: ComponentType; label: string; icon: string }[] =
  [
    { type: "text", label: "텍스트", icon: "📝" },
    { type: "image", label: "이미지", icon: "🖼️" },
    { type: "button", label: "버튼", icon: "🔲" },
    { type: "link", label: "링크", icon: "🔗" },
  ];

interface DragItem {
  type: "component";
  componentType: ComponentType;
}

const ComponentPanel = () => {
  return (
    <Container>
      <Title>컴포넌트</Title>
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
      {label}
    </ComponentItem>
  );
};

const Container = styled.div`
  background: #f5f5f5;
  padding: 16px;
  border-right: 1px solid #e0e0e0;
`;

const Title = styled.h2`
  font-size: 18px;
  margin-bottom: 16px;
`;

const ComponentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ComponentItem = styled.div<{ $isDragging: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: move;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};

  &:hover {
    background: #f8f8f8;
  }
`;

const ComponentIcon = styled.span`
  font-size: 20px;
`;

export default ComponentPanel;
