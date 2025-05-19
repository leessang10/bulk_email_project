import { atom } from "jotai";
import { mockTemplateContent } from "../mockData";
import type {
  ButtonBlock,
  ComponentBlock,
  EditorState,
  ImageBlock,
  TextBlock,
} from "../types";
import { editorStateAtom } from "./editor";

// HTML 변환 유틸리티 atom
export const convertComponentBlockToHtmlAtom = atom(
  (get) =>
    (block: ComponentBlock): string => {
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
    }
);

// 전체 HTML 변환 atom
export const convertStateToHtmlAtom = atom((get) => {
  const convertComponentToHtml = get(convertComponentBlockToHtmlAtom);

  return (state: EditorState): string => {
    const renderLayout = (layoutId: string): string => {
      const layout = state.layouts[layoutId];
      const columnBlocks = Object.values(layout.columnBlocks).sort(
        (a, b) => a.order - b.order
      );
      const columnWidth = 100 / columnBlocks.length;

      const columns = columnBlocks.map((columnBlock) => {
        const columnContent = columnBlock.componentBlock
          ? convertComponentToHtml(columnBlock.componentBlock)
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
});

// 실시간 HTML 생성 atom
export const generatedHtmlAtom = atom((get) => {
  const editorState = get(editorStateAtom);
  const convertStateToHtml = get(convertStateToHtmlAtom);
  return convertStateToHtml(editorState);
});

// 템플릿 컨텐츠 자동 업데이트 atom
export const autoUpdateTemplateContentAtom = atom(null, (get, set) => {
  const html = get(generatedHtmlAtom);
  set(templateContentAtom, {
    html,
    style: mockTemplateContent.style,
  });
});
