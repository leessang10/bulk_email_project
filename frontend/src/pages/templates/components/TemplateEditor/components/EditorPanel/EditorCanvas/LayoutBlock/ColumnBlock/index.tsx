import { useAtom } from "jotai";
import React from "react";
import { useDrop } from "react-dnd";
import styled from "styled-components";
import { editorStateAtom, selectBlockAtom } from "../../../../../atoms/editor";
import type { ComponentBlock, EditorState } from "../../../../../types";
import AddComponentButton from "../../AddComponentButton";
import ContentBlock from "./ContentBlock";

interface ColumnBlockProps {
  layoutId: string;
  columnId: string;
  componentBlock: ComponentBlock | null;
  selectedBlockId: string | null;
}

const Container = styled.div<{ $isOver: boolean }>`
  padding: 10px;
  background: ${({ $isOver }) =>
    $isOver ? "rgba(0, 123, 255, 0.04)" : "transparent"};
  border-radius: 4px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
`;

const ColumnBlock: React.FC<ColumnBlockProps> = ({
  layoutId,
  columnId,
  componentBlock,
  selectedBlockId,
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
        const sourceColumnBlock =
          prev.layouts[item.sourceLayoutId].columnBlocks[item.sourceColumnId];
        const targetColumnBlock = prev.layouts[layoutId].columnBlocks[columnId];

        return {
          ...prev,
          layouts: {
            ...prev.layouts,
            [item.sourceLayoutId]: {
              ...prev.layouts[item.sourceLayoutId],
              columnBlocks: {
                ...prev.layouts[item.sourceLayoutId].columnBlocks,
                [item.sourceColumnId]: {
                  ...sourceColumnBlock,
                  componentBlock: null,
                },
              },
            },
            [layoutId]: {
              ...prev.layouts[layoutId],
              columnBlocks: {
                ...prev.layouts[layoutId].columnBlocks,
                [columnId]: {
                  ...targetColumnBlock,
                  componentBlock: item.componentBlock,
                },
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
    selectBlock({ blockId, layoutId, columnId });
  };

  return (
    <Container ref={drop} $isOver={isOver}>
      {componentBlock ? (
        <ContentBlock
          block={componentBlock}
          isSelected={selectedBlockId === componentBlock.id}
          onSelect={handleSelectBlock}
          layoutId={layoutId}
          columnId={columnId}
        />
      ) : (
        <AddComponentButton layoutId={layoutId} columnBlockId={columnId} />
      )}
    </Container>
  );
};

export default ColumnBlock;
