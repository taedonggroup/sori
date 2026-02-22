"use client";

// 공명 분석 결과 페이지 - bg-black, monospace 데이터, teal 액센트
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { 조각분석결과 } from "@/lib/gonmyung/types";

const mock결과: 조각분석결과 = {
  장르: "Electronic",
  악기: ["신디사이저", "드럼머신", "베이스", "보이스 샘플"],
  BPM: 128,
  키: "F minor",
  원석_페르소나: ["몽환적", "실험적", "도시적"],
};

// JSON 문자열을 안전하게 파싱
function safeParseResult(raw: string | null): 조각분석결과 | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as 조각분석결과;
  } catch {
    return null;
  }
}

function 분석내용() {
  const searchParams = useSearchParams();
  const 조각이름 = searchParams.get("name") ?? "알 수 없는 조각";
  const 결과파라미터 = searchParams.get("result");

  const [분석중, 분석중설정] = useState(!결과파라미터);
  const [진행도, 진행도설정] = useState(결과파라미터 ? 100 : 0);
  const [결과, 결과설정] = useState<조각분석결과 | null>(
    safeParseResult(결과파라미터)
  );
  const [분석메시지, 분석메시지설정] = useState("공명이 듣고 있습니다...");

  useEffect(() => {
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

    // 진행도 90%까지 점진 증가
    const 진행인터벌 = setInterval(() => {
      진행도설정((이전) => {
        if (이전 >= 90) return 이전;
        return 이전 + Math.random() * 6;
      });
    }, 400);

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

  // 로딩 화면
  if (분석중) {
    return (
      <div className="w-full max-w-lg flex flex-col items-center space-y-12">
        <div className="text-center space-y-2">
          <p className="text-zinc-600 text-[10px] tracking-[0.5em] uppercase">
            공명 분석 중
          </p>
          <p className="text-zinc-500 text-sm truncate tracking-wide">{조각이름}</p>
        </div>

        {/* 동심원 ripple */}
        <div className="relative flex items-center justify-center">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="absolute w-20 h-20 rounded-full border border-teal-900/50 animate-ripple"
              style={{ animationDelay: `${index * 0.7}s` }}
            />
          ))}
          <div
            className="w-20 h-20 rounded-full animate-pulse"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)",
            }}
          />
        </div>

        {/* 분석 메시지 + 진행바 */}
        <div className="space-y-4 w-full text-center">
          <p className="text-zinc-400 text-lg font-thin tracking-wide animate-pulse">
            {분석메시지}
          </p>
          <div className="w-full h-px bg-zinc-900 overflow-hidden">
            <div
              className="h-full bg-teal-500/40 transition-all duration-500 ease-out"
              style={{ width: `${진행도}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면
  return (
    <div className="w-full max-w-lg space-y-8 animate-fadeInUp pb-28 sm:pb-8">
      {/* 헤더 */}
      <div className="text-center space-y-2">
        <p className="text-zinc-600 text-[10px] tracking-[0.5em] uppercase">
          공명 완료
        </p>
        <h1 className="text-2xl font-thin text-white tracking-widest">
          당신의 조각이 말합니다
        </h1>
      </div>

      {/* 분석 카드 */}
      <div className="bg-black border border-zinc-900 p-6 space-y-5">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-zinc-600 text-[10px] tracking-widest uppercase mb-2">장르</p>
            <p className="text-teal-400 font-mono text-sm">{결과?.장르}</p>
          </div>
          <div>
            <p className="text-zinc-600 text-[10px] tracking-widest uppercase mb-2">BPM</p>
            <p className="text-white font-mono text-xl">{결과?.BPM}</p>
          </div>
          <div>
            <p className="text-zinc-600 text-[10px] tracking-widest uppercase mb-2">키</p>
            <p className="text-white font-mono text-xl">{결과?.키}</p>
          </div>
        </div>

        <div className="w-full h-px bg-zinc-900" />

        <div>
          <p className="text-zinc-600 text-[10px] tracking-widest uppercase mb-3">감지된 악기</p>
          <div className="flex flex-wrap gap-2">
            {결과?.악기.map((악기) => (
              <span
                key={악기}
                className="border border-zinc-800 text-zinc-400 text-xs px-3 py-1"
              >
                {악기}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 원석 페르소나 */}
      <div className="space-y-3">
        <p className="text-zinc-600 text-[10px] text-center tracking-[0.5em] uppercase">
          원석 페르소나
        </p>
        <div className="grid grid-cols-3 gap-px bg-zinc-900">
          {결과?.원석_페르소나.map((키워드, 인덱스) => (
            <div
              key={인덱스}
              className="bg-black border border-zinc-800 p-4 text-center"
            >
              <p className="text-zinc-300 font-medium text-sm">{키워드}</p>
            </div>
          ))}
        </div>
      </div>

      {/* (첫)울림 버튼 */}
      <Link
        href={`/create?genre=${결과?.장르?.toLowerCase() ?? ""}`}
        className="block w-full py-4 text-sm tracking-[0.2em] text-center
          border border-teal-600/60 text-teal-400
          transition-all duration-300
          hover:border-teal-400"
      >
        (첫)울림을 만들어보세요
      </Link>

      {/* 다른 조각 분석 링크 */}
      <Link
        href="/upload"
        className="block text-center text-zinc-600 text-[10px] tracking-widest hover:text-zinc-400 transition-colors uppercase"
      >
        다른 조각 분석하기
      </Link>
    </div>
  );
}

export default function 공명분석결과() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <Suspense
        fallback={
          <p className="text-zinc-600 text-sm tracking-wide">불러오는 중...</p>
        }
      >
        <분석내용 />
      </Suspense>
    </main>
  );
}
