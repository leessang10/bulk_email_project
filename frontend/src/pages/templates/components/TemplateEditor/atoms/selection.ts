import { atom } from "jotai";

import { findComponentBlockById } from "./componentBlock";
import { editorStateAtom } from "./editor";

// 기본 선택 상태 atoms
export const selectedLayoutIdAtom = atom<string | null>(null);
export const selectedColumnBlockIdAtom = atom<string | null>(null);
export const selectedComponentBlockIdAtom = atom<string | null>(null);

// 선택된 레이아웃을 가져오는 derived atom
export const selectedLayoutAtom = atom((get) => {
  const state = get(editorStateAtom);
  const selectedId = get(selectedLayoutIdAtom);
  return selectedId ? state.layouts[selectedId] : null;
});

// 선택된 컬럼 블록을 가져오는 derived atom
export const selectedColumnBlockAtom = atom((get) => {
  const state = get(editorStateAtom);
  const selectedId = get(selectedColumnBlockIdAtom);
  const layoutId = get(selectedLayoutIdAtom);
  if (!layoutId || !selectedId) return null;
  return state.layouts[layoutId].columnBlocks[selectedId];
});

// 선택된 컴포넌트 블록을 가져오는 derived atom
export const selectedComponentBlockAtom = atom((get) => {
  const state = get(editorStateAtom);
  const selectedId = get(selectedComponentBlockIdAtom);

  if (!selectedId) return null;

  const location = findComponentBlockById(state, selectedId);
  return location?.block || null;
});

// 블록 선택을 위한 인터페이스와 atom
export interface SelectBlockParams {
  blockId: string;
  layoutId: string;
  columnId: string;
}

export const selectBlockAtom = atom(
  null,
  (_get, set, { blockId, layoutId, columnId }: SelectBlockParams) => {
    set(selectedLayoutIdAtom, layoutId);
    set(selectedColumnBlockIdAtom, columnId);
    set(selectedComponentBlockIdAtom, blockId);
  }
);

// 선택 해제를 위한 atom
export const clearSelectionAtom = atom(null, (_get, set) => {
  set(selectedLayoutIdAtom, null);
  set(selectedColumnBlockIdAtom, null);
  set(selectedComponentBlockIdAtom, null);
});
