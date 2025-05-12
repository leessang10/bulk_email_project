export type LayoutType =
  | "1-column"
  | "2-column"
  | "3-column"
  | "4-column"
  | "footer";

export type ComponentType = "text" | "image" | "button" | "link";

export type DeviceMode = "desktop" | "mobile";

export interface ComponentItem {
  id: string;
  type: ComponentType;
  content: string;
  properties: {
    // Common properties
    width?: string;
    paddingX?: string;
    paddingY?: string;
    align?: "left" | "center" | "right";
    border?: string;
    borderRadius?: string;
    backgroundColor?: string;
    cssClass?: string;

    // Text & Link & Button common properties
    color?: string;
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: "normal" | "bold";
    fontStyle?: "normal" | "italic";
    textDecoration?: "none" | "underline" | "line-through";
    textAlign?: "left" | "center" | "right";

    // Image specific
    src?: string;
    alt?: string;
    title?: string;

    // Button & Link specific
    href?: string;
    target?: string;
    rel?: string;
  };
}

export interface LayoutItem {
  id: string;
  type: LayoutType;
  children: ComponentItem[];
}

export interface EditorState {
  layouts: LayoutItem[];
}

export const LAYOUT_STYLES: Record<
  LayoutType,
  {
    columns: number;
    template: string;
    maxComponents: number;
    isFooter?: boolean;
  }
> = {
  "1-column": {
    columns: 1,
    template: "1fr",
    maxComponents: 1,
  },
  "2-column": {
    columns: 2,
    template: "1fr 1fr",
    maxComponents: 2,
  },
  "3-column": {
    columns: 3,
    template: "repeat(3, 1fr)",
    maxComponents: 3,
  },
  "4-column": {
    columns: 4,
    template: "repeat(4, 1fr)",
    maxComponents: 4,
  },
  footer: {
    columns: 1,
    template: "1fr",
    maxComponents: 1,
    isFooter: true,
  },
};
