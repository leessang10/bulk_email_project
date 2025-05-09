"use client";
import { Layout, Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Sider } = Layout;

const menuItems = [
  { key: "/statistics", label: <Link href="/statistics">발송 통계</Link> },
  {
    key: "/emailGroups",
    label: <Link href="/emailGroups">이메일 그룹 관리</Link>,
  },
  {
    key: "/templates",
    label: <Link href="/templates">이메일 템플릿 관리</Link>,
  },
  { key: "/tasks", label: <Link href="/tasks">이메일 발송 작업 관리</Link> },
  {
    key: "/unsubscribe",
    label: <Link href="/unsubscribe">수신거부 관리</Link>,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <Sider width={200} style={{ background: "#fff" }}>
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        style={{ height: "100%", borderRight: 0 }}
        items={menuItems}
      />
    </Sider>
  );
}
