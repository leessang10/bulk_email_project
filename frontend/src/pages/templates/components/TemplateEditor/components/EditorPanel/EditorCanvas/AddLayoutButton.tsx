import { useAtom } from "jotai";
import { nanoid } from "nanoid";
import React from "react";
import { MdViewColumn } from "react-icons/md";
import styled from "styled-components";
import { editorTreeAtom } from "../../../atoms";
import type { EditorTree, LayoutBlock } from "../../../types";
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
  const [, setTree] = useAtom(editorTreeAtom);
  const [menuState, setMenuState] = React.useState<MenuState | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    setMenuState({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMenuSelect = (option: { type: string; value: string }) => {
    const newLayoutId = nanoid();
    setTree((prev: EditorTree) => ({
      ...prev,
      blocks: {
        ...prev.blocks,
        [newLayoutId]: {
          id: newLayoutId,
          type: "layout",
          parentId: null,
          columns: Number(option.value),
          children: [],
        } as LayoutBlock,
      },
      rootIds: [...prev.rootIds, newLayoutId],
    }));
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
