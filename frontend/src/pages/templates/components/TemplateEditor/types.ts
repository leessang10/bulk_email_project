export type BlockType = "text" | "button" | "image" | "layout";

export interface BaseBlock {
  id: string;
  type: BlockType;
  parentId: string | null;
}

export interface TextBlock extends BaseBlock {
  type: "text";
  content: string;
  style: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    fontSize?: string;
    color?: string;
    textAlign?: "left" | "center" | "right" | "justify";
  };
}

export interface ButtonBlock extends BaseBlock {
  type: "button";
  label: string;
  url: string;
  style: {
    backgroundColor?: string;
    color?: string;
    padding?: string;
    borderRadius?: string;
  };
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  src: string;
  alt?: string;
  width?: string;
}

export interface ColumnContent {
  blockId: string;
  columnIndex: number;
}

export interface LayoutBlock extends BaseBlock {
  type: "layout";
  columns: number;
  children: ColumnContent[]; // 열 정보를 포함한 블록 ID
}

export type Block = TextBlock | ButtonBlock | ImageBlock | LayoutBlock;

export interface EditorTree {
  blocks: Record<string, Block>;
  rootIds: string[];
}

export type ColumnPath = {
  layoutId: string;
  columnIndex: number;
};
