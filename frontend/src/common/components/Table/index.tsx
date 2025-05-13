import React from "react";
import styled from "styled-components";

const TableContainer = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.1);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 0.125rem solid #eee;
  color: #666;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const Td = styled.td`
  padding: 0.75rem 1rem;
  border-bottom: 0.0625rem solid #eee;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f8f9fa;
  }
`;

interface Column {
  key: string;
  label: string;
}

interface TableProps {
  columns: Column[];
  data: any[];
  onSort?: (key: string) => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  onSort,
  sortKey,
  sortDirection,
}) => {
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
            <Tr key={index}>
              {columns.map((column) => (
                <Td key={column.key}>{row[column.key]}</Td>
              ))}
            </Tr>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default Table;
