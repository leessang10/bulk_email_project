import React from "react";
import { useDrag } from "react-dnd";
import styled from "styled-components";

const ItemContainer = styled.div<{ $isDragging?: boolean }>`
  padding: 12px;
  margin-bottom: 8px;
  background: ${({ $isDragging }) => ($isDragging ? "#e3f2fd" : "#fff")};
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: move;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};

  &:hover {
    background: #f5f5f5;
  }
`;

export interface DraggableItemProps {
  type: "component" | "layout";
  id: string;
  label: string;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ type, id, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { type, id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <ItemContainer ref={drag} $isDragging={isDragging}>
      {label}
    </ItemContainer>
  );
};

export default DraggableItem;
