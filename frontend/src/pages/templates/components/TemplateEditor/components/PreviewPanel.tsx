import { useAtom } from "jotai";
import { MdDesktopWindows, MdPhoneAndroid } from "react-icons/md";
import styled from "styled-components";
import { templateContentAtom, type ViewMode, viewModeAtom } from "./atoms";
import { mockTemplateContent } from "./mockData";

const Container = styled.div`
  width: 800px;
  height: 100%;
  border-left: 1px solid #e0e0e0;
  background: #fafafa;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const ViewModeControls = styled.div`
  display: flex;
  gap: 8px;
  padding: 4px;
  background: #f0f0f0;
  border-radius: 6px;
`;

const ViewModeButton = styled.button<{ active: boolean }>`
  border: none;
  background: ${(props) => (props.active ? "#fff" : "transparent")};
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${(props) => (props.active ? "#333" : "#666")};
  box-shadow: ${(props) =>
    props.active ? "0 1px 3px rgba(0,0,0,0.1)" : "none"};

  &:hover {
    background: ${(props) => (props.active ? "#fff" : "#e8e8e8")};
  }
`;

const PreviewContainer = styled.div`
  flex: 1;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const PreviewFrame = styled.div<{ viewMode: ViewMode }>`
  width: ${(props) => (props.viewMode === "mobile" ? "375px" : "100%")};
  min-height: 600px;
  background: white;
  transition: width 0.3s ease;
`;

const PreviewContent = styled.div`
  width: 100%;
  height: 100%;
`;

const PreviewPanel = () => {
  const [viewMode, setViewMode] = useAtom(viewModeAtom);
  const [templateContent] = useAtom(templateContentAtom);

  // 실제 템플릿 내용이 없을 경우 목업 데이터 사용
  const content = templateContent.html ? templateContent : mockTemplateContent;

  return (
    <Container>
      <Header>
        <Title>미리보기</Title>
        <ViewModeControls>
          <ViewModeButton
            active={viewMode === "desktop"}
            onClick={() => setViewMode("desktop")}
            title="데스크톱 보기"
          >
            <MdDesktopWindows size={20} />
          </ViewModeButton>
          <ViewModeButton
            active={viewMode === "mobile"}
            onClick={() => setViewMode("mobile")}
            title="모바일 보기"
          >
            <MdPhoneAndroid size={20} />
          </ViewModeButton>
        </ViewModeControls>
      </Header>
      <PreviewContainer>
        <PreviewFrame viewMode={viewMode}>
          <PreviewContent>
            <style>{content.style}</style>
            <div dangerouslySetInnerHTML={{ __html: content.html }} />
          </PreviewContent>
        </PreviewFrame>
      </PreviewContainer>
    </Container>
  );
};

export default PreviewPanel;
