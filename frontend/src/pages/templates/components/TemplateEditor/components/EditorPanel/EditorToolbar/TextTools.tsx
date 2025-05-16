import { useAtom } from "jotai";
import {
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdFormatBold,
  MdFormatColorText,
  MdFormatItalic,
  MdFormatSize,
  MdFormatUnderlined,
} from "react-icons/md";
import styled from "styled-components";
import { editorTreeAtom, selectedBlockAtom } from "../../../atoms";
import type { TextBlock } from "../../../types";

const ToolSection = styled.div`
  display: flex;
  gap: 8px;
  padding-bottom: 8px;

  &:not(:last-child) {
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 8px;
  }
`;

const ToolGroup = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;

  &:not(:last-child) {
    padding-right: 8px;
    border-right: 1px solid #e0e0e0;
  }
`;

const ToolButton = styled.button<{ active?: boolean }>`
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

const Input = styled.input`
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

const ColorInput = styled.input`
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

const Select = styled.select`
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

const FONT_SIZES = [
  { value: "12px", label: "12px" },
  { value: "14px", label: "14px" },
  { value: "16px", label: "16px" },
  { value: "18px", label: "18px" },
  { value: "20px", label: "20px" },
  { value: "24px", label: "24px" },
  { value: "28px", label: "28px" },
  { value: "32px", label: "32px" },
];

const TextTools = () => {
  const [selectedBlock] = useAtom(selectedBlockAtom);
  const [tree, setTree] = useAtom(editorTreeAtom);

  const textBlock = selectedBlock as TextBlock | null;
  const style = {
    fontSize: "14px",
    color: "#000000",
    ...textBlock?.style,
  };

  const updateStyle = (updates: Partial<TextBlock["style"]>) => {
    if (!textBlock) return;

    setTree((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [textBlock.id]: {
          ...textBlock,
          style: { ...textBlock.style, ...updates },
        },
      },
    }));
  };

  return (
    <ToolSection>
      <ToolGroup>
        <ToolButton
          active={style.bold}
          onClick={() => updateStyle({ bold: !style.bold })}
          title="굵게"
        >
          <MdFormatBold />
        </ToolButton>
        <ToolButton
          active={style.italic}
          onClick={() => updateStyle({ italic: !style.italic })}
          title="기울임"
        >
          <MdFormatItalic />
        </ToolButton>
        <ToolButton
          active={style.underline}
          onClick={() => updateStyle({ underline: !style.underline })}
          title="밑줄"
        >
          <MdFormatUnderlined />
        </ToolButton>
      </ToolGroup>

      <ToolGroup>
        <ToolButton
          active={style.textAlign === "left"}
          onClick={() => updateStyle({ textAlign: "left" })}
          title="왼쪽 정렬"
        >
          <MdFormatAlignLeft />
        </ToolButton>
        <ToolButton
          active={style.textAlign === "center"}
          onClick={() => updateStyle({ textAlign: "center" })}
          title="가운데 정렬"
        >
          <MdFormatAlignCenter />
        </ToolButton>
        <ToolButton
          active={style.textAlign === "right"}
          onClick={() => updateStyle({ textAlign: "right" })}
          title="오른쪽 정렬"
        >
          <MdFormatAlignRight />
        </ToolButton>
        <ToolButton
          active={style.textAlign === "justify"}
          onClick={() => updateStyle({ textAlign: "justify" })}
          title="양쪽 정렬"
        >
          <MdFormatAlignJustify />
        </ToolButton>
      </ToolGroup>

      <ToolGroup>
        <ToolButton title="글자 크기">
          <MdFormatSize />
        </ToolButton>
        <Select
          value={style.fontSize}
          onChange={(e) => updateStyle({ fontSize: e.target.value })}
        >
          {FONT_SIZES.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </Select>
      </ToolGroup>

      <ToolGroup>
        <ToolButton title="글자 색상">
          <MdFormatColorText />
        </ToolButton>
        <ColorInput
          type="color"
          value={style.color}
          onChange={(e) => updateStyle({ color: e.target.value })}
        />
      </ToolGroup>
    </ToolSection>
  );
};

export default TextTools;
