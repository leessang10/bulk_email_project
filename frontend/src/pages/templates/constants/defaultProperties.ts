import type { ComponentType } from "../types/editor";

export const DEFAULT_LAYOUT_PROPERTIES = {
  padding: "16px",
  backgroundColor: "transparent",
  align: "center" as const,
  verticalAlign: "middle" as const,
  borderRadius: "0px",
};

export const DEFAULT_COMPONENT_PROPERTIES: Record<
  ComponentType,
  {
    content: string;
    properties: Record<string, any>;
  }
> = {
  text: {
    content: "텍스트를 입력하세요",
    properties: {
      color: "#333333",
      fontSize: "16px",
      textAlign: "center" as const,
      fontWeight: "normal" as const,
      lineHeight: "1.5",
      margin: "0px",
      padding: "0px",
    },
  },
  image: {
    content: "",
    properties: {
      src: "https://via.placeholder.com/300x200",
      alt: "이미지 설명",
      width: "80%",
      height: "auto",
      margin: "0 auto",
      display: "block",
      borderRadius: "4px",
    },
  },
  button: {
    content: "버튼",
    properties: {
      backgroundColor: "#1a73e8",
      color: "#ffffff",
      padding: "12px 24px",
      borderRadius: "4px",
      fontSize: "16px",
      textAlign: "center" as const,
      textDecoration: "none",
      display: "inline-block",
      margin: "0 auto",
      border: "none",
      width: "auto",
      minWidth: "120px",
    },
  },
  link: {
    content: "링크",
    properties: {
      color: "#1a73e8",
      href: "#",
      textDecoration: "none",
      fontSize: "16px",
      textAlign: "center" as const,
      display: "block",
      margin: "0 auto",
      padding: "8px 0",
    },
  },
};
