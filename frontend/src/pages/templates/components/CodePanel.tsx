import styled from "styled-components";
import { EDITOR_CONSTANTS } from "../constants/styles";
import type { LayoutItem } from "../types/editor";
import { convertToMJML } from "../utils/mjml";

interface CodePanelProps {
  layouts: LayoutItem[];
}

const CodePanel = ({ layouts }: CodePanelProps) => {
  const mjmlContent = convertToMJML(layouts);

  return (
    <Container>
      <CodeWrapper>
        <CodeEditor readOnly value={mjmlContent} />
      </CodeWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  background: ${EDITOR_CONSTANTS.backgroundColor};
  padding: ${EDITOR_CONSTANTS.contentPadding};
  overflow: auto;
`;

const CodeWrapper = styled.div`
  width: 100%;
  max-width: ${EDITOR_CONSTANTS.maxWidth};
  background: #1e1e1e;
  border: 1px solid ${EDITOR_CONSTANTS.borderColor};
  border-radius: ${EDITOR_CONSTANTS.borderRadius};
  overflow: hidden;
`;

const CodeEditor = styled.textarea`
  width: 100%;
  min-height: calc(
    100vh - ${EDITOR_CONSTANTS.toolbarHeight} -
      ${EDITOR_CONSTANTS.contentPadding} * 2
  );
  background: #1e1e1e;
  color: #d4d4d4;
  border: none;
  padding: ${EDITOR_CONSTANTS.contentPadding};
  font-family: "Consolas", monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;
  white-space: pre;
  tab-size: 2;

  &::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  &::-webkit-scrollbar-track {
    background: #1e1e1e;
  }

  &::-webkit-scrollbar-thumb {
    background: #424242;
    border-radius: 6px;
    border: 3px solid #1e1e1e;
  }
`;

export default CodePanel;
