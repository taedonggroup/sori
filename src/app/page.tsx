"use client";

// 공간 (메인 랜딩페이지) — 상업용 서비스 디자인 개선
import { useState, useEffect } from "react";
import Link from "next/link";
import JoakakCard from "@/components/gonmyung/JoakakCard";
import type { Joakak, JoakakListResponse } from "@/lib/gonmyung/types";

export default function 공간() {
  const [recentJoakak, setRecentJoakak] = useState<Joakak[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    // 히어로 순차 등장 트리거
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
        {/* 배경 장식: 수평 라인 (파형 느낌) */}
        <div className="absolute inset-0 flex flex-col justify-center gap-px opacity-[0.025] pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="w-full h-px bg-white" style={{ opacity: Math.sin(i * 0.4) * 0.5 + 0.5 }} />
          ))}
        </div>

        {/* 배경 원형 그라디언트 (발광 효과) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #F8F32B 0%, transparent 70%)" }}
          />
          <div
            className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full opacity-[0.03]"
            style={{ background: "radial-gradient(circle, #00cccc 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 space-y-10 pt-16">
          {/* 브랜드 */}
          <div
            className="space-y-2"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
              transitionDelay: "0.1s",
            }}
          >
            <p className="text-zinc-600 text-[10px] tracking-[0.5em] uppercase">POWERED BY 공명</p>
            <p className="text-white text-xl font-thin tracking-[0.5em] animate-glow-brand">SORI</p>
          </div>

          {/* 메인 슬로건 — 순차 등장 */}
          <div className="space-y-3">
            <h1
              className="text-3xl sm:text-5xl lg:text-7xl font-thin tracking-widest text-white leading-tight"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(24px)",
                filter: heroVisible ? "blur(0)" : "blur(4px)",
                transition: "opacity 0.9s ease, transform 0.9s ease, filter 0.9s ease",
                transitionDelay: "0.3s",
              }}
            >
              고독한 원석들이 부딪혀
            </h1>
            <h1
              className="text-3xl sm:text-5xl lg:text-7xl font-thin tracking-widest text-zinc-400 leading-tight"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(24px)",
                filter: heroVisible ? "blur(0)" : "blur(4px)",
                transition: "opacity 0.9s ease, transform 0.9s ease, filter 0.9s ease",
                transitionDelay: "0.55s",
              }}
            >
              별이 되는 첫 번째 울림
            </h1>
          </div>

          {/* 서브텍스트 */}
          <p
            className="text-zinc-600 text-sm tracking-[0.2em]"
            style={{
              opacity: heroVisible ? 1 : 0,
              transition: "opacity 0.8s ease",
              transitionDelay: "0.8s",
            }}
          >
            당신의 조각을 공명에게 들려주세요
          </p>

          {/* CTA 버튼 */}
          <div
            className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:justify-center"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
              transitionDelay: "1s",
            }}
          >
            <Link
              href="/upload"
              className="w-full sm:w-auto text-center btn-sori-primary text-sm tracking-[0.2em] px-8 py-4 font-light"
            >
              조각 올리기
            </Link>
            <Link
              href="/gallery"
              className="w-full sm:w-auto text-center text-zinc-500 text-sm tracking-[0.2em] px-8 py-4 hover:text-zinc-300 transition-colors"
            >
              갤러리 보기 →
            </Link>
          </div>

          {/* 스크롤 힌트 */}
          <div
            className="absolute bottom-8 text-zinc-700 text-[10px] flex flex-col items-center gap-2 tracking-widest"
            style={{
              opacity: heroVisible ? 1 : 0,
              transition: "opacity 1s ease",
              transitionDelay: "1.4s",
            }}
          >
            <span>SCROLL</span>
            <span className="animate-bounce text-zinc-800">↓</span>
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
              {
                no: "01",
                title: "조각을 올려요",
                desc: "음악 파일을 업로드합니다\nmp3 · wav · flac · m4a",
                color: "#00cccc",
              },
              {
                no: "02",
                title: "공명이 들어요",
                desc: "AI가 장르 · BPM · 키 · 악기\n음악적 정체성을 분석합니다",
                color: "#F8F32B",
              },
              {
                no: "03",
                title: "함께 울립니다",
                desc: "다른 원석의 조각과\n공명으로 믹스됩니다",
                color: "#a855f7",
              },
            ].map((item) => (
              <div
                key={item.no}
                className="group bg-black p-8 sm:p-10 space-y-4 relative overflow-hidden hover:bg-zinc-950 transition-colors duration-300 cursor-default"
              >
                {/* 호버 시 상단 컬러 라인 */}
                <div
                  className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }}
                />
                <p className="text-zinc-800 text-xs font-mono tracking-widest group-hover:text-zinc-600 transition-colors">{item.no}</p>
                <p className="text-white text-lg font-light tracking-wide" style={{ color: "white" }}>{item.title}</p>
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
            <div className="flex items-center gap-3">
              {/* teal 포인트 라인 */}
              <div className="w-0.5 h-4 bg-[#00cccc]" style={{ boxShadow: "0 0 6px rgba(0, 204, 204, 0.6)" }} />
              <p className="text-zinc-400 text-[10px] tracking-[0.5em] uppercase">지금 공명 중인 조각들</p>
            </div>
            <Link href="/gallery" className="text-zinc-600 text-[10px] tracking-widest hover:text-[#F8F32B] transition-colors uppercase">
              전체 보기 →
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-zinc-950 border border-zinc-900 p-4 h-32 animate-pulse" />
              ))}
            </div>
          ) : recentJoakak.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              {/* 이퀄라이저 아이콘 */}
              <div className="flex items-end justify-center gap-1 h-8 opacity-20">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-1 bg-zinc-600 rounded-sm" style={{ height: `${8 + Math.sin(i) * 10}px` }} />
                ))}
              </div>
              <p className="text-zinc-600 text-sm tracking-wide">아직 조각이 없습니다</p>
              <Link
                href="/upload"
                className="inline-block text-[#F8F32B] text-[10px] tracking-widest hover:underline transition-all uppercase"
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

      {/* 섹션4: 브랜드 푸터 */}
      <footer className="bg-black border-t border-zinc-900 py-12 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-white text-xs tracking-[0.6em] font-light animate-glow-brand">SORI</p>
            <p className="text-zinc-700 text-[10px] tracking-[0.3em]">POWERED BY 공명 — TEDONG</p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/gallery" className="text-zinc-700 text-[10px] tracking-widest hover:text-zinc-500 transition-colors uppercase">갤러리</Link>
            <Link href="/upload" className="text-zinc-700 text-[10px] tracking-widest hover:text-zinc-500 transition-colors uppercase">조각 올리기</Link>
          </div>
          <p className="text-zinc-800 text-[9px] tracking-wider">© 2026 TEDONG</p>
        </div>
      </footer>
    </main>
  );
}
