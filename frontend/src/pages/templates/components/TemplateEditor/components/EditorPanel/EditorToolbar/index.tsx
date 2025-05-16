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
import type { ButtonBlock, ImageBlock, TextBlock } from "../../../types";

const Container = styled.div`
  width: 100%;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 12px;
  position: sticky;
  top: 0;
  z-index: 100;
`;

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

const Label = styled.label`
  font-size: 14px;
  color: #666;
  margin-right: 4px;
`;

const TextTools = () => {
  const [selectedBlock] = useAtom(selectedBlockAtom);
  const [tree, setTree] = useAtom(editorTreeAtom);

  const textBlock = selectedBlock as TextBlock | null;
  const style = textBlock?.style || {};

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
        <Input
          type="text"
          value={style.fontSize || ""}
          onChange={(e) => updateStyle({ fontSize: e.target.value })}
          placeholder="예: 16px"
        />
      </ToolGroup>

      <ToolGroup>
        <ToolButton title="글자 색상">
          <MdFormatColorText />
        </ToolButton>
        <ColorInput
          type="color"
          value={style.color || "#000000"}
          onChange={(e) => updateStyle({ color: e.target.value })}
        />
      </ToolGroup>
    </ToolSection>
  );
};

const ButtonTools = () => {
  const [selectedBlock] = useAtom(selectedBlockAtom);
  const [tree, setTree] = useAtom(editorTreeAtom);

  const buttonBlock = selectedBlock as ButtonBlock;
  const style = buttonBlock.style;

  const updateButton = (updates: Partial<ButtonBlock>) => {
    setTree((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [buttonBlock.id]: {
          ...buttonBlock,
          ...updates,
        },
      },
    }));
  };

  return (
    <ToolSection>
      <ToolGroup>
        <Label>텍스트</Label>
        <Input
          type="text"
          value={buttonBlock.label}
          onChange={(e) => updateButton({ label: e.target.value })}
          placeholder="버튼 텍스트"
        />
      </ToolGroup>

      <ToolGroup>
        <Label>URL</Label>
        <Input
          type="text"
          value={buttonBlock.url}
          onChange={(e) => updateButton({ url: e.target.value })}
          placeholder="https://"
        />
      </ToolGroup>

      <ToolGroup>
        <Label>배경색</Label>
        <ColorInput
          type="color"
          value={style.backgroundColor || "#007bff"}
          onChange={(e) =>
            updateButton({
              style: { ...style, backgroundColor: e.target.value },
            })
          }
        />
      </ToolGroup>

      <ToolGroup>
        <Label>텍스트 색상</Label>
        <ColorInput
          type="color"
          value={style.color || "#ffffff"}
          onChange={(e) =>
            updateButton({ style: { ...style, color: e.target.value } })
          }
        />
      </ToolGroup>

      <ToolGroup>
        <Label>패딩</Label>
        <Input
          type="text"
          value={style.padding || ""}
          onChange={(e) =>
            updateButton({ style: { ...style, padding: e.target.value } })
          }
          placeholder="예: 8px 16px"
        />
      </ToolGroup>

      <ToolGroup>
        <Label>모서리</Label>
        <Input
          type="text"
          value={style.borderRadius || ""}
          onChange={(e) =>
            updateButton({ style: { ...style, borderRadius: e.target.value } })
          }
          placeholder="예: 4px"
        />
      </ToolGroup>
    </ToolSection>
  );
};

const ImageTools = () => {
  const [selectedBlock] = useAtom(selectedBlockAtom);
  const [tree, setTree] = useAtom(editorTreeAtom);

  const imageBlock = selectedBlock as ImageBlock;

  const updateImage = (updates: Partial<ImageBlock>) => {
    setTree((prev) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [imageBlock.id]: {
          ...imageBlock,
          ...updates,
        },
      },
    }));
  };

  return (
    <ToolSection>
      <ToolGroup>
        <Label>이미지 URL</Label>
        <Input
          type="text"
          value={imageBlock.src}
          onChange={(e) => updateImage({ src: e.target.value })}
          placeholder="https://"
        />
      </ToolGroup>

      <ToolGroup>
        <Label>대체 텍스트</Label>
        <Input
          type="text"
          value={imageBlock.alt || ""}
          onChange={(e) => updateImage({ alt: e.target.value })}
          placeholder="이미지 설명"
        />
      </ToolGroup>

      <ToolGroup>
        <Label>너비</Label>
        <Input
          type="text"
          value={imageBlock.width || ""}
          onChange={(e) => updateImage({ width: e.target.value })}
          placeholder="예: 100px 또는 100%"
        />
      </ToolGroup>
    </ToolSection>
  );
};

const EditorToolbar = () => {
  const [selectedBlock] = useAtom(selectedBlockAtom);

  return (
    <Container>
      <TextTools />
      {selectedBlock && (
        <>
          {selectedBlock.type === "button" && <ButtonTools />}
          {selectedBlock.type === "image" && <ImageTools />}
        </>
      )}
    </Container>
  );
};

export default EditorToolbar;
