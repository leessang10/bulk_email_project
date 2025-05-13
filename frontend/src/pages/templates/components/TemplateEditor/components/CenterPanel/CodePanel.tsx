import styled from "styled-components";
import { convertToMJML } from "../../../../utils/mjml";
import { EDITOR_CONSTANTS } from "../../constants/styles";
import type { LayoutItem } from "../../types/editor";

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
  max-width: 50rem;
  background: #1e1e1e;
  border: 0.0625rem solid ${EDITOR_CONSTANTS.borderColor};
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
  font-size: 0.875rem;
  line-height: 1.5;
  resize: none;
  outline: none;
  white-space: pre;
  tab-size: 2;

  &::-webkit-scrollbar {
    width: 0.75rem;
    height: 0.75rem;
  }

  &::-webkit-scrollbar-track {
    background: #1e1e1e;
  }

  &::-webkit-scrollbar-thumb {
    background: #424242;
    border-radius: 0.375rem;
    border: 0.1875rem solid #1e1e1e;
  }
`;

export default CodePanel;
