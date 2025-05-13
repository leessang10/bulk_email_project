import { Provider } from "jotai";
import styled from "styled-components";
import CenterPanel from "./components/CenterPanel";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";

const TemplateEditor = () => {
  return (
    <Provider>
      <Container>
        <LeftPanel />
        <CenterPanel />
        <RightPanel />
      </Container>
    </Provider>
  );
};

const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #fff;
`;

export default TemplateEditor;
