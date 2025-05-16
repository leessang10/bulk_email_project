import { useAtom } from "jotai";
import styled from "styled-components";
import { editorTreeAtom, selectedBlockAtom } from "../../../atoms";
import type { ImageBlock } from "../../../types";

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

const Label = styled.label`
  font-size: 14px;
  color: #666;
  margin-right: 4px;
`;

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

export default ImageTools;
