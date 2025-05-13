import { useAtom } from "jotai";
import styled from "styled-components";
import { layoutsAtom, selectedItemAtom, selectedItemIdAtom } from "../../atoms";
import PropertyPanel from "./PropertyPanel";

const RightPanel = () => {
  const [layouts, setLayouts] = useAtom(layoutsAtom);
  const [selectedItem] = useAtom(selectedItemAtom);
  const [, setSelectedItemId] = useAtom(selectedItemIdAtom);

  const handleUpdateProperties = (
    componentId: string,
    properties: Record<string, any>
  ) => {
    setLayouts((prev) =>
      prev.map((layout) => {
        const updatedChildren = layout.children.map((component) => {
          if (component.id === componentId) {
            return {
              ...component,
              properties: { ...component.properties, ...properties },
            };
          }
          return component;
        });
        return { ...layout, children: updatedChildren };
      })
    );
  };

  const handleUpdateContent = (componentId: string, content: string) => {
    setLayouts((prev) =>
      prev.map((layout) => {
        const updatedChildren = layout.children.map((component) => {
          if (component.id === componentId) {
            return { ...component, content };
          }
          return component;
        });
        return { ...layout, children: updatedChildren };
      })
    );
  };

  const handleDeleteComponent = (componentId: string) => {
    setLayouts((prev) =>
      prev.map((layout) => ({
        ...layout,
        children: layout.children.filter(
          (component) => component.id !== componentId
        ),
      }))
    );
    setSelectedItemId(null);
  };

  const handleDeleteLayout = (layoutId: string) => {
    setLayouts((prev) => prev.filter((layout) => layout.id !== layoutId));
    setSelectedItemId(null);
  };

  return (
    <Container>
      <PropertyPanel
        selectedItem={selectedItem}
        onUpdateProperties={handleUpdateProperties}
        onUpdateContent={handleUpdateContent}
        onDeleteComponent={handleDeleteComponent}
        onDeleteLayout={handleDeleteLayout}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 18rem;
  border-left: 0.0625rem solid #e0e0e0;
  background: white;
`;

export default RightPanel;
