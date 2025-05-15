import { atom } from "jotai";
import type { TableState } from "./types";

const tableAtoms = new Map<
  string,
  ReturnType<typeof createTableAtomInstance>
>();

const createTableAtomInstance = (tableId: string) => {
  const initialState: TableState = {
    currentPage: 1,
    perPage: 10,
    sort: {
      sortKey: "createdAt",
      sortDirection: "desc",
    },
    filters: {},
    searchQuery: "",
    isDetailDrawerOpen: false,
    isCreateDrawerOpen: false,
    selectedRow: null,
  };

  const tableStateAtom = atom(initialState);
  const currentPageAtom = atom(
    (get) => get(tableStateAtom).currentPage,
    (get, set, currentPage: number) =>
      set(tableStateAtom, { ...get(tableStateAtom), currentPage })
  );
  const perPageAtom = atom(
    (get) => get(tableStateAtom).perPage,
    (get, set, perPage: number) =>
      set(tableStateAtom, { ...get(tableStateAtom), perPage })
  );
  const sortAtom = atom(
    (get) => get(tableStateAtom).sort,
    (get, set, sort: { sortKey: string; sortDirection: "asc" | "desc" }) =>
      set(tableStateAtom, { ...get(tableStateAtom), sort })
  );
  const searchQueryAtom = atom(
    (get) => get(tableStateAtom).searchQuery,
    (get, set, searchQuery: string) =>
      set(tableStateAtom, { ...get(tableStateAtom), searchQuery })
  );
  const filtersAtom = atom(
    (get) => get(tableStateAtom).filters,
    (get, set, filters: Record<string, string>) =>
      set(tableStateAtom, { ...get(tableStateAtom), filters })
  );
  const detailDrawerAtom = atom(
    (get) => ({
      isOpen: get(tableStateAtom).isDetailDrawerOpen,
      selectedRow: get(tableStateAtom).selectedRow,
    }),
    (get, set, value: { isOpen: boolean; selectedRow: any }) =>
      set(tableStateAtom, {
        ...get(tableStateAtom),
        isDetailDrawerOpen: value.isOpen,
        selectedRow: value.selectedRow,
      })
  );
  const createDrawerAtom = atom(
    (get) => get(tableStateAtom).isCreateDrawerOpen,
    (get, set, isOpen: boolean) =>
      set(tableStateAtom, {
        ...get(tableStateAtom),
        isCreateDrawerOpen: isOpen,
      })
  );

  return {
    tableStateAtom,
    currentPageAtom,
    perPageAtom,
    sortAtom,
    searchQueryAtom,
    filtersAtom,
    detailDrawerAtom,
    createDrawerAtom,
  };
};

export const createTableAtom = (tableId: string) => {
  if (!tableAtoms.has(tableId)) {
    tableAtoms.set(tableId, createTableAtomInstance(tableId));
  }
  return tableAtoms.get(tableId)!;
};
