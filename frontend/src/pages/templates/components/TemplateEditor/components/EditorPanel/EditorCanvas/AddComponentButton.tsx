import { useAtom } from "jotai";
import React, { useCallback } from "react";
import styled from "styled-components";
import {
  blockMenuOptionsAtom,
  blockMenuStateAtom,
  closeBlockMenuAtom,
  handleBlockMenuSelectAtom,
  openBlockMenuAtom,
} from "../../../atoms/blockMenu";
import FloatingMenu from "./FloatingMenu";

const EmptyBlockButton = styled.button`
  width: 100%;
  height: 100%;
  min-height: 100px;
  border: 2px dashed #e0e0e0;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 123, 255, 0.04);
    border-color: rgba(0, 123, 255, 0.4);
    color: #007bff;
  }
`;

interface AddComponentButtonProps {
  layoutId: string;
  columnBlockId: string;
}

const AddComponentButton: React.FC<AddComponentButtonProps> = ({
  layoutId,
  columnBlockId,
}) => {
  const [menuState] = useAtom(blockMenuStateAtom);
  const [menuOptions] = useAtom(blockMenuOptionsAtom);
  const [, openMenu] = useAtom(openBlockMenuAtom);
  const [, closeMenu] = useAtom(closeBlockMenuAtom);
  const [, handleMenuSelect] = useAtom(handleBlockMenuSelectAtom);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      openMenu({
        x: e.clientX,
        y: e.clientY,
        layoutId,
        columnBlockId,
      });
    },
    [openMenu, layoutId, columnBlockId]
  );

  return (
    <>
      <EmptyBlockButton onClick={handleClick}>+ 컴포넌트 추가</EmptyBlockButton>
      {menuState?.layoutId === layoutId &&
        menuState?.columnBlockId === columnBlockId && (
          <FloatingMenu
            type="block"
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

export default AddComponentButton;
