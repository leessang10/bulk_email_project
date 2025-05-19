import { useAtom } from "jotai";
import { useMemo } from "react";
import styled from "styled-components";
import { editorStateAtom } from "../../../../atoms";
import ColumnBlock from "./ColumnBlock";

const Container = styled.div`
  margin-bottom: 20px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
`;

const Grid = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  gap: 1px;
  background: #e0e0e0;
`;

interface LayoutBlockProps {
  layoutId: string;
  selectedBlockId: string | null;
  onAddBlock: (
    e: React.MouseEvent,
    layoutId: string,
    columnBlockId: string
  ) => void;
}

const LayoutBlock: React.FC<LayoutBlockProps> = ({
  layoutId,
  selectedBlockId,
  onAddBlock,
}) => {
  const [editorState] = useAtom(editorStateAtom);

  const layout = editorState.layouts[layoutId];

  // 컬럼 블록을 순서대로 정렬
  const columnBlocks = useMemo(() => {
    return Object.values(layout.columnBlocks)
      .sort((a, b) => a.order - b.order)
      .map((columnBlock) => ({
        columnBlock,
        componentBlock: columnBlock.componentBlock,
      }));
  }, [layout.columnBlocks]);

  return (
    <Container>
      <Grid columns={columnBlocks.length}>
        {columnBlocks.map(({ columnBlock, componentBlock }) => (
          <ColumnBlock
            key={columnBlock.id}
            layoutId={layoutId}
            columnId={columnBlock.id}
            componentBlock={componentBlock}
            selectedBlockId={selectedBlockId}
            onAddBlock={(e) => onAddBlock(e, layoutId, columnBlock.id)}
          />
        ))}
      </Grid>
    </Container>
  );
};

export default LayoutBlock;
