import { atom } from "jotai";
import { nanoid } from "nanoid";
import type {
  ButtonBlock,
  ComponentBlock,
  ComponentBlockType,
  EditorState,
  ImageBlock,
  TextBlock,
} from "../types";
import { editorStateAtom } from "./editor";
import { selectedComponentBlockIdAtom } from "./selection";

// 컴포넌트 블록 위치 정보
interface ComponentBlockLocation {
  layoutId: string;
  columnId: string;
  block: ComponentBlock;
}

// ID로 컴포넌트 블록 찾기
export const findComponentBlockById = (
  state: EditorState,
  blockId: string
): ComponentBlockLocation | null => {
  for (const [layoutId, layout] of Object.entries(state.layouts)) {
    for (const [columnId, columnBlock] of Object.entries(layout.columnBlocks)) {
      if (columnBlock.componentBlock?.id === blockId) {
        return {
          layoutId,
          columnId,
          block: columnBlock.componentBlock,
        };
      }
    }
  }
  return null;
};

// 컴포넌트 블록 생성 함수
export const createComponentBlock = (
  type: ComponentBlockType
): ComponentBlock => {
  const id = nanoid();

  switch (type) {
    case "text": {
      const block: TextBlock = {
        id,
        type: "text",
        content: "텍스트를 입력하세요",
        style: {
          textAlign: "center",
          bold: false,
          italic: false,
          underline: false,
          fontSize: "16px",
          color: "#000000",
        },
      };
      return block;
    }
    case "button": {
      const block: ButtonBlock = {
        id,
        type: "button",
        label: "버튼",
        url: "#",
        style: {
          backgroundColor: "#007bff",
          color: "#ffffff",
          padding: "8px 16px",
          align: "center",
        },
      };
      return block;
    }
    case "image": {
      const block: ImageBlock = {
        id,
        type: "image",
        src: "",
        alt: "이미지",
        width: "100%",
        align: "center",
      };
      return block;
    }
    default:
      throw new Error(`Unknown block type: ${type}`);
  }
};

// 컴포넌트 블록 상태 업데이트
export const updateEditorState = (
  state: EditorState,
  location: { layoutId: string; columnId: string },
  update: (block: ComponentBlock | null) => ComponentBlock | null
): EditorState => {
  const { layoutId, columnId } = location;
  const layout = state.layouts[layoutId];
  const columnBlock = layout?.columnBlocks[columnId];

  if (!layout || !columnBlock) return state;

  return {
    ...state,
    layouts: {
      ...state.layouts,
      [layoutId]: {
        ...layout,
        columnBlocks: {
          ...layout.columnBlocks,
          [columnId]: {
            ...columnBlock,
            componentBlock: update(columnBlock.componentBlock),
          },
        },
      },
    },
  };
};


// 컴포넌트 블록 추가 atom
export interface AddComponentBlockParams {
  layoutId: string;
  columnBlockId: string;
  blockType: string;
}

export const addComponentBlockAtom = atom(
  null,
  (
    get,
    set,
    { layoutId, columnBlockId, blockType }: AddComponentBlockParams
  ) => {
    const editorState = get(editorStateAtom);
    const newBlock = createComponentBlock(blockType as ComponentBlockType);

    const newState = updateEditorState(
      editorState,
      { layoutId, columnId: columnBlockId },
      () => newBlock
    );

    set(editorStateAtom, newState);
    set(selectedComponentBlockIdAtom, newBlock.id);
  }
);

// 컴포넌트 블록 삭제 atom
export const deleteComponentBlockAtom = atom(null, (get, set) => {
  const state = get(editorStateAtom);
  const selectedId = get(selectedComponentBlockIdAtom);

  if (!selectedId) return;

  const location = findComponentBlockById(state, selectedId);
  if (!location) return;

  const newState = updateEditorState(
    state,
    { layoutId: location.layoutId, columnId: location.columnId },
    () => null
  );

  set(editorStateAtom, newState);
  set(selectedComponentBlockIdAtom, null);
});

// 컴포넌트 블록 업데이트 atom
interface UpdateComponentBlockParams {
  blockId: string;
  updates: Partial<ComponentBlock>;
}

export const updateComponentBlockAtom = atom(
  null,
  (get, set, { blockId, updates }: UpdateComponentBlockParams) => {
    const state = get(editorStateAtom);
    const location = findComponentBlockById(state, blockId);
    if (!location) return;

    const newState = updateEditorState(
      state,
      { layoutId: location.layoutId, columnId: location.columnId },
      (block) => {
        if (!block) return null;
        // 타입별로 적절한 업데이트 처리
        switch (block.type) {
          case "text":
            return {
              ...block,
              ...(updates as Partial<TextBlock>),
            } as TextBlock;
          case "button":
            return {
              ...block,
              ...(updates as Partial<ButtonBlock>),
            } as ButtonBlock;
          case "image":
            return {
              ...block,
              ...(updates as Partial<ImageBlock>),
            } as ImageBlock;
          default:
            return block;
        }
      }
    );

    set(editorStateAtom, newState);
  }
);

// 텍스트 블록 컨텐츠 업데이트
export const updateTextContentAtom = atom(
  null,
  (get, set, { blockId, content }: { blockId: string; content: string }) => {
    const state = get(editorStateAtom);
    const location = findComponentBlockById(state, blockId);
    if (!location || location.block.type !== "text") return;

    set(updateComponentBlockAtom, {
      blockId,
      updates: { content },
    });
  }
);

// 텍스트 블록 스타일 업데이트
export const updateTextStyleAtom = atom(
  null,
  (
    get,
    set,
    { blockId, style }: { blockId: string; style: Partial<TextBlock["style"]> }
  ) => {
    const state = get(editorStateAtom);
    const location = findComponentBlockById(state, blockId);
    if (!location || location.block.type !== "text") return;

    set(updateComponentBlockAtom, {
      blockId,
      updates: {
        style: { ...location.block.style, ...style },
      },
    });
  }
);

// 버튼 블록 스타일 업데이트
export const updateButtonStyleAtom = atom(
  null,
  (
    get,
    set,
    {
      blockId,
      style,
    }: { blockId: string; style: Partial<ButtonBlock["style"]> }
  ) => {
    const state = get(editorStateAtom);
    const location = findComponentBlockById(state, blockId);
    if (!location || location.block.type !== "button") return;

    set(updateComponentBlockAtom, {
      blockId,
      updates: {
        style: { ...location.block.style, ...style },
      },
    });
  }
);
