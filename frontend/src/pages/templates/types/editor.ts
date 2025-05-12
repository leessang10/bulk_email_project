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
    width?: string;
    height?: string;
    color?: string;
    backgroundColor?: string;
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    textAlign?: "left" | "center" | "right";
    padding?: string;
    margin?: string;
    borderRadius?: string;
    href?: string;
    src?: string;
    alt?: string;
    display?: string;
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
