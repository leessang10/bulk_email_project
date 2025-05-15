import type { ReactNode } from "react";

export type SortDirection = "asc" | "desc";

export interface ColumnDef<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface SortOption {
  value: string;
  label: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterDef {
  name: string;
  label: string;
  options: FilterOption[];
}

export interface TableAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  icon?: ReactNode;
}

export interface TableState<T> {
  currentPage: number;
  perPage: number;
  sort: {
    sortKey: keyof T | "";
    sortDirection: SortDirection;
  };
  filters: Record<string, string | number | boolean>;
  searchQuery: string;
  isDetailDrawerOpen: boolean;
  isCreateDrawerOpen: boolean;
  selectedRow: T | null;
}

export interface TableParams {
  page: number;
  perPage: number;
  sortKey: string;
  sortDirection: SortDirection;
  filters: Record<string, string | number | boolean>;
  searchQuery: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
}
