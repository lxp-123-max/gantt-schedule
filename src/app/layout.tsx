import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "工程进度计划 - Gantt Schedule",
  description: "绘制和管理工程项目进度计划",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}