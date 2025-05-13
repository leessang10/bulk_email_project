import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface Option {
  value: number | string;
  label: string;
}

interface SelectProps {
  value: number | string | (number | string)[] | null;
  onChange: (value: number | string | (number | string)[]) => void;
  options: Option[];
  placeholder?: string;
  isMulti?: boolean;
}

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SelectButton = styled.button`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    border-color: #4a90e2;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
`;

const Option = styled.div<{ isSelected: boolean }>`
  padding: 8px 12px;
  cursor: pointer;
  background: ${({ isSelected }) => (isSelected ? "#f0f7ff" : "white")};
  color: ${({ isSelected }) => (isSelected ? "#4a90e2" : "#333")};

  &:hover {
    background: #f0f7ff;
  }
`;

const SelectedTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const Tag = styled.div`
  background: #e3f2fd;
  color: #4a90e2;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RemoveTag = styled.button`
  background: none;
  border: none;
  color: #4a90e2;
  cursor: pointer;
  padding: 0;
  font-size: 1.2rem;
  line-height: 1;

  &:hover {
    color: #357abd;
  }
`;

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "선택하세요",
  isMulti = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: number | string) => {
    if (isMulti) {
      const currentValues = (value as (number | string)[]) || [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const removeTag = (tagValue: number | string) => {
    if (isMulti && Array.isArray(value)) {
      onChange(value.filter((v) => v !== tagValue));
    }
  };

  const getSelectedLabels = () => {
    if (!value) return placeholder;
    if (isMulti && Array.isArray(value)) {
      return (
        <SelectedTags>
          {value.map((v) => {
            const option = options.find((opt) => opt.value === v);
            return option ? (
              <Tag key={v}>
                {option.label}
                <RemoveTag onClick={() => removeTag(v)}>&times;</RemoveTag>
              </Tag>
            ) : null;
          })}
        </SelectedTags>
      );
    }
    const option = options.find((opt) => opt.value === value);
    return option ? option.label : placeholder;
  };

  return (
    <SelectContainer ref={containerRef}>
      <SelectButton type="button" onClick={() => setIsOpen(!isOpen)}>
        {getSelectedLabels()}
        <span>{isOpen ? "▲" : "▼"}</span>
      </SelectButton>
      {isOpen && (
        <Dropdown>
          {options.map((option) => (
            <Option
              key={option.value}
              isSelected={
                isMulti
                  ? Array.isArray(value) && value.includes(option.value)
                  : value === option.value
              }
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </Option>
          ))}
        </Dropdown>
      )}
    </SelectContainer>
  );
};
