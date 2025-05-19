// 컴포넌트 블록 타입
export type ComponentBlockType = "text" | "button" | "image";

// 컴포넌트 블록의 기본 인터페이스
export interface BaseComponentBlock {
  id: string;
  type: ComponentBlockType;
}

// 텍스트 블록
export interface TextBlock extends BaseComponentBlock {
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

// 버튼 블록
export interface ButtonBlock extends BaseComponentBlock {
  type: "button";
  label: string;
  url: string;
  style: {
    backgroundColor?: string;
    color?: string;
    padding?: string;
    align?: "left" | "center" | "right";
  };
}

// 이미지 블록
export interface ImageBlock extends BaseComponentBlock {
  type: "image";
  src: string;
  alt?: string;
  width?: string;
  align?: "left" | "center" | "right";
}

// 컴포넌트 블록 유니온 타입
export type ComponentBlock = TextBlock | ButtonBlock | ImageBlock;

// 컬럼 인터페이스
export interface ColumnBlock {
  id: string;
  order: number; // 컬럼 순서
  layoutId: string; // 부모 레이아웃 ID
  componentBlock: ComponentBlock | null; // 컬럼에 추가된 컴포넌트 블록
}

// 레이아웃 인터페이스
export interface Layout {
  id: string;
  order: number; // 레이아웃 순서
  columnBlocks: ColumnBlock[]; // 1~4개의 컬럼
}

// 전체 에디터 상태 인터페이스
export interface EditorState {
  layouts: {
    [layoutId: string]: {
      id: string; // 레이아웃 ID
      order: number; // 레이아웃 순서
      columnBlocks: {
        [columnBlockId: string]: {
          id: string; // 컬럼 블록 ID
          order: number; // 컬럼 순서
          layoutId: string; // 부모 레이아웃 ID
          componentBlock: ComponentBlock | null;
        };
      };
    };
  };
}
