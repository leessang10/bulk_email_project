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
  width: 250px;
  border-right: 1px solid #e0e0e0;
  background: white;
  display: flex;
  flex-direction: column;
`;

const PanelTitle = styled.h2`
  padding: 16px;
  margin: 0;
  font-size: 16px;
  border-bottom: 1px solid #e0e0e0;
`;

const TabContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export default LeftPanel;
