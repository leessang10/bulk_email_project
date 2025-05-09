"use client";
import { Layout, Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Sider } = Layout;

const menuItems = [
  { key: "/templates", label: <Link href="/templates">이메일 템플릿</Link> },
  { key: "/emailGroups", label: <Link href="/emailGroups">주소록/그룹</Link> },
  { key: "/tasks", label: <Link href="/tasks">발송 작업</Link> },
  { key: "/statistics", label: <Link href="/statistics">통계</Link> },
  { key: "/unsubscribe", label: <Link href="/unsubscribe">수신거부</Link> },
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
