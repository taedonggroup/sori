"use client";

// 공간 (메인 랜딩페이지) - 초기 컨셉 복원 + 모바일 최적화
import { useState, useEffect } from "react";
import Link from "next/link";
import JoakakCard from "@/components/gonmyung/JoakakCard";
import type { Joakak, JoakakListResponse } from "@/lib/gonmyung/types";

export default function 공간() {
  const [recentJoakak, setRecentJoakak] = useState<Joakak[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecent() {
      try {
        const response = await fetch("/api/gonmyung/joakak?limit=3&page=1");
        if (!response.ok) throw new Error("목록 로드 실패");
        const data = (await response.json()) as JoakakListResponse;
        setRecentJoakak(data.joakak);
      } catch {
        // 네트워크 오류 시 빈 목록 유지
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecent();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* 섹션1: 풀스크린 히어로 */}
      <section className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden">
        {/* 배경 장식: 가로 라인들 (파형 느낌) */}
        <div className="absolute inset-0 flex flex-col justify-center gap-px opacity-[0.03] pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="w-full h-px bg-white" style={{ opacity: Math.sin(i * 0.4) * 0.5 + 0.5 }} />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 space-y-10">
          {/* 브랜드 */}
          <div className="space-y-1">
            <p className="text-zinc-600 text-[10px] tracking-[0.5em] uppercase">POWERED BY 공명</p>
            <p className="text-white text-xl font-thin tracking-[0.5em]">SORI</p>
          </div>

          {/* 메인 슬로건 */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-thin tracking-widest text-white leading-tight">
              고독한 원석들이 부딪혀
            </h1>
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-thin tracking-widest text-zinc-500 leading-tight">
              별이 되는 첫 번째 울림
            </h1>
          </div>

          {/* 서브텍스트 */}
          <p className="text-zinc-600 text-sm tracking-[0.2em]">
            당신의 조각을 공명에게 들려주세요
          </p>

          {/* CTA 버튼 - 모바일 세로 정렬 */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:justify-center">
            <Link
              href="/upload"
              className="w-full sm:w-auto text-center border border-white/40 text-white text-sm tracking-[0.2em] px-8 py-4 hover:border-white hover:bg-white/5 transition-all duration-300"
            >
              조각 올리기
            </Link>
            <Link
              href="/gallery"
              className="w-full sm:w-auto text-center text-zinc-500 text-sm tracking-[0.2em] px-8 py-4 hover:text-zinc-300 transition-colors"
            >
              갤러리 보기
            </Link>
          </div>

          {/* 스크롤 힌트 */}
          <div className="absolute bottom-8 text-zinc-700 text-[10px] flex flex-col items-center gap-1 tracking-widest">
            <span>SCROLL</span>
            <span className="animate-bounce">↓</span>
          </div>
        </div>
      </section>

      {/* 섹션2: 어떻게 작동하나요 */}
      <section className="bg-black text-white py-24 sm:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          {/* 섹션 레이블 */}
          <div className="flex items-center gap-4 mb-16 justify-center">
            <div className="flex-1 max-w-16 h-px bg-zinc-900" />
            <p className="text-zinc-600 text-[10px] tracking-[0.5em] uppercase">어떻게 작동하나요</p>
            <div className="flex-1 max-w-16 h-px bg-zinc-900" />
          </div>

          {/* 번호형 단계 카드 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-zinc-900">
            {[
              { no: "01", title: "조각을 올려요", desc: "음악 파일을 업로드합니다\nmp3 · wav · flac · m4a" },
              { no: "02", title: "공명이 들어요", desc: "AI가 장르 · BPM · 키 · 악기\n음악적 정체성을 분석합니다" },
              { no: "03", title: "함께 울립니다", desc: "다른 원석의 조각과\n공명으로 믹스됩니다" },
            ].map((item) => (
              <div key={item.no} className="bg-black p-8 sm:p-10 space-y-4">
                <p className="text-zinc-700 text-xs font-mono tracking-widest">{item.no}</p>
                <p className="text-white text-lg font-light tracking-wide">{item.title}</p>
                <p className="text-zinc-600 text-sm leading-relaxed whitespace-pre-line">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 섹션3: 최근 조각 */}
      <section className="bg-black text-white border-t border-zinc-900 py-20 px-6 pb-28 sm:pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <p className="text-zinc-600 text-[10px] tracking-[0.5em] uppercase">지금 공명 중인 조각들</p>
            <Link href="/gallery" className="text-zinc-600 text-[10px] tracking-widest hover:text-zinc-400 transition-colors uppercase">
              전체 보기 →
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-black border border-zinc-900 p-4 h-32 animate-pulse"
                />
              ))}
            </div>
          ) : recentJoakak.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <p className="text-zinc-600 text-sm tracking-wide">아직 조각이 없습니다</p>
              <Link
                href="/upload"
                className="inline-block text-zinc-500 text-[10px] tracking-widest hover:text-zinc-300 transition-colors uppercase"
              >
                첫 번째 조각 올리기 →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentJoakak.map((joakak) => (
                <JoakakCard
                  key={joakak.id}
                  joakak={joakak}
                  isExpanded={expandedId === joakak.id}
                  onToggleExpand={() => setExpandedId((prev) => (prev === joakak.id ? null : joakak.id))}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
