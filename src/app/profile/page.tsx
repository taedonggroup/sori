"use client";

// 원석 프로필 페이지 — 스크롤 없는 원페이지, 3단계 상태 전환
import { Component, useState, type ReactNode, type ErrorInfo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import ParticleBackground from "@/components/ParticleBackground";

// 3D 렌더링 오류 경계 — GLB 로드 실패 시 폴백
class StoneErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("3D 렌더링 오류:", error, info);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// Three.js 씬 — SSR 제외 (클라이언트 전용)
const StoneScene = dynamic(() => import("@/components/3d/StoneScene"), {
  ssr: false,
  loading: () => <div className="w-full h-full" />,
});

// --- 목 데이터 (추후 API 연동) ---
const MOCK_원석 = {
  닉네임: "원석_0421",
  가입일: "2026.02",
  조각수: 7,
  페르소나: [
    "몽환적", "실험적", "도시적",
    "고독한", "전위적", "감성적", "내성적",
  ],
  조각목록: [
    { id: 1, 이름: "untitled_01.wav",   장르: "Electronic",   BPM: 128, 키: "F minor",  날짜: "2026.02.21" },
    { id: 2, 이름: "sketch_loop.mp3",   장르: "Ambient",      BPM: 72,  키: "C Major",  날짜: "2026.02.20" },
    { id: 3, 이름: "raw_demo_03.flac",  장르: "Experimental", BPM: 95,  키: "D minor",  날짜: "2026.02.19" },
    { id: 4, 이름: "fragment_04.m4a",   장르: "Electronic",   BPM: 140, 키: "A minor",  날짜: "2026.02.17" },
    { id: 5, 이름: "noise_sketch.wav",  장르: "Noise",        BPM: 110, 키: "G minor",  날짜: "2026.02.15" },
    { id: 6, 이름: "midnight_05.mp3",   장르: "R&B",          BPM: 85,  키: "Eb Major", 날짜: "2026.02.12" },
    { id: 7, 이름: "loop_07.flac",      장르: "Hip-hop",      BPM: 93,  키: "C minor",  날짜: "2026.02.10" },
  ],
};

type ProfileState = "기본" | "페르소나" | "조각목록";

const STATE_ORDER: ProfileState[] = ["기본", "페르소나", "조각목록"];

export default function 원석프로필() {
  const [currentState, setCurrentState] = useState<ProfileState>("기본");
  const { 닉네임, 가입일, 조각수, 페르소나, 조각목록 } = MOCK_원석;

  const currentIndex = STATE_ORDER.indexOf(currentState);

  // 다음 상태로 전환
  const goNext = () => {
    const nextIndex = (currentIndex + 1) % STATE_ORDER.length;
    setCurrentState(STATE_ORDER[nextIndex]);
  };

  // 특정 상태로 전환
  const goTo = (state: ProfileState) => {
    setCurrentState(state);
  };

  // 하단 버튼 텍스트
  const getButtonLabel = (): string => {
    switch (currentState) {
      case "기본": return "페르소나 보기 →";
      case "페르소나": return "조각 보기 →";
      case "조각목록": return "처음으로";
    }
  };

  // 표시할 조각 (최대 5개)
  const visibleFragments = 조각목록.slice(0, 5);
  const remainingCount = 조각목록.length - visibleFragments.length;

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* 파티클 배경 */}
      <ParticleBackground />

      {/* 3D 원석 씬 — 전체 배경 (GLB 로드 실패 시 빈 div 폴백) */}
      <div className="absolute inset-0">
        <StoneErrorBoundary fallback={<div className="w-full h-full" />}>
          <StoneScene />
        </StoneErrorBoundary>
      </div>

      {/* 상단 브랜드 */}
      <header className="fixed top-0 left-0 z-20 p-6 md:p-8">
        <Link href="/">
          <span className="text-zinc-600 text-xs tracking-[0.3em] uppercase font-light hover:text-zinc-400 transition-colors">
            SORI
          </span>
        </Link>
      </header>

      {/* ═══ UI 오버레이 ═══ */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pb-24">

        {/* 상태 1 — 기본 */}
        {currentState === "기본" && (
          <div key="기본" className="flex flex-col items-center text-center animate-fadeIn">
            <p className="text-zinc-500 text-xs tracking-[0.4em] uppercase mb-4">
              원석 프로필
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-[0.25em] uppercase text-white">
              {닉네임}
            </h1>
            <p className="mt-4 text-sm tracking-[0.2em] text-zinc-500">
              {가입일} 합류 &nbsp;·&nbsp; 조각 {조각수}개
            </p>
          </div>
        )}

        {/* 상태 2 — 페르소나 */}
        {currentState === "페르소나" && (
          <div key="페르소나" className="flex flex-col items-center text-center max-w-2xl animate-fadeIn">
            <p className="text-zinc-600 text-xs tracking-[0.4em] uppercase mb-3">
              원석의 정체성
            </p>
            <h2 className="text-2xl font-light text-white tracking-tight mb-10">
              공명이 발견한 당신의 소리
            </h2>

            {/* 페르소나 태그 — staggered fadeInUp */}
            <div className="flex flex-wrap justify-center gap-3">
              {페르소나.map((키워드, i) => (
                <span
                  key={키워드}
                  className="px-5 py-2.5 border border-[rgba(74,111,165,0.25)] text-zinc-400 text-sm rounded-full
                    cursor-default transition-all duration-500 animate-fadeInUp
                    hover:border-[rgba(74,111,165,0.6)] hover:text-white
                    hover:shadow-[0_0_20px_rgba(74,111,165,0.15)]"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {키워드}
                </span>
              ))}
            </div>

            <p className="mt-8 text-zinc-700 text-xs tracking-wider">
              {조각수}개의 조각이 만들어낸 정체성
            </p>
          </div>
        )}

        {/* 상태 3 — 조각목록 */}
        {currentState === "조각목록" && (
          <div key="조각목록" className="flex flex-col items-center w-full max-w-xl animate-fadeIn">
            <p className="text-zinc-600 text-xs tracking-[0.4em] uppercase mb-3">
              조각 아카이브
            </p>
            <h2 className="text-2xl font-light text-white tracking-tight mb-8">
              공명에게 들려준 조각들
            </h2>

            {/* 조각 리스트 (최대 5개) */}
            <div className="w-full space-y-2">
              {visibleFragments.map((조각, i) => (
                <div
                  key={조각.id}
                  className="group flex items-center justify-between p-3 rounded-lg
                    border border-zinc-900 bg-black/60 backdrop-blur-sm
                    hover:border-zinc-700 hover:bg-zinc-900/80
                    transition-all duration-300 animate-slideInRight"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* 순서 + 파일명 */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-zinc-700 text-xs font-mono w-5 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-zinc-300 text-sm truncate group-hover:text-white transition-colors">
                      {조각.이름}
                    </p>
                  </div>

                  {/* 분석 태그 — 모바일에서 BPM/키 숨김 */}
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <span className="text-zinc-500 text-xs">{조각.장르}</span>
                    <span className="text-zinc-800 text-xs hidden sm:inline">·</span>
                    <span className="text-zinc-500 text-xs hidden sm:inline">{조각.BPM}</span>
                    <span className="text-zinc-800 text-xs hidden sm:inline">·</span>
                    <span className="text-zinc-500 text-xs hidden sm:inline">{조각.키}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 나머지 조각 수 */}
            {remainingCount > 0 && (
              <p className="mt-3 text-zinc-700 text-xs tracking-wider">
                +{remainingCount}개 더
              </p>
            )}

            {/* 새 조각 업로드 링크 */}
            <Link
              href="/upload"
              className="mt-6 inline-block px-6 py-2.5 rounded-full text-xs tracking-wider
                border border-zinc-800 text-zinc-500
                hover:border-white/40 hover:text-white
                transition-all duration-300"
            >
              새 조각 업로드하기
            </Link>
          </div>
        )}
      </div>

      {/* ═══ 하단 네비게이션 ═══ */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
        {/* 전환 버튼 */}
        <button
          onClick={goNext}
          className="text-zinc-500 text-xs tracking-wider hover:text-white transition-colors duration-300"
        >
          {getButtonLabel()}
        </button>

        {/* dot 네비게이션 */}
        <div className="flex items-center gap-3">
          {STATE_ORDER.map((state, i) => (
            <button
              key={state}
              onClick={() => goTo(state)}
              className={`rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "w-2 h-2 bg-white"
                  : "w-1.5 h-1.5 bg-zinc-700 hover:bg-zinc-500"
              }`}
              aria-label={`${state} 보기`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
