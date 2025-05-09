import {
  BarChartOutlined,
  FileTextOutlined,
  MailOutlined,
  SendOutlined,
  StopOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { Layout, Menu, Switch } from "antd";
import { useToken } from "antd/es/theme/internal";
import Head from "next/head";
import Link from "next/link";
import { useCallback } from "react";
import { useSystemStore } from "../store";

const { Sider, Content } = Layout;

type SystemType = "잡스" | "틀루토";

const FullHeightLayout = styled(Layout)`
  min-height: 100vh;
`;
const LogoRow = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  height: 48px;
  margin: 16px;
  color: ${({ color }) => color || "#fff"};
  font-weight: bold;
  font-size: 20px;
  text-align: center;
  gap: 8px;
`;
const StyledContent = styled(Content)`
  margin: 24px;
  padding: 24px;
  min-height: 280px;
`;

const sidebarMenu = [
  {
    key: "statistics",
    icon: <BarChartOutlined />,
    label: "통계",
    route: "/statistics",
  },
  {
    key: "email-groups",
    icon: <TeamOutlined />,
    label: "이메일 그룹",
    route: "/email-groups",
  },
  {
    key: "email-templates",
    icon: <FileTextOutlined />,
    label: "이메일 템플릿",
    route: "/email-templates",
  },
  {
    key: "send-tasks",
    icon: <SendOutlined />,
    label: "이메일 발송 작업",
    route: "/send-tasks",
  },
  {
    key: "unsubscribe",
    icon: <StopOutlined />,
    label: "수신 거부 관리",
    route: "/unsubscribe",
  },
  {
    key: "test-emails",
    icon: <MailOutlined />,
    label: "테스트 이메일 관리",
    route: "/test-emails",
  },
];

export default function Home() {
  const system = useSystemStore((state) => state.system);
  const toggleSystem = useSystemStore((state) => state.toggleSystem);
  const [, token] = useToken();
  // console.log(token);

  // Switch 토글 핸들러
  const handleToggle = useCallback(() => {
    toggleSystem();
  }, [toggleSystem]);

  return (
    <>
      <Head>
        <title>대량 메일 발송</title>
        <meta name="description" content="마케팅 대량 메일 발송 시스템" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <FullHeightLayout>
        <Sider
          style={{
            position: "relative",
            transition: "background 0.3s, color 0.3s, border-color 0.3s",
            background: token.colorBgContainer,
          }}
        >
          <LogoRow color={token.colorTextLightSolid}>{"메일 대시보드"}</LogoRow>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["statistics"]}
            style={{
              background: token.colorBgContainer,
              color: token.colorTextLightSolid,
              transition: "background 0.3s, color 0.3s",
            }}
          >
            {sidebarMenu.map((item) => (
              <Menu.Item
                key={item.key}
                icon={item.icon}
                style={{ color: token.colorTextLightSolid }}
              >
                <Link href={item.route}>{item.label}</Link>
              </Menu.Item>
            ))}
          </Menu>
          {/* Sider 내부 하단에 고정된 토글 UI */}
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 48,
              width: "100%",
              padding: "16px",
              background: token.colorBgContainer,
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              transition: "padding 0.2s, background 0.3s, color 0.3s",
            }}
          >
            <span
              style={{
                fontSize: 14,
                marginRight: 10,
                whiteSpace: "nowrap",
                color: token.colorTextLightSolid,
              }}
            >
              {system} 메일 시스템
            </span>
            <Switch
              checked={system === "틀루토"}
              onChange={handleToggle}
              style={{ marginBottom: 0 }}
            />
          </div>
        </Sider>
        <StyledContent>
          <h1>환영합니다 👋</h1>
          <p>좌측 메뉴에서 기능을 선택하세요.</p>
        </StyledContent>
      </FullHeightLayout>
    </>
  );
}
