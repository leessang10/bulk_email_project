import { Provider as JotaiProvider } from "jotai";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import CenterPanel from "./components/CenterPanel";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";

const TemplateEditor = () => {
  return (
    <JotaiProvider>
      <DndProvider backend={HTML5Backend}>
        <Container>
          <LeftPanel />
          <CenterPanel />
          <RightPanel />
        </Container>
      </DndProvider>
    </JotaiProvider>
  );
};

const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #fff;
`;

export default TemplateEditor;
