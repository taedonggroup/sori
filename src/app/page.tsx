"use client";

// 공간 (메인 랜딩페이지) — 3D 제거, 비즈니스 랜딩으로 전환
import Link from "next/link";
import JoakakFeed from "@/components/gonmyung/JoakakFeed";

export default function 공간() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Hero 섹션 */}
      <section className="flex flex-col items-center justify-center px-6 pt-32 pb-20">
        <p className="text-teal-400 text-xs tracking-[0.5em] uppercase mb-4">
          POWERED BY 공명
        </p>
        <h1 className="text-4xl sm:text-5xl font-light text-center tracking-tight leading-tight mb-6">
          당신의 조각이 울리는
          <br />
          첫 번째 공명
        </h1>
        <p className="text-zinc-400 text-center max-w-md mb-10">
          음악 파일을 올리면 AI 공명이 당신의 음악적 정체성을 분석합니다
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/upload"
            className="bg-teal-600 hover:bg-teal-500 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors"
          >
            조각 올리기 →
          </Link>
          <Link
            href="/gallery"
            className="border border-zinc-700 hover:border-zinc-500 rounded-lg px-6 py-2.5 text-sm text-zinc-300 transition-colors text-center"
          >
            갤러리 둘러보기
          </Link>
        </div>
      </section>

      {/* 서비스 소개 3단 카드 */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-3">
            <div className="text-2xl">🎵</div>
            <h3 className="text-white font-medium">조각 분석</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              업로드하면 공명 AI가 장르, BPM, 키, 악기를 분석합니다
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-3">
            <div className="text-2xl">💎</div>
            <h3 className="text-white font-medium">원석 페르소나</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              당신만의 음악적 정체성을 3가지 키워드로 정의합니다
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-3">
            <div className="text-2xl">🔮</div>
            <h3 className="text-white font-medium">(첫)울림</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              여러 조각을 믹스해 새로운 음원이 탄생합니다
            </p>
          </div>
        </div>
      </section>

      {/* 최근 조각 섹션 */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-white">최근 조각</h2>
          <Link
            href="/gallery"
            className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors"
          >
            전체 보기 →
          </Link>
        </div>
        <JoakakFeed />
      </section>
    </main>
  );
}
