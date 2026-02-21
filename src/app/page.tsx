// 공간 — 원석을 맞이하는 메인 페이지
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function 공간() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      {/* 배경 그라디언트 */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-10">
        {/* 브랜드 */}
        <div className="space-y-3">
          <p className="text-zinc-500 text-sm tracking-[0.3em] uppercase">공명</p>
          <h1 className="text-6xl font-bold tracking-tight text-white">
            SORI
          </h1>
          <p className="text-zinc-400 text-lg">
            당신의 음악을 듣습니다
          </p>
        </div>

        {/* 구분선 */}
        <div className="w-px h-16 bg-zinc-800 mx-auto" />

        {/* 히어로 문구 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-light text-zinc-100 leading-relaxed">
            모든 원석에게는<br />
            <span className="text-white font-medium">자신만의 소리</span>가 있습니다
          </h2>
          <p className="text-zinc-500 text-base leading-relaxed">
            공명은 당신의 조각을 듣고<br />
            숨겨진 음악적 정체성을 발견합니다
          </p>
        </div>

        {/* CTA */}
        <div className="pt-4">
          <Link href="/upload">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-zinc-100 px-10 py-6 text-base font-medium rounded-full transition-all duration-300 hover:scale-105"
            >
              당신의 조각을 들려주세요
            </Button>
          </Link>
        </div>

        {/* 하단 안내 */}
        <p className="text-zinc-700 text-sm">
          mp3 · wav · flac · m4a 지원 · 최대 25MB
        </p>
      </div>
    </main>
  );
}
