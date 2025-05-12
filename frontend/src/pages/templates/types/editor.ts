export type LayoutType =
  | "1-column"
  | "2-column"
  | "3-column"
  | "4-column"
  | "footer";

export interface LayoutItem {
  id: string;
  type: LayoutType;
  children: ComponentItem[];
}

export interface ComponentItem {
  id: string;
  type: "text" | "image" | "button" | "link";
  properties: Record<string, any>;
}

export interface EditorState {
  layouts: LayoutItem[];
}
