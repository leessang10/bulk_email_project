import { useAtom } from "jotai";
import { useEffect } from "react";
import { MdDesktopWindows, MdPhoneAndroid } from "react-icons/md";
import styled from "styled-components";
import {
  editorTreeAtom,
  templateContentAtom,
  type ViewMode,
  viewModeAtom,
} from "../atoms";
import { mockTemplateContent } from "../mockData";
import type {
  Block,
  ButtonBlock,
  ImageBlock,
  LayoutBlock,
  TextBlock,
} from "../types";

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

const convertBlockToHtml = (block: Block): string => {
  switch (block.type) {
    case "text": {
      const textBlock = block as TextBlock;
      const style = textBlock.style;
      return `
        <div style="
          ${style.bold ? "font-weight: bold;" : ""}
          ${style.italic ? "font-style: italic;" : ""}
          ${style.underline ? "text-decoration: underline;" : ""}
          ${style.fontSize ? `font-size: ${style.fontSize};` : ""}
          ${style.color ? `color: ${style.color};` : ""}
          ${style.textAlign ? `text-align: ${style.textAlign};` : ""}
        ">
          ${textBlock.content}
        </div>
      `;
    }
    case "button": {
      const buttonBlock = block as ButtonBlock;
      const style = buttonBlock.style;
      return `
        <a href="${buttonBlock.url}" style="
          display: inline-block;
          padding: ${style.padding || "8px 16px"};
          background-color: ${style.backgroundColor || "#007bff"};
          color: ${style.color || "#ffffff"};
          border-radius: ${style.borderRadius || "4px"};
          text-decoration: none;
          font-size: 14px;
          line-height: 1.5;
          text-align: center;
        ">
          ${buttonBlock.label}
        </a>
      `;
    }
    case "image": {
      const imageBlock = block as ImageBlock;
      return `
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
      `;
    }
    default:
      return "";
  }
};

const convertTreeToHtml = (tree: {
  blocks: Record<string, Block>;
  rootIds: string[];
}): string => {
  const renderLayout = (layoutBlock: LayoutBlock): string => {
    const columnWidth = 100 / layoutBlock.columns;
    const columns = Array.from({ length: layoutBlock.columns }).map(
      (_, columnIndex) => {
        const columnBlocks = layoutBlock.children
          .filter((child) => child.columnIndex === columnIndex)
          .map((child) => tree.blocks[child.blockId])
          .map(convertBlockToHtml)
          .join("");

        return `
        <td style="width: ${columnWidth}%; padding: 16px; vertical-align: top;">
          ${columnBlocks}
        </td>
      `;
      }
    );

    return `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          ${columns.join("")}
        </tr>
      </table>
    `;
  };

  return tree.rootIds
    .map((id) => {
      const block = tree.blocks[id];
      if (block.type === "layout") {
        return renderLayout(block as LayoutBlock);
      }
      return convertBlockToHtml(block);
    })
    .join("");
};

const PreviewPanel = () => {
  const [viewMode, setViewMode] = useAtom(viewModeAtom);
  const [tree] = useAtom(editorTreeAtom);
  const [, setTemplateContent] = useAtom(templateContentAtom);

  // 에디터 트리가 변경될 때마다 HTML 업데이트
  useEffect(() => {
    const html = convertTreeToHtml(tree);
    setTemplateContent({
      html,
      style: mockTemplateContent.style, // 기본 스타일 유지
    });
  }, [tree, setTemplateContent]);

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
              dangerouslySetInnerHTML={{ __html: convertTreeToHtml(tree) }}
            />
          </PreviewContent>
        </PreviewFrame>
      </PreviewContainer>
    </Container>
  );
};

export default PreviewPanel;
