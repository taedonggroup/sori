"use client";

// 조각 갤러리 — 커뮤니티 조각 피드 + 선택→공명 믹스
// 3D 배경은 SoriCanvas(layout)에서 담당
import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SceneEffect from "@/components/SceneEffect";
import JoakakFeed from "@/components/gonmyung/JoakakFeed";
import MixSelector from "@/components/gonmyung/MixSelector";
import ResonanceLoader from "@/components/gonmyung/ResonanceLoader";
import type { Joakak, MixResponse } from "@/lib/gonmyung/types";

interface MixResult {
  outputUrl: string;
  joakakCount: number;
  duration: number;
}

export default function 갤러리() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isMixing, setIsMixing] = useState(false);
  const [mixResult, setMixResult] = useState<MixResult | null>(null);

  const handleSelectToggle = useCallback((joakak: Joakak) => {
    setSelectedIds((prev) =>
      prev.includes(joakak.id)
        ? prev.filter((id) => id !== joakak.id)
        : [...prev, joakak.id]
    );
  }, []);

  const handleMix = useCallback(async () => {
    if (selectedIds.length < 2) return;
    setIsMixing(true);
    try {
      const response = await fetch("/api/gonmyung/mix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ joakak_ids: selectedIds }),
      });
      if (!response.ok) throw new Error("믹스 실패");
      const data = (await response.json()) as MixResponse;
      setMixResult({
        outputUrl: data.output_url,
        joakakCount: data.joakak_count,
        duration: data.duration,
      });
    } catch {
      // 오류 무시
    } finally {
      setIsMixing(false);
    }
  }, [selectedIds]);

  const handleReset = useCallback(() => {
    setMixResult(null);
    setSelectedIds([]);
  }, []);

  return (
    <main className="min-h-screen bg-transparent text-white">
      {/* gallery 씬으로 전환 — 원석 소형화 우측 배치 */}
      <SceneEffect scene="gallery" />

      {/* 공명 로딩 오버레이 */}
      <ResonanceLoader
        isLoading={isMixing}
        progress={isMixing ? 50 : 0}
        currentStep="조각들을 공명으로 믹싱하는 중..."
      />

      <div className="max-w-3xl mx-auto px-4 py-12 pb-32">
        {/* 헤더 */}
        <header className="flex items-center justify-between mb-10">
          <div className="space-y-1">
            <Link href="/">
              <span className="text-zinc-600 text-xs tracking-[0.4em] uppercase hover:text-zinc-400 transition-colors">
                ← 공간으로
              </span>
            </Link>
            <h1 className="text-2xl font-light text-white tracking-tight">
              조각 갤러리
            </h1>
          </div>
          <Button variant="sori-outline" size="sori-lg" className="text-sm" asChild>
            <Link href="/upload">조각 올리기</Link>
          </Button>
        </header>

        {/* 믹스 결과 */}
        {mixResult ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase">공명 완료</p>
              <h2 className="text-xl font-light text-white">
                {mixResult.joakakCount}개의 조각이 하나의 울림이 되었습니다
              </h2>
            </div>

            {/* 울림 플레이어 */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase text-center">울림</p>
              <audio
                controls
                src={mixResult.outputUrl}
                className="w-full"
                style={{ filter: "invert(1) hue-rotate(180deg)" }}
              />
              <p className="text-zinc-700 text-xs text-center">
                재생 시간: {Math.round(mixResult.duration)}초
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <Button variant="sori-ghost" onClick={handleReset}>
                다시 선택하기
              </Button>
              <Button variant="sori-outline" asChild>
                <Link href="/">공간으로</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* 선택 안내 */}
            <p className="text-zinc-700 text-xs text-center mb-4">
              {selectedIds.length === 0
                ? "조각을 선택해 공명으로 믹스하거나, 재생 버튼으로 들어보세요"
                : `${selectedIds.length}개 선택됨 — 2개 이상 선택하면 믹스 버튼이 나타납니다`}
            </p>

            {/* 피드 */}
            <JoakakFeed
              selectionMode
              selectedIds={selectedIds}
              onSelectToggle={handleSelectToggle}
            />
          </>
        )}
      </div>

      {/* 믹스 선택 패널 */}
      {!mixResult && (
        <MixSelector
          selectedIds={selectedIds}
          onMix={handleMix}
          isMixing={isMixing}
        />
      )}
    </main>
  );
}
