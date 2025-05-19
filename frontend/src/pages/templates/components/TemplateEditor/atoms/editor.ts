import { atom } from "jotai";
import { set } from "lodash";
import type { ComponentBlock, EditorState } from "../types";

// 기본 에디터 상태
export const editorStateAtom = atom<EditorState>({
  layouts: {},
});

// 플로팅 메뉴 상태
export interface FloatingMenuState {
  type: "layout" | "block";
  x: number;
  y: number;
  layoutId?: string;
  columnBlockId?: string;
}

export const floatingMenuStateAtom = atom<FloatingMenuState | null>(null);

// 정렬된 레이아웃 atom
export const sortedLayoutsAtom = atom((get) => {
  const editorState = get(editorStateAtom);
  return Object.values(editorState.layouts).sort((a, b) => a.order - b.order);
});

// 선택된 블록 ID
export const selectedComponentBlockIdAtom = atom<string | null>(null);

// 블록 추가 atom
export interface AddBlockParams {
  layoutId: string;
  columnBlockId: string;
  blockType: string;
}

export const addBlockAtom = atom(
  null,
  (get, set, { layoutId, columnBlockId, blockType }: AddBlockParams) => {
    const editorState = get(editorStateAtom);
    const layout = editorState.layouts[layoutId];
    const columnBlock = layout?.columnBlocks[columnBlockId];

    if (!layout || !columnBlock || columnBlock.layoutId !== layoutId) {
      console.log("Invalid block addition attempt");
      return;
    }

    // 새로운 컴포넌트 블록 생성 로직은 기존 코드에서 가져와야 함
    // 여기서는 임시로 빈 객체로 처리
    const newComponentBlock = { id: "temp", type: blockType };

    set(editorStateAtom, {
      ...editorState,
      layouts: {
        ...editorState.layouts,
        [layoutId]: {
          ...layout,
          columnBlocks: {
            ...layout.columnBlocks,
            [columnBlockId]: {
              ...columnBlock,
              componentBlock: newComponentBlock,
            },
          },
        },
      },
    });

    set(selectedComponentBlockIdAtom, newComponentBlock.id);
  }
);

// 블록 선택 atom
export interface SelectBlockParams {
  blockId: string;
  layoutId: string;
  columnId: string;
}

export const selectBlockAtom = atom(
  null,
  (get, set, { blockId, layoutId, columnId }: SelectBlockParams) => {
    set(selectedComponentBlockIdAtom, blockId);
  }
);

// 블록 삭제 atom
export const deleteBlockAtom = atom(null, (get, set) => {
  const editorState = get(editorStateAtom);
  const selectedBlockId = get(selectedComponentBlockIdAtom);

  if (!selectedBlockId) return;

  // 선택된 블록을 찾아서 삭제하는 로직
  Object.entries(editorState.layouts).forEach(([layoutId, layout]) => {
    Object.entries(layout.columnBlocks).forEach(([columnId, columnBlock]) => {
      if (columnBlock.componentBlock?.id === selectedBlockId) {
        const newState = {
          ...editorState,
          layouts: {
            ...editorState.layouts,
            [layoutId]: {
              ...layout,
              columnBlocks: {
                ...layout.columnBlocks,
                [columnId]: {
                  ...columnBlock,
                  componentBlock: null,
                },
              },
            },
          },
        };
        set(editorStateAtom, newState);
        set(selectedComponentBlockIdAtom, null);
      }
    });
  });
});

// 상태 업데이트 유틸리티 함수들
export const updateBlockContent = (
  state: EditorState,
  layoutId: string,
  columnId: string,
  content: string
): EditorState => {
  return set(
    { ...state },
    `layouts.${layoutId}.columnBlocks.${columnId}.componentBlock.content`,
    content
  );
};

export const updateBlockStyle = (
  state: EditorState,
  layoutId: string,
  columnId: string,
  style: Partial<ComponentBlock["style"]>
): EditorState => {
  return set(
    { ...state },
    `layouts.${layoutId}.columnBlocks.${columnId}.componentBlock.style`,
    {
      ...state.layouts[layoutId].columnBlocks[columnId].componentBlock?.style,
      ...style,
    }
  );
};

export const updateBlockProperty = (
  state: EditorState,
  layoutId: string,
  columnId: string,
  path: string,
  value: any
): EditorState => {
  return set(
    { ...state },
    `layouts.${layoutId}.columnBlocks.${columnId}.componentBlock.${path}`,
    value
  );
};

// 블록 업데이트 atom
export const updateBlockAtom = atom(
  null,
  (
    get,
    set,
    {
      layoutId,
      columnId,
      path,
      value,
    }: {
      layoutId: string;
      columnId: string;
      path: string;
      value: any;
    }
  ) => {
    const prevState = get(editorStateAtom);
    const newState = updateBlockProperty(
      prevState,
      layoutId,
      columnId,
      path,
      value
    );
    set(editorStateAtom, newState);
  }
);

// 블록 컨텐츠 업데이트 atom
export const updateBlockContentAtom = atom(
  null,
  (
    get,
    set,
    {
      layoutId,
      columnId,
      content,
    }: {
      layoutId: string;
      columnId: string;
      content: string;
    }
  ) => {
    const prevState = get(editorStateAtom);
    const newState = updateBlockContent(prevState, layoutId, columnId, content);
    set(editorStateAtom, newState);
  }
);

// 블록 스타일 업데이트 atom
export const updateBlockStyleAtom = atom(
  null,
  (
    get,
    set,
    {
      layoutId,
      columnId,
      style,
    }: {
      layoutId: string;
      columnId: string;
      style: Partial<ComponentBlock["style"]>;
    }
  ) => {
    const prevState = get(editorStateAtom);
    const newState = updateBlockStyle(prevState, layoutId, columnId, style);
    set(editorStateAtom, newState);
  }
);
