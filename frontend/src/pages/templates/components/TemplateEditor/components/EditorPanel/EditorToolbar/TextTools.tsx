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
import { updateComponentBlockAtom } from "../../../atoms/componentBlock";
import { editorStateAtom } from "../../../atoms/editor";
import {
  selectedColumnBlockIdAtom,
  selectedComponentBlockIdAtom,
  selectedLayoutIdAtom,
} from "../../../atoms/selection";
import type { TextBlock } from "../../../types";
import DeleteButton from "./DeleteButton";
import {
  ColorInput,
  Select,
  ToolButton,
  ToolGroup,
  ToolSection,
} from "./styles";

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
  const [editorState] = useAtom(editorStateAtom);
  const [selectedLayoutId] = useAtom(selectedLayoutIdAtom);
  const [selectedColumnId] = useAtom(selectedColumnBlockIdAtom);
  const [selectedBlockId] = useAtom(selectedComponentBlockIdAtom);
  const [, updateComponentBlock] = useAtom(updateComponentBlockAtom);

  const selectedBlock =
    selectedLayoutId && selectedColumnId && selectedBlockId
      ? editorState.layouts[selectedLayoutId].columnBlocks[selectedColumnId]
          .componentBlock
      : null;

  const textBlock =
    selectedBlock?.type === "text" ? (selectedBlock as TextBlock) : null;

  const style = textBlock?.style || {
    fontSize: "14px",
    color: "#000000",
    textAlign: "left" as const,
  };

  const updateStyle = (updates: Partial<TextBlock["style"]>) => {
    if (!textBlock || !selectedBlockId) return;

    const updatedStyle = {
      ...textBlock.style,
      ...updates,
    };

    updateComponentBlock({
      blockId: selectedBlockId,
      updates: { style: updatedStyle },
    });
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

      <ToolGroup>
        <DeleteButton />
      </ToolGroup>
    </ToolSection>
  );
};

export default TextTools;
