"use client";

// 조각 갤러리 — 커뮤니티 조각 피드 + 선택→공명 믹스
import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ParticleBackground from "@/components/ParticleBackground";
import { Button } from "@/components/ui/button";
import JoakakFeed from "@/components/gonmyung/JoakakFeed";
import MixSelector from "@/components/gonmyung/MixSelector";
import ResonanceLoader from "@/components/gonmyung/ResonanceLoader";
import ResultPanel from "@/components/gonmyung/ResultPanel";
import type { Joakak, MixResponse, GenerateResponse } from "@/lib/gonmyung/types";

export default function 갤러리() {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isMixing, setIsMixing] = useState(false);
  const [mixResult, setMixResult] = useState<GenerateResponse | null>(null);

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

      // MixResponse → ResultPanel이 사용하는 GenerateResponse 형태로 변환
      setMixResult({
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
    } catch {
      // 오류 시 무시
    } finally {
      setIsMixing(false);
    }
  }, [selectedIds]);

  const handleMixReset = useCallback(() => {
    setMixResult(null);
    setSelectedIds([]);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white relative">
      <ParticleBackground />

      {/* 공명 로딩 오버레이 */}
      <ResonanceLoader
        isLoading={isMixing}
        progress={isMixing ? 50 : 0}
        currentStep="조각들을 공명으로 믹싱하는 중..."
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12 pb-32">
        {/* 헤더 */}
        <header className="flex items-center justify-between mb-10 animate-fadeInUp">
          <div className="space-y-1">
            <Link href="/">
              <span className="text-zinc-600 text-xs tracking-[0.4em] uppercase hover:text-zinc-400 transition-colors">
                SORI
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
          <div className="animate-fadeInUp">
            <div className="mb-6 text-center">
              <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase mb-2">
                공명 완료
              </p>
              <h2 className="text-xl font-light text-white">
                {selectedIds.length}개의 조각이 하나의 울림이 되었습니다
              </h2>
            </div>
            <ResultPanel result={mixResult} onReset={handleMixReset} />
          </div>
        ) : (
          <>
            {/* 선택 모드 안내 */}
            {selectedIds.length > 0 && (
              <p className="text-zinc-600 text-xs text-center mb-4 animate-fadeInUp">
                {selectedIds.length}개 선택됨 — 2개 이상 선택하면 공명 믹스 버튼이 나타납니다
              </p>
            )}
            {selectedIds.length === 0 && (
              <p className="text-zinc-700 text-xs text-center mb-4">
                조각을 선택해 공명으로 믹스하거나, 재생 버튼으로 들어보세요
              </p>
            )}

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
