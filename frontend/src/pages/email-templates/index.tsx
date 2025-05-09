import { Table, Button, Space, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AdminLayout from '@/shared/components/layouts/AdminLayout';
import type { ColumnsType } from 'antd/es/table';

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
}

const columns: ColumnsType<EmailTemplate> = [
  {
    title: '템플릿명',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '제목',
    dataIndex: 'subject',
    key: 'subject',
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
        <Button type="link" danger>
          삭제
        </Button>
      </Space>
    ),
  },
];

const mockData: EmailTemplate[] = [
  {
    id: 1,
    name: '신규 가입 환영',
    subject: '환영합니다!',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
  },
  {
    id: 2,
    name: '주간 뉴스레터',
    subject: '이번 주 소식',
    createdAt: '2024-03-19',
    updatedAt: '2024-03-19',
  },
];

export default function EmailTemplatesPage() {
  return (
    <AdminLayout>
      <Card
        title="이메일 템플릿"
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            새 템플릿
          </Button>
        }
      >
        <Table columns={columns} dataSource={mockData} rowKey="id" />
      </Card>
    </AdminLayout>
  );
}
