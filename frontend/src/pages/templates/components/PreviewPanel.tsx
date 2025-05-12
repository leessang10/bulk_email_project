import styled from "styled-components";
import { EDITOR_CONSTANTS } from "../constants/styles";
import type { LayoutItem } from "../types/editor";
import { convertMJMLToHTML, convertToMJML } from "../utils/mjml";

interface PreviewPanelProps {
  layouts: LayoutItem[];
  deviceMode: "desktop" | "mobile";
}

const PreviewPanel = ({ layouts, deviceMode }: PreviewPanelProps) => {
  const mjmlContent = convertToMJML(layouts);
  const htmlContent = convertMJMLToHTML(mjmlContent);

  return (
    <Container>
      <PreviewWrapper $deviceMode={deviceMode}>
        <PreviewFrame srcDoc={htmlContent} title="Email Preview" />
      </PreviewWrapper>
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

const PreviewWrapper = styled.div<{ $deviceMode: "desktop" | "mobile" }>`
  width: ${EDITOR_CONSTANTS.maxWidth};
  max-width: ${({ $deviceMode }) =>
    $deviceMode === "desktop"
      ? EDITOR_CONSTANTS.maxWidth
      : EDITOR_CONSTANTS.mobileWidth};
  background: white;
  border: 1px solid ${EDITOR_CONSTANTS.borderColor};
  border-radius: ${EDITOR_CONSTANTS.borderRadius};
  overflow: hidden;
`;

const PreviewFrame = styled.iframe`
  width: 100%;
  min-height: calc(
    100vh - ${EDITOR_CONSTANTS.toolbarHeight} -
      ${EDITOR_CONSTANTS.contentPadding} * 2
  );
  border: none;
  display: block;
`;

export default PreviewPanel;
