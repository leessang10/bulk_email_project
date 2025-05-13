import React from "react";
import styled from "styled-components";

interface RangeInputProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  label: string;
  onChange: (value: number) => void;
}

const RangeInput: React.FC<RangeInputProps> = ({
  value,
  min,
  max,
  step = 1,
  unit = "px",
  label,
  onChange,
}) => {
  return (
    <Container>
      <Label>{label}</Label>
      <InputGroup>
        <Range
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <NumberInput
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <Unit>{unit}</Unit>
      </InputGroup>
    </Container>
  );
};

const Container = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Range = styled.input`
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  background: #e0e0e0;
  border-radius: 2px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: #1a73e8;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

const NumberInput = styled.input`
  width: 60px;
  padding: 4px 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  text-align: center;
`;

const Unit = styled.span`
  color: #666;
  font-size: 14px;
  width: 24px;
`;

export default RangeInput;
