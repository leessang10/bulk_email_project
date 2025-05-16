import React from "react";
import styled from "styled-components";

const MenuContainer = styled.div<{ x: number; y: number }>`
  position: fixed;
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px;
  z-index: 1000;
  min-width: 180px;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: none;
  color: #333;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;

  &:hover {
    background: #f0f0f0;
  }

  svg {
    width: 20px;
    height: 20px;
    color: #666;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #e0e0e0;
  margin: 4px 0;
`;

interface MenuOption {
  type: string;
  value: string;
  label: string;
  icon: React.ReactNode;
}

export interface FloatingMenuProps {
  type: "layout" | "block";
  x: number;
  y: number;
  onSelect: (option: { type: string; value: string }) => void;
  onClose: () => void;
  options?: MenuOption[];
}

const BLOCK_OPTIONS: MenuOption[] = [
  { type: "block", value: "text", label: "텍스트", icon: null },
  { type: "block", value: "button", label: "버튼", icon: null },
  { type: "block", value: "image", label: "이미지", icon: null },
];

const FloatingMenu: React.FC<FloatingMenuProps> = ({
  type,
  x,
  y,
  onSelect,
  onClose,
  options = type === "layout" ? [] : BLOCK_OPTIONS,
}) => {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ x, y });

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // 메뉴가 화면 밖으로 나가지 않도록 위치 조정
    const adjustPosition = () => {
      if (!menuRef.current) return;

      const menu = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = x;
      let adjustedY = y;

      if (x + menu.width > viewportWidth) {
        adjustedX = viewportWidth - menu.width - 16;
      }

      if (y + menu.height > viewportHeight) {
        adjustedY = viewportHeight - menu.height - 16;
      }

      setPosition({ x: adjustedX, y: adjustedY });
    };

    adjustPosition();
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", adjustPosition);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", adjustPosition);
    };
  }, [x, y, onClose]);

  return (
    <MenuContainer ref={menuRef} x={position.x} y={position.y}>
      {options.map((option, index) => (
        <React.Fragment key={option.value}>
          <MenuItem onClick={() => onSelect(option)}>
            {option.icon}
            {option.label}
          </MenuItem>
          {index < options.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </MenuContainer>
  );
};

export default FloatingMenu;
