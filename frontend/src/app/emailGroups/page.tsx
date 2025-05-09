"use client";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Descriptions,
  Drawer,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { useMemo, useState } from "react";

const { Title } = Typography;
const { Option } = Select;

// ENUM 값 정의
const REGION_LABELS: Record<string, string> = {
  DOMESTIC: "국내",
  OVERSEAS: "해외",
};
const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  EMPTY: { label: "비어있음", color: "default" },
  CREATING: { label: "생성중", color: "processing" },
  COMPLETED: { label: "완료", color: "green" },
  FAILED: { label: "실패", color: "red" },
};
const ADDRESS_TYPE_LABELS: Record<string, string> = {
  normal: "일반",
  test: "테스트",
};

// 목업 그룹 데이터 (enum 반영)
const statusList = ["EMPTY", "CREATING", "COMPLETED", "FAILED"];
const regionList = ["DOMESTIC", "OVERSEAS"];
const addressTypeList = ["normal", "test"];

const mockGroups = Array.from({ length: 8 }).map((_, i) => {
  const status = statusList[i % statusList.length];
  const region = regionList[i % regionList.length];
  return {
    id: i + 1,
    name: `그룹${i + 1}`,
    region,
    status,
    address_count: 3 + (i % 4),
    created_at: `2024-06-${(i + 1).toString().padStart(2, "0")}`,
    updated_at: `2024-06-${(i + 2).toString().padStart(2, "0")}`,
    mail_merge_data: null,
    addresses: Array.from({ length: 3 + (i % 4) }).map((_, j) => ({
      id: j + 1,
      address_type: addressTypeList[j % addressTypeList.length],
      email: `user${i + 1}_${j + 1}@example.com`,
      name: `이름${j + 1}`,
      is_subscribed: j % 2 === 0,
      memo: j % 2 === 0 ? "VIP 고객" : "",
      created_at: `2024-06-${(i + 1).toString().padStart(2, "0")}`,
      updated_at: `2024-06-${(i + 2).toString().padStart(2, "0")}`,
      address_group_id: i + 1,
      mail_merge_data: null,
    })),
  };
});

export default function EmailGroupsPage() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  // 필터/검색/정렬 상태
  const [regionFilter, setRegionFilter] = useState<string | undefined>(
    undefined
  );
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [addressTypeFilter, setAddressTypeFilter] = useState<
    string | undefined
  >(undefined);
  const [search, setSearch] = useState("");
  const [sorter, setSorter] = useState<{
    field: string;
    order: "ascend" | "descend" | null;
  }>({ field: "created_at", order: null });
  const [emailPage, setEmailPage] = useState(1);
  const [emailPageSize, setEmailPageSize] = useState(5);

  // 그룹 테이블 컬럼
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      sorter: (a: any, b: any) => a.id - b.id,
      sortOrder: sorter.field === "id" ? sorter.order : null,
    },
    {
      title: "그룹명",
      dataIndex: "name",
      key: "name",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      sortOrder: sorter.field === "name" ? sorter.order : null,
    },
    {
      title: "지역",
      dataIndex: "region",
      key: "region",
      render: (v: string) => REGION_LABELS[v],
      filters: regionList.map((r) => ({ text: REGION_LABELS[r], value: r })),
      filteredValue: regionFilter ? [regionFilter] : null,
      onFilter: (value: any, record: any) => record.region === value,
    },
    {
      title: "상태",
      dataIndex: "status",
      key: "status",
      render: (v: string) => (
        <Tag color={STATUS_LABELS[v].color}>{STATUS_LABELS[v].label}</Tag>
      ),
      filters: statusList.map((s) => ({
        text: STATUS_LABELS[s].label,
        value: s,
      })),
      filteredValue: statusFilter ? [statusFilter] : null,
      onFilter: (value: any, record: any) => record.status === value,
    },
    {
      title: "주소 수",
      dataIndex: "address_count",
      key: "address_count",
      width: 80,
      sorter: (a: any, b: any) => a.address_count - b.address_count,
      sortOrder: sorter.field === "address_count" ? sorter.order : null,
    },
    {
      title: "생성일",
      dataIndex: "created_at",
      key: "created_at",
      width: 110,
      sorter: (a: any, b: any) => a.created_at.localeCompare(b.created_at),
      sortOrder: sorter.field === "created_at" ? sorter.order : null,
    },
  ];

  // 주소록(이메일) 테이블 컬럼
  const addressColumns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    {
      title: "타입",
      dataIndex: "address_type",
      key: "address_type",
      width: 70,
      filters: addressTypeList.map((t) => ({
        text: ADDRESS_TYPE_LABELS[t],
        value: t,
      })),
      filteredValue: addressTypeFilter ? [addressTypeFilter] : null,
      onFilter: (value: any, record: any) => record.address_type === value,
      render: (v: string) => ADDRESS_TYPE_LABELS[v],
    },
    { title: "이메일", dataIndex: "email", key: "email" },
    { title: "이름", dataIndex: "name", key: "name" },
    {
      title: "구독여부",
      dataIndex: "is_subscribed",
      key: "is_subscribed",
      width: 80,
      render: (v: boolean) =>
        v ? <Tag color="blue">구독</Tag> : <Tag>거부</Tag>,
    },
    { title: "생성일", dataIndex: "created_at", key: "created_at", width: 110 },
  ];

  // 필터/검색/정렬 적용된 데이터
  const filteredGroups = useMemo(() => {
    let data = [...mockGroups];
    if (regionFilter) data = data.filter((g) => g.region === regionFilter);
    if (statusFilter) data = data.filter((g) => g.status === statusFilter);
    if (search)
      data = data.filter(
        (g) => g.name.includes(search) || String(g.id) === search
      );
    // 정렬
    if (sorter.order && sorter.field) {
      data = data.sort((a, b) => {
        const col = sorter.field;
        if (col === "id" || col === "address_count") {
          return sorter.order === "ascend" ? a[col] - b[col] : b[col] - a[col];
        } else {
          return sorter.order === "ascend"
            ? String(a[col as keyof typeof a]).localeCompare(
                String(b[col as keyof typeof b])
              )
            : String(b[col as keyof typeof b]).localeCompare(
                String(a[col as keyof typeof a])
              );
        }
      });
    }
    return data;
  }, [regionFilter, statusFilter, search, sorter]);

  // 주소록 필터 적용
  const filteredAddresses = useMemo(() => {
    if (!selectedGroup) return [];
    let data = [...selectedGroup.addresses];
    if (addressTypeFilter)
      data = data.filter((a) => a.address_type === addressTypeFilter);
    return data;
  }, [selectedGroup, addressTypeFilter]);

  // 이메일 목록 페이지네이션 적용
  const pagedAddresses = useMemo(() => {
    if (!selectedGroup) return [];
    const start = (emailPage - 1) * emailPageSize;
    return filteredAddresses.slice(start, start + emailPageSize);
  }, [filteredAddresses, emailPage, emailPageSize, selectedGroup]);

  // rowSelection 설정
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    getCheckboxProps: (record: any) => ({
      disabled: record.status !== "COMPLETED",
    }),
  };

  // 일괄 삭제
  function onBulkDelete() {
    Modal.confirm({
      title: "선택한 그룹을 삭제하시겠습니까?",
      content: `총 ${selectedRowKeys.length}개 그룹이 삭제됩니다.`,
      okText: "삭제",
      okType: "danger",
      onOk: () => setSelectedRowKeys([]),
    });
  }

  // 그룹 등록 (목업)
  function onCreate() {
    setEditDrawerOpen(true);
  }

  // 행 클릭 시 Drawer 오픈
  function onRowClick(record: any) {
    setSelectedGroup(record);
    setDrawerOpen(true);
    setAddressTypeFilter(undefined);
    setEmailPage(1);
  }

  // 테이블 정렬 핸들러
  function handleTableChange(_: any, filters: any, sorterObj: any) {
    setRegionFilter(filters.region ? filters.region[0] : undefined);
    setStatusFilter(filters.status ? filters.status[0] : undefined);
    setSorter({
      field: sorterObj.field,
      order: sorterObj.order,
    });
  }

  return (
    <div>
      <Title level={2}>이메일 그룹 관리</Title>
      <p>이곳에서 이메일 그룹을 관리할 수 있습니다.</p>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search
          placeholder="그룹명/ID 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
        <Select
          allowClear
          placeholder="지역 전체"
          value={regionFilter}
          onChange={setRegionFilter}
          style={{ width: 120 }}
        >
          {regionList.map((r) => (
            <Option key={r} value={r}>
              {REGION_LABELS[r]}
            </Option>
          ))}
        </Select>
        <Select
          allowClear
          placeholder="상태 전체"
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 120 }}
        >
          {statusList.map((s) => (
            <Option key={s} value={s}>
              {STATUS_LABELS[s].label}
            </Option>
          ))}
        </Select>
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
          그룹 등록
        </Button>
        <Button
          icon={<DeleteOutlined />}
          danger
          disabled={selectedRowKeys.length === 0}
          onClick={onBulkDelete}
        >
          선택 삭제
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredGroups}
        rowSelection={rowSelection}
        pagination={{ pageSize: 10 }}
        rowKey="id"
        bordered
        size="middle"
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
        style={{ cursor: "pointer" }}
        onChange={handleTableChange}
      />
      {/* 그룹 등록/수정 Drawer */}
      <Drawer
        title={selectedGroup ? "그룹 수정" : "그룹 등록"}
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        width={480}
        destroyOnHidden
      >
        <Form layout="vertical">
          <Form.Item label="그룹명" name="name">
            <Input placeholder="그룹명을 입력하세요" />
          </Form.Item>
          <Form.Item label="지역" name="region">
            <Select>
              {regionList.map((r) => (
                <Option key={r} value={r}>
                  {REGION_LABELS[r]}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="상태" name="status">
            <Select>
              {statusList.map((s) => (
                <Option key={s} value={s}>
                  {STATUS_LABELS[s].label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              저장
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      {/* 그룹 상세 Drawer */}
      <Drawer
        title={selectedGroup ? `${selectedGroup.name} 상세` : ""}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={600}
        destroyOnHidden
      >
        {selectedGroup && (
          <>
            <Descriptions
              column={2}
              bordered
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label="ID">
                {selectedGroup.id}
              </Descriptions.Item>
              <Descriptions.Item label="그룹명">
                {selectedGroup.name}
              </Descriptions.Item>
              <Descriptions.Item label="지역">
                {REGION_LABELS[selectedGroup.region]}
              </Descriptions.Item>
              <Descriptions.Item label="상태">
                <Tag color={STATUS_LABELS[selectedGroup.status].color}>
                  {STATUS_LABELS[selectedGroup.status].label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="주소 수">
                {selectedGroup.address_count}
              </Descriptions.Item>
              <Descriptions.Item label="생성일">
                {selectedGroup.created_at}
              </Descriptions.Item>
              <Descriptions.Item label="수정일">
                {selectedGroup.updated_at}
              </Descriptions.Item>
            </Descriptions>
            <Table
              columns={addressColumns}
              dataSource={pagedAddresses}
              pagination={{
                current: emailPage,
                pageSize: emailPageSize,
                total: filteredAddresses.length,
                onChange: (page, pageSize) => {
                  setEmailPage(page);
                  setEmailPageSize(pageSize);
                },
                showSizeChanger: true,
                size: "small",
              }}
              size="small"
              rowKey="id"
              bordered
              title={() => "포함된 이메일 주소록"}
            />
          </>
        )}
      </Drawer>
    </div>
  );
}
