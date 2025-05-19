import { useAtom } from "jotai";
import styled from "styled-components";
import {
  editorStateAtom,
  selectedColumnBlockIdAtom,
  selectedComponentBlockIdAtom,
  selectedLayoutIdAtom,
} from "../../../atoms";
import type { ButtonBlock } from "../../../types";

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

const ButtonTools = () => {
  const [selectedBlockId] = useAtom(selectedComponentBlockIdAtom);
  const [editorState, setEditorState] = useAtom(editorStateAtom);
  const [selectedLayoutId] = useAtom(selectedLayoutIdAtom);
  const [selectedColumnId] = useAtom(selectedColumnBlockIdAtom);

  const buttonBlock =
    selectedLayoutId && selectedColumnId && selectedBlockId
      ? (editorState.layouts[selectedLayoutId].columnBlocks[selectedColumnId]
          .componentBlock as ButtonBlock)
      : null;

  if (!buttonBlock) return null;

  const style = buttonBlock.style;

  const updateButton = (updates: Partial<ButtonBlock>) => {
    if (!selectedLayoutId || !selectedColumnId) return;

    setEditorState((prev) => ({
      ...prev,
      layouts: {
        ...prev.layouts,
        [selectedLayoutId]: {
          ...prev.layouts[selectedLayoutId],
          columnBlocks: {
            ...prev.layouts[selectedLayoutId].columnBlocks,
            [selectedColumnId]: {
              ...prev.layouts[selectedLayoutId].columnBlocks[selectedColumnId],
              componentBlock: {
                ...buttonBlock,
                ...updates,
              },
            },
          },
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
        <Label>정렬</Label>
        <select
          value={style.align || "center"}
          onChange={(e) =>
            updateButton({
              style: {
                ...style,
                align: e.target.value as "left" | "center" | "right",
              },
            })
          }
        >
          <option value="left">왼쪽</option>
          <option value="center">가운데</option>
          <option value="right">오른쪽</option>
        </select>
      </ToolGroup>
    </ToolSection>
  );
};

export default ButtonTools;
