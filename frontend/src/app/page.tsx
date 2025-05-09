"use client";
import styled from "@emotion/styled";
import { Button, Layout, Space, Typography } from "antd";

const { Title, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;

const MainWrapper = styled.div`
  min-height: 100vh;
  background: #f7f9fb;
`;

const CenterBox = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 64px 24px 32px 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  text-align: center;
`;

export default function Home() {
  return (
    <MainWrapper>
      <Header style={{ background: "#1677ff", padding: 0 }}>
        <Title
          level={2}
          style={{ color: "#fff", margin: 0, padding: "16px 0" }}
        >
          Bulk Email Service
        </Title>
      </Header>
      <Content style={{ minHeight: "calc(100vh - 120px)" }}>
        <CenterBox>
          <img
            src="/next.svg"
            alt="로고"
            width={120}
            style={{ marginBottom: 24 }}
          />
          <Title level={3}>마케팅 대량 메일 발송 시스템</Title>
          <Paragraph type="secondary">
            쉽고 빠르게 대량 이메일을 발송하고,
            <br />
            템플릿, 예약, 통계, 수신거부까지 한 번에 관리하세요.
          </Paragraph>
          <Space
            direction="vertical"
            size="large"
            style={{ width: "100%", marginTop: 32 }}
          >
            <Button type="primary" size="large" block>
              시작하기
            </Button>
            <Button size="large" block href="#features">
              주요 기능 보기
            </Button>
          </Space>
        </CenterBox>
      </Content>
      <Footer style={{ textAlign: "center", background: "#f7f9fb" }}>
        <Paragraph type="secondary">
          © {new Date().getFullYear()} Bulk Email Service
        </Paragraph>
      </Footer>
    </MainWrapper>
  );
}
