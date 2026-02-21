"use client";

// 원석 프로필 페이지
// Igloo 안개 산악 + SleepWellCreative 감성 + Vibrant 인터랙션
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

// Three.js 씬 — SSR 제외 (클라이언트 전용)
const StoneScene = dynamic(() => import("@/components/3d/StoneScene"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#b8c4cc]" />,
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
    { id: 1, 이름: "untitled_01.wav",    장르: "Electronic",   BPM: 128, 키: "F minor", 날짜: "2026.02.21" },
    { id: 2, 이름: "sketch_loop.mp3",   장르: "Ambient",      BPM: 72,  키: "C Major",  날짜: "2026.02.20" },
    { id: 3, 이름: "raw_demo_03.flac",  장르: "Experimental", BPM: 95,  키: "D minor",  날짜: "2026.02.19" },
    { id: 4, 이름: "fragment_04.m4a",   장르: "Electronic",   BPM: 140, 키: "A minor",  날짜: "2026.02.17" },
    { id: 5, 이름: "noise_sketch.wav",  장르: "Noise",        BPM: 110, 키: "G minor",  날짜: "2026.02.15" },
    { id: 6, 이름: "midnight_05.mp3",   장르: "R&B",          BPM: 85,  키: "Eb Major", 날짜: "2026.02.12" },
    { id: 7, 이름: "loop_07.flac",      장르: "Hip-hop",      BPM: 93,  키: "C minor",  날짜: "2026.02.10" },
  ],
};

export default function 원석프로필() {
  const { 닉네임, 가입일, 조각수, 페르소나, 조각목록 } = MOCK_원석;

  return (
    <main className="bg-black text-white">

      {/* ═══ 섹션 1 — 원석 공간 히어로 (Igloo + SleepWellCreative) ═══ */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Three.js 3D 씬 — 전체 화면 */}
        <div className="absolute inset-0">
          <StoneScene />
        </div>

        {/* 상단 좌측 브랜드 */}
        <header className="absolute top-0 left-0 z-10 p-6 md:p-8">
          <Link href="/">
            <span className="text-zinc-600 text-xs tracking-[0.3em] uppercase font-light hover:text-zinc-400 transition-colors">
              SORI
            </span>
          </Link>
        </header>

        {/* 원석 이름 오버레이 — SleepWellCreative 타이포그래피 */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-zinc-500 text-xs tracking-[0.4em] uppercase mb-4">
            원석 프로필
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-light tracking-[0.25em] uppercase"
            style={{ color: "#2d3748", textShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
          >
            {닉네임}
          </h1>
          <p className="mt-4 text-sm tracking-[0.2em]" style={{ color: "#4a5568" }}>
            {가입일} 합류 &nbsp;·&nbsp; 조각 {조각수}개
          </p>
        </div>

        {/* 스크롤 힌트 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
          <p className="text-xs tracking-[0.2em] text-zinc-500 uppercase">Scroll</p>
          <ChevronDown className="size-4 text-zinc-500" />
        </div>
      </section>

      {/* ═══ 섹션 2 — 원석 페르소나 (Vibrant 인터랙션 + SleepWellCreative 무드) ═══ */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-black">
        <div className="max-w-2xl mx-auto text-center space-y-12">
          <div className="space-y-3">
            <p className="text-zinc-600 text-xs tracking-[0.4em] uppercase">
              원석의 정체성
            </p>
            <h2 className="text-2xl font-light text-white tracking-tight">
              공명이 발견한 당신의 소리
            </h2>
          </div>

          {/* 페르소나 태그 — hover 시 발광 (Vibrant 인터랙션 참고) */}
          <div className="flex flex-wrap justify-center gap-3">
            {페르소나.map((키워드, i) => (
              <span
                key={키워드}
                className="group px-5 py-2.5 border border-zinc-800 text-zinc-400 text-sm rounded-full
                  cursor-default transition-all duration-500
                  hover:border-white/40 hover:text-white
                  hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {키워드}
              </span>
            ))}
          </div>

          <p className="text-zinc-700 text-xs tracking-wider">
            {조각수}개의 조각이 만들어낸 정체성
          </p>
        </div>
      </section>

      {/* ═══ 섹션 3 — 조각 아카이브 ═══ */}
      <section className="min-h-screen px-6 py-24 bg-zinc-950">
        <div className="max-w-2xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <p className="text-zinc-600 text-xs tracking-[0.4em] uppercase">
              조각 아카이브
            </p>
            <h2 className="text-2xl font-light text-white tracking-tight">
              공명에게 들려준 조각들
            </h2>
          </div>

          {/* 조각 목록 */}
          <div className="space-y-3">
            {조각목록.map((조각, i) => (
              <div
                key={조각.id}
                className="group flex items-center justify-between p-4 rounded-xl
                  border border-zinc-900 bg-black/40
                  hover:border-zinc-700 hover:bg-zinc-900/60
                  transition-all duration-300 animate-fadeInUp cursor-pointer"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* 순서 + 파일명 */}
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-zinc-700 text-xs font-mono w-5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-zinc-300 text-sm truncate group-hover:text-white transition-colors">
                      {조각.이름}
                    </p>
                    <p className="text-zinc-600 text-xs mt-0.5">{조각.날짜}</p>
                  </div>
                </div>

                {/* 분석 태그 */}
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <span className="text-zinc-600 text-xs">{조각.장르}</span>
                  <span className="text-zinc-800 text-xs">·</span>
                  <span className="text-zinc-600 text-xs">{조각.BPM} BPM</span>
                  <span className="text-zinc-800 text-xs">·</span>
                  <span className="text-zinc-600 text-xs">{조각.키}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 새 조각 업로드 */}
          <div className="pt-4 text-center">
            <Link
              href="/upload"
              className="inline-block px-8 py-3 rounded-full text-sm tracking-wider
                border border-zinc-800 text-zinc-500
                hover:border-zinc-600 hover:text-zinc-300
                transition-all duration-300"
            >
              새 조각 업로드하기
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
