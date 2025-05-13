import styled from "styled-components";
import ComponentPanel from "./ComponentPanel";
import LayoutPanel from "./LayoutPanel";

const LeftPanel = () => {
  return (
    <Container>
      <PanelTitle>레이아웃 / 컴포넌트</PanelTitle>
      <TabContainer>
        <LayoutPanel />
        <ComponentPanel />
      </TabContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 15rem;
  border-right: 0.0625rem solid #e0e0e0;
  background: white;
  display: flex;
  flex-direction: column;
`;

const PanelTitle = styled.h2`
  padding: 0.75rem;
  margin: 0;
  font-size: 1rem;
  border-bottom: 0.0625rem solid #e0e0e0;
`;

const TabContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export default LeftPanel;
