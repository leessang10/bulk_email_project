import type { EditorState } from "./types";

export const mockTemplateContent = {
  style: `
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    td {
      vertical-align: top;
    }
  `,
};

export const mockEditorState: EditorState = {
  layouts: {
    "layout-1": {
      id: "layout-1",
      columns: [
        {
          id: "column-1",
          layoutId: "layout-1",
          componentBlockId: "text-1",
        },
      ],
    },
    "layout-2": {
      id: "layout-2",
      columns: [
        {
          id: "column-2",
          layoutId: "layout-2",
          componentBlockId: "image-1",
        },
        {
          id: "column-3",
          layoutId: "layout-2",
          componentBlockId: "text-2",
        },
      ],
    },
    "layout-3": {
      id: "layout-3",
      columns: [
        {
          id: "column-4",
          layoutId: "layout-3",
          componentBlockId: "button-1",
        },
      ],
    },
  },
  columns: {
    "column-1": {
      id: "column-1",
      layoutId: "layout-1",
      componentBlockId: "text-1",
    },
    "column-2": {
      id: "column-2",
      layoutId: "layout-2",
      componentBlockId: "image-1",
    },
    "column-3": {
      id: "column-3",
      layoutId: "layout-2",
      componentBlockId: "text-2",
    },
    "column-4": {
      id: "column-4",
      layoutId: "layout-3",
      componentBlockId: "button-1",
    },
  },
  componentBlocks: {
    "text-1": {
      id: "text-1",
      type: "text",
      content: "안녕하세요! 이메일 템플릿 에디터입니다.",
      style: {
        bold: true,
        fontSize: "24px",
        textAlign: "center",
      },
    },
    "image-1": {
      id: "image-1",
      type: "image",
      src: "https://via.placeholder.com/300x200",
      alt: "샘플 이미지",
      width: "100%",
    },
    "text-2": {
      id: "text-2",
      type: "text",
      content:
        "이미지 옆에 있는 텍스트입니다. 2단 레이아웃의 예시를 보여줍니다.",
      style: {
        fontSize: "16px",
      },
    },
    "button-1": {
      id: "button-1",
      type: "button",
      label: "자세히 보기",
      url: "#",
      style: {
        backgroundColor: "#007bff",
        color: "#ffffff",
        padding: "12px 24px",
        borderRadius: "6px",
      },
    },
  },
  layoutOrder: ["layout-1", "layout-2", "layout-3"],
};
