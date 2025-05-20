import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Upload,
  message,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import React, { useState } from "react";
import { useEmailGroups } from "./hooks/useEmailGroups";
import type {
  CreateEmailGroupDto,
  EmailGroup,
  EmailGroupListParams,
  EmailGroupRegion,
  EmailGroupStatus,
  UpdateEmailGroupDto,
} from "./types/emailGroupsTypes";

const { Title } = Typography;

const STATUS_COLORS: Record<EmailGroupStatus, string> = {
  PENDING: "default",
  WAITING: "processing",
  PROCESSING: "processing",
  COMPLETED: "success",
  FAILED: "error",
};

const STATUS_LABELS: Record<EmailGroupStatus, string> = {
  PENDING: "대기",
  WAITING: "준비",
  PROCESSING: "처리중",
  COMPLETED: "완료",
  FAILED: "실패",
};

const REGION_LABELS: Record<EmailGroupRegion, string> = {
  DOMESTIC: "국내",
  OVERSEAS: "해외",
};

const EmailGroupsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<EmailGroup | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [searchParams, setSearchParams] = useState<EmailGroupListParams>({
    page: 1,
    pageSize: 10,
    sortBy: "createdAt",
    sortOrder: "DESC",
  });

  const {
    emailGroups,
    total,
    isLoading,
    createEmailGroup,
    isCreating,
    updateEmailGroup,
    isUpdating,
    deleteEmailGroup,
    isDeleting,
  } = useEmailGroups(searchParams);

  const handleModalOpen = (group?: EmailGroup) => {
    setEditingGroup(group ?? null);
    form.resetFields();
    if (group) {
      form.setFieldsValue(group);
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingGroup(null);
    form.resetFields();
    setFileList([]);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingGroup) {
        await updateEmailGroup({
          id: editingGroup.id,
          data: {
            ...values,
            file: fileList[0]?.originFileObj,
          } as UpdateEmailGroupDto,
        });
        message.success("그룹이 수정되었습니다.");
      } else {
        const formData: CreateEmailGroupDto = {
          ...values,
          file: fileList[0]?.originFileObj,
        };
        await createEmailGroup(formData);
        message.success("그룹이 생성되었습니다.");
      }
      handleModalClose();
    } catch (error) {
      message.error("오류가 발생했습니다.");
    }
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setSearchParams({
      ...searchParams,
      page: pagination.current,
      pageSize: pagination.pageSize,
      sortBy: sorter.field,
      sortOrder: sorter.order === "ascend" ? "ASC" : "DESC",
    });
  };

  const columns = [
    {
      title: "그룹명",
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: "25%",
    },
    {
      title: "지역",
      dataIndex: "region",
      key: "region",
      width: "10%",
      filters: Object.entries(REGION_LABELS).map(([value, label]) => ({
        text: label,
        value: value,
      })),
      render: (region: EmailGroupRegion) => REGION_LABELS[region],
    },
    {
      title: "상태",
      dataIndex: "status",
      key: "status",
      width: "10%",
      filters: Object.entries(STATUS_LABELS).map(([value, label]) => ({
        text: label,
        value: value,
      })),
      render: (status: EmailGroupStatus) => (
        <Tag color={STATUS_COLORS[status]}>{STATUS_LABELS[status]}</Tag>
      ),
    },
    {
      title: "이메일 수",
      dataIndex: "addressCount",
      key: "addressCount",
      sorter: true,
      width: "15%",
      render: (count: number) => count.toLocaleString(),
    },
    {
      title: "생성일",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      width: "20%",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "작업",
      key: "action",
      width: "20%",
      render: (_: any, record: EmailGroup) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleModalOpen(record)}
          >
            수정
          </Button>
          <Popconfirm
            title="정말 삭제하시겠습니까?"
            onConfirm={() => {
              deleteEmailGroup(record.id);
              message.success("삭제되었습니다.");
            }}
            okText="예"
            cancelText="아니오"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              loading={isDeleting}
            >
              삭제
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card bordered={false}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Space direction="vertical" size="small">
            <Title level={4} style={{ margin: 0 }}>
              이메일 그룹 관리
            </Title>
            <Typography.Text type="secondary">
              이메일 그룹을 생성하고 관리할 수 있습니다.
            </Typography.Text>
          </Space>

          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Space wrap>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleModalOpen()}
              >
                새 그룹 만들기
              </Button>
              <Input
                placeholder="그룹명으로 검색"
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    search: e.target.value,
                    page: 1,
                  })
                }
                style={{ width: 300 }}
                allowClear
              />
              <Select
                placeholder="지역 선택"
                style={{ width: 120 }}
                allowClear
                onChange={(value) =>
                  setSearchParams({
                    ...searchParams,
                    region: value,
                    page: 1,
                  })
                }
              >
                {Object.entries(REGION_LABELS).map(([value, label]) => (
                  <Select.Option key={value} value={value}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
              <Select
                placeholder="상태 선택"
                style={{ width: 120 }}
                allowClear
                onChange={(value) =>
                  setSearchParams({
                    ...searchParams,
                    status: value,
                    page: 1,
                  })
                }
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <Select.Option key={value} value={value}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </Space>

            <Table
              columns={columns}
              dataSource={emailGroups}
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

      <Modal
        title={editingGroup ? "그룹 수정" : "새 그룹 만들기"}
        open={isModalOpen}
        onCancel={handleModalClose}
        onOk={form.submit}
        confirmLoading={isCreating || isUpdating}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            region: "DOMESTIC",
          }}
        >
          <Form.Item
            name="name"
            label="그룹명"
            rules={[{ required: true, message: "그룹명을 입력해주세요" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="region"
            label="지역"
            rules={[{ required: true, message: "지역을 선택해주세요" }]}
          >
            <Select>
              <Select.Option value="DOMESTIC">국내</Select.Option>
              <Select.Option value="OVERSEAS">해외</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="이메일 목록">
            <Upload
              accept=".csv,.xlsx"
              maxCount={1}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
            >
              <Button>파일 선택</Button>
            </Upload>
            <Typography.Text
              type="secondary"
              style={{ marginTop: 8, display: "block" }}
            >
              CSV 또는 Excel 파일을 업로드해주세요.
            </Typography.Text>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmailGroupsPage;
