import { useAtom } from "jotai";
import React from "react";
import styled from "styled-components";
import Drawer from "../Drawer";
import Pagination from "../Pagination";
import SearchFilter from "../SearchFilter";
import { createTableAtom } from "./atoms";

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

const Td = styled.td`
  padding: 0.625rem 0.75rem;
  border-bottom: 0.0625rem solid #eee;
  color: #475569;
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

interface Column {
  key: string;
  label: string;
  render?: (value: any) => React.ReactNode;
}

interface TableV2Props<T> {
  tableId: string;
  columns: Column[];
  data: T[];
  totalItems: number;
  sortOptions: { value: string; label: string }[];
  filters?: {
    name: string;
    label: string;
    options: { value: string; label: string }[];
  }[];
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "danger";
  }>;
  onDataRequest: (params: {
    page: number;
    perPage: number;
    sortKey: string;
    sortDirection: "asc" | "desc";
    filters: Record<string, string>;
    searchQuery: string;
  }) => void;
  onRowClick?: (row: T) => void;
  DetailDrawerContent?: React.FC<{ data: T; onClose?: () => void }>;
  CreateDrawerContent?: React.FC<{ onClose?: () => void }>;
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

  const handleSort = (key: string) => {
    setSort({
      sortKey: key,
      sortDirection:
        sort.sortKey === key && sort.sortDirection === "asc" ? "desc" : "asc",
    });
  };

  const handleFilterChange = (name: string, value: string) => {
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
              >
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
                <Th key={column.key} onClick={() => handleSort(column.key)}>
                  {column.label}
                  {sort.sortKey === column.key && (
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
                  <Td key={column.key}>
                    {column.render
                      ? column.render(row[column.key])
                      : row[column.key]}
                  </Td>
                ))}
              </Tr>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
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
}>`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

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
