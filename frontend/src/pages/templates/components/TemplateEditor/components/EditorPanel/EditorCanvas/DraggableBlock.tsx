import { useDrag } from "react-dnd";
import styled from "styled-components";
import type { Block, ButtonBlock, ImageBlock, TextBlock } from "../../../types";

const BlockContainer = styled.div<{ isSelected?: boolean }>`
  position: relative;
  cursor: move;
  user-select: none;

  ${(props) =>
    props.isSelected &&
    `
    &::after {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border: 2px solid #007bff;
      border-radius: 4px;
      pointer-events: none;
    }
  `}

  &:hover {
    &::before {
      content: "";
      position: absolute;
      top: -1px;
      left: -1px;
      right: -1px;
      bottom: -1px;
      border: 1px solid #007bff;
      border-radius: 4px;
      pointer-events: none;
      opacity: 0.5;
    }
  }
`;

const TextContent = styled.div<{ style?: TextBlock["style"] }>`
  padding: 8px;
  min-height: 24px;
  font-weight: ${(props) => (props.style?.bold ? "bold" : "normal")};
  font-style: ${(props) => (props.style?.italic ? "italic" : "normal")};
  text-decoration: ${(props) =>
    props.style?.underline ? "underline" : "none"};
  font-size: ${(props) => props.style?.fontSize || "inherit"};
  color: ${(props) => props.style?.color || "inherit"};
  text-align: ${(props) => props.style?.textAlign || "left"};
  cursor: text;

  &:empty::before {
    content: "텍스트를 입력하세요";
    color: #999;
  }
`;

const ButtonContent = styled.button<{ style?: ButtonBlock["style"] }>`
  display: inline-block;
  padding: ${(props) => props.style?.padding || "8px 16px"};
  background-color: ${(props) => props.style?.backgroundColor || "#007bff"};
  color: ${(props) => props.style?.color || "#ffffff"};
  border: none;
  border-radius: ${(props) => props.style?.borderRadius || "4px"};
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;
  line-height: 1.5;
  text-align: center;
  width: fit-content;
`;

const ImageContent = styled.img<{ width?: string }>`
  max-width: 100%;
  height: auto;
  width: ${(props) => props.width || "auto"};
  display: block;
`;

const renderBlock = (
  block: Block,
  isSelected: boolean,
  onSelect: (blockId: string) => void
) => {
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(block.id);
  };

  switch (block.type) {
    case "text":
      return (
        <TextContent
          style={block.style}
          contentEditable
          suppressContentEditableWarning
          onClick={handleContentClick}
          onBlur={(e) => {
            const content = e.currentTarget.textContent || "";
            // TODO: 상태 업데이트 로직 추가
          }}
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      );
    case "button":
      return (
        <ButtonContent style={block.style} onClick={handleContentClick}>
          {block.label || "버튼"}
        </ButtonContent>
      );
    case "image":
      const imageBlock = block as ImageBlock;
      return (
        <ImageContent
          src={imageBlock.src}
          alt={imageBlock.alt || ""}
          width={imageBlock.width}
          onClick={handleContentClick}
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/300x200";
          }}
        />
      );
    default:
      return null;
  }
};

interface DraggableBlockProps {
  block: Block;
  isSelected: boolean;
  onSelect: (blockId: string) => void;
}

const DraggableBlock: React.FC<DraggableBlockProps> = ({
  block,
  isSelected,
  onSelect,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "block",
    item: { type: "block", id: block.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <BlockContainer
      ref={drag}
      isSelected={isSelected}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(block.id);
      }}
    >
      {renderBlock(block, isSelected, onSelect)}
    </BlockContainer>
  );
};

export default DraggableBlock;
