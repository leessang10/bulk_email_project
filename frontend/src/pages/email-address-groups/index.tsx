import { Table, Button, Space, Card, Input, Tag } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AdminLayout from '@/shared/components/layouts/AdminLayout';
import type { ColumnsType } from 'antd/es/table';

interface EmailAddressGroup {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

const columns: ColumnsType<EmailAddressGroup> = [
  {
    title: '그룹명',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '설명',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '멤버 수',
    dataIndex: 'memberCount',
    key: 'memberCount',
    render: (count: number) => <Tag color="blue">{count}명</Tag>,
  },
  {
    title: '생성일',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: '수정일',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
  {
    title: '작업',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Button type="link">수정</Button>
        <Button type="link">멤버 관리</Button>
        <Button type="link" danger>
          삭제
        </Button>
      </Space>
    ),
  },
];

const mockData: EmailAddressGroup[] = [
  {
    id: 1,
    name: 'VIP 고객',
    description: 'VIP 등급 고객 그룹',
    memberCount: 150,
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
  },
  {
    id: 2,
    name: '일반 회원',
    description: '일반 회원 그룹',
    memberCount: 500,
    createdAt: '2024-03-19',
    updatedAt: '2024-03-19',
  },
];

export default function EmailAddressGroupsPage() {
  return (
    <AdminLayout>
      <Card
        title="주소록 그룹 관리"
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            새 그룹
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }}>
          <Input placeholder="그룹명 검색" prefix={<SearchOutlined />} style={{ width: 200 }} />
        </Space>
        <Table columns={columns} dataSource={mockData} rowKey="id" />
      </Card>
    </AdminLayout>
  );
}
