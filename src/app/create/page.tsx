"use client";

// (첫)울림 만들기 — 갤러리에서 조각 선택 → FFmpeg amix 믹스
import { useState, useCallback, Suspense } from "react";
import Link from "next/link";
import ParticleBackground from "@/components/ParticleBackground";
import { Button } from "@/components/ui/button";
import JoakakFeed from "@/components/gonmyung/JoakakFeed";
import MixSelector from "@/components/gonmyung/MixSelector";
import ResonanceLoader from "@/components/gonmyung/ResonanceLoader";
import ResultPanel from "@/components/gonmyung/ResultPanel";
import type { Joakak, MixResponse, GenerateResponse } from "@/lib/gonmyung/types";

function CreateContent() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isMixing, setIsMixing] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
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

      if (!response.ok) {
        throw new Error(`믹스 실패: ${response.status}`);
      }

      const data = (await response.json()) as MixResponse;

      // MixResponse → ResultPanel용 GenerateResponse 형태로 변환
      setResult({
        success: true,
        genre: `${selectedIds.length}개 조각 믹스`,
        mood: "공명",
        duration: data.duration,
        preset_applied: "FFmpeg amix",
        preset_eq: { low: 5, mid: 5, high: 5 },
        preset_reverb: 0.5,
        mode: "ai",
        outputs: {
          full_mix: data.output_url,
          stems: { drums: null, bass: null, melody: null },
        },
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
    setResult(null);
    setSelectedIds([]);
    setErrorMessage(null);
  }, []);

  return (
    <>
      {/* 공명 로딩 오버레이 */}
      <ResonanceLoader
        isLoading={isMixing}
        progress={isMixing ? 50 : 0}
        currentStep="조각들을 공명으로 믹싱하는 중..."
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 pb-32">
        {/* 헤더 */}
        <header className="text-center mb-10 space-y-3 animate-fadeInUp">
          <Link href="/" className="inline-block">
            <h2 className="text-zinc-600 text-xs tracking-[0.4em] uppercase hover:text-zinc-400 transition-colors">
              SORI
            </h2>
          </Link>
          <h1 className="text-2xl font-light text-white tracking-tight">
            (첫)울림 만들기
          </h1>
          <p className="text-zinc-500 text-sm font-light">
            조각을 선택해 공명이 믹스합니다
          </p>
        </header>

        {/* 에러 메시지 */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-800/50 rounded-xl text-center animate-fadeInUp">
            <p className="text-red-400 text-sm">{errorMessage}</p>
          </div>
        )}

        {result ? (
          /* 결과 패널 */
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase mb-2">공명 완료</p>
              <p className="text-zinc-400 text-sm">
                {selectedIds.length}개의 조각이 하나의 울림이 되었습니다
              </p>
            </div>
            <ResultPanel result={result} onReset={handleReset} />
            <div className="text-center">
              <Button variant="sori-ghost" asChild>
                <Link href="/gallery">갤러리로 돌아가기</Link>
              </Button>
            </div>
          </div>
        ) : (
          /* 조각 선택 피드 */
          <div className="space-y-4 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
            {selectedIds.length === 0 ? (
              <p className="text-zinc-600 text-xs text-center">
                아래에서 조각을 2개 이상 선택하면 공명이 믹스합니다
              </p>
            ) : (
              <p className="text-zinc-500 text-xs text-center">
                {selectedIds.length}개 선택됨 — 2개 이상이면 믹스 패널이 나타납니다
              </p>
            )}

            <JoakakFeed
              selectionMode
              selectedIds={selectedIds}
              onSelectToggle={handleSelectToggle}
            />
          </div>
        )}

        {/* 갤러리 링크 */}
        {!result && (
          <div className="mt-8 text-center">
            <Button variant="sori-ghost" className="text-sm" asChild>
              <Link href="/gallery">갤러리로 돌아가기</Link>
            </Button>
          </div>
        )}
      </div>

      {/* 믹스 선택 패널 */}
      {!result && (
        <MixSelector
          selectedIds={selectedIds}
          onMix={handleMix}
          isMixing={isMixing}
        />
      )}
    </>
  );
}

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <ParticleBackground />
      <Suspense
        fallback={
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <p className="text-zinc-500">불러오는 중...</p>
          </div>
        }
      >
        <CreateContent />
      </Suspense>
    </main>
  );
}
