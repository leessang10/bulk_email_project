import styled from "styled-components";

export const ToolSection = styled.div<{ disabled?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 8px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

  &:not(:last-child) {
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 8px;
  }
`;

export const ToolGroup = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  min-height: 32px;
  flex-shrink: 0;

  &:not(:last-child) {
    padding-right: 8px;
    border-right: 1px solid #e0e0e0;
  }

  @media (max-width: 768px) {
    &:not(:last-child) {
      border-right: none;
      border-bottom: 1px solid #e0e0e0;
      padding-right: 0;
      padding-bottom: 8px;
      width: 100%;
    }
  }
`;

export const Input = styled.input`
  padding: 4px 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  width: 120px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

export const ColorInput = styled.input`
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
  }
`;

export const Label = styled.label`
  font-size: 14px;
  color: #666;
  margin-right: 4px;
`;

export const Select = styled.select`
  padding: 4px 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  width: 80px;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

export const ToolButton = styled.button<{ active?: boolean }>`
  padding: 6px;
  border: none;
  background: ${(props) => (props.active ? "#e8e8e8" : "transparent")};
  border-radius: 4px;
  cursor: pointer;
  color: ${(props) => (props.active ? "#007bff" : "#666")};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f0f0f0;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;
