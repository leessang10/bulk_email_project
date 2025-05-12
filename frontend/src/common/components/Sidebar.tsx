import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const SidebarContainer = styled.div`
  width: 220px;
  height: 100vh;
  background: #222e3c;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 32px 0 0 0;
`;

const MenuItem = styled(Link)<{ $active?: boolean }>`
  padding: 16px 32px;
  color: ${({ $active }) => ($active ? "#4fc3f7" : "#fff")};
  text-decoration: none;
  font-weight: ${({ $active }) => ($active ? "bold" : "normal")};
  background: ${({ $active }) => ($active ? "#1a2230" : "none")};
  transition: background 0.2s;
  &:hover {
    background: #1a2230;
    color: #4fc3f7;
  }
`;

const menus = [
  { path: "/statistics", label: "이메일 발송 통계" },
  { path: "/email-groups", label: "이메일 그룹 관리" },
  { path: "/templates", label: "이메일 템플릿 관리" },
  { path: "/send-task", label: "이메일 발송 작업 관리" },
  { path: "/unsubscribes", label: "수신거부 이메일 관리" },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <SidebarContainer>
      {menus.map((menu) => (
        <MenuItem
          key={menu.path}
          to={menu.path}
          $active={location.pathname === menu.path}
        >
          {menu.label}
        </MenuItem>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;
