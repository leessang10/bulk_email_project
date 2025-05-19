import { useAtom } from "jotai";
import { useCallback, useState } from "react";
import styled from "styled-components";
import {
  addBlockAtom,
  editorStateAtom,
  selectedComponentBlockIdAtom,
} from "../../../atoms";
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
  layoutId?: string;
  columnBlockId?: string;
}

const EditorCanvas = () => {
  const [editorState] = useAtom(editorStateAtom);
  const [selectedBlockId, setSelectedBlockId] = useAtom(
    selectedComponentBlockIdAtom
  );
  const [menuState, setMenuState] = useState<FloatingMenuState | null>(null);
  const [, addBlock] = useAtom(addBlockAtom);

  // 캔버스 영역 클릭 시 선택 해제
  const handleCanvasClick = useCallback(() => {
    setSelectedBlockId(null);
  }, [setSelectedBlockId]);

  const handleAddBlockClick = useCallback(
    (e: React.MouseEvent, layoutId: string, columnBlockId: string) => {
      e.stopPropagation();
      console.log("Adding block to:", { layoutId, columnBlockId });
      setMenuState({
        type: "block",
        x: e.clientX,
        y: e.clientY,
        layoutId,
        columnBlockId,
      });
    },
    []
  );

  const handleMenuSelect = useCallback(
    (option: { type: string; value: string }) => {
      console.log("Menu selected:", { option, menuState });
      if (menuState?.layoutId && menuState?.columnBlockId) {
        console.log("Adding block with:", {
          layoutId: menuState.layoutId,
          columnBlockId: menuState.columnBlockId,
          blockType: option.value,
        });
        addBlock({
          layoutId: menuState.layoutId,
          columnBlockId: menuState.columnBlockId,
          blockType: option.value,
        });
      }
      setMenuState(null);
    },
    [menuState, addBlock]
  );

  const handleMenuClose = useCallback(() => {
    setMenuState(null);
  }, []);

  return (
    <Container onClick={handleCanvasClick}>
      {Object.values(editorState.layouts)
        .sort((a, b) => a.order - b.order)
        .map((layout) => (
          <LayoutBlock
            key={layout.id}
            layoutId={layout.id}
            selectedBlockId={selectedBlockId}
            onAddBlock={handleAddBlockClick}
          />
        ))}
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
