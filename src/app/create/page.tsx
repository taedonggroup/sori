"use client";

// (첫)울림 만들기 — 갤러리에서 조각 선택 → FFmpeg amix 믹스
import { useState, useCallback } from "react";
import Link from "next/link";
import JoakakFeed from "@/components/gonmyung/JoakakFeed";
import MixSelector from "@/components/gonmyung/MixSelector";
import ResonanceLoader from "@/components/gonmyung/ResonanceLoader";
import type { Joakak, MixResponse } from "@/lib/gonmyung/types";

interface MixResult {
  outputUrl: string;
  joakakCount: number;
  duration: number;
}

export default function CreatePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isMixing, setIsMixing] = useState(false);
  const [mixResult, setMixResult] = useState<MixResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    setErrorMessage(null);
    try {
      const response = await fetch("/api/gonmyung/mix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ joakak_ids: selectedIds }),
      });
      if (!response.ok) throw new Error(`믹스 실패: ${response.status}`);
      const data = (await response.json()) as MixResponse;
      setMixResult({
        outputUrl: data.output_url,
        joakakCount: data.joakak_count,
        duration: data.duration,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "공명 믹스에 실패했습니다."
      );
    } finally {
      setIsMixing(false);
    }
  }, [selectedIds]);

  const handleReset = useCallback(() => {
    setMixResult(null);
    setSelectedIds([]);
    setErrorMessage(null);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* 공명 로딩 오버레이 */}
      <ResonanceLoader
        isLoading={isMixing}
        progress={isMixing ? 50 : 0}
        currentStep="조각들을 공명으로 믹싱하는 중..."
      />

      {/* 헤더 */}
      <header className="border-b border-zinc-900 px-4 sm:px-6 py-4 sm:py-5 mb-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-zinc-600 text-[10px] tracking-[0.5em] uppercase mb-1">SORI / 공명</p>
          <h1 className="text-white text-lg font-light tracking-widest">(첫)울림 만들기</h1>
          <p className="text-zinc-600 text-xs tracking-[0.2em] mt-1">조각을 2개 이상 선택하면 공명이 믹스합니다</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-28 sm:pb-8">
        {/* 에러 메시지 */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-black border border-red-900 text-center">
            <p className="text-red-400 text-sm">{errorMessage}</p>
          </div>
        )}

        {mixResult ? (
          /* 결과 */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-zinc-600 text-[10px] tracking-[0.5em] uppercase">
                공명 완료
              </p>
              <p className="text-zinc-400 text-sm tracking-[0.2em]">
                {mixResult.joakakCount}개의 조각이 하나의 울림이 되었습니다
              </p>
            </div>

            {/* 울림 플레이어 */}
            <div className="bg-black border border-zinc-900 p-6 space-y-4">
              <p className="text-zinc-600 text-[10px] tracking-[0.5em] uppercase text-center">
                울림
              </p>
              <audio
                controls
                src={mixResult.outputUrl}
                className="w-full"
              />
              <p className="text-zinc-700 text-xs text-center font-mono">
                재생 시간: {Math.round(mixResult.duration)}초
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleReset}
                className="text-zinc-600 text-xs tracking-[0.2em] py-3 px-4 hover:text-zinc-300 transition-colors uppercase"
              >
                다시 선택
              </button>
              <Link
                href="/gallery"
                className="border border-zinc-800 text-zinc-400 text-xs tracking-[0.2em] py-3 px-5 hover:border-zinc-600 hover:text-zinc-200 transition-all uppercase"
              >
                갤러리로
              </Link>
            </div>
          </div>
        ) : (
          /* 조각 선택 피드 */
          <div className="space-y-4">
            <p className="text-zinc-700 text-[10px] tracking-[0.2em] text-center">
              {selectedIds.length === 0
                ? "아래에서 조각을 2개 이상 선택하면 공명이 믹스합니다"
                : `${selectedIds.length}개 선택됨 — 2개 이상이면 믹스 패널이 나타납니다`}
            </p>
            <JoakakFeed
              selectionMode
              selectedIds={selectedIds}
              onSelectToggle={handleSelectToggle}
            />
          </div>
        )}

        {!mixResult && (
          <div className="mt-8 text-center">
            <Link
              href="/gallery"
              className="text-zinc-600 text-xs tracking-[0.2em] hover:text-zinc-300 transition-colors uppercase"
            >
              갤러리로 돌아가기
            </Link>
          </div>
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
