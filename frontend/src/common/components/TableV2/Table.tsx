import { useAtom } from "jotai";
import React from "react";
import styled from "styled-components";
import { createTableAtom } from "./atoms";
import Drawer from "./Drawer";
import Pagination from "./Pagination";
import SearchFilter from "./SearchFilter";
import type {
  ColumnDef,
  FilterDef,
  PaginationInfo,
  SortOption,
  TableAction,
  TableParams,
} from "./types";

const TableContainer = styled.div`
  background: white;
  border-radius: 0.375rem;
  box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.1);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

const Th = styled.th`
  padding: 0.625rem 0.75rem;
  text-align: left;
  border-bottom: 0.0625rem solid #eee;
  color: #666;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const Td = styled.td<{ $align?: "left" | "center" | "right" }>`
  padding: 0.625rem 0.75rem;
  border-bottom: 0.0625rem solid #eee;
  color: #475569;
  text-align: ${(props) => props.$align || "left"};
`;

const Tr = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }

  &:last-child td {
    border-bottom: none;
  }
`;

export interface TableV2Props<T> {
  tableId: string;
  columns: ColumnDef<T>[];
  data: T[];
  totalItems: number;
  sortOptions: SortOption[];
  filters?: FilterDef[];
  actions?: TableAction[];
  onDataRequest: (params: TableParams) => void;
  onRowClick?: (row: T) => void;
  DetailDrawerContent?: React.FC<{ data: T; onClose?: () => void }>;
  CreateDrawerContent?: React.FC<{ onClose?: () => void }>;
  paginationInfo?: PaginationInfo;
}

const TableV2 = <T extends Record<string, any>>({
  tableId,
  columns,
  data,
  totalItems,
  sortOptions,
  filters = [],
  actions,
  onDataRequest,
  onRowClick,
  DetailDrawerContent,
  CreateDrawerContent,
  paginationInfo,
}: TableV2Props<T>) => {
  const atoms = React.useMemo(() => createTableAtom(tableId), [tableId]);

  const [searchQuery, setSearchQuery] = useAtom(atoms.searchQueryAtom);
  const [currentPage, setCurrentPage] = useAtom(atoms.currentPageAtom);
  const [perPage, setPerPage] = useAtom(atoms.perPageAtom);
  const [sort, setSort] = useAtom(atoms.sortAtom);
  const [filterValues, setFilterValues] = useAtom(atoms.filtersAtom);
  const [detailDrawer, setDetailDrawer] = useAtom(atoms.detailDrawerAtom);
  const [isCreateDrawerOpen, setCreateDrawerOpen] = useAtom(
    atoms.createDrawerAtom
  );

  React.useEffect(() => {
    onDataRequest({
      page: currentPage,
      perPage,
      sortKey: sort.sortKey,
      sortDirection: sort.sortDirection,
      filters: filterValues,
      searchQuery,
    });
  }, [
    currentPage,
    perPage,
    sort.sortKey,
    sort.sortDirection,
    filterValues,
    searchQuery,
  ]);

  const handleSort = (key: keyof T) => {
    if (!columns.find((col) => col.key === key)?.sortable) return;

    setSort({
      sortKey: key as string,
      sortDirection:
        sort.sortKey === key && sort.sortDirection === "asc" ? "desc" : "asc",
    });
  };

  const handleFilterChange = (
    name: string,
    value: string | number | boolean
  ) => {
    setFilterValues({ ...filterValues, [name]: value });
  };

  const totalPages = Math.ceil(totalItems / perPage);

  return (
    <div>
      <TableHeader>
        <SearchFilter
          searchPlaceholder="검색어를 입력하세요"
          onSearchChange={setSearchQuery}
          onPerPageChange={setPerPage}
          onSortChange={(value) =>
            setSort({ sortKey: value, sortDirection: "asc" })
          }
          sortOptions={sortOptions}
          filters={filters.map((filter) => ({
            ...filter,
            onChange: (value) => handleFilterChange(filter.name, value),
          }))}
        />
        {actions && actions.length > 0 && (
          <ActionButtons>
            {actions.map((action, index) => (
              <ActionButton
                key={index}
                onClick={action.onClick}
                $variant={action.variant}
                disabled={action.disabled}
              >
                {action.icon && <span className="icon">{action.icon}</span>}
                {action.label}
              </ActionButton>
            ))}
          </ActionButtons>
        )}
      </TableHeader>

      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              {columns.map((column) => (
                <Th
                  key={String(column.key)}
                  onClick={() => handleSort(column.key)}
                  style={{
                    width: column.width,
                    cursor: column.sortable ? "pointer" : "default",
                  }}
                >
                  {column.label}
                  {column.sortable && sort.sortKey === column.key && (
                    <span>{sort.sortDirection === "asc" ? " ↑" : " ↓"}</span>
                  )}
                </Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <Tr
                key={index}
                onClick={() => {
                  setDetailDrawer({ isOpen: true, selectedRow: row });
                  onRowClick?.(row);
                }}
              >
                {columns.map((column) => (
                  <Td key={String(column.key)} $align={column.align}>
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </Td>
                ))}
              </Tr>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>

      <Pagination
        currentPage={paginationInfo?.currentPage || currentPage}
        totalPages={paginationInfo?.totalPages || totalPages}
        totalItems={paginationInfo?.totalItems || totalItems}
        perPage={paginationInfo?.perPage || perPage}
        onPageChange={setCurrentPage}
      />

      {DetailDrawerContent && detailDrawer.selectedRow && (
        <Drawer
          isOpen={detailDrawer.isOpen}
          onClose={() => setDetailDrawer({ isOpen: false, selectedRow: null })}
          title="상세 정보"
        >
          <DetailDrawerContent
            data={detailDrawer.selectedRow}
            onClose={() =>
              setDetailDrawer({ isOpen: false, selectedRow: null })
            }
          />
        </Drawer>
      )}

      {CreateDrawerContent && (
        <Drawer
          isOpen={isCreateDrawerOpen}
          onClose={() => setCreateDrawerOpen(false)}
          title="새로 만들기"
        >
          <CreateDrawerContent onClose={() => setCreateDrawerOpen(false)} />
        </Drawer>
      )}
    </div>
  );
};

export default TableV2;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{
  $variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  .icon {
    display: flex;
    align-items: center;
  }

  ${({ $variant }) => {
    switch ($variant) {
      case "primary":
        return `
          background-color: #2196f3;
          color: white;
          &:hover {
            background-color: #1976d2;
          }
        `;
      case "danger":
        return `
          background-color: #f44336;
          color: white;
          &:hover {
            background-color: #d32f2f;
          }
        `;
      default:
        return `
          background-color: #e0e0e0;
          color: #333;
          &:hover {
            background-color: #bdbdbd;
          }
        `;
    }
  }}
`;
