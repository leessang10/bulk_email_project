import React from "react";
import styled from "styled-components";
import type { PaginationInfo } from "../types";

export interface PaginationProps extends PaginationInfo {
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
}) => {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PageButton
          key={i}
          isActive={i === currentPage}
          onClick={() => onPageChange(i)}
        >
          {i}
        </PageButton>
      );
    }

    return pages;
  };

  return (
    <PaginationContainer>
      <PageInfo>
        총 {totalItems}개 중 {(currentPage - 1) * perPage + 1}-
        {Math.min(currentPage * perPage, totalItems)}개
      </PageInfo>
      <PageButtonContainer>
        <PageButton
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          {"<<"}
        </PageButton>
        <PageButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {"<"}
        </PageButton>
        {renderPageNumbers()}
        <PageButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {">"}
        </PageButton>
        <PageButton
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          {">>"}
        </PageButton>
      </PageButtonContainer>
    </PaginationContainer>
  );
};

export default Pagination;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding: 0 1rem;
`;

const PageButtonContainer = styled.div`
  display: flex;
  gap: 0.375rem;
`;

const PageInfo = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const PageButton = styled.button<{ isActive?: boolean }>`
  padding: 0.375rem 0.625rem;
  border: 0.0625rem solid ${(props) => (props.isActive ? "#4a90e2" : "#e2e8f0")};
  background-color: ${(props) => (props.isActive ? "#4a90e2" : "white")};
  color: ${(props) => (props.isActive ? "white" : "#475569")};
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  min-width: 2rem;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.isActive ? "#357abd" : "#f8f9fa")};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
