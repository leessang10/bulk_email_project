import { useAtom } from "jotai";
import { useCallback } from "react";
import styled from "styled-components";
import { editorStateAtom } from "../../../atoms/editor";
import { selectedComponentBlockIdAtom } from "../../../atoms/selection";
import AddLayoutButton from "./AddLayoutButton";
import LayoutBlock from "./LayoutBlock";

const Container = styled.div`
  min-height: 80%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const EditorCanvas = () => {
  const [editorState] = useAtom(editorStateAtom);
  const [, setSelectedBlockId] = useAtom(
    selectedComponentBlockIdAtom
  );


  // 캔버스 영역 클릭 시 선택 해제
  const handleCanvasClick = useCallback(() => {
    setSelectedBlockId(null);
  }, [setSelectedBlockId]);

  return (
    <Container onClick={handleCanvasClick}>
      {Object.entries(editorState.layouts)
        .sort(([, a], [, b]) => a.order - b.order)
        .map(([layoutId]) => (
          <LayoutBlock
            key={layoutId}
            layoutId={layoutId}
          />
        ))}
      <AddLayoutButton />
    </Container>
  );
};

export default EditorCanvas;
