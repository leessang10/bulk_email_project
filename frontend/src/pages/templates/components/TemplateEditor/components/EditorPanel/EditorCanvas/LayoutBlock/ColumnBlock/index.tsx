import { useAtom } from "jotai";
import { useDrop } from "react-dnd";
import styled from "styled-components";
import { editorStateAtom, selectBlockAtom } from "../../../../../atoms";
import type { ComponentBlock, EditorState } from "../../../../../types";
import ContentBlock from "./ContentBlock";

const Container = styled.div<{ $isOver: boolean }>`
  flex: 1;
  min-height: 100px;
  background: ${(props) => (props.$isOver ? "#f0f0f0" : "white")};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  gap: 12px;
  position: relative;
`;

const EmptyText = styled.div`
  color: #999;
  font-size: 14px;
  text-align: center;
`;

interface ColumnBlockProps {
  layoutId: string;
  columnId: string;
  componentBlock: ComponentBlock | null;
  selectedBlockId: string | null;
  onAddBlock: (e: React.MouseEvent) => void;
}

const ColumnBlock: React.FC<ColumnBlockProps> = ({
  layoutId,
  columnId,
  componentBlock,
  selectedBlockId,
  onAddBlock,
}) => {
  const [, setEditorState] = useAtom(editorStateAtom);
  const [, selectBlock] = useAtom(selectBlockAtom);

  const [{ isOver }, drop] = useDrop({
    accept: "component-block",
    drop: (item: {
      type: string;
      id: string;
      sourceLayoutId: string;
      sourceColumnId: string;
      componentBlock: ComponentBlock;
    }) => {
      if (
        item.sourceLayoutId === layoutId &&
        item.sourceColumnId === columnId
      ) {
        return;
      }

      setEditorState((prev: EditorState) => {
        // 이전 위치의 컴포넌트 블록을 제거
        const sourceColumnBlock =
          prev.layouts[item.sourceLayoutId].columnBlocks[item.sourceColumnId];
        const updatedSourceColumn = {
          ...sourceColumnBlock,
          componentBlock: null,
        };

        // 새로운 위치에 컴포넌트 블록을 추가
        const targetColumnBlock = prev.layouts[layoutId].columnBlocks[columnId];
        const updatedTargetColumn = {
          ...targetColumnBlock,
          componentBlock: item.componentBlock,
        };

        return {
          ...prev,
          layouts: {
            ...prev.layouts,
            [item.sourceLayoutId]: {
              ...prev.layouts[item.sourceLayoutId],
              columnBlocks: {
                ...prev.layouts[item.sourceLayoutId].columnBlocks,
                [item.sourceColumnId]: updatedSourceColumn,
              },
            },
            [layoutId]: {
              ...prev.layouts[layoutId],
              columnBlocks: {
                ...prev.layouts[layoutId].columnBlocks,
                [columnId]: updatedTargetColumn,
              },
            },
          },
        };
      });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleSelectBlock = (blockId: string) => {
    console.log("Selecting block with context:", {
      blockId,
      layoutId,
      columnId,
    });
    selectBlock({ blockId, layoutId, columnId });
  };

  return (
    <Container ref={drop} $isOver={isOver} onClick={onAddBlock}>
      {componentBlock ? (
        <ContentBlock
          block={componentBlock}
          isSelected={selectedBlockId === componentBlock.id}
          onSelect={handleSelectBlock}
          layoutId={layoutId}
          columnId={columnId}
        />
      ) : (
        <EmptyText>컴포넌트를 추가하려면 클릭하세요</EmptyText>
      )}
    </Container>
  );
};

export default ColumnBlock;
