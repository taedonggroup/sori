"use client";

// 조각 업로드 페이지 — 원석이 음악 파일을 올리는 공간
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function 조각업로드() {
  const router = useRouter();
  const 파일입력참조 = useRef<HTMLInputElement>(null);
  const [선택된조각, 선택된조각설정] = useState<File | null>(null);
  const [드래그중, 드래그중설정] = useState(false);
  const [업로드중, 업로드중설정] = useState(false);

  // 파일 크기를 읽기 좋은 형식으로 변환
  const 파일크기표시 = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const 조각선택처리 = useCallback((파일: File) => {
    const 지원형식 = /\.(mp3|wav|flac|m4a)$/i;
    if (!지원형식.test(파일.name)) {
      alert("mp3, wav, flac, m4a 파일만 업로드할 수 있습니다.");
      return;
    }
    if (파일.size > 25 * 1024 * 1024) {
      alert("파일 크기는 25MB 이하여야 합니다.");
      return;
    }
    선택된조각설정(파일);
  }, []);

  const 드래그오버처리 = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    드래그중설정(true);
  }, []);

  const 드래그나감처리 = useCallback(() => {
    드래그중설정(false);
  }, []);

  const 드롭처리 = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    드래그중설정(false);
    const 파일 = e.dataTransfer.files[0];
    if (파일) 조각선택처리(파일);
  }, [조각선택처리]);

  const 파일변경처리 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const 파일 = e.target.files?.[0];
    if (파일) 조각선택처리(파일);
  };

  const 공명에게들려주기 = async () => {
    if (!선택된조각) return;
    업로드중설정(true);

    // 파일명을 URL 파라미터로 전달하여 분석 페이지로 이동
    const params = new URLSearchParams({ name: 선택된조각.name });
    router.push(`/analysis?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg space-y-8">
        {/* 헤더 */}
        <div className="text-center space-y-2">
          <p className="text-zinc-500 text-sm tracking-widest uppercase">조각 업로드</p>
          <h1 className="text-3xl font-semibold text-white">당신의 조각을 공명에게</h1>
          <p className="text-zinc-500 text-sm">공명이 당신의 음악을 듣고 분석합니다</p>
        </div>

        {/* 드래그앤드롭 영역 */}
        <Card
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 bg-transparent
            ${드래그중 ? "border-white bg-zinc-900" : "border-zinc-800 hover:border-zinc-600"}
            ${선택된조각 ? "border-zinc-600 bg-zinc-950" : ""}`}
          onDragOver={드래그오버처리}
          onDragLeave={드래그나감처리}
          onDrop={드롭처리}
          onClick={() => 파일입력참조.current?.click()}
        >
          <input
            ref={파일입력참조}
            type="file"
            accept=".mp3,.wav,.flac,.m4a"
            className="hidden"
            onChange={파일변경처리}
          />

          {선택된조각 ? (
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto">
                <span className="text-2xl">🎵</span>
              </div>
              <div>
                <p className="text-white font-medium truncate">{선택된조각.name}</p>
                <p className="text-zinc-500 text-sm mt-1">{파일크기표시(선택된조각.size)}</p>
              </div>
              <p className="text-zinc-600 text-xs">다른 파일을 선택하려면 클릭하세요</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center mx-auto">
                <span className="text-3xl">♪</span>
              </div>
              <div>
                <p className="text-zinc-300 font-medium">조각을 이곳에 끌어다 놓으세요</p>
                <p className="text-zinc-600 text-sm mt-1">또는 클릭하여 파일 선택</p>
              </div>
              <p className="text-zinc-700 text-xs">mp3 · wav · flac · m4a · 최대 25MB</p>
            </div>
          )}
        </Card>

        {/* 제출 버튼 */}
        <Button
          size="lg"
          className="w-full py-6 text-base rounded-full bg-white text-black hover:bg-zinc-100 transition-all duration-300 disabled:opacity-30"
          disabled={!선택된조각 || 업로드중}
          onClick={공명에게들려주기}
        >
          {업로드중 ? "공명에게 전달 중..." : "공명에게 들려주기"}
        </Button>
      </div>
    </main>
  );
}
