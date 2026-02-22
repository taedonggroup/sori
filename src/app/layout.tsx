import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        style={{ backgroundColor: "#000000", color: "#fafafa" }}
      >
        {/* 데스크탑 상단 Navbar (sm 이상에서만 표시) */}
        <Navbar />

        {/* 페이지 컨텐츠 — 데스크탑은 Navbar 높이(48px) 만큼 상단 여백 */}
        <div className="sm:pt-12">
          {children}
        </div>

        {/* 모바일 하단 탭 네비게이션 (sm 미만에서만 표시) */}
        <MobileNav />
      </body>
    </html>
  );
}
