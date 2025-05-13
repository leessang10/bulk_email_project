import { atom } from "jotai";
import type { ComponentItem, LayoutItem } from "./types/editor";

export type ViewMode = "editor" | "preview" | "code";
export type DeviceMode = "desktop" | "mobile";

export const layoutsAtom = atom<LayoutItem[]>([]);
export const viewModeAtom = atom<ViewMode>("editor");
export const deviceModeAtom = atom<DeviceMode>("desktop");
export const selectedItemIdAtom = atom<string | null>(null);

// Derived atom for selected item
export const selectedItemAtom = atom((get) => {
  const layouts = get(layoutsAtom);
  const selectedItemId = get(selectedItemIdAtom);

  if (!selectedItemId) return null;

  return layouts.reduce<ComponentItem | LayoutItem | null>((found, layout) => {
    if (found) return found;
    if (layout.id === selectedItemId) return layout;
    const component = layout.children.find((c) => c.id === selectedItemId);
    return component || null;
  }, null);
});
