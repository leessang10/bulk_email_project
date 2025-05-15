import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import styled from "styled-components";
import EmailGroupsPage from "./pages/email-groups";
import SendTaskPage from "./pages/send-task";
import StatisticsPage from "./pages/statistics";
import TemplatesPage from "./pages/templates";
import UnsubscribesPage from "./pages/unsubscribes";

const AppContainer = styled.div`
  display: flex;
`;

const Sidebar = styled.nav`
  width: 250px;
  min-height: 100vh;
  background-color: #2c3e50;
  padding: 20px;
`;

const MainContent = styled.main`
  flex: 1;
  background-color: #f5f6fa;
  min-height: 100vh;
`;

const NavLink = styled.a`
  display: block;
  color: white;
  padding: 10px;
  margin-bottom: 5px;
  text-decoration: none;
  border-radius: 4px;

  &:hover {
    background-color: #34495e;
  }
`;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContainer>
          <Sidebar>
            <NavLink href="/statistics">이메일 발송 통계</NavLink>
            <NavLink href="/email-groups">이메일 그룹 관리</NavLink>
            <NavLink href="/templates">이메일 템플릿 관리</NavLink>
            <NavLink href="/send-task">이메일 발송 작업 관리</NavLink>
            <NavLink href="/unsubscribes">수신거부 이메일 관리</NavLink>
          </Sidebar>
          <MainContent>
            <Routes>
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="/email-groups" element={<EmailGroupsPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/send-task" element={<SendTaskPage />} />
              <Route path="/unsubscribes" element={<UnsubscribesPage />} />
            </Routes>
          </MainContent>
        </AppContainer>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
