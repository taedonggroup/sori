"use client";

// (첫)울림 만들기 — 공명 AI 엔진으로 음악 생성
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ParticleBackground from "@/components/ParticleBackground";
import GenreGrid from "@/components/gonmyung/GenreGrid";
import ParameterControls from "@/components/gonmyung/ParameterControls";
import ResonanceLoader from "@/components/gonmyung/ResonanceLoader";
import ResultPanel from "@/components/gonmyung/ResultPanel";
import { GONMYUNG_PRESETS } from "@/lib/gonmyung/presets";
import { GENRE_SAMPLE_MAP } from "@/lib/gonmyung/samples";
import type { GenerateResponse } from "@/lib/gonmyung/types";

const API_URL = process.env.NEXT_PUBLIC_GONMYUNG_API_URL;

const LOADING_STEPS = [
  "흩어진 조각들을 수집하는 중...",
  "공명의 주파수를 맞추는 중...",
  "[MusicGen] 음악 생성 중...",
  "마스터링 프리셋 적용 중...",
  "[Demucs] 스템 분리 중...",
  "공명이 울립니다",
];

function createMockResult(genre: string, duration: number, mood: string): GenerateResponse {
  const preset = GONMYUNG_PRESETS.find((p) => p.genre === genre) ?? GONMYUNG_PRESETS[0];
  return {
    success: true,
    genre,
    mood,
    duration,
    preset_applied: preset.name,
    preset_eq: preset.eq,
    preset_reverb: preset.reverb,
    mode: "simulation",
    outputs: {
      full_mix: GENRE_SAMPLE_MAP[genre] ?? "/audio/test/full_mix.wav",
      stems: {
        drums: "/audio/test/stem_drums.wav",
        bass: "/audio/test/stem_bass.wav",
        melody: "/audio/test/stem_melody.wav",
      },
    },
  };
}

function CreateContent() {
  const searchParams = useSearchParams();
  const genreParam = searchParams.get("genre");

  const [selectedGenre, setSelectedGenre] = useState("kpop");
  const [duration, setDuration] = useState(10);
  const [intensity, setIntensity] = useState(7);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // URL 쿼리 파라미터로 장르 초기값 설정
  useEffect(() => {
    if (!genreParam) return;
    const matchedPreset = GONMYUNG_PRESETS.find(
      (p) => p.genre === genreParam.toLowerCase()
    );
    if (matchedPreset) {
      setSelectedGenre(matchedPreset.genre);
    }
  }, [genreParam]);

  const runSimulation = useCallback(
    (genre: string, dur: number) => {
      const preset = GONMYUNG_PRESETS.find((p) => p.genre === genre) ?? GONMYUNG_PRESETS[0];
      const mood = preset.mood;
      let stepIndex = 0;

      const stepInterval = setInterval(() => {
        stepIndex++;
        if (stepIndex < LOADING_STEPS.length) {
          setCurrentStep(LOADING_STEPS[stepIndex]);
          setProgress((stepIndex / (LOADING_STEPS.length - 1)) * 100);
        }
      }, 500);

      setCurrentStep(LOADING_STEPS[0]);
      setProgress(0);

      setTimeout(() => {
        clearInterval(stepInterval);
        setProgress(100);
        setCurrentStep(LOADING_STEPS[LOADING_STEPS.length - 1]);

        setTimeout(() => {
          setResult(createMockResult(genre, dur, mood));
          setIsGenerating(false);
        }, 400);
      }, 3000);

      return () => clearInterval(stepInterval);
    },
    []
  );

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setResult(null);
    setProgress(0);
    setErrorMessage(null);

    const preset = GONMYUNG_PRESETS.find((p) => p.genre === selectedGenre) ?? GONMYUNG_PRESETS[0];
    const mood = preset.mood;

    if (!API_URL) {
      if (process.env.NODE_ENV === "production") {
        setErrorMessage("공명 API가 설정되지 않았습니다. 관리자에게 문의해주세요.");
        setIsGenerating(false);
        return;
      }
      runSimulation(selectedGenre, duration);
      return;
    }

    try {
      setCurrentStep(LOADING_STEPS[0]);
      const response = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          genre: selectedGenre,
          duration,
          intensity,
          mood,
        }),
      });

      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }

      const data = (await response.json()) as GenerateResponse;
      setProgress(100);
      setCurrentStep(LOADING_STEPS[LOADING_STEPS.length - 1]);

      setTimeout(() => {
        setResult(data);
        setIsGenerating(false);
      }, 400);
    } catch (error) {
      console.error("공명 API 오류:", error instanceof Error ? error.message : error);
      // 개발환경이면 시뮬레이션 폴백, 프로덕션이면 에러 표시
      if (process.env.NODE_ENV === "development") {
        runSimulation(selectedGenre, duration);
      } else {
        setErrorMessage("공명 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
        setIsGenerating(false);
      }
    }
  }, [selectedGenre, duration, intensity, runSimulation]);

  const handleReset = useCallback(() => {
    setResult(null);
    setProgress(0);
    setCurrentStep("");
    setErrorMessage(null);
  }, []);

  return (
    <>
      {/* 공명 로딩 오버레이 */}
      <ResonanceLoader
        isLoading={isGenerating}
        progress={progress}
        currentStep={currentStep}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        {/* 헤더 */}
        <header className="text-center mb-12 space-y-3 animate-fadeInUp">
          <Link href="/" className="inline-block">
            <h2 className="text-zinc-600 text-xs tracking-[0.4em] uppercase hover:text-zinc-400 transition-colors">
              SORI
            </h2>
          </Link>
          <h1 className="text-2xl font-light text-white tracking-tight">
            (첫)울림 만들기
          </h1>
          <p className="text-zinc-500 text-sm font-light">
            K-Content에 특화된 공명이 당신의 조각으로 울림을 만듭니다
          </p>
        </header>

        {/* 에러 메시지 영역 */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-800/50 rounded-xl text-center animate-fadeInUp">
            <p className="text-red-400 text-sm">{errorMessage}</p>
          </div>
        )}

        {!result ? (
          <div className="space-y-8">
            {/* 패널 01: 장르 선택 */}
            <section
              className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4 animate-fadeInUp"
              style={{ animationDelay: "0.1s" }}
            >
              <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase">
                01 — 장르 선택
              </p>
              <GenreGrid
                presets={GONMYUNG_PRESETS}
                selectedGenre={selectedGenre}
                onSelect={setSelectedGenre}
              />
            </section>

            {/* 패널 02: 파라미터 */}
            <section
              className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4 animate-fadeInUp"
              style={{ animationDelay: "0.2s" }}
            >
              <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase">
                02 — 파라미터
              </p>
              <ParameterControls
                duration={duration}
                intensity={intensity}
                onDurationChange={setDuration}
                onIntensityChange={setIntensity}
              />
            </section>

            {/* 생성 버튼 */}
            <div
              className="animate-fadeInUp"
              style={{ animationDelay: "0.3s" }}
            >
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-4 rounded-full text-sm tracking-wider
                  border border-[#F8F32B]/60 text-[#F8F32B]
                  transition-all duration-300
                  hover:border-[#F8F32B] hover:shadow-[0_0_20px_rgba(248,243,43,0.15)]
                  active:scale-[0.98]
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                공명 생성
              </button>
            </div>
          </div>
        ) : (
          <ResultPanel result={result} onReset={handleReset} />
        )}

        {/* 돌아가기 링크 */}
        <div className="mt-8 text-center">
          <Link
            href="/upload"
            className="text-zinc-600 text-sm hover:text-zinc-400 transition-colors"
          >
            조각 업로드로 돌아가기
          </Link>
        </div>
      </div>
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
