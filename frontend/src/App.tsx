import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import "./App.css";
import Sidebar from "./common/components/Sidebar";
import EmailGroupsPage from "./pages/email-groups";
import SendTaskPage from "./pages/send-task";
import StatisticsPage from "./pages/statistics";
import TemplatesPage from "./pages/templates";
import UnsubscribesPage from "./pages/unsubscribes";

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  padding: 40px;
  background: #f7f9fb;
`;

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Sidebar />
        <Content>
          <Routes>
            <Route path="/" element={<StatisticsPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/email-groups" element={<EmailGroupsPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/send-task" element={<SendTaskPage />} />
            <Route path="/unsubscribes" element={<UnsubscribesPage />} />
          </Routes>
        </Content>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
