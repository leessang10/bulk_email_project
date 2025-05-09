import { Layout, Menu } from 'antd';
import { MailOutlined, TeamOutlined, AppstoreOutlined, SendOutlined, StopOutlined, BarChartOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Link from 'next/link';

const { Sider, Content } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    key: 'statistics',
    icon: <BarChartOutlined />,
    label: '통계',
    path: '/statistics',
  },
  {
    key: 'email-templates',
    icon: <MailOutlined />,
    label: '이메일 템플릿',
    path: '/email-templates',
  },
  {
    key: 'email-addresses',
    icon: <TeamOutlined />,
    label: '주소록 관리',
    path: '/email-addresses',
  },
  {
    key: 'email-address-groups',
    icon: <AppstoreOutlined />,
    label: '주소록 그룹',
    path: '/email-address-groups',
  },
  {
    key: 'send-tasks',
    icon: <SendOutlined />,
    label: '발송 작업',
    path: '/send-tasks',
  },
  {
    key: 'unsubscribes',
    icon: <StopOutlined />,
    label: '수신 거부',
    path: '/unsubscribes',
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const selectedKey = menuItems.find((item) => item.path === router.pathname)?.key;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        theme="light"
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.2)' }} />
        <Menu
          mode="inline"
          selectedKeys={[selectedKey || '']}
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: <Link href={item.path}>{item.label}</Link>,
          }))}
        />
      </Sider>
      <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>{children}</Content>
    </Layout>
  );
}
