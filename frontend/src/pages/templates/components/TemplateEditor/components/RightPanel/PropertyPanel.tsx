import styled from "styled-components";
import type { ComponentItem, LayoutItem } from "../../types/editor";

interface PropertyPanelProps {
  selectedItem: ComponentItem | LayoutItem | null;
  onUpdateProperties: (
    componentId: string,
    properties: Record<string, any>
  ) => void;
  onUpdateContent: (componentId: string, content: string) => void;
  onDeleteComponent: (componentId: string) => void;
  onDeleteLayout: (layoutId: string) => void;
}

const PropertyPanel = ({
  selectedItem,
  onUpdateProperties,
  onUpdateContent,
  onDeleteComponent,
  onDeleteLayout,
}: PropertyPanelProps) => {
  if (!selectedItem) {
    return (
      <Container>
        <EmptyMessage>선택된 항목이 없습니다.</EmptyMessage>
      </Container>
    );
  }

  const handleDelete = () => {
    if ("children" in selectedItem) {
      onDeleteLayout(selectedItem.id);
    } else {
      onDeleteComponent(selectedItem.id);
    }
  };

  return (
    <Container>
      <Header>
        <Title>속성</Title>
        <DeleteButton onClick={handleDelete}>삭제</DeleteButton>
      </Header>
      <Content>{/* 속성 편집 UI 구현 */}</Content>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-bottom: 0.0625rem solid #e0e0e0;
`;

const Title = styled.h2`
  font-size: 1rem;
  margin: 0;
`;

const DeleteButton = styled.button`
  padding: 0.375rem 0.75rem;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover {
    background: #d32f2f;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 0.75rem;
  overflow-y: auto;
`;

const EmptyMessage = styled.div`
  padding: 0.75rem;
  text-align: center;
  color: #666;
`;

export default PropertyPanel;
