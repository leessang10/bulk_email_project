import { useAtom } from "jotai";
import { nanoid } from "nanoid";
import { useState } from "react";
import styled from "styled-components";
import { editorTreeAtom, selectedBlockIdAtom } from "../../../atoms";
import type { Block, LayoutBlock as LayoutBlockType } from "../../../types";
import AddLayoutButton from "./AddLayoutButton";
import FloatingMenu from "./FloatingMenu";
import LayoutBlock from "./LayoutBlock";

const Container = styled.div`
  min-height: 80%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

interface FloatingMenuState {
  type: "layout" | "block";
  x: number;
  y: number;
  columnPath?: { layoutId: string; columnIndex: number };
}

const createBlock = (type: string, id: string, parentId: string): Block => {
  switch (type) {
    case "text":
      return {
        id,
        type: "text",
        parentId,
        content: "텍스트를 입력하세요",
        style: {},
      } as Block;
    case "button":
      return {
        id,
        type: "button",
        parentId,
        label: "버튼",
        url: "#",
        style: {},
      } as Block;
    case "image":
      return {
        id,
        type: "image",
        parentId,
        src: "https://via.placeholder.com/300x200",
        alt: "이미지",
        width: "100%",
      } as Block;
    default:
      throw new Error(`Unknown block type: ${type}`);
  }
};

const EditorCanvas = () => {
  const [tree, setTree] = useAtom(editorTreeAtom);
  const [selectedBlockId, setSelectedBlockId] = useAtom(selectedBlockIdAtom);
  const [menuState, setMenuState] = useState<FloatingMenuState | null>(null);

  // 캔버스 영역 클릭 시 선택 해제
  const handleCanvasClick = () => {
    setSelectedBlockId(null);
  };

  const handleAddBlockClick = (
    e: React.MouseEvent,
    layoutId: string,
    columnIndex: number
  ) => {
    e.stopPropagation();
    setMenuState({
      type: "block",
      x: e.clientX,
      y: e.clientY,
      columnPath: { layoutId, columnIndex },
    });
  };

  const handleMenuSelect = (option: { type: string; value: string }) => {
    if (menuState?.columnPath) {
      const { layoutId, columnIndex } = menuState.columnPath;
      const newBlockId = nanoid();
      const layout = tree.blocks[layoutId] as LayoutBlockType;

      setTree((prev) => ({
        ...prev,
        blocks: {
          ...prev.blocks,
          [newBlockId]: createBlock(option.value, newBlockId, layoutId),
          [layoutId]: {
            ...layout,
            children: [
              ...layout.children,
              { blockId: newBlockId, columnIndex },
            ],
          },
        },
      }));
      setSelectedBlockId(newBlockId);
    }
    setMenuState(null);
  };

  const handleMenuClose = () => {
    setMenuState(null);
  };

  return (
    <Container onClick={handleCanvasClick}>
      {tree.rootIds.map((id) => {
        const block = tree.blocks[id];
        if (block.type === "layout") {
          return (
            <LayoutBlock
              key={block.id}
              block={block as LayoutBlockType}
              onAddBlock={handleAddBlockClick}
              selectedBlockId={selectedBlockId}
              onSelectBlock={setSelectedBlockId}
            />
          );
        }
        return null;
      })}
      <AddLayoutButton />
      {menuState && (
        <FloatingMenu
          type={menuState.type}
          x={menuState.x}
          y={menuState.y}
          onSelect={handleMenuSelect}
          onClose={handleMenuClose}
        />
      )}
    </Container>
  );
};

export default EditorCanvas;
