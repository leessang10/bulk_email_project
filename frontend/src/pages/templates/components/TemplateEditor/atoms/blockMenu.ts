import { atom } from "jotai";
import { addComponentBlockAtom } from "./componentBlock";

// 블록 메뉴 상태 타입
export interface BlockMenuState {
  type: "block";
  x: number;
  y: number;
  layoutId: string;
  columnBlockId: string;
}

// 블록 메뉴 상태 atom
export const blockMenuStateAtom = atom<BlockMenuState | null>(null);

// 블록 메뉴 열기 atom
export const openBlockMenuAtom = atom(
  null,
  (get, set, params: Omit<BlockMenuState, "type">) => {
    set(blockMenuStateAtom, { ...params, type: "block" });
  }
);

// 블록 메뉴 닫기 atom
export const closeBlockMenuAtom = atom(null, (get, set) => {
  set(blockMenuStateAtom, null);
});

// 블록 메뉴 선택 처리 atom
export const handleBlockMenuSelectAtom = atom(
  null,
  (get, set, option: { type: string; value: string }) => {
    const menuState = get(blockMenuStateAtom);

    if (menuState?.layoutId && menuState.columnBlockId) {
      set(addComponentBlockAtom, {
        layoutId: menuState.layoutId,
        columnBlockId: menuState.columnBlockId,
        blockType: option.value,
      });
    }

    set(blockMenuStateAtom, null);
  }
);

// 블록 메뉴 옵션 atom
export const blockMenuOptionsAtom = atom(() => {
  return [
    { type: "block", value: "text", label: "텍스트", icon: null },
    { type: "block", value: "button", label: "버튼", icon: null },
    { type: "block", value: "image", label: "이미지", icon: null },
  ];
});
