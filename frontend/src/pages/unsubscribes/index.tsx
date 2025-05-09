import { Table, Card, Space, Input, Select, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import AdminLayout from '@/shared/components/layouts/AdminLayout';
import type { ColumnsType } from 'antd/es/table';

interface Unsubscribe {
  id: number;
  email: string;
  name: string;
  reason: string;
  unsubscribedAt: string;
  lastEmailSent: string;
}

const columns: ColumnsType<Unsubscribe> = [
  {
    title: '이메일',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '이름',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '거부 사유',
    dataIndex: 'reason',
    key: 'reason',
    render: (reason: string) => <Tag color="red">{reason}</Tag>,
  },
  {
    title: '거부 일시',
    dataIndex: 'unsubscribedAt',
    key: 'unsubscribedAt',
  },
  {
    title: '마지막 발송',
    dataIndex: 'lastEmailSent',
    key: 'lastEmailSent',
  },
];

const mockData: Unsubscribe[] = [
  {
    id: 1,
    email: 'user1@example.com',
    name: '홍길동',
    reason: '불필요한 메일',
    unsubscribedAt: '2024-03-20 15:30:00',
    lastEmailSent: '2024-03-20 15:00:00',
  },
  {
    id: 2,
    email: 'user2@example.com',
    name: '김철수',
    reason: '빈도가 높음',
    unsubscribedAt: '2024-03-19 14:20:00',
    lastEmailSent: '2024-03-19 14:00:00',
  },
];

const reasonOptions = [
  { value: 'all', label: '전체' },
  { value: 'unnecessary', label: '불필요한 메일' },
  { value: 'frequency', label: '빈도가 높음' },
  { value: 'content', label: '관심없는 내용' },
  { value: 'other', label: '기타' },
];

export default function UnsubscribesPage() {
  return (
    <AdminLayout>
      <Card title="수신 거부 관리">
        <Space style={{ marginBottom: 16 }}>
          <Input placeholder="이메일 검색" prefix={<SearchOutlined />} style={{ width: 200 }} />
          <Select placeholder="거부 사유" style={{ width: 150 }} options={reasonOptions} />
        </Space>
        <Table columns={columns} dataSource={mockData} rowKey="id" />
      </Card>
    </AdminLayout>
  );
}
