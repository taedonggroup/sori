"use client";

// 믹스 선택 패널 — 하단 고정 플로팅, 선택된 조각으로 공명 믹스 시작
interface MixSelectorProps {
  selectedIds: string[];
  onMix: () => void;
  isMixing: boolean;
}

export default function MixSelector({ selectedIds, onMix, isMixing }: MixSelectorProps) {
  if (selectedIds.length < 2) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 px-4 pointer-events-none">
      <div
        className="pointer-events-auto bg-zinc-950/90 backdrop-blur-md border border-zinc-800
          rounded-2xl px-6 py-4 flex items-center gap-6 shadow-2xl
          shadow-black/50"
      >
        {/* 선택 현황 */}
        <div className="text-left">
          <p className="text-white text-sm font-medium">
            {selectedIds.length}개 조각 선택됨
          </p>
          <p className="text-zinc-600 text-xs mt-0.5">
            공명이 조각들을 하나로 믹스합니다
          </p>
        </div>

        {/* 믹스 버튼 */}
        <button
          onClick={onMix}
          disabled={isMixing}
          className={`
            px-6 py-2.5 rounded-xl text-sm font-medium tracking-wider transition-all duration-200
            ${isMixing
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              : "bg-[#F8F32B] text-black hover:brightness-110"
            }
          `}
        >
          {isMixing ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 border border-zinc-500 border-t-transparent rounded-full animate-spin" />
              믹싱 중...
            </span>
          ) : (
            "공명 믹스"
          )}
        </button>
      </div>
    </div>
  );
}
