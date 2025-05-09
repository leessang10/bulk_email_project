"use client";
import { Typography } from "antd";

export default function TasksPage() {
  return (
    <div>
      <Typography.Title level={2}>발송 작업 관리</Typography.Title>
      <p>이곳에서 이메일 발송 예약, 진행 현황, 이력을 확인할 수 있습니다.</p>
    </div>
  );
}
