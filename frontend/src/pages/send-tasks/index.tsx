import { Table, Button, Space, Card, Input, Select, Tag, Progress } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AdminLayout from '@/shared/components/layouts/AdminLayout';
import type { ColumnsType } from 'antd/es/table';

interface SendTask {
  id: number;
  templateName: string;
  groupName: string;
  totalRecipients: number;
  sentCount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  scheduledAt: string;
  startedAt: string;
  completedAt: string;
}

const columns: ColumnsType<SendTask> = [
  {
    title: '템플릿',
    dataIndex: 'templateName',
    key: 'templateName',
  },
  {
    title: '대상 그룹',
    dataIndex: 'groupName',
    key: 'groupName',
  },
  {
    title: '발송 현황',
    key: 'progress',
    render: (_, record) => {
      const percent = Math.round((record.sentCount / record.totalRecipients) * 100);
      return (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Progress percent={percent} size="small" />
          <span>
            {record.sentCount} / {record.totalRecipients}
          </span>
        </Space>
      );
    },
  },
  {
    title: '상태',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const statusMap = {
        pending: { color: 'default', text: '대기중' },
        in_progress: { color: 'processing', text: '발송중' },
        completed: { color: 'success', text: '완료' },
        failed: { color: 'error', text: '실패' },
      };
      const { color, text } = statusMap[status as keyof typeof statusMap];
      return <Tag color={color}>{text}</Tag>;
    },
  },
  {
    title: '예약 시간',
    dataIndex: 'scheduledAt',
    key: 'scheduledAt',
  },
  {
    title: '시작 시간',
    dataIndex: 'startedAt',
    key: 'startedAt',
  },
  {
    title: '완료 시간',
    dataIndex: 'completedAt',
    key: 'completedAt',
  },
  {
    title: '작업',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        {record.status === 'pending' && (
          <>
            <Button type="link">수정</Button>
            <Button type="link" danger>
              취소
            </Button>
          </>
        )}
        {record.status === 'in_progress' && (
          <Button type="link" danger>
            중지
          </Button>
        )}
        {record.status === 'completed' && <Button type="link">상세보기</Button>}
        {record.status === 'failed' && <Button type="link">재시도</Button>}
      </Space>
    ),
  },
];

const mockData: SendTask[] = [
  {
    id: 1,
    templateName: '신규 가입 환영',
    groupName: 'VIP 고객',
    totalRecipients: 150,
    sentCount: 150,
    status: 'completed',
    scheduledAt: '2024-03-20 10:00:00',
    startedAt: '2024-03-20 10:00:00',
    completedAt: '2024-03-20 10:05:00',
  },
  {
    id: 2,
    templateName: '주간 뉴스레터',
    groupName: '일반 회원',
    totalRecipients: 500,
    sentCount: 300,
    status: 'in_progress',
    scheduledAt: '2024-03-20 11:00:00',
    startedAt: '2024-03-20 11:00:00',
    completedAt: '-',
  },
];

export default function SendTasksPage() {
  return (
    <AdminLayout>
      <Card
        title="발송 작업 관리"
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            새 발송 작업
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }}>
          <Input placeholder="템플릿 검색" prefix={<SearchOutlined />} style={{ width: 200 }} />
          <Select
            placeholder="상태 선택"
            style={{ width: 120 }}
            options={[
              { value: 'all', label: '전체' },
              { value: 'pending', label: '대기중' },
              { value: 'in_progress', label: '발송중' },
              { value: 'completed', label: '완료' },
              { value: 'failed', label: '실패' },
            ]}
          />
        </Space>
        <Table columns={columns} dataSource={mockData} rowKey="id" />
      </Card>
    </AdminLayout>
  );
}
