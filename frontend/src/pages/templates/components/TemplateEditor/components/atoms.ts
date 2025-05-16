import { atom } from "jotai";
import type { ColumnPath, EditorTree } from "./types";

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

export const editorTreeAtom = atom<EditorTree>({
  blocks: {
    "initial-layout": {
      id: "initial-layout",
      type: "layout",
      parentId: null,
      columns: 1,
      children: [],
    },
  },
  rootIds: ["initial-layout"],
});

export const selectedBlockIdAtom = atom<string | null>(null);

export const selectedColumnPathAtom = atom<ColumnPath | null>(null);

export const selectedBlockAtom = atom((get) => {
  const tree = get(editorTreeAtom);
  const selectedId = get(selectedBlockIdAtom);
  return selectedId ? tree.blocks[selectedId] : null;
});
