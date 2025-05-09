import { create } from "zustand";

export type SystemType = "잡스" | "틀루토";
export interface SystemStore {
  system: SystemType;
  toggleSystem: () => void;
}

export const useSystemStore = create<SystemStore>((set) => ({
  system: "잡스",
  toggleSystem: () =>
    set((state) => ({ system: state.system === "잡스" ? "틀루토" : "잡스" })),
}));
