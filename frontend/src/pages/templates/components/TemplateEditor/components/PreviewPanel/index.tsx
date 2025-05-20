import { useAtom } from "jotai";
import { useEffect } from "react";
import { MdDesktopWindows, MdPhoneAndroid } from "react-icons/md";
import styled from "styled-components";
import {
  editorStateAtom,
  templateContentAtom,
  type ViewMode,
  viewModeAtom,
} from "../../atoms/editor.ts";
import { mockTemplateContent } from "../../mockData.ts";
import type {
  ButtonBlock,
  ComponentBlock,
  EditorState,
  ImageBlock,
  TextBlock,
} from "../../types.ts";

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
  background: #f0f0f0;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 40px;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const PreviewFrame = styled.div<{ viewMode: ViewMode }>`
  width: ${(props) => (props.viewMode === "mobile" ? "375px" : "100%")};
  max-width: 800px;
  min-height: 600px;
  background: white;
  transition: width 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
`;

const PreviewContent = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const convertComponentBlockToHtml = (block: ComponentBlock): string => {
  switch (block.type) {
    case "text": {
      const textBlock = block as TextBlock;
      const style = textBlock.style || {};
      return `
        <div style="
          ${style.bold ? "font-weight: bold;" : ""}
          ${style.italic ? "font-style: italic;" : ""}
          ${style.underline ? "text-decoration: underline;" : ""}
          ${style.fontSize ? `font-size: ${style.fontSize};` : ""}
          ${style.color ? `color: ${style.color};` : ""}
          ${style.textAlign ? `text-align: ${style.textAlign};` : ""}
          padding: 8px;
          min-height: 24px;
        ">
          ${textBlock.content}
        </div>
      `;
    }
    case "button": {
      const buttonBlock = block as ButtonBlock;
      const style = buttonBlock.style || {};
      return `
        <div style="
          width: 100%;
          display: flex;
          justify-content: ${
            style.align === "left"
              ? "flex-start"
              : style.align === "right"
              ? "flex-end"
              : "center"
          };
        ">
          <a href="${buttonBlock.url}" style="
            display: inline-block;
            padding: ${style.padding || "8px 16px"};
            background-color: ${style.backgroundColor || "#007bff"};
            color: ${style.color || "#ffffff"};
            border-radius: 4px;
            text-decoration: none;
            font-size: 14px;
            line-height: 1.5;
            text-align: center;
          ">
            ${buttonBlock.label}
          </a>
        </div>
      `;
    }
    case "image": {
      const imageBlock = block as ImageBlock;
      return `
        <div style="
          width: 100%;
          display: flex;
          justify-content: ${
            imageBlock.align === "left"
              ? "flex-start"
              : imageBlock.align === "right"
              ? "flex-end"
              : "center"
          };
        ">
          <img
            src="${imageBlock.src}"
            alt="${imageBlock.alt || ""}"
            style="
              max-width: 100%;
              height: auto;
              ${imageBlock.width ? `width: ${imageBlock.width};` : ""}
              display: block;
            "
          />
        </div>
      `;
    }
    default:
      return "";
  }
};

const convertStateToHtml = (state: EditorState): string => {
  const renderLayout = (layoutId: string): string => {
    const layout = state.layouts[layoutId];
    const columnBlocks = Object.values(layout.columnBlocks).sort(
      (a, b) => a.order - b.order
    );
    const columnWidth = 100 / columnBlocks.length;

    const columns = columnBlocks.map((columnBlock) => {
      const columnContent = columnBlock.componentBlock
        ? convertComponentBlockToHtml(columnBlock.componentBlock)
        : "";

      return `
        <td style="width: ${columnWidth}%; padding: 16px; vertical-align: top;">
          ${columnContent}
        </td>
      `;
    });

    return `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          ${columns.join("")}
        </tr>
      </table>
    `;
  };

  return Object.values(state.layouts)
    .sort((a, b) => a.order - b.order)
    .map((layout) => renderLayout(layout.id))
    .join("");
};

const PreviewPanel = () => {
  const [viewMode, setViewMode] = useAtom(viewModeAtom);
  const [editorState] = useAtom(editorStateAtom);
  const [, setTemplateContent] = useAtom(templateContentAtom);

  // 에디터 상태가 변경될 때마다 HTML 업데이트
  useEffect(() => {
    const html = convertStateToHtml(editorState);
    setTemplateContent({
      html,
      style: mockTemplateContent.style, // 기본 스타일 유지
    });
  }, [editorState, setTemplateContent]);

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
            <style>{mockTemplateContent.style}</style>
            <div
              dangerouslySetInnerHTML={{
                __html: convertStateToHtml(editorState),
              }}
            />
          </PreviewContent>
        </PreviewFrame>
      </PreviewContainer>
    </Container>
  );
};

export default PreviewPanel;
