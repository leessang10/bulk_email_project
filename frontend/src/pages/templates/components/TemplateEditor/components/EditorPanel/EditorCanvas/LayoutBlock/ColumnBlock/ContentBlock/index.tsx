import { useAtom } from "jotai";
import { useDrag } from "react-dnd";
import styled from "styled-components";
import { editorStateAtom } from "../../../../../../atoms";
import type {
  ButtonBlock,
  ComponentBlock,
  ImageBlock,
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
  isSelected: boolean,
  onSelect: (blockId: string) => void,
  onContentChange: (content: string) => void,
  layoutId: string,
  columnId: string
) => {
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(block.id);
  };

  switch (block.type) {
    case "text": {
      const textBlock = block as TextBlock;
      return (
        <TextContent
          style={textBlock.style}
          contentEditable
          suppressContentEditableWarning
          onClick={handleContentClick}
          onInput={(e) => {
            const content = e.currentTarget.textContent || "";
            onContentChange(content);
          }}
        >
          {textBlock.content}
        </TextContent>
      );
    }
    case "button": {
      const buttonBlock = block as ButtonBlock;
      return (
        <ContentWrapper align={buttonBlock.style?.align}>
          <ButtonContent style={buttonBlock.style} onClick={handleContentClick}>
            {buttonBlock.label || "버튼"}
          </ButtonContent>
        </ContentWrapper>
      );
    }
    case "image": {
      const imageBlock = block as ImageBlock;
      return (
        <ContentWrapper align={imageBlock.align}>
          <ImageContent
            src={imageBlock.src}
            alt={imageBlock.alt || ""}
            width={imageBlock.width}
            onClick={handleContentClick}
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
  const [, setEditorState] = useAtom(editorStateAtom);

  const handleContentChange = (content: string) => {
    if (block.type === "text") {
      setEditorState((prev) => ({
        ...prev,
        layouts: {
          ...prev.layouts,
          [layoutId]: {
            ...prev.layouts[layoutId],
            columnBlocks: {
              ...prev.layouts[layoutId].columnBlocks,
              [columnId]: {
                ...prev.layouts[layoutId].columnBlocks[columnId],
                componentBlock: {
                  ...block,
                  content,
                },
              },
            },
          },
        },
      }));
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
      {renderBlock(
        block,
        isSelected,
        onSelect,
        handleContentChange,
        layoutId,
        columnId
      )}
    </BlockContainer>
  );
};

export default ContentBlock;
