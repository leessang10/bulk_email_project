import React from "react";
import styled from "styled-components";

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 8px;
`;

const PageButton = styled.button<{ isActive?: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${(props) => (props.isActive ? "#4a90e2" : "#ddd")};
  background-color: ${(props) => (props.isActive ? "#4a90e2" : "white")};
  color: ${(props) => (props.isActive ? "white" : "#333")};
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.isActive ? "#357abd" : "#f8f9fa")};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
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
      <PageButton onClick={() => onPageChange(1)} disabled={currentPage === 1}>
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
    </PaginationContainer>
  );
};

export default Pagination;
