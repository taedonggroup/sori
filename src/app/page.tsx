"use client";

import Link from "next/link";
import ParticleBackground from "@/components/ParticleBackground";

export default function 공간() {
  return (
    <>
      {/* 섹션 1: 풀스크린 히어로 */}
      <main className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden">
        <ParticleBackground />
        <div className="relative z-10 flex flex-col items-center text-center px-6 space-y-10">
          {/* 상단 브랜드 */}
          <div className="space-y-1">
            <p className="text-zinc-600 text-xs tracking-[0.5em] uppercase">POWERED BY 공명</p>
            <p className="text-white text-2xl font-thin tracking-[0.4em]">SORI</p>
          </div>

          {/* 메인 슬로건 */}
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-thin tracking-widest text-white leading-tight">
              고독한 원석들이 부딪혀
            </h1>
            <h1 className="text-5xl md:text-7xl font-thin tracking-widest text-zinc-300 leading-tight">
              별이 되는 첫 번째 울림
            </h1>
          </div>

          {/* 서브텍스트 */}
          <p className="text-zinc-500 text-base tracking-wider">
            당신의 조각을 공명에게 들려주세요
          </p>

          {/* CTA */}
          <Link href="/upload">
            <button className="border border-white/40 text-white rounded-full px-12 py-4 text-sm tracking-widest transition-all duration-300 hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95">
              조각 올리기
            </button>
          </Link>

          {/* 스크롤 힌트 */}
          <div className="absolute bottom-8 animate-bounce text-zinc-600 text-xs flex flex-col items-center gap-1">
            <span>scroll</span>
            <span>↓</span>
          </div>
        </div>
      </main>

      {/* 섹션 2: 공명 소개 */}
      <section className="bg-black text-white py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-zinc-600 text-xs tracking-[0.4em] uppercase mb-16">어떻게 작동하나요</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { no: "01", title: "조각을 올려요", desc: "당신의 음악 파일을 업로드합니다" },
              { no: "02", title: "공명이 들어요", desc: "AI가 음악적 정체성을 분석합니다" },
              { no: "03", title: "(첫)울림이 됩니다", desc: "당신만의 음악적 정체성을 발견합니다" },
            ].map((item) => (
              <div key={item.no} className="border border-zinc-800 rounded-2xl p-8 text-center space-y-3">
                <p className="text-zinc-600 text-sm">{item.no}</p>
                <p className="text-white font-medium text-lg">{item.title}</p>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
