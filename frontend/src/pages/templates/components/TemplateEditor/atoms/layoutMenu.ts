import { atom } from "jotai";
import { maxBy, range } from "lodash";
import { nanoid } from "nanoid";
import type { EditorState } from "../types";
import { editorStateAtom } from "./editor";

// 레이아웃 메뉴 상태 타입
export interface LayoutMenuState {
  type: "layout";
  x: number;
  y: number;
}

// 레이아웃 메뉴 상태 atom
export const layoutMenuStateAtom = atom<LayoutMenuState | null>(null);

// 레이아웃 메뉴 열기 atom
export const openLayoutMenuAtom = atom(
  null,
  (get, set, params: Omit<LayoutMenuState, "type">) => {
    set(layoutMenuStateAtom, { ...params, type: "layout" });
  }
);

// 레이아웃 메뉴 닫기 atom
export const closeLayoutMenuAtom = atom(null, (get, set) => {
  set(layoutMenuStateAtom, null);
});

// 레이아웃 추가 atom
export const addLayoutAtom = atom(null, (get, set, columnsCount: number) => {
  const newLayoutId = nanoid();

  const columnBlocks = range(columnsCount).reduce((acc, index) => {
    const columnId = nanoid();
    return {
      ...acc,
      [columnId]: {
        id: columnId,
        order: index,
        layoutId: newLayoutId,
        componentBlock: null,
      },
    };
  }, {});

  set(editorStateAtom, (prev: EditorState) => {
    const maxOrder = maxBy(Object.values(prev.layouts), "order")?.order ?? -1;
    return {
      ...prev,
      layouts: {
        ...prev.layouts,
        [newLayoutId]: {
          id: newLayoutId,
          order: maxOrder + 1,
          columnBlocks,
        },
      },
    };
  });
});

// 레이아웃 메뉴 옵션 atom
export const layoutMenuOptionsAtom = atom(() => {
  return range(1, 5).map((num) => ({
    type: "layout",
    value: String(num),
    label: `${num}열 레이아웃`,
    icon: null,
  }));
});

// 레이아웃 메뉴 선택 처리 atom
export const handleLayoutMenuSelectAtom = atom(
  null,
  (get, set, option: { type: string; value: string }) => {
    const columnsCount = Number(option.value);
    set(addLayoutAtom, columnsCount);
    set(layoutMenuStateAtom, null);
  }
);
