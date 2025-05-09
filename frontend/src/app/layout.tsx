import { Layout } from "antd";
import "antd/dist/reset.css";
import { Geist, Geist_Mono } from "next/font/google";
import ClientProviders from "./ClientProviders";
import ContentWrapper from "./ContentWrapper";
import Sidebar from "./Sidebar";
import "./globals.css";

const { Content } = Layout;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClientProviders>
          <Layout style={{ minHeight: "100vh" }}>
            <Sidebar />
            <Layout>
              <ContentWrapper>{children}</ContentWrapper>
            </Layout>
          </Layout>
        </ClientProviders>
      </body>
    </html>
  );
}
