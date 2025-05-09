import "@/styles/globals.css";
import { ThemeProvider } from "@emotion/react";
import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import type { AppProps } from "next/app";
import { useSystemStore } from "../store";

const theme = {
  colors: {
    primary: "#1677ff",
  },
};

const systemTheme = {
  잡스: {
    colorPrimary: "#1677ff", // 블루
    colorBgBase: "#f0f6ff",
    colorBgContainer: "#1677ff",
    colorTextLightSolid: "#fff",
  },
  틀루토: {
    colorPrimary: "#8b5cf6", // 보라
    colorBgBase: "#f6f0ff",
    colorBgContainer: "#8b5cf6",
    colorTextLightSolid: "#fff",
  },
};

export default function App({ Component, pageProps }: AppProps) {
  const system = useSystemStore((state) => state.system);
  return (
    <ConfigProvider
      theme={{
        token: systemTheme[system],
      }}
    >
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </ConfigProvider>
  );
}
