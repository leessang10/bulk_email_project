import { useAtom } from "jotai";
import { nanoid } from "nanoid";
import React from "react";
import { MdViewColumn } from "react-icons/md";
import styled from "styled-components";
import { editorStateAtom } from "../../../atoms";
import type { EditorState } from "../../../types";
import FloatingMenu from "./FloatingMenu";

const Button = styled.button`
  width: 100%;
  background: rgba(0, 123, 255, 0.04);
  border: 2px dashed rgba(0, 123, 255, 0.2);
  color: #007bff;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 123, 255, 0.08);
    border-color: rgba(0, 123, 255, 0.4);
  }
`;

interface MenuState {
  x: number;
  y: number;
}

const LAYOUT_OPTIONS = [
  { type: "layout", value: "1", label: "1열 레이아웃", icon: <MdViewColumn /> },
  { type: "layout", value: "2", label: "2열 레이아웃", icon: <MdViewColumn /> },
  { type: "layout", value: "3", label: "3열 레이아웃", icon: <MdViewColumn /> },
  { type: "layout", value: "4", label: "4열 레이아웃", icon: <MdViewColumn /> },
];

const AddLayoutButton = () => {
  const [editorState, setEditorState] = useAtom(editorStateAtom);
  const [menuState, setMenuState] = React.useState<MenuState | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    setMenuState({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMenuSelect = (option: { type: string; value: string }) => {
    const newLayoutId = nanoid();
    const columnsCount = Number(option.value);

    // 새로운 컬럼 블록들 생성
    const newColumnBlocks: EditorState["layouts"][string]["columnBlocks"] = {};
    Array.from({ length: columnsCount }).forEach((_, index) => {
      const columnId = nanoid();
      newColumnBlocks[columnId] = {
        id: columnId,
        order: index,
        layoutId: newLayoutId,
        componentBlock: null,
      };
    });

    setEditorState((prev: EditorState) => {
      // 새 레이아웃의 순서는 현재 레이아웃들 중 가장 큰 order + 1
      const maxOrder = Object.values(prev.layouts).reduce(
        (max, layout) => Math.max(max, layout.order),
        -1
      );

      const newLayout: EditorState["layouts"][string] = {
        id: newLayoutId,
        order: maxOrder + 1,
        columnBlocks: newColumnBlocks,
      };

      return {
        ...prev,
        layouts: {
          ...prev.layouts,
          [newLayoutId]: newLayout,
        },
      };
    });

    setMenuState(null);
  };

  const handleMenuClose = () => {
    setMenuState(null);
  };

  return (
    <>
      <Button onClick={handleClick}>+ 레이아웃 추가</Button>
      {menuState && (
        <FloatingMenu
          type="layout"
          x={menuState.x}
          y={menuState.y}
          onSelect={handleMenuSelect}
          onClose={handleMenuClose}
          options={LAYOUT_OPTIONS}
        />
      )}
    </>
  );
};

export default AddLayoutButton;
