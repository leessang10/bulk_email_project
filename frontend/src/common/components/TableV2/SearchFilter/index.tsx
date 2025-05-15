import React from "react";
import styled from "styled-components";
import type { FilterDef, SortOption } from "../types";

const Container = styled.div`
  margin-bottom: 1rem;
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 0.0625rem solid #e2e8f0;
  border-radius: 0.375rem;
  width: 16rem;
  font-size: 0.875rem;
  color: #475569;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border: 0.0625rem solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  min-width: 7rem;
  color: #475569;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const Label = styled.label`
  font-size: 0.875rem;
  color: #64748b;
  white-space: nowrap;
`;

export interface SearchFilterProps {
  searchPlaceholder?: string;
  onSearchChange: (value: string) => void;
  onPerPageChange: (value: number) => void;
  onSortChange: (value: string) => void;
  sortOptions: SortOption[];
  perPageOptions?: number[];
  filters?: (FilterDef & {
    onChange: (value: string | number | boolean) => void;
  })[];
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchPlaceholder = "검색어를 입력하세요",
  onSearchChange,
  onPerPageChange,
  onSortChange,
  sortOptions,
  perPageOptions = [10, 20, 50, 100],
  filters = [],
}) => {
  return (
    <Container>
      <SearchInput
        type="text"
        placeholder={searchPlaceholder}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      {filters.map((filter) => (
        <FilterGroup key={filter.name}>
          <Label>{filter.label}</Label>
          <Select
            onChange={(e) => {
              const value = e.target.value;
              // 값 타입 변환 처리
              const convertedValue = (() => {
                if (value === "true") return true;
                if (value === "false") return false;
                const num = Number(value);
                return isNaN(num) ? value : num;
              })();
              filter.onChange(convertedValue);
            }}
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FilterGroup>
      ))}

      <FilterGroup>
        <Label>정렬</Label>
        <Select onChange={(e) => onSortChange(e.target.value)}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FilterGroup>

      <FilterGroup>
        <Label>표시 개수</Label>
        <Select onChange={(e) => onPerPageChange(Number(e.target.value))}>
          {perPageOptions.map((value) => (
            <option key={value} value={value}>
              {value}개씩 보기
            </option>
          ))}
        </Select>
      </FilterGroup>
    </Container>
  );
};

export default SearchFilter;
