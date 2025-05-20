import { useAtom } from "jotai";
import { useMemo } from "react";
import styled from "styled-components";
import { editorStateAtom } from "../../../../atoms/editor";
import ColumnBlock from "./ColumnBlock";

interface LayoutBlockProps {
  layoutId: string;
}

const Container = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Grid = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  gap: 16px;
  padding: 16px;
`;

const LayoutBlock: React.FC<LayoutBlockProps> = ({ layoutId }) => {
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
          />
        ))}
      </Grid>
    </Container>
  );
};

export default LayoutBlock;
