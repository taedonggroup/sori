"use client";

// 공명 분석 결과 페이지 — 공명이 조각을 분석한 결과를 보여주는 공간
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { 조각분석결과 } from "@/lib/공명/analyze";

// 분석 Mock 데이터 (STEP 7에서 실제 API 연동)
const mock결과: 조각분석결과 = {
  장르: "Electronic",
  악기: ["신디사이저", "드럼머신", "베이스", "보이스 샘플"],
  BPM: 128,
  키: "F minor",
  원석_페르소나: ["몽환적", "실험적", "도시적"],
};

function 분석내용() {
  const searchParams = useSearchParams();
  const 조각이름 = searchParams.get("name") ?? "알 수 없는 조각";
  const 결과파라미터 = searchParams.get("result");

  const [분석중, 분석중설정] = useState(!결과파라미터);
  const [진행도, 진행도설정] = useState(결과파라미터 ? 100 : 0);
  const [결과, 결과설정] = useState<조각분석결과 | null>(
    결과파라미터 ? JSON.parse(결과파라미터) : null
  );
  const [분석메시지, 분석메시지설정] = useState("공명이 듣고 있습니다...");

  useEffect(() => {
    // 이미 결과가 있으면 로딩 건너뜀
    if (결과파라미터) return;

    const 메시지목록 = [
      "공명이 듣고 있습니다...",
      "리듬을 감지하는 중...",
      "악기를 인식하는 중...",
      "당신의 정체성을 발견하는 중...",
    ];

    let 현재메시지인덱스 = 0;
    const 메시지인터벌 = setInterval(() => {
      현재메시지인덱스 = (현재메시지인덱스 + 1) % 메시지목록.length;
      분석메시지설정(메시지목록[현재메시지인덱스]);
    }, 1200);

    const 진행인터벌 = setInterval(() => {
      진행도설정((이전) => {
        if (이전 >= 95) return 이전;
        return 이전 + Math.random() * 8;
      });
    }, 400);

    // 결과 없이 직접 접근한 경우 Mock으로 폴백
    const 타임아웃 = setTimeout(() => {
      clearInterval(메시지인터벌);
      clearInterval(진행인터벌);
      진행도설정(100);
      setTimeout(() => {
        분석중설정(false);
        결과설정(mock결과);
      }, 400);
    }, 3000);

    return () => {
      clearInterval(메시지인터벌);
      clearInterval(진행인터벌);
      clearTimeout(타임아웃);
    };
  }, [결과파라미터]);

  return (
    <div className="relative z-10 w-full max-w-lg space-y-8">
      {분석중 ? (
        <div className="text-center space-y-8">
          <div className="space-y-2">
            <p className="text-zinc-500 text-sm tracking-widest uppercase">공명 분석 중</p>
            <p className="text-zinc-400 text-sm truncate">{조각이름}</p>
          </div>

          <div className="flex items-center justify-center gap-1 h-16">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-white rounded-full animate-pulse"
                style={{
                  height: `${20 + Math.random() * 40}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${0.8 + Math.random() * 0.4}s`,
                }}
              />
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-zinc-300 text-lg font-light">{분석메시지}</p>
            <Progress value={진행도} className="h-1 bg-zinc-900" />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-zinc-500 text-sm tracking-widest uppercase">공명 완료</p>
            <h1 className="text-2xl font-semibold text-white">당신의 조각이 말합니다</h1>
          </div>

          <Card className="bg-zinc-950 border-zinc-800 rounded-2xl">
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-zinc-500 text-xs mb-1">장르</p>
                  <p className="text-white font-medium">{결과?.장르}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs mb-1">BPM</p>
                  <p className="text-white font-medium">{결과?.BPM}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs mb-1">키</p>
                  <p className="text-white font-medium">{결과?.키}</p>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <p className="text-zinc-500 text-xs mb-2">감지된 악기</p>
                <div className="flex flex-wrap gap-2">
                  {결과?.악기.map((악기) => (
                    <Badge key={악기} variant="outline" className="border-zinc-700 text-zinc-300 text-xs">
                      {악기}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <p className="text-zinc-500 text-xs text-center tracking-widest uppercase">원석 페르소나</p>
            <div className="grid grid-cols-3 gap-3">
              {결과?.원석_페르소나.map((키워드, 인덱스) => (
                <Card key={인덱스} className="bg-zinc-950 border-zinc-800 rounded-xl">
                  <CardContent className="p-4 text-center">
                    <p className="text-white font-medium">{키워드}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Button
            size="lg"
            className="w-full py-6 text-base rounded-full bg-white text-black hover:bg-zinc-100 transition-all duration-300"
          >
            (첫)울림을 만들어보세요
          </Button>

          <Link href="/upload" className="block text-center text-zinc-600 text-sm hover:text-zinc-400 transition-colors">
            다른 조각 분석하기
          </Link>
        </div>
      )}
    </div>
  );
}

export default function 공명분석결과() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 pointer-events-none" />
      <Suspense fallback={<p className="text-zinc-500">불러오는 중...</p>}>
        <분석내용 />
      </Suspense>
    </main>
  );
}
