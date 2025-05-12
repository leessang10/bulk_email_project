import styled from "styled-components";
import DraggableItem from "./DraggableItem";

const ListContainer = styled.div`
  margin-bottom: 24px;
`;

const ListTitle = styled.h3`
  margin-bottom: 16px;
  color: #333;
  font-size: 16px;
`;

export const components = [
  { id: "text", label: "텍스트" },
  { id: "image", label: "이미지" },
  { id: "button", label: "버튼" },
  { id: "link", label: "링크" },
];

export const layouts = [
  { id: "layout-1", label: "1열 레이아웃" },
  { id: "layout-2", label: "2열 레이아웃" },
  { id: "layout-3", label: "3열 레이아웃" },
  { id: "layout-4", label: "4열 레이아웃" },
  { id: "footer", label: "푸터" },
];

const ComponentList = () => {
  return (
    <>
      <ListContainer>
        <ListTitle>레이아웃</ListTitle>
        {layouts.map((layout) => (
          <DraggableItem
            key={layout.id}
            type="layout"
            id={layout.id}
            label={layout.label}
          />
        ))}
      </ListContainer>
      <ListContainer>
        <ListTitle>컴포넌트</ListTitle>
        {components.map((component) => (
          <DraggableItem
            key={component.id}
            type="component"
            id={component.id}
            label={component.label}
          />
        ))}
      </ListContainer>
    </>
  );
};

export default ComponentList;
