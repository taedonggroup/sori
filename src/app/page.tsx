"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ParticleBackground from "@/components/ParticleBackground";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import JoakakCard from "@/components/gonmyung/JoakakCard";
import type { Joakak, JoakakListResponse } from "@/lib/gonmyung/types";

export default function 공간() {
  const [recentJoakak, setRecentJoakak] = useState<Joakak[]>([]);

  // 최신 조각 3개 로드
  useEffect(() => {
    fetch("/api/gonmyung/joakak?limit=3&page=1")
      .then((res) => res.json())
      .then((data: JoakakListResponse) => {
        setRecentJoakak(data.joakak ?? []);
      })
      .catch(() => {
        // 조각 없음 상태 유지
      });
  }, []);

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
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="sori-outline" size="sori-lg" className="max-w-xs" asChild>
              <Link href="/upload">조각 올리기</Link>
            </Button>
            <Button variant="sori-ghost" size="sori-lg" className="max-w-xs" asChild>
              <Link href="/gallery">갤러리 보기</Link>
            </Button>
          </div>

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
          <p className="text-center text-zinc-600 text-xs tracking-[0.4em] uppercase mb-16">
            어떻게 작동하나요
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { no: "01", title: "조각을 올려요", desc: "당신의 음악 파일을 업로드합니다" },
              { no: "02", title: "공명이 들어요", desc: "AI가 음악적 정체성을 분석합니다" },
              { no: "03", title: "함께 울립니다", desc: "다른 원석의 조각과 공명으로 믹스됩니다" },
            ].map((item) => (
              <Card key={item.no} className="bg-transparent border-zinc-800 rounded-2xl py-0">
                <CardContent className="p-8 text-center space-y-3">
                  <p className="text-zinc-600 text-sm">{item.no}</p>
                  <p className="text-white font-medium text-lg">{item.title}</p>
                  <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 섹션 3: 최신 조각 미리보기 */}
      <section className="bg-black text-white py-20 px-6 border-t border-zinc-900">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <p className="text-zinc-600 text-xs tracking-[0.4em] uppercase">
              지금 공명 중인 조각들
            </p>
            <Link
              href="/gallery"
              className="text-zinc-500 text-xs tracking-wider hover:text-zinc-300 transition-colors"
            >
              모든 조각 보기 →
            </Link>
          </div>

          {recentJoakak.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentJoakak.map((joakak) => (
                <JoakakCard key={joakak.id} joakak={joakak} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-zinc-700 text-sm">아직 조각이 없습니다</p>
              <p className="text-zinc-800 text-xs mt-2">첫 번째 조각을 올려보세요</p>
            </div>
          )}

          <div className="mt-10 text-center">
            <Button variant="sori-outline" size="sori-lg" className="max-w-xs" asChild>
              <Link href="/gallery">갤러리에서 조각 탐색하기</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
