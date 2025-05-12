import { useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";
import type { ComponentType, LayoutItem } from "../types/editor";
import { LAYOUT_STYLES } from "../types/editor";

interface DraggableLayoutBoxProps {
  layout: LayoutItem;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  onAddComponent: (layoutId: string, componentType: ComponentType) => void;
}

interface DragItem {
  type: "layoutBox" | "component";
  id?: string;
  originalIndex?: number;
  currentIndex?: number;
  componentType?: ComponentType;
}

const DraggableLayoutBox = ({
  layout,
  index,
  isSelected,
  onClick,
  onReorder,
  onAddComponent,
}: DraggableLayoutBoxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const layoutStyle = LAYOUT_STYLES[layout.type];

  // 푸터 레이아웃인 경우 수신거부 버튼 자동 추가 (이미 버튼이 있는 경우 제외)
  useEffect(() => {
    if (
      layoutStyle.isFooter &&
      layout.children.length === 0 &&
      !layout.children.some((child) => child.type === "button")
    ) {
      onAddComponent(layout.id, "button");
    }
  }, [layout.id, layoutStyle.isFooter, layout.children, onAddComponent]);

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

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>(
    () => ({
      accept: ["layoutBox", "component"],
      hover: (item, monitor) => {
        if (item.type === "layoutBox") {
          if (!ref.current) return;

          const dragIndex = item.currentIndex!;
          const hoverIndex = index;

          if (dragIndex === hoverIndex) return;

          const hoverBoundingRect = ref.current.getBoundingClientRect();
          const hoverMiddleY =
            (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
          const clientOffset = monitor.getClientOffset();
          if (!clientOffset) return;

          const hoverClientY = clientOffset.y - hoverBoundingRect.top;

          if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
          if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

          onReorder(dragIndex, hoverIndex);
          item.currentIndex = hoverIndex;
        }
      },
      drop: (item, monitor) => {
        if (item.type === "component" && !monitor.didDrop()) {
          // 컴포넌트 개수 제한 확인
          if (layout.children.length >= layoutStyle.maxComponents) {
            return;
          }
          // 푸터에 이미 버튼이 있는 경우 추가 방지
          if (layoutStyle.isFooter && item.componentType === "button") {
            return;
          }
          onAddComponent(layout.id, item.componentType!);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }),
      }),
    }),
    [
      index,
      onReorder,
      layout.id,
      onAddComponent,
      layout.children.length,
      layoutStyle.maxComponents,
      layoutStyle.isFooter,
    ]
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
      $isOver={isOver && layout.children.length < layoutStyle.maxComponents}
    >
      <Content $columns={layoutStyle.template}>
        {layout.children.map((component) => (
          <ComponentBox key={component.id}>
            {component.type === "text" && <div>{component.content}</div>}
            {component.type === "image" && (
              <img
                src={component.properties.src}
                alt={component.properties.alt}
                style={{
                  width: component.properties.width || "100%",
                  height: component.properties.height || "auto",
                }}
              />
            )}
            {component.type === "button" && (
              <button
                style={{
                  backgroundColor: component.properties.backgroundColor,
                  color: component.properties.color,
                  padding: component.properties.padding,
                  borderRadius: component.properties.borderRadius,
                  width: "100%",
                }}
              >
                {layoutStyle.isFooter ? "수신거부" : component.content}
              </button>
            )}
            {component.type === "link" && (
              <a
                href={component.properties.href}
                style={{
                  color: component.properties.color,
                  textDecoration: "none",
                }}
              >
                {component.content}
              </a>
            )}
          </ComponentBox>
        ))}
        {layout.children.length < layoutStyle.maxComponents &&
          Array.from({
            length: layoutStyle.maxComponents - layout.children.length,
          }).map((_, index) => (
            <EmptyContent key={`empty-${index}`}>+</EmptyContent>
          ))}
      </Content>
    </LayoutBox>
  );
};

const LayoutBox = styled.div<{
  $isSelected: boolean;
  $isDragging: boolean;
  $isOver: boolean;
}>`
  padding: 10px;
  background: white;
  border: 2px solid
    ${({ $isSelected }) => ($isSelected ? "#1a73e8" : "#e0e0e0")};
  border-radius: 4px;
  margin-bottom: 16px;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};
  transition: all 0.2s;
  position: relative;

  ${({ $isOver }) =>
    $isOver &&
    `
    background: #f0f7ff;
  `}

  &:hover {
    border-color: #1a73e8;
  }
`;

const Content = styled.div<{ $columns: string }>`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns};
  gap: 16px;
  padding: 0px;
  background: #f8f8f8;
  border-radius: 4px;
  min-height: 100px;
`;

const ComponentBox = styled.div`
  background: white;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
`;

const EmptyContent = styled.div`
  text-align: center;
  color: #999;
  padding: 20px;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border: 2px dashed #ccc;
  border-radius: 4px;
  min-height: 120px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e8e8e8;
    border-color: #999;
    color: #666;
  }
`;

export default DraggableLayoutBox;
