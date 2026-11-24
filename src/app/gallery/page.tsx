"use client";

// 조각 갤러리 — 장르 필터 탭 + 커스텀 오디오 플레이어 + 성공 축하 화면
import { useState } from "react";
import Link from "next/link";
import JoakakFeed from "@/components/gonmyung/JoakakFeed";
import MixSelector from "@/components/gonmyung/MixSelector";
import ResonanceLoader from "@/components/gonmyung/ResonanceLoader";
import CustomAudioPlayer from "@/components/gonmyung/CustomAudioPlayer";
import { useMixing } from "@/hooks/useMixing";

// 장르 필터 데이터 (색상 코딩)
const GENRE_FILTERS = [
  { id: "", label: "전체", color: "#71717a", bg: "rgba(113,113,122,0.1)" },
  { id: "kpop", label: "K-Pop", color: "#f472b6", bg: "rgba(244,114,182,0.1)" },
  { id: "electronic", label: "일렉", color: "#22d3ee", bg: "rgba(34,211,238,0.1)" },
  { id: "ambient", label: "앰비언트", color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
  { id: "hip-hop", label: "힙합", color: "#fb923c", bg: "rgba(251,146,60,0.1)" },
  { id: "trot", label: "트로트", color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
  { id: "r&b", label: "R&B", color: "#34d399", bg: "rgba(52,211,153,0.1)" },
];

export default function 갤러리() {
  const { selectedIds, isMixing, mixResult, mixError, mixProgress, handleSelectToggle, handleMix, handleReset } = useMixing();
  const [activeGenre, setActiveGenre] = useState("");

  return (
    <main className="min-h-screen bg-black text-white">
      {/* 공명 로딩 오버레이 */}
      <ResonanceLoader
        isLoading={isMixing}
        progress={mixProgress}
        currentStep="조각들을 공명으로 믹싱하는 중..."
      />

      {/* 헤더 */}
      <header className="border-b border-zinc-900 px-4 sm:px-6 py-4 sm:py-5 pt-16 sm:pt-16">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-zinc-600 text-[10px] tracking-[0.5em] uppercase mb-1">SORI</p>
            <h1 className="text-white text-lg font-light tracking-widest">조각 갤러리</h1>
          </div>
          <Link
            href="/upload"
            className="btn-sori-outline text-xs tracking-[0.2em] px-4 py-2.5 uppercase"
          >
            올리기
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-8">

        {/* 믹스 오류 */}
        {mixError && (
          <div className="mb-6 p-4 bg-black border border-red-900 text-center animate-fadeInUp">
            <p className="text-red-400 text-sm">{mixError}</p>
          </div>
        )}

        {/* 믹스 결과 + 성공 축하 화면 */}
        {mixResult ? (
          <div className="space-y-8 animate-fadeInUp">
            {/* 성공 축하 헤더 */}
            <div className="text-center space-y-3 py-6 relative">
              {/* 파티클 장식 */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-[#F8F32B] rounded-full"
                    style={{
                      left: `${15 + i * 14}%`,
                      top: `${20 + (i % 2) * 40}%`,
                      animation: `celebrate-particle ${0.8 + i * 0.15}s ease-out ${i * 0.1}s both`,
                      opacity: mixResult !== null ? 0 : 1,
                    }}
                  />
                ))}
              </div>

              <p className="text-[#F8F32B] text-[10px] tracking-[0.6em] uppercase animate-glow-brand">
                ✦ 공명 완료
              </p>
              <h2 className="text-2xl font-thin text-white tracking-widest">
                {mixResult.joakakCount}개의 조각이
              </h2>
              <p className="text-zinc-500 text-lg font-thin tracking-widest">하나의 울림이 되었습니다</p>
            </div>

            {/* 커스텀 오디오 플레이어 */}
            <CustomAudioPlayer
              src={mixResult.outputUrl}
              title="울림"
              subtitle={`${mixResult.joakakCount}개 조각 · ${Math.round(mixResult.duration)}초`}
              autoPlay
            />

            {/* 액션 버튼 */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handleReset}
                className="text-zinc-600 text-xs tracking-[0.2em] py-3 px-4 hover:text-zinc-300 transition-colors uppercase border border-zinc-900 hover:border-zinc-700"
              >
                다시 선택
              </button>
              <Link
                href="/"
                className="btn-sori-outline text-xs tracking-[0.2em] py-3 px-5 uppercase"
              >
                공간으로
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* 장르 필터 탭 — 색상 코딩 pill */}
            <div className="mb-6 overflow-x-auto no-scrollbar">
              <div className="flex gap-2 pb-1 w-max sm:w-auto sm:flex-wrap">
                {GENRE_FILTERS.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => setActiveGenre(genre.id)}
                    className={`px-4 py-1.5 text-xs tracking-[0.15em] border transition-all duration-200 whitespace-nowrap ${activeGenre === genre.id
                        ? "text-black font-medium"
                        : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400 bg-transparent"
                      }`}
                    style={
                      activeGenre === genre.id
                        ? {
                          background: genre.color,
                          borderColor: genre.color,
                          boxShadow: `0 0 12px ${genre.color}40`,
                        }
                        : {}
                    }
                  >
                    {genre.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 선택 안내 */}
            <p className="text-zinc-700 text-[10px] tracking-[0.2em] text-center mb-4">
              {selectedIds.length === 0
                ? "조각을 선택해 공명으로 믹스하거나, 재생 버튼으로 들어보세요"
                : `${selectedIds.length}개 선택됨 — 2개 이상 선택하면 믹스 버튼이 나타납니다`}
            </p>

            {/* 피드 */}
            <JoakakFeed
              selectionMode
              selectedIds={selectedIds}
              onSelectToggle={handleSelectToggle}
              genreFilter={activeGenre || undefined}
            />
          </>
        )}
      </div>

      {/* 믹스 선택 패널 */}
      {!mixResult && (
        <MixSelector
          selectedIds={selectedIds}
          onMix={handleMix}
          isMixing={isMixing}
        />
      )}
    </main>
  );
}
