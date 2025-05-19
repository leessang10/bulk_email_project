import { Provider } from "jotai";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import EditorPanel from "./components/EditorPanel";
import PreviewPanel from "./components/PreviewPanel";

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #fff;
  overflow: hidden;
`;

const TemplateEditor = () => {
  console.log("TemplateEditor render");

  return (
    <Provider>
      <DndProvider backend={HTML5Backend}>
        <Container>
          <EditorPanel />
          <PreviewPanel />
        </Container>
      </DndProvider>
    </Provider>
  );
};

export default TemplateEditor;
