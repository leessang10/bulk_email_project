import React from "react";
import styled from "styled-components";

interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
}

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:hover {
    border-color: #4a90e2;
  }

  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
}) => {
  const formatDate = (date: Date) => {
    return date.toISOString().slice(0, 16);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    onChange(date);
  };

  return (
    <Input
      type="datetime-local"
      value={value ? formatDate(value) : ""}
      onChange={handleChange}
      min={minDate ? formatDate(minDate) : undefined}
      max={maxDate ? formatDate(maxDate) : undefined}
    />
  );
};
