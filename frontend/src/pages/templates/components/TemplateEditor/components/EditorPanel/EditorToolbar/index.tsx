import { useAtom } from "jotai";
import styled from "styled-components";
import { selectedBlockAtom } from "../../../atoms";
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
  const [selectedBlock] = useAtom(selectedBlockAtom);

  return (
    <Container>
      <TextTools />
      {selectedBlock && (
        <>
          {selectedBlock.type === "button" && <ButtonTools />}
          {selectedBlock.type === "image" && <ImageTools />}
        </>
      )}
    </Container>
  );
};

export default EditorToolbar;
