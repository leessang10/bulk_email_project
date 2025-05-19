import { atom } from "jotai";
import { nanoid } from "nanoid";
import type { ComponentBlock, EditorState } from "./types";

export type ViewMode = "desktop" | "mobile";

export interface TemplateContent {
  html: string;
  style: string;
}

export const templateContentAtom = atom<TemplateContent>({
  html: "",
  style: "",
});

export const viewModeAtom = atom<ViewMode>("desktop");

// 컴포넌트 블록 생성 함수
const createComponentBlock = (type: string): ComponentBlock => {
  const id = nanoid();

  switch (type) {
    case "text":
      return {
        id,
        type: "text",
        content: "텍스트를 입력하세요",
        style: {
          textAlign: "center",
        },
      };
    case "button":
      return {
        id,
        type: "button",
        label: "버튼",
        url: "#",
        style: {},
      };
    case "image":
      return {
        id,
        type: "image",
        src: "",
        alt: "이미지",
        width: "100%",
      };
    default:
      throw new Error(`Unknown block type: ${type}`);
  }
};

export const editorStateAtom = atom<EditorState>({
  layouts: {},
});

// 선택된 요소들을 위한 atoms
export const selectedLayoutIdAtom = atom<string | null>(null);
export const selectedColumnBlockIdAtom = atom<string | null>(null);
export const selectedComponentBlockIdAtom = atom<string | null>(null);

// 선택된 요소들을 가져오는 derived atoms
export const selectedLayoutAtom = atom((get) => {
  const state = get(editorStateAtom);
  const selectedId = get(selectedLayoutIdAtom);
  return selectedId ? state.layouts[selectedId] : null;
});

export const selectedColumnBlockAtom = atom((get) => {
  const state = get(editorStateAtom);
  const selectedId = get(selectedColumnBlockIdAtom);
  const layoutId = get(selectedLayoutIdAtom);
  if (!layoutId || !selectedId) return null;
  return state.layouts[layoutId].columnBlocks[selectedId];
});

export const selectedComponentBlockAtom = atom((get) => {
  const state = get(editorStateAtom);
  const selectedId = get(selectedComponentBlockIdAtom);
  const columnBlockId = get(selectedColumnBlockIdAtom);
  const layoutId = get(selectedLayoutIdAtom);
  if (!layoutId || !columnBlockId) return null;
  return state.layouts[layoutId].columnBlocks[columnBlockId].componentBlock;
});

// 블록 추가를 위한 atom
interface AddBlockParams {
  layoutId: string;
  columnBlockId: string;
  blockType: string;
}

export const addBlockAtom = atom(
  null,
  (get, set, { layoutId, columnBlockId, blockType }: AddBlockParams) => {
    console.log("addBlockAtom called with:", {
      layoutId,
      columnBlockId,
      blockType,
    });
    const editorState = get(editorStateAtom);
    const layout = editorState.layouts[layoutId];
    const columnBlock = layout?.columnBlocks[columnBlockId];

    console.log("Current state:", {
      layout,
      columnBlock,
      columnBlockLayoutId: columnBlock?.layoutId,
    });

    if (!layout || !columnBlock || columnBlock.layoutId !== layoutId) {
      console.log("Validation failed:", {
        hasLayout: !!layout,
        hasColumnBlock: !!columnBlock,
        layoutIdMatch: columnBlock?.layoutId === layoutId,
      });
      return;
    }

    const newBlock = createComponentBlock(blockType);
    console.log("Created new block:", newBlock);

    // 상태 업데이트를 한 번에 처리
    const newState: EditorState = {
      ...editorState,
      layouts: {
        ...editorState.layouts,
        [layoutId]: {
          ...layout,
          columnBlocks: {
            ...layout.columnBlocks,
            [columnBlockId]: {
              ...columnBlock,
              componentBlock: newBlock,
            },
          },
        },
      },
    };

    console.log("New state:", newState);
    set(editorStateAtom, newState);
    set(selectedComponentBlockIdAtom, newBlock.id);
  }
);

// 블록 선택 시 모든 선택 상태를 한 번에 업데이트하는 atom
export const selectBlockAtom = atom(
  null,
  (
    get,
    set,
    selection: { blockId: string; layoutId: string; columnId: string }
  ) => {
    set(selectedComponentBlockIdAtom, selection.blockId);
    set(selectedLayoutIdAtom, selection.layoutId);
    set(selectedColumnBlockIdAtom, selection.columnId);
  }
);
