import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";
import type { LayoutItem } from "../types/editor";

interface DraggableLayoutBoxProps {
  layout: LayoutItem;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  type: "layoutBox";
  id: string;
  originalIndex: number;
  currentIndex: number;
}

const DraggableLayoutBox = ({
  layout,
  index,
  isSelected,
  onClick,
  onReorder,
}: DraggableLayoutBoxProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag<
    DragItem,
    void,
    { isDragging: boolean }
  >(
    () => ({
      type: "layoutBox",
      item: {
        type: "layoutBox",
        id: layout.id,
        originalIndex: index,
        currentIndex: index,
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [layout.id, index]
  );

  const [, drop] = useDrop<DragItem>(
    () => ({
      accept: "layoutBox",
      hover: (item, monitor) => {
        if (!ref.current) return;

        const dragIndex = item.currentIndex;
        const hoverIndex = index;

        // 자기 자신 위에 드래그하는 경우 무시
        if (dragIndex === hoverIndex) return;

        // 드래그 중인 아이템의 사각형 영역 가져오기
        const hoverBoundingRect = ref.current.getBoundingClientRect();

        // 드래그 중인 아이템의 수직 중앙점 계산
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // 마우스 포인터의 위치 가져오기
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) return;

        // 드래그 중인 아이템과 호버 중인 아이템의 거리 계산
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // 드래그 방향에 따라 순서 변경 여부 결정
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

        onReorder(dragIndex, hoverIndex);
        item.currentIndex = hoverIndex;
      },
    }),
    [index, onReorder]
  );

  drag(drop(ref));

  return (
    <LayoutBox
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      $isSelected={isSelected}
      $isDragging={isDragging}
    >
      <DragHandle>⋮⋮</DragHandle>
      <div>
        {layout.type} 레이아웃
        <LayoutId>({layout.id})</LayoutId>
      </div>
    </LayoutBox>
  );
};

const LayoutBox = styled.div<{ $isSelected: boolean; $isDragging: boolean }>`
  padding: 20px;
  background: white;
  border: 2px solid
    ${({ $isSelected }) => ($isSelected ? "#1a73e8" : "#e0e0e0")};
  border-radius: 4px;
  margin-bottom: 16px;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};
  transition: all 0.2s;
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    border-color: #1a73e8;
  }
`;

const DragHandle = styled.div`
  cursor: move;
  color: #999;
  font-size: 16px;
  user-select: none;
`;

const LayoutId = styled.span`
  color: #999;
  font-size: 12px;
  margin-left: 8px;
`;

export default DraggableLayoutBox;
