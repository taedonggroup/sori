"use client";

// 공간 (메인 페이지) — stone / fragments 상태 머신
import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import NicknameInput from "@/components/gonmyung/NicknameInput";
import JoakakFeed from "@/components/gonmyung/JoakakFeed";
import UlrimRecommendPanel from "@/components/gonmyung/UlrimRecommendPanel";
import { Button } from "@/components/ui/button";

// Three.js는 SSR 비활성화
const StoneScene = dynamic(() => import("@/components/3d/StoneScene"), { ssr: false });

type PageState = "stone" | "fragments";

export default function 공간() {
  const [pageState, setPageState] = useState<PageState>("stone");
  const [nickname, setNickname] = useState("");

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ===== STONE 상태 ===== */}
      <div
        className={`transition-opacity duration-400 ${
          pageState === "stone"
            ? "opacity-100"
            : "opacity-0 pointer-events-none fixed inset-0"
        }`}
      >
        {/* 원석 3D 씬 — stone 상태에서 풀사이즈 */}
        <div className="w-full" style={{ height: "60vh" }}>
          {pageState === "stone" && <StoneScene />}
        </div>

        {/* stone 콘텐츠 */}
        <div className="flex flex-col items-center px-6 pt-6 pb-16 space-y-8">
          {/* 브랜드 */}
          <div className="text-center space-y-1">
            <p className="text-zinc-600 text-xs tracking-[0.5em] uppercase">POWERED BY 공명</p>
            <p className="text-white text-2xl font-thin tracking-[0.4em]">S O R I</p>
          </div>

          {/* 닉네임 입력 */}
          <div className="w-full max-w-xs">
            <NicknameInput value={nickname} onChange={setNickname} />
          </div>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="sori-outline" size="sori-lg" asChild>
              <Link href="/upload">조각 올리기</Link>
            </Button>
            <Button
              variant="sori-ghost"
              size="sori-lg"
              onClick={() => setPageState("fragments")}
            >
              조각 둘러보기 →
            </Button>
          </div>
        </div>
      </div>

      {/* ===== FRAGMENTS 상태 ===== */}
      <div
        className={`transition-opacity duration-500 delay-200 ${
          pageState === "fragments"
            ? "opacity-100"
            : "opacity-0 pointer-events-none fixed inset-0"
        }`}
      >
        <div className="min-h-screen px-4 pt-6 pb-28">
          {/* 헤더 */}
          <div className="flex items-center gap-4 mb-6 max-w-3xl mx-auto">
            <button
              onClick={() => setPageState("stone")}
              className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors flex items-center gap-1"
            >
              ← 공간으로
            </button>
            <p className="text-white text-sm tracking-wider">조각들</p>
          </div>

          {/* 조각 피드 */}
          <div className="max-w-3xl mx-auto">
            <JoakakFeed />
          </div>
        </div>

        {/* 원석 미니 씬 — 우하단 고정 */}
        <div
          className="cursor-pointer"
          style={{
            position: "fixed",
            bottom: "16px",
            right: "16px",
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "1px solid #27272a",
            zIndex: 40,
          }}
          onClick={() => setPageState("stone")}
          title="공간으로 돌아가기"
        >
          {pageState === "fragments" && <StoneScene />}
        </div>
      </div>

      {/* 공명 추천 패널 — fragments에서만 표시 */}
      <UlrimRecommendPanel isVisible={pageState === "fragments"} />
    </div>
  );
}
