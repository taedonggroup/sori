import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TransitionOverlay from "@/components/TransitionOverlay";
import CanvasLoader from "@/components/3d/CanvasLoader";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {/* 3D 배경 캔버스 — fixed, z-0, 항상 마운트 유지 (SSR 비활성화) */}
        <CanvasLoader />

        {/* 씬 전환 fade-to-black 오버레이 — z-5 */}
        <TransitionOverlay />

        {/* HTML UI 오버레이 — z-10 */}
        <main className="relative" style={{ zIndex: 10 }}>
          {children}
        </main>
      </body>
    </html>
  );
}
