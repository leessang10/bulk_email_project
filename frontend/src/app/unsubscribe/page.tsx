"use client";
import { Input, Table, Typography } from "antd";
import { useMemo, useState } from "react";

const { Title } = Typography;

// 목업 수신거부 데이터 (시간까지 포함)
const mockUnsubscribes = Array.from({ length: 27 }).map((_, i) => ({
  id: i + 1,
  email: `user${i + 1}@example.com`,
  reason: i % 3 === 0 ? "스팸" : i % 3 === 1 ? "광고성" : "기타",
  created_at:
    `2024-06-${((i % 30) + 1).toString().padStart(2, "0")}` +
    ` ${String(9 + (i % 10)).padStart(2, "0")}:${String(10 + (i % 50)).padStart(
      2,
      "0"
    )}:${String(20 + (i % 40)).padStart(2, "0")}`,
}));

export default function UnsubscribePage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "이메일", dataIndex: "email", key: "email" },
    { title: "사유", dataIndex: "reason", key: "reason" },
    {
      title: "수신거부일",
      dataIndex: "created_at",
      key: "created_at",
      width: 170,
    },
  ];

  const filtered = useMemo(() => {
    if (!search) return mockUnsubscribes;
    return mockUnsubscribes.filter(
      (item) => item.email.includes(search) || item.reason.includes(search)
    );
  }, [search]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <Title level={2}>수신거부 관리</Title>
      <p>이곳에서 수신거부 목록을 확인하고 관리할 수 있습니다.</p>
      <Input.Search
        placeholder="이메일/사유 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: 240, marginBottom: 16 }}
        allowClear
      />
      <Table
        columns={columns}
        dataSource={paged}
        pagination={{
          current: page,
          pageSize,
          total: filtered.length,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
          showSizeChanger: true,
          position: ["bottomCenter"],
        }}
        rowKey="id"
        bordered
        size="middle"
      />
    </div>
  );
}
