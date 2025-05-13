import React from "react";
import styled from "styled-components";

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

interface TableProps<T> {
  columns: Column[];
  data: T[];
  onSort?: (key: string) => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onRowClick?: (row: T) => void;
}

const Table = <T extends Record<string, any>>({
  columns,
  data,
  onSort,
  sortKey,
  sortDirection,
  onRowClick,
}: TableProps<T>) => {
  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            {columns.map((column) => (
              <Th key={column.key} onClick={() => onSort?.(column.key)}>
                {column.label}
                {sortKey === column.key && (
                  <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
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
