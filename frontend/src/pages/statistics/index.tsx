import { Card, Row, Col, Statistic, Table } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import AdminLayout from '@/shared/components/layouts/AdminLayout';
import type { ColumnsType } from 'antd/es/table';

interface TopTemplate {
  id: number;
  name: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
}

const columns: ColumnsType<TopTemplate> = [
  {
    title: '템플릿명',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '발송 수',
    dataIndex: 'sentCount',
    key: 'sentCount',
  },
  {
    title: '오픈율',
    dataIndex: 'openRate',
    key: 'openRate',
    render: (rate: number) => `${rate}%`,
  },
  {
    title: '클릭율',
    dataIndex: 'clickRate',
    key: 'clickRate',
    render: (rate: number) => `${rate}%`,
  },
];

const mockData: TopTemplate[] = [
  {
    id: 1,
    name: '신규 가입 환영',
    sentCount: 1000,
    openRate: 75,
    clickRate: 45,
  },
  {
    id: 2,
    name: '주간 뉴스레터',
    sentCount: 800,
    openRate: 60,
    clickRate: 30,
  },
];

export default function StatisticsPage() {
  return (
    <AdminLayout>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic title="총 구독자" value={5000} valueStyle={{ color: '#3f8600' }} prefix={<ArrowUpOutlined />} suffix="명" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="이번 달 발송" value={2500} valueStyle={{ color: '#3f8600' }} prefix={<ArrowUpOutlined />} suffix="건" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="평균 오픈율" value={65} valueStyle={{ color: '#3f8600' }} prefix={<ArrowUpOutlined />} suffix="%" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="평균 클릭율" value={35} valueStyle={{ color: '#cf1322' }} prefix={<ArrowDownOutlined />} suffix="%" />
          </Card>
        </Col>
      </Row>

      <Card title="인기 템플릿 TOP 5" style={{ marginTop: 16 }}>
        <Table columns={columns} dataSource={mockData} rowKey="id" pagination={false} />
      </Card>
    </AdminLayout>
  );
}
