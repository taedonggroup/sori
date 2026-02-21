"use client";

// 공명 엔진 — 장르 선택 그리드 (K-Content 핵심 + 기타 장르)
import type { GonmyungPreset } from "@/lib/gonmyung/types";

// 프리셋 이름에서 표시용 라벨 추출
const GENRE_LABELS: Record<string, string> = {
  kpop: "K-Pop",
  kdrama: "K-드라마 OST",
  trot: "트로트 퓨전",
  hiphop: "힙합",
  rnb: "R&B",
  edm: "EDM",
  ambient: "앰비언트",
  rock: "록",
  jazz: "재즈",
  classical: "클래식",
  trap: "트랩",
  lofi: "Lo-Fi",
  house: "하우스",
  drill: "드릴",
  indie: "인디",
  folk: "포크",
  metal: "메탈",
  funk: "펑크",
  soul: "소울",
  cinematic: "시네마틱",
  reggae: "레게",
  experimental: "실험",
};

interface GenreGridProps {
  presets: GonmyungPreset[];
  selectedGenre: string;
  onSelect: (genre: string) => void;
}

export default function GenreGrid({
  presets,
  selectedGenre,
  onSelect,
}: GenreGridProps) {
  // K-Content 핵심 / 기타 장르 분리
  const corePresets = presets.filter((p) => p.tier === "core");
  const standardPresets = presets.filter((p) => p.tier === "standard");

  return (
    <div className="space-y-6">
      {/* K-Content 핵심 장르 */}
      <div className="space-y-3">
        <p className="text-[#F8F32B] text-[10px] tracking-[0.3em] uppercase">
          K-Content 핵심
        </p>
        <p className="text-zinc-500 text-xs">
          K-Content에 화력을 집중합니다
        </p>
        <div className="grid grid-cols-3 gap-3">
          {corePresets.map((preset) => {
            const isSelected = preset.genre === selectedGenre;
            const label = GENRE_LABELS[preset.genre] ?? preset.genre;

            return (
              <button
                key={preset.id}
                onClick={() => onSelect(preset.genre)}
                aria-pressed={isSelected}
                aria-label={`${label} 장르 선택`}
                className={`
                  py-4 px-3 rounded-xl text-sm transition-all duration-200 border
                  ${
                    isSelected
                      ? "bg-[#F8F32B] text-black font-semibold border-[#F8F32B] shadow-[0_0_20px_rgba(248,243,43,0.3)]"
                      : "bg-zinc-900 text-zinc-300 border-[#F8F32B]/30 hover:border-[#F8F32B]/60 shadow-[0_0_8px_rgba(248,243,43,0.06)]"
                  }
                `}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 기타 장르 */}
      <div className="space-y-3">
        <p className="text-zinc-600 text-[10px] tracking-[0.3em] uppercase">
          기타 장르
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {standardPresets.map((preset) => {
            const isSelected = preset.genre === selectedGenre;
            const label = GENRE_LABELS[preset.genre] ?? preset.genre;

            return (
              <button
                key={preset.id}
                onClick={() => onSelect(preset.genre)}
                aria-pressed={isSelected}
                aria-label={`${label} 장르 선택`}
                className={`
                  px-2 py-2.5 text-xs rounded-lg border transition-all duration-200
                  ${
                    isSelected
                      ? "border-[#F8F32B] bg-[rgba(248,243,43,0.08)] text-[#F8F32B] font-bold"
                      : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400"
                  }
                `}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
