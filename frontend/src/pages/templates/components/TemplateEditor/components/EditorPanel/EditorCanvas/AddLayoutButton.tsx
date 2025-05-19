import { useAtom } from "jotai";
import React from "react";
import styled from "styled-components";
import {
  closeLayoutMenuAtom,
  handleLayoutMenuSelectAtom,
  layoutMenuOptionsAtom,
  layoutMenuStateAtom,
  openLayoutMenuAtom,
} from "../../../atoms/layoutMenu";
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

const AddLayoutButton = () => {
  const [menuState] = useAtom(layoutMenuStateAtom);
  const [menuOptions] = useAtom(layoutMenuOptionsAtom);
  const [, openMenu] = useAtom(openLayoutMenuAtom);
  const [, closeMenu] = useAtom(closeLayoutMenuAtom);
  const [, handleMenuSelect] = useAtom(handleLayoutMenuSelectAtom);

  const handleClick = (e: React.MouseEvent) => {
    openMenu({
      x: e.clientX,
      y: e.clientY,
    });
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
          onClose={closeMenu}
          options={menuOptions}
        />
      )}
    </>
  );
};

export default AddLayoutButton;
