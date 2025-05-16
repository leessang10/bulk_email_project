import { Provider } from "jotai";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import EditorCanvas from "./components/EditorCanvas";
import PreviewPanel from "./components/PreviewPanel";
const TemplateEditor = () => {
  return (
    <Provider>
      <DndProvider backend={HTML5Backend}>
        <Container>
          <EditorCanvas />
          <PreviewPanel />
        </Container>
      </DndProvider>
    </Provider>
  );
};

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #fff;
  overflow: hidden;
`;

export default TemplateEditor;
