import React from "react";
import styled from "styled-components";

const Container = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 16px;
  align-items: flex-end;
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 120px;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Label = styled.label`
  font-size: 14px;
  color: #666;
`;

interface SearchFilterProps {
  searchPlaceholder?: string;
  onSearchChange: (value: string) => void;
  onPerPageChange: (value: number) => void;
  onSortChange: (value: string) => void;
  sortOptions: { value: string; label: string }[];
  perPageOptions?: number[];
  filters?: {
    name: string;
    label: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
  }[];
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
          <Select onChange={(e) => filter.onChange(e.target.value)}>
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
