import { useAtom } from "jotai";
import styled from "styled-components";
import {
  editorStateAtom,
  selectedColumnBlockIdAtom,
  selectedComponentBlockIdAtom,
  selectedLayoutIdAtom,
} from "../../../atoms";
import ButtonTools from "./ButtonTools";
import ImageTools from "./ImageTools";
import TextTools from "./TextTools";

const Container = styled.div`
  width: 100%;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 12px;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const EditorToolbar = () => {
  const [selectedBlockId] = useAtom(selectedComponentBlockIdAtom);
  const [editorState] = useAtom(editorStateAtom);
  const [selectedLayoutId] = useAtom(selectedLayoutIdAtom);
  const [selectedColumnId] = useAtom(selectedColumnBlockIdAtom);

  const selectedBlock =
    selectedLayoutId && selectedColumnId && selectedBlockId
      ? editorState.layouts[selectedLayoutId].columnBlocks[selectedColumnId]
          .componentBlock
      : null;

  console.log("EditorToolbar state:", {
    selectedBlockId,
    selectedLayoutId,
    selectedColumnId,
    selectedBlock,
  });

  return (
    <Container>
      <TextTools />
      {selectedBlock?.type === "button" && <ButtonTools />}
      {selectedBlock?.type === "image" && <ImageTools />}
    </Container>
  );
};

export default EditorToolbar;
