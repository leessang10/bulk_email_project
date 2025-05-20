import { useAtom } from "jotai";


import { updateComponentBlockAtom } from "../../../atoms/componentBlock";
import { editorStateAtom } from "../../../atoms/editor";
import {
  selectedColumnBlockIdAtom,
  selectedComponentBlockIdAtom, selectedLayoutIdAtom,
} from '../../../atoms/selection';
import type { ButtonBlock } from "../../../types";
import DeleteButton from "./DeleteButton";
import {
  ColorInput,
  Input,
  Label,
  Select,
  ToolGroup,
  ToolSection,
} from "./styles";

const ButtonTools = () => {
  const [selectedBlockId] = useAtom(selectedComponentBlockIdAtom);
  const [editorState] = useAtom(editorStateAtom);
  const [selectedLayoutId] = useAtom(selectedLayoutIdAtom);
  const [selectedColumnId] = useAtom(selectedColumnBlockIdAtom);
  const [, updateComponentBlock] = useAtom(updateComponentBlockAtom);

  const buttonBlock =
    selectedLayoutId && selectedColumnId && selectedBlockId
      ? (editorState.layouts[selectedLayoutId].columnBlocks[selectedColumnId]
          .componentBlock as ButtonBlock)
      : null;

  if (!buttonBlock) return null;

  const style = buttonBlock.style;

  const updateButton = (updates: Partial<ButtonBlock>) => {
    if (!selectedBlockId) return;
    updateComponentBlock({ blockId: selectedBlockId, updates });
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
        <Select
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
        </Select>
      </ToolGroup>

      <ToolGroup>
        <DeleteButton />
      </ToolGroup>
    </ToolSection>
  );
};

export default ButtonTools;
