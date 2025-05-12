import React from "react";
import styled from "styled-components";
import { EMAIL_SAFE_FONTS } from "../../constants/fonts";

interface TextStyleControlsProps {
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  onFontFamilyChange: (value: string) => void;
  onBoldChange: (value: boolean) => void;
  onItalicChange: (value: boolean) => void;
  onUnderlineChange: (value: boolean) => void;
  onStrikethroughChange: (value: boolean) => void;
}

const TextStyleControls: React.FC<TextStyleControlsProps> = ({
  fontFamily,
  isBold,
  isItalic,
  isUnderline,
  isStrikethrough,
  onFontFamilyChange,
  onBoldChange,
  onItalicChange,
  onUnderlineChange,
  onStrikethroughChange,
}) => {
  return (
    <Container>
      <Select
        value={fontFamily}
        onChange={(e) => onFontFamilyChange(e.target.value)}
      >
        {EMAIL_SAFE_FONTS.map((font) => (
          <option
            key={font.value}
            value={font.value}
            style={{ fontFamily: font.value }}
          >
            {font.label}
          </option>
        ))}
      </Select>
      <ButtonGroup>
        <StyleButton
          type="button"
          $active={isBold}
          onClick={() => onBoldChange(!isBold)}
          title="굵게"
        >
          B
        </StyleButton>
        <StyleButton
          type="button"
          $active={isItalic}
          onClick={() => onItalicChange(!isItalic)}
          title="기울임"
        >
          I
        </StyleButton>
        <StyleButton
          type="button"
          $active={isUnderline}
          onClick={() => onUnderlineChange(!isUnderline)}
          title="밑줄"
        >
          U
        </StyleButton>
        <StyleButton
          type="button"
          $active={isStrikethrough}
          onClick={() => onStrikethroughChange(!isStrikethrough)}
          title="취소선"
        >
          S
        </StyleButton>
      </ButtonGroup>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: white;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 4px;
`;

const StyleButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: ${({ $active }) => ($active ? "#1a73e8" : "white")};
  color: ${({ $active }) => ($active ? "white" : "#333")};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ $active }) => ($active ? "#1557b0" : "#f5f5f5")};
  }
`;

export default TextStyleControls;
