import { useAtom } from "jotai";
import { useDrop } from "react-dnd";
import styled from "styled-components";
import { editorTreeAtom } from "../../../atoms";
import type { Block, LayoutBlock as LayoutBlockType } from "../../../types";
import DraggableBlock from "./DraggableBlock";

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

interface DragItem {
  type: "block";
  id: string;
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
        setTree((prev) => {
          // 이전 위치에서 제거
          const oldLayout = Object.values(prev.blocks).find(
            (b): b is LayoutBlockType =>
              b.type === "layout" &&
              b.children.some((child) => child.blockId === item.id)
          );

          if (oldLayout) {
            const updatedOldLayout: LayoutBlockType = {
              ...oldLayout,
              children: oldLayout.children.filter(
                (child) => child.blockId !== item.id
              ),
            };

            // 새 위치에 추가
            const targetLayout = prev.blocks[layoutId] as LayoutBlockType;
            const updatedNewLayout: LayoutBlockType = {
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

interface LayoutBlockProps {
  block: LayoutBlockType;
  onAddBlock: (
    e: React.MouseEvent,
    layoutId: string,
    columnIndex: number
  ) => void;
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
}

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

export default LayoutBlock;
