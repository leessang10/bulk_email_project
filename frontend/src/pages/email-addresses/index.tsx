import { Table, Button, Space, Card, Input, Select } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AdminLayout from '@/shared/components/layouts/AdminLayout';
import type { ColumnsType } from 'antd/es/table';

interface EmailAddress {
  id: number;
  email: string;
  name: string;
  group: string;
  isSubscribed: boolean;
  createdAt: string;
}

const columns: ColumnsType<EmailAddress> = [
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
    title: '그룹',
    dataIndex: 'group',
    key: 'group',
  },
  {
    title: '구독 상태',
    dataIndex: 'isSubscribed',
    key: 'isSubscribed',
    render: (isSubscribed: boolean) => <span style={{ color: isSubscribed ? '#52c41a' : '#ff4d4f' }}>{isSubscribed ? '구독중' : '구독취소'}</span>,
  },
  {
    title: '등록일',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: '작업',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Button type="link">수정</Button>
        <Button type="link" danger>
          삭제
        </Button>
      </Space>
    ),
  },
];

const mockData: EmailAddress[] = [
  {
    id: 1,
    email: 'user1@example.com',
    name: '홍길동',
    group: 'VIP',
    isSubscribed: true,
    createdAt: '2024-03-20',
  },
  {
    id: 2,
    email: 'user2@example.com',
    name: '김철수',
    group: '일반',
    isSubscribed: false,
    createdAt: '2024-03-19',
  },
];

export default function EmailAddressesPage() {
  return (
    <AdminLayout>
      <Card
        title="주소록 관리"
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            주소록 추가
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }}>
          <Input placeholder="이메일 검색" prefix={<SearchOutlined />} style={{ width: 200 }} />
          <Select
            placeholder="그룹 선택"
            style={{ width: 120 }}
            options={[
              { value: 'all', label: '전체' },
              { value: 'vip', label: 'VIP' },
              { value: 'normal', label: '일반' },
            ]}
          />
          <Select
            placeholder="구독 상태"
            style={{ width: 120 }}
            options={[
              { value: 'all', label: '전체' },
              { value: 'subscribed', label: '구독중' },
              { value: 'unsubscribed', label: '구독취소' },
            ]}
          />
        </Space>
        <Table columns={columns} dataSource={mockData} rowKey="id" />
      </Card>
    </AdminLayout>
  );
}
