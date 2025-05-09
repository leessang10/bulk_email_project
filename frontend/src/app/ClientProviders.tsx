"use client";
import { ThemeProvider } from "@emotion/react";
import "antd/dist/reset.css";

const theme = {
  colorPrimary: "#1677ff",
};

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
