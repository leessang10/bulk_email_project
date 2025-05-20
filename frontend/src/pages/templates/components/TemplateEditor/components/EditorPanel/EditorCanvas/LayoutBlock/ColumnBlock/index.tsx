import { useAtom } from "jotai";
import React from "react";
import { useDrop } from "react-dnd";
import styled from "styled-components";
import { editorStateAtom } from "../../../../../atoms/editor";
import {
  selectBlockAtom,
  selectedComponentBlockIdAtom,
} from "../../../../../atoms/selection";
import type { ComponentBlock, EditorState } from "../../../../../types";
import AddComponentButton from "../../AddComponentButton";
import ContentBlock from "./ContentBlock";

interface ColumnBlockProps {
  layoutId: string;
  columnId: string;
  componentBlock: ComponentBlock | null;
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
}) => {
  const [, setEditorState] = useAtom(editorStateAtom);
  const [selectedBlockId] = useAtom(selectedComponentBlockIdAtom);
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
      if (item.sourceColumnId === columnId) {
        return;
      }

      setEditorState((prev: EditorState) => {
        const sourceColumnBlock =
          prev.layouts[item.sourceLayoutId].columnBlocks[item.sourceColumnId];
        const targetColumnBlock = prev.layouts[layoutId].columnBlocks[columnId];

        const newState = { ...prev };

        newState.layouts[item.sourceLayoutId] = {
          ...prev.layouts[item.sourceLayoutId],
          columnBlocks: {
            ...prev.layouts[item.sourceLayoutId].columnBlocks,
            [item.sourceColumnId]: {
              ...sourceColumnBlock,
              componentBlock: null,
            },
          },
        };

        newState.layouts[layoutId] = {
          ...prev.layouts[layoutId],
          columnBlocks: {
            ...prev.layouts[layoutId].columnBlocks,
            [columnId]: {
              ...targetColumnBlock,
              componentBlock: item.componentBlock,
            },
          },
        };

        return newState;
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
