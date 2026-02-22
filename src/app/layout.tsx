import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SORI — 당신의 조각이 울리는 첫 번째 공명",
  description: "당신의 조각을 공명에게 들려주세요. AI가 음악적 정체성을 분석하고 (첫)울림을 만들어냅니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: "#09090b", color: "#fafafa" }}
      >
        {/* 글로벌 네비게이션 */}
        <Navbar />

        {/* 페이지 컨텐츠 — Navbar 높이(56px) 만큼 상단 여백 */}
        <div className="pt-14">
          {children}
        </div>
      </body>
    </html>
  );
}
