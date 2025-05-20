import { SearchOutlined } from "@ant-design/icons";
import { Card, Input, Space, Table, Typography } from "antd";
import React, { useState } from "react";
import { useUnsubscribes } from "./hooks/useUnsubscribes";
import type { UnsubscribeListParams } from "./types/unsubscribeTypes";

const { Title } = Typography;

const UnsubscribesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useState<UnsubscribeListParams>({
    page: 1,
    pageSize: 10,
    sortBy: "createdAt",
    sortOrder: "DESC",
  });

  const { unsubscribes, total, isLoading } = useUnsubscribes(searchParams);

  const columns = [
    {
      title: "이메일",
      dataIndex: "email",
      key: "email",
      sorter: true,
      width: "40%",
    },
    {
      title: "수신거부 사유",
      dataIndex: "reason",
      key: "reason",
      render: (reason: string | null) => reason || "-",
      width: "40%",
    },
    {
      title: "등록일",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      width: "20%",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setSearchParams({
      ...searchParams,
      page: pagination.current,
      pageSize: pagination.pageSize,
      sortBy: sorter.field,
      sortOrder: sorter.order === "ascend" ? "ASC" : "DESC",
    });
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card bordered={false}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Space direction="vertical" size="small">
            <Title level={4} style={{ margin: 0 }}>
              수신거부 목록
            </Title>
            <Typography.Text type="secondary">
              이메일 수신을 거부한 사용자 목록을 관리합니다.
            </Typography.Text>
          </Space>

          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Input
              placeholder="이메일로 검색"
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              onChange={(e) =>
                setSearchParams({
                  ...searchParams,
                  email: e.target.value,
                  page: 1,
                })
              }
              style={{ maxWidth: 300 }}
              allowClear
            />

            <Table
              columns={columns}
              dataSource={unsubscribes}
              rowKey="id"
              loading={isLoading}
              pagination={{
                total,
                current: searchParams.page,
                pageSize: searchParams.pageSize,
                showSizeChanger: true,
                showTotal: (total) => `총 ${total}개`,
                position: ["bottomCenter"],
              }}
              onChange={handleTableChange}
              style={{ marginTop: 8 }}
            />
          </Space>
        </Space>
      </Card>
    </div>
  );
};

export default UnsubscribesPage;
