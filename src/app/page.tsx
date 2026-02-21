"use client";

// 공간 (메인) — stone / fragments 상태 머신
// 3D 배경은 SoriCanvas(layout)에서 담당, 이 페이지는 HTML 오버레이만
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import NicknameInput from "@/components/gonmyung/NicknameInput";
import JoakakFeed from "@/components/gonmyung/JoakakFeed";
import UlrimRecommendPanel from "@/components/gonmyung/UlrimRecommendPanel";
import { Button } from "@/components/ui/button";
import { useSceneStore } from "@/store/sceneStore";

type PageState = "stone" | "fragments";

export default function 공간() {
  const [pageState, setPageState] = useState<PageState>("stone");
  const [nickname, setNickname] = useState("");

  const setScene = useSceneStore((s) => s.setScene);
  const setTransitioning = useSceneStore((s) => s.setTransitioning);

  // 페이지 마운트 시 stone 씬으로 초기화
  useEffect(() => {
    setScene("stone");
  }, [setScene]);

  // stone → fragments 전환: 카메라 fly-through 연출
  const goToFragments = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      setPageState("fragments");
      setScene("fragments");
      setTimeout(() => setTransitioning(false), 500);
    }, 500);
  }, [setScene, setTransitioning]);

  // fragments → stone 복귀
  const goToStone = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      setPageState("stone");
      setScene("stone");
      setTimeout(() => setTransitioning(false), 500);
    }, 500);
  }, [setScene, setTransitioning]);

  // ===== STONE 상태 =====
  if (pageState === "stone") {
    return (
      <div className="min-h-screen bg-transparent text-white flex flex-col">
        {/* 브랜드 */}
        <div className="text-center pt-8 pb-2 space-y-1 shrink-0">
          <p className="text-zinc-600 text-xs tracking-[0.5em] uppercase">POWERED BY 공명</p>
          <p className="text-white text-2xl font-thin tracking-[0.4em]">S O R I</p>
        </div>

        {/* 3D 원석은 SoriCanvas가 담당 — spacer */}
        <div className="flex-1" style={{ minHeight: "50vh" }} />

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
              onClick={goToFragments}
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
    <div className="min-h-screen bg-transparent text-white">
      {/* 헤더 */}
      <div className="flex items-center gap-4 px-4 pt-6 pb-2 max-w-3xl mx-auto">
        <button
          onClick={goToStone}
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

      {/* 우하단 미니 원석 버튼 — SoriCanvas 원석이 fragments 씬에서 우하단으로 이동 */}
      <div
        style={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          border: "1px solid #27272a",
          zIndex: 40,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={goToStone}
        title="공간으로 돌아가기"
      >
        <span className="text-zinc-600 text-xs">◎</span>
      </div>

      {/* 공명 추천 패널 */}
      <UlrimRecommendPanel isVisible />
    </div>
  );
}
