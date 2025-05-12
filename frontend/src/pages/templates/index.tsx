import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TemplateEditor from "./components/TemplateEditor";

const TemplatesPage = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <TemplateEditor />
    </DndProvider>
  );
};

export default TemplatesPage;
