"use client";
import { Layout } from "antd";

const { Content } = Layout;

export default function ContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Content
      style={{
        margin: 0,
        padding: 24,
        minHeight: 280,
        background: "#f7f9fb",
      }}
    >
      {children}
    </Content>
  );
}
