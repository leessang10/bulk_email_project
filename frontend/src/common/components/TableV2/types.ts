export interface ColumnDef<T> {
  key: keyof T;
  label: string;
  render?: (value: any) => React.ReactNode;
}

export interface TableState {
  currentPage: number;
  perPage: number;
  sort: {
    sortKey: string;
    sortDirection: "asc" | "desc";
  };
  filters: Record<string, string>;
  searchQuery: string;
  isDetailDrawerOpen: boolean;
  isCreateDrawerOpen: boolean;
  selectedRow: any | null;
}

export interface TableParams {
  page: number;
  perPage: number;
  sortKey: string;
  sortDirection: "asc" | "desc";
  filters: Record<string, string>;
  searchQuery: string;
}
