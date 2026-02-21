"use client";

// 공간 (메인) — stone / fragments 상태 머신
import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import NicknameInput from "@/components/gonmyung/NicknameInput";
import JoakakFeed from "@/components/gonmyung/JoakakFeed";
import UlrimRecommendPanel from "@/components/gonmyung/UlrimRecommendPanel";
import { Button } from "@/components/ui/button";

// Three.js Canvas — SSR 비활성화 필수
const StoneScene = dynamic(() => import("@/components/3d/StoneScene"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-transparent" />,
});

type PageState = "stone" | "fragments";

export default function 공간() {
  const [pageState, setPageState] = useState<PageState>("stone");
  const [nickname, setNickname] = useState("");

  // ===== STONE 상태 =====
  if (pageState === "stone") {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        {/* 브랜드 */}
        <div className="text-center pt-8 pb-2 space-y-1 shrink-0">
          <p className="text-zinc-600 text-xs tracking-[0.5em] uppercase">POWERED BY 공명</p>
          <p className="text-white text-2xl font-thin tracking-[0.4em]">S O R I</p>
        </div>

        {/* 원석 3D 씬 */}
        <div className="flex-1" style={{ minHeight: "50vh" }}>
          <StoneScene />
        </div>

        {/* 닉네임 + 버튼 */}
        <div className="shrink-0 flex flex-col items-center px-6 pt-4 pb-12 space-y-6">
          <div className="w-full max-w-xs">
            <NicknameInput value={nickname} onChange={setNickname} />
          </div>
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
    );
  }

  // ===== FRAGMENTS 상태 =====
  return (
    <div className="min-h-screen bg-black text-white">
      {/* 헤더 */}
      <div className="flex items-center gap-4 px-4 pt-6 pb-2 max-w-3xl mx-auto">
        <button
          onClick={() => setPageState("stone")}
          className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors flex items-center gap-1"
        >
          ← 공간으로
        </button>
        <p className="text-white text-sm tracking-wider">조각들</p>
      </div>

      {/* 조각 피드 */}
      <div className="max-w-3xl mx-auto px-4 pb-28">
        <JoakakFeed />
      </div>

      {/* 우하단 미니 원석 — 클릭 시 공간으로 */}
      <div
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
          cursor: "pointer",
        }}
        onClick={() => setPageState("stone")}
        title="공간으로 돌아가기"
      >
        <StoneScene />
      </div>

      {/* 공명 추천 패널 */}
      <UlrimRecommendPanel isVisible />
    </div>
  );
}
