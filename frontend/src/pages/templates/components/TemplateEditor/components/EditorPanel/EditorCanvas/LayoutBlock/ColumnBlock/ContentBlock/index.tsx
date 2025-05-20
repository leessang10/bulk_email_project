import { useAtom } from "jotai";
import { useDrag } from "react-dnd";
import styled from "styled-components";
import { updateComponentBlockAtom } from "../../../../../../atoms/componentBlock";
import type {
  ButtonBlock,
  ComponentBlock,
  TextBlock,
} from "../../../../../../types";

const BlockContainer = styled.div<{ $isSelected?: boolean }>`
  position: relative;
  cursor: move;
  user-select: none;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  ${(props) =>
    props.$isSelected &&
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

const ContentWrapper = styled.div<{ align?: "left" | "center" | "right" }>`
  width: 100%;
  display: flex;
  justify-content: ${(props) => {
    switch (props.align) {
      case "left":
        return "flex-start";
      case "right":
        return "flex-end";
      default:
        return "center";
    }
  }};
`;

const TextContent = styled.div<{ style?: TextBlock["style"] }>`
  width: 100%;
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
  border-radius: 4px;
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
  block: ComponentBlock,
  onContentChange: (content: string) => void
) => {
  switch (block.type) {
    case "text": {
      return (
        <TextContent
          style={block.style}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => {
            const content = e.currentTarget.textContent || "";
            onContentChange(content);
          }}
        >
          {block.content}
        </TextContent>
      );
    }
    case "button": {
      return (
        <ContentWrapper align={block.style?.align}>
          <ButtonContent style={block.style}>
            {block.label || "버튼"}
          </ButtonContent>
        </ContentWrapper>
      );
    }
    case "image": {
      return (
        <ContentWrapper align={block.align}>
          <ImageContent
            src={block.src}
            alt={block.alt || ""}
            width={block.width}
            onError={(e) => {
              e.currentTarget.src = "";
            }}
          />
        </ContentWrapper>
      );
    }
    default:
      return null;
  }
};

interface ContentBlockProps {
  block: ComponentBlock;
  isSelected: boolean;
  onSelect: (blockId: string) => void;
  layoutId: string;
  columnId: string;
}

const ContentBlock: React.FC<ContentBlockProps> = ({
  block,
  isSelected,
  onSelect,
  layoutId,
  columnId,
}) => {
  const [, updateBlockContent] = useAtom(updateComponentBlockAtom);

  const handleContentChange = (content: string) => {
    if (block.type === "text") {
      updateBlockContent({
        blockId: block.id,
        updates: { content },
      });
    }
  };

  const [{ isDragging }, drag] = useDrag({
    type: "component-block",
    item: {
      type: "component-block",
      id: block.id,
      sourceLayoutId: layoutId,
      sourceColumnId: columnId,
      componentBlock: block,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <BlockContainer
      ref={drag}
      $isSelected={isSelected}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(block.id);
      }}
    >
      {renderBlock(block, handleContentChange)}
    </BlockContainer>
  );
};

export default ContentBlock;
