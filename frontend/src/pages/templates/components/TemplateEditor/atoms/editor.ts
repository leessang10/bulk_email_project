import { atom } from "jotai";
import type { EditorState } from "../types";

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

// 기본 에디터 상태
export const editorStateAtom = atom<EditorState>({
  layouts: {},
});

// 정렬된 레이아웃 atom
export const sortedLayoutsAtom = atom((get) => {
  const editorState = get(editorStateAtom);
  return Object.values(editorState.layouts).sort((a, b) => a.order - b.order);
});
