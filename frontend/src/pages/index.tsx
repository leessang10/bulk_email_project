import { Card, Row, Col, Statistic } from 'antd';
import { MailOutlined, TeamOutlined, SendOutlined, StopOutlined } from '@ant-design/icons';
import AdminLayout from '@/shared/components/layouts/AdminLayout';

export default function Home() {
  return (
    <AdminLayout>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="전체 템플릿" value={11} prefix={<MailOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="전체 주소록" value={1234} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="발송 대기" value={5} prefix={<SendOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="수신 거부" value={23} prefix={<StopOutlined />} />
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
}
