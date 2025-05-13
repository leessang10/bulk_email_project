import styled from "styled-components";

interface Column {
  key: string;
  label: string;
  render?: (value: any) => React.ReactNode;
}

export interface TableProps<T> {
  columns: Column[];
  data: T[];
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
  onRowClick?: (row: T) => void;
}

const TableContainer = styled.div`
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th<{ sortable?: boolean }>`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #1a2230;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
  cursor: ${({ sortable }) => (sortable ? "pointer" : "default")};
  white-space: nowrap;

  &:hover {
    ${({ sortable }) => sortable && "background-color: #f1f5f9;"}
  }
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #475569;
`;

const Tr = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  &:last-child td {
    border-bottom: none;
  }
`;

const SortIcon = styled.span<{ direction?: "asc" | "desc" }>`
  margin-left: 4px;
  opacity: 0.5;

  &::after {
    content: "${({ direction }) =>
      direction === "asc" ? "↑" : direction === "desc" ? "↓" : ""}";
  }
`;

const Table = <T extends Record<string, any>>({
  columns,
  data,
  sortKey,
  sortDirection,
  onSort,
  onRowClick,
}: TableProps<T>) => {
  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            {columns.map((column) => (
              <Th
                key={column.key}
                onClick={() => onSort?.(column.key)}
                sortable={!!onSort}
              >
                {column.label}
                {sortKey === column.key && (
                  <SortIcon direction={sortDirection} />
                )}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <Tr key={index} onClick={() => onRowClick?.(row)}>
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
  );
};

export default Table;
