import type { ComponentType } from "../types/editor";

export const DEFAULT_LAYOUT_PROPERTIES = {
  paddingX: "24px",
  paddingY: "16px",
  backgroundColor: "transparent",
  align: "center" as const,
  verticalAlign: "top" as const,
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
      fontStyle: "normal" as const,
      textDecoration: "none" as const,
      fontFamily: "Arial, sans-serif",
      paddingX: "24px",
      paddingY: "16px",
      borderRadius: "0px",
    },
  },
  image: {
    content: "",
    properties: {
      src: "https://via.placeholder.com/552x276",
      alt: "이미지 설명",
      align: "center",
      width: "100%",
      paddingX: "24px",
      paddingY: "16px",
      border: "none",
      borderRadius: "0px",
    },
  },
  button: {
    content: "버튼",
    properties: {
      backgroundColor: "#1a73e8",
      color: "#ffffff",
      paddingX: "24px",
      paddingY: "16px",
      borderRadius: "4px",
      fontSize: "16px",
      textAlign: "center" as const,
      fontWeight: "normal" as const,
      fontStyle: "normal" as const,
      textDecoration: "none" as const,
      fontFamily: "Arial, sans-serif",
      href: "#",
      border: "none",
    },
  },
  link: {
    content: "링크",
    properties: {
      color: "#1a73e8",
      href: "#",
      textDecoration: "none" as const,
      fontSize: "16px",
      textAlign: "center" as const,
      paddingX: "24px",
      paddingY: "16px",
      fontWeight: "normal" as const,
      fontStyle: "normal" as const,
      fontFamily: "Arial, sans-serif",
      borderRadius: "0px",
    },
  },
};

export const getDefaultContent = (type: ComponentType): string => {
  switch (type) {
    case "text":
      return "텍스트를 입력하세요";
    case "button":
      return "버튼";
    case "link":
      return "링크";
    default:
      return "";
  }
};

export const getDefaultProperties = (
  type: ComponentType
): Record<string, any> => {
  return DEFAULT_COMPONENT_PROPERTIES[type].properties;
};
