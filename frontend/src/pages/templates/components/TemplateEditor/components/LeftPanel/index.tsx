import { useState } from "react";
import styled from "styled-components";
import ComponentPanel from "./ComponentPanel";
import LayoutPanel from "./LayoutPanel";

type TabType = "layout" | "component";

const LeftPanel = () => {
  const [activeTab, setActiveTab] = useState<TabType>("layout");

  return (
    <Container>
      <TabButtons>
        <TabButton
          $active={activeTab === "layout"}
          onClick={() => setActiveTab("layout")}
        >
          레이아웃
        </TabButton>
        <TabButton
          $active={activeTab === "component"}
          onClick={() => setActiveTab("component")}
        >
          컴포넌트
        </TabButton>
      </TabButtons>
      <TabContainer>
        {activeTab === "layout" ? <LayoutPanel /> : <ComponentPanel />}
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

const TabButtons = styled.div`
  display: flex;
  border-bottom: 0.0625rem solid #e0e0e0;
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.5rem;
  font-size: 0.875rem;
  border: none;
  background: ${(props) => (props.$active ? "#f5f5f5" : "white")};
  color: ${(props) => (props.$active ? "#1a73e8" : "#666")};
  font-weight: ${(props) => (props.$active ? "500" : "normal")};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$active ? "#f5f5f5" : "#f8f8f8")};
  }

  &:first-child {
    border-right: 0.0625rem solid #e0e0e0;
  }
`;

const TabContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  background: #f5f5f5;
`;

export default LeftPanel;
