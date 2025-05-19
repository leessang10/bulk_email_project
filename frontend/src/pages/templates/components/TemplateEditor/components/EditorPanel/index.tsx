import { useAtom } from "jotai";
import styled from "styled-components";
import { selectedComponentBlockIdAtom } from "../../atoms";
import EditorCanvas from "./EditorCanvas";
import EditorToolbar from "./EditorToolbar";

const Container = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  border-left: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
  position: relative;
`;

const ScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const EditorPanel = () => {
  const [selectedBlockId] = useAtom(selectedComponentBlockIdAtom);

  console.log("EditorPanel render:", { selectedBlockId });

  return (
    <Container>
      <EditorToolbar />
      <ScrollContainer>
        <EditorCanvas />
      </ScrollContainer>
    </Container>
  );
};

export default EditorPanel;
