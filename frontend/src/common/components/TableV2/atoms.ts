import { atom } from "jotai";

export interface TableState {
  searchQuery: string;
  currentPage: number;
  perPage: number;
  sortKey: string;
  sortDirection: "asc" | "desc";
  filters: Record<string, string>;
  isDetailDrawerOpen: boolean;
  isCreateDrawerOpen: boolean;
  selectedRow: any | null;
}

const tableAtoms = new Map<
  string,
  ReturnType<typeof createTableAtomInstance>
>();

const createTableAtomInstance = (tableId: string) => {
  const initialState: TableState = {
    searchQuery: "",
    currentPage: 1,
    perPage: 10,
    sortKey: "",
    sortDirection: "asc",
    filters: {},
    isDetailDrawerOpen: false,
    isCreateDrawerOpen: false,
    selectedRow: null,
  };

  const baseAtom = atom<TableState>(initialState);

  return {
    tableStateAtom: baseAtom,
    searchQueryAtom: atom(
      (get) => get(baseAtom).searchQuery,
      (get, set, searchQuery: string) =>
        set(baseAtom, {
          ...get(baseAtom),
          searchQuery,
          currentPage: 1,
        })
    ),
    currentPageAtom: atom(
      (get) => get(baseAtom).currentPage,
      (get, set, page: number) =>
        set(baseAtom, {
          ...get(baseAtom),
          currentPage: page,
        })
    ),
    perPageAtom: atom(
      (get) => get(baseAtom).perPage,
      (get, set, perPage: number) =>
        set(baseAtom, {
          ...get(baseAtom),
          perPage,
          currentPage: 1,
        })
    ),
    sortAtom: atom(
      (get) => ({
        sortKey: get(baseAtom).sortKey,
        sortDirection: get(baseAtom).sortDirection,
      }),
      (
        get,
        set,
        {
          sortKey,
          sortDirection,
        }: { sortKey: string; sortDirection: "asc" | "desc" }
      ) =>
        set(baseAtom, {
          ...get(baseAtom),
          sortKey,
          sortDirection,
        })
    ),
    filtersAtom: atom(
      (get) => get(baseAtom).filters,
      (get, set, filters: Record<string, string>) =>
        set(baseAtom, {
          ...get(baseAtom),
          filters,
          currentPage: 1,
        })
    ),
    detailDrawerAtom: atom(
      (get) => ({
        isOpen: get(baseAtom).isDetailDrawerOpen,
        selectedRow: get(baseAtom).selectedRow,
      }),
      (
        get,
        set,
        { isOpen, selectedRow }: { isOpen: boolean; selectedRow: any | null }
      ) =>
        set(baseAtom, {
          ...get(baseAtom),
          isDetailDrawerOpen: isOpen,
          selectedRow,
        })
    ),
    createDrawerAtom: atom(
      (get) => get(baseAtom).isCreateDrawerOpen,
      (get, set, isOpen: boolean) =>
        set(baseAtom, {
          ...get(baseAtom),
          isCreateDrawerOpen: isOpen,
        })
    ),
  };
};

export const createTableAtom = (tableId: string) => {
  if (!tableAtoms.has(tableId)) {
    tableAtoms.set(tableId, createTableAtomInstance(tableId));
  }
  return tableAtoms.get(tableId)!;
};
