import { atom } from "jotai";

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
