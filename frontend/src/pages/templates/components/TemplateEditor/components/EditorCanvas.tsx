import { useAtom } from "jotai";
import { nanoid } from "nanoid";
import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";
import AddLayoutButton from "./AddLayoutButton";
import { editorTreeAtom, selectedBlockIdAtom } from "./atoms";
import FloatingMenu from "./FloatingMenu";
import type {
  Block,
  ButtonBlock,
  EditorTree,
  ImageBlock,
  LayoutBlock,
  TextBlock,
} from "./types";

const Container = styled.div`
  min-height: 80%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const LayoutContainer = styled.div`
  margin-bottom: 20px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
`;

const LayoutGrid = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  gap: 1px;
  background: #e0e0e0;
`;

const StyledColumn = styled.div<{ isOver?: boolean }>`
  min-height: 100px;
  background: white;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;

  ${(props) =>
    props.isOver &&
    `
    background: #f8f9fa;
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 2px dashed #007bff;
      pointer-events: none;
    }
  `}
`;

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

const EmptyColumnMessage = styled.div`
  color: #666;
  text-align: center;
  padding: 20px;
  border: 2px dashed #e0e0e0;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #f8f9fa;
    border-color: #007bff;
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

const updateBlockContent = (blockId: string, updates: Partial<Block>) => {
  const [, setTree] = useAtom(editorTreeAtom);
  setTree((prev: EditorTree) => {
    const block = prev.blocks[blockId];
    const updatedBlock = { ...block, ...updates } as Block;
    return {
      ...prev,
      blocks: {
        ...prev.blocks,
        [blockId]: updatedBlock,
      },
    };
  });
};

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
            updateBlockContent(block.id, { content } as Partial<TextBlock>);
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
      return (
        <ImageContent
          src={block.src}
          alt={block.alt || ""}
          width={block.width}
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

const DraggableBlock: React.FC<{
  block: Block;
  isSelected: boolean;
  onSelect: (blockId: string) => void;
}> = ({ block, isSelected, onSelect }) => {
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

interface FloatingMenuState {
  type: "layout" | "block";
  x: number;
  y: number;
  columnPath?: { layoutId: string; columnIndex: number };
}

const createBlock = (type: string, id: string, parentId: string): Block => {
  switch (type) {
    case "text":
      return {
        id,
        type: "text",
        parentId,
        content: "텍스트를 입력하세요",
        style: {},
      } as TextBlock;
    case "button":
      return {
        id,
        type: "button",
        parentId,
        label: "버튼",
        url: "#",
        style: {},
      } as ButtonBlock;
    case "image":
      return {
        id,
        type: "image",
        parentId,
        src: "https://via.placeholder.com/300x200",
        alt: "이미지",
      } as ImageBlock;
    default:
      throw new Error(`Unknown block type: ${type}`);
  }
};

interface DragItem {
  type: "block";
  id: string;
}

const EditorCanvas = () => {
  const [tree, setTree] = useAtom(editorTreeAtom);
  const [selectedBlockId, setSelectedBlockId] = useAtom(selectedBlockIdAtom);
  const [menuState, setMenuState] = useState<FloatingMenuState | null>(null);

  // 캔버스 영역 클릭 시 선택 해제
  const handleCanvasClick = () => {
    setSelectedBlockId(null);
  };

  const handleAddBlockClick = (
    e: React.MouseEvent,
    layoutId: string,
    columnIndex: number
  ) => {
    e.stopPropagation();
    setMenuState({
      type: "block",
      x: e.clientX,
      y: e.clientY,
      columnPath: { layoutId, columnIndex },
    });
  };

  const handleMenuSelect = (option: { type: string; value: string }) => {
    if (menuState?.columnPath) {
      const { layoutId, columnIndex } = menuState.columnPath;
      const newBlockId = nanoid();
      const layout = tree.blocks[layoutId] as LayoutBlock;

      setTree((prev: EditorTree) => ({
        ...prev,
        blocks: {
          ...prev.blocks,
          [newBlockId]: createBlock(option.value, newBlockId, layoutId),
          [layoutId]: {
            ...layout,
            children: [
              ...layout.children,
              { blockId: newBlockId, columnIndex },
            ],
          },
        },
      }));
      setSelectedBlockId(newBlockId);
    }
    setMenuState(null);
  };

  const handleMenuClose = () => {
    setMenuState(null);
  };

  return (
    <Container onClick={handleCanvasClick}>
      {tree.rootIds.map((id) => {
        const block = tree.blocks[id];
        if (block.type === "layout") {
          return (
            <LayoutBlock
              key={block.id}
              block={block as LayoutBlock}
              onAddBlock={handleAddBlockClick}
              selectedBlockId={selectedBlockId}
              onSelectBlock={setSelectedBlockId}
            />
          );
        }
        return null;
      })}
      <AddLayoutButton />
      {menuState && (
        <FloatingMenu
          type={menuState.type}
          x={menuState.x}
          y={menuState.y}
          onSelect={handleMenuSelect}
          onClose={handleMenuClose}
        />
      )}
    </Container>
  );
};

interface LayoutBlockProps {
  block: LayoutBlock;
  onAddBlock: (
    e: React.MouseEvent,
    layoutId: string,
    columnIndex: number
  ) => void;
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
}

interface EditorColumnProps {
  layoutId: string;
  columnIndex: number;
  blocks: Block[];
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  onAddBlock: (
    e: React.MouseEvent,
    layoutId: string,
    columnIndex: number
  ) => void;
}

const EditorColumn: React.FC<EditorColumnProps> = ({
  layoutId,
  columnIndex,
  blocks,
  selectedBlockId,
  onSelectBlock,
  onAddBlock,
}) => {
  const [tree, setTree] = useAtom(editorTreeAtom);
  const [{ isOver }, drop] = useDrop({
    accept: "block",
    drop: (item: DragItem) => {
      const draggedBlock = tree.blocks[item.id];

      if (draggedBlock) {
        setTree((prev: EditorTree) => {
          // 이전 위치에서 제거
          const oldLayout = Object.values(prev.blocks).find(
            (b): b is LayoutBlock =>
              b.type === "layout" &&
              b.children.some((child) => child.blockId === item.id)
          );

          if (oldLayout) {
            const updatedOldLayout: LayoutBlock = {
              ...oldLayout,
              children: oldLayout.children.filter(
                (child) => child.blockId !== item.id
              ),
            };

            // 새 위치에 추가
            const targetLayout = prev.blocks[layoutId] as LayoutBlock;
            const updatedNewLayout: LayoutBlock = {
              ...targetLayout,
              children: [
                ...targetLayout.children,
                { blockId: item.id, columnIndex },
              ],
            };

            return {
              ...prev,
              blocks: {
                ...prev.blocks,
                [oldLayout.id]: updatedOldLayout,
                [layoutId]: updatedNewLayout,
              },
            };
          }

          return prev;
        });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <StyledColumn ref={drop} isOver={isOver}>
      {blocks.length > 0 ? (
        blocks.map((block) => (
          <DraggableBlock
            key={block.id}
            block={block}
            isSelected={block.id === selectedBlockId}
            onSelect={onSelectBlock}
          />
        ))
      ) : (
        <EmptyColumnMessage
          onClick={(e) => onAddBlock(e, layoutId, columnIndex)}
        >
          + 블록 추가
        </EmptyColumnMessage>
      )}
    </StyledColumn>
  );
};

const LayoutBlock: React.FC<LayoutBlockProps> = ({
  block,
  onAddBlock,
  selectedBlockId,
  onSelectBlock,
}) => {
  const [tree] = useAtom(editorTreeAtom);

  return (
    <LayoutContainer>
      <LayoutGrid columns={block.columns}>
        {Array.from({ length: block.columns }).map((_, columnIndex) => {
          const columnBlocks = block.children
            .filter((child) => child.columnIndex === columnIndex)
            .map((child) => tree.blocks[child.blockId]);

          return (
            <EditorColumn
              key={columnIndex}
              layoutId={block.id}
              columnIndex={columnIndex}
              blocks={columnBlocks}
              selectedBlockId={selectedBlockId}
              onSelectBlock={onSelectBlock}
              onAddBlock={onAddBlock}
            />
          );
        })}
      </LayoutGrid>
    </LayoutContainer>
  );
};

export default EditorCanvas;
