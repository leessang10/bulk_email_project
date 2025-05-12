import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";
import {
  DEFAULT_COMPONENT_PROPERTIES,
  DEFAULT_LAYOUT_PROPERTIES,
} from "../constants/defaultProperties";
import type { ComponentType, LayoutItem } from "../types/editor";
import { LAYOUT_STYLES } from "../types/editor";

interface DraggableLayoutBoxProps {
  layout: LayoutItem;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  onAddComponent: (layoutId: string, componentType: ComponentType) => void;
  onSelectComponent: (componentId: string) => void;
  selectedComponentId: string | null;
  onUpdateProperties: (properties: Record<string, any>) => void;
  onUpdateContent: (content: string) => void;
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
  onSelectComponent,
  selectedComponentId,
  onUpdateProperties,
  onUpdateContent,
}: DraggableLayoutBoxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const layoutStyle = LAYOUT_STYLES[layout.type];

  const [{ isDragging }, drag] = useDrag({
    type: "layoutBox",
    item: { type: "layoutBox", index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ["component", "layoutBox"],
    hover: (item: { type: string; index?: number }, monitor) => {
      if (!ref.current) return;

      if (item.type === "layoutBox" && typeof item.index === "number") {
        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) return;

        onReorder(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
    },
    drop: (item: { type: string; componentType?: ComponentType }, monitor) => {
      if (
        !monitor.didDrop() &&
        item.type === "component" &&
        item.componentType
      ) {
        onAddComponent(layout.id, item.componentType);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  drag(drop(ref));

  return (
    <LayoutBox
      ref={ref}
      onClick={onClick}
      $isSelected={isSelected}
      $isDragging={isDragging}
      $isOver={isOver && layout.children.length < layoutStyle.maxComponents}
      style={{
        paddingLeft: DEFAULT_LAYOUT_PROPERTIES.paddingX,
        paddingRight: DEFAULT_LAYOUT_PROPERTIES.paddingX,
        paddingTop: DEFAULT_LAYOUT_PROPERTIES.paddingY,
        paddingBottom: DEFAULT_LAYOUT_PROPERTIES.paddingY,
        backgroundColor: DEFAULT_LAYOUT_PROPERTIES.backgroundColor,
        borderRadius: DEFAULT_LAYOUT_PROPERTIES.borderRadius,
      }}
    >
      <Content
        $columns={layoutStyle.template}
        style={{
          alignItems: DEFAULT_LAYOUT_PROPERTIES.verticalAlign,
          justifyContent: DEFAULT_LAYOUT_PROPERTIES.align,
        }}
      >
        {layout.children.map((component) => (
          <ComponentBox
            key={component.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectComponent(component.id);
            }}
            $isSelected={selectedComponentId === component.id}
          >
            {component.type === "text" && (
              <div
                style={{
                  ...DEFAULT_COMPONENT_PROPERTIES.text.properties,
                  color:
                    component.properties.color ||
                    DEFAULT_COMPONENT_PROPERTIES.text.properties.color,
                  fontSize:
                    component.properties.fontSize ||
                    DEFAULT_COMPONENT_PROPERTIES.text.properties.fontSize,
                  textAlign:
                    component.properties.textAlign ||
                    DEFAULT_COMPONENT_PROPERTIES.text.properties.textAlign,
                }}
              >
                {component.content}
              </div>
            )}
            {component.type === "image" && (
              <img
                src={
                  component.properties.src ||
                  DEFAULT_COMPONENT_PROPERTIES.image.properties.src
                }
                alt={
                  component.properties.alt ||
                  DEFAULT_COMPONENT_PROPERTIES.image.properties.alt
                }
                style={{
                  width:
                    component.properties.width ||
                    DEFAULT_COMPONENT_PROPERTIES.image.properties.width,
                  paddingLeft:
                    component.properties.paddingX ||
                    DEFAULT_COMPONENT_PROPERTIES.image.properties.paddingX,
                  paddingRight:
                    component.properties.paddingX ||
                    DEFAULT_COMPONENT_PROPERTIES.image.properties.paddingX,
                  paddingTop:
                    component.properties.paddingY ||
                    DEFAULT_COMPONENT_PROPERTIES.image.properties.paddingY,
                  paddingBottom:
                    component.properties.paddingY ||
                    DEFAULT_COMPONENT_PROPERTIES.image.properties.paddingY,
                  borderRadius:
                    component.properties.borderRadius ||
                    DEFAULT_COMPONENT_PROPERTIES.image.properties.borderRadius,
                }}
              />
            )}
            {component.type === "button" && (
              <button
                style={{
                  ...DEFAULT_COMPONENT_PROPERTIES.button.properties,
                  backgroundColor:
                    component.properties.backgroundColor ||
                    DEFAULT_COMPONENT_PROPERTIES.button.properties
                      .backgroundColor,
                  color:
                    component.properties.color ||
                    DEFAULT_COMPONENT_PROPERTIES.button.properties.color,
                  paddingLeft:
                    component.properties.paddingX ||
                    DEFAULT_COMPONENT_PROPERTIES.button.properties.paddingX,
                  paddingRight:
                    component.properties.paddingX ||
                    DEFAULT_COMPONENT_PROPERTIES.button.properties.paddingX,
                  paddingTop:
                    component.properties.paddingY ||
                    DEFAULT_COMPONENT_PROPERTIES.button.properties.paddingY,
                  paddingBottom:
                    component.properties.paddingY ||
                    DEFAULT_COMPONENT_PROPERTIES.button.properties.paddingY,
                  borderRadius:
                    component.properties.borderRadius ||
                    DEFAULT_COMPONENT_PROPERTIES.button.properties.borderRadius,
                }}
              >
                {component.content}
              </button>
            )}
            {component.type === "link" && (
              <a
                href={
                  component.properties.href ||
                  DEFAULT_COMPONENT_PROPERTIES.link.properties.href
                }
                style={{
                  ...DEFAULT_COMPONENT_PROPERTIES.link.properties,
                  color:
                    component.properties.color ||
                    DEFAULT_COMPONENT_PROPERTIES.link.properties.color,
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
  min-height: 100px;
`;

const ComponentBox = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  border: 2px solid
    ${({ $isSelected }) => ($isSelected ? "#1a73e8" : "transparent")};
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    border-color: #1a73e8;
    background: #f8f9fa;
  }
`;

const EmptyContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 32px;
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
