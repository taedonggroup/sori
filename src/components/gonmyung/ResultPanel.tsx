"use client";

// 공명 엔진 — 결과 패널 (프리셋 태그, 오디오 플레이어, EQ 시각화)
import { RotateCcw } from "lucide-react";
import type { GenerateResponse } from "@/lib/gonmyung/types";

interface ResultPanelProps {
  result: GenerateResponse;
  onReset: () => void;
}

const EQ_LABELS = ["Low", "Mid", "High"] as const;

function EqBar({ label, value }: { label: string; value: number }) {
  const heightPercent = (value / 10) * 100;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-6 h-20 bg-zinc-900 rounded-full overflow-hidden flex items-end">
        <div
          className="w-full rounded-full transition-all duration-700"
          style={{
            height: `${heightPercent}%`,
            backgroundColor: "#F8F32B",
            boxShadow: "0 0 6px rgba(248, 243, 43, 0.4)",
          }}
        />
      </div>
      <span className="text-zinc-600 text-[10px] uppercase">{label}</span>
    </div>
  );
}

export default function ResultPanel({ result, onReset }: ResultPanelProps) {
  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* 헤더 + 프리셋 태그 */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase">
            공명 완료
          </p>
          <p className="text-white text-lg font-light">
            {result.genre} — {result.mood}
          </p>
        </div>
        <span className="px-3 py-1 text-[10px] border border-[#F8F32B] text-[#F8F32B] rounded-full tracking-wider">
          {result.preset_applied}
        </span>
      </div>

      {/* Full Mix 오디오 */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <p className="text-zinc-500 text-xs tracking-[0.2em] uppercase">
          Full Mix
        </p>
        {result.outputs.full_mix ? (
          <audio
            controls
            src={result.outputs.full_mix}
            className="w-full h-10 [&::-webkit-media-controls-panel]:bg-zinc-900 invert-[0.85] sepia-[0.1] brightness-[0.8]"
          />
        ) : (
          <div className="w-full h-10 bg-zinc-900 rounded-lg flex items-center justify-center">
            <p className="text-zinc-600 text-xs">시뮬레이션 모드 — 오디오 없음</p>
          </div>
        )}
      </div>

      {/* Stems 그리드 */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <p className="text-zinc-500 text-xs tracking-[0.2em] uppercase">
          Stems
        </p>
        <div className="grid grid-cols-3 gap-3">
          {(
            [
              { label: "Drums", src: result.outputs.stems.drums },
              { label: "Bass", src: result.outputs.stems.bass },
              { label: "Melody", src: result.outputs.stems.melody },
            ] as const
          ).map((stem) => (
            <div key={stem.label} className="space-y-2">
              <p className="text-zinc-400 text-[10px] text-center uppercase tracking-wider">
                {stem.label}
              </p>
              {stem.src ? (
                <audio
                  controls
                  src={stem.src}
                  className="w-full h-8 [&::-webkit-media-controls-panel]:bg-zinc-900 invert-[0.85] sepia-[0.1] brightness-[0.8]"
                />
              ) : (
                <div className="w-full h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                  <span className="text-zinc-700 text-[9px]">—</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* EQ 시각화 */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
        <p className="text-zinc-500 text-xs tracking-[0.2em] uppercase mb-4">
          EQ Profile
        </p>
        <div className="flex items-end justify-center gap-6">
          {EQ_LABELS.map((label) => (
            <EqBar
              key={label}
              label={label}
              value={
                result.preset_eq[
                  label.toLowerCase() as keyof typeof result.preset_eq
                ]
              }
            />
          ))}
        </div>
        <div className="mt-3 text-center">
          <span className="text-zinc-600 text-[10px]">
            Reverb: {(result.preset_reverb * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* 다시 생성 버튼 */}
      <button
        onClick={onReset}
        className="w-full py-4 rounded-full text-sm tracking-wider
          border border-white/60 text-white
          transition-all duration-300
          hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]
          active:scale-[0.98]
          flex items-center justify-center gap-2"
      >
        <RotateCcw size={14} />
        다시 생성
      </button>
    </div>
  );
}
