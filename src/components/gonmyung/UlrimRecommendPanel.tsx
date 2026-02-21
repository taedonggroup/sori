"use client";

// 공명 추천 패널 — fragments 상태에서 하단 플로팅 버튼 + 슬라이드업 패널
import { useState } from "react";
import { Sparkles, X, Play, Pause, Check } from "lucide-react";

interface RecommendCombination {
  ids: string[];
  reason: string;
}

interface RecommendApiResponse {
  combinations: RecommendCombination[];
}

interface MixApiResponse {
  output_url: string;
}

interface UlrimRecommendPanelProps {
  isVisible: boolean;
}

export default function UlrimRecommendPanel({ isVisible }: UlrimRecommendPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [combinations, setCombinations] = useState<RecommendCombination[]>([]);
  const [activePreviewIndex, setActivePreviewIndex] = useState<number | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [confirmedIndex, setConfirmedIndex] = useState<number | null>(null);
  const [previewAudio] = useState<HTMLAudioElement | null>(
    () => typeof window !== "undefined" ? new Audio() : null
  );

  const handleOpen = async () => {
    setIsOpen(true);
    setIsLoading(true);
    setCombinations([]);
    setActivePreviewIndex(null);
    setIsPreviewPlaying(false);
    setConfirmedIndex(null);

    try {
      const response = await fetch("/api/gonmyung/recommend");
      if (!response.ok) throw new Error("추천 로드 실패");
      const data = (await response.json()) as RecommendApiResponse;
      setCombinations(data.combinations);
    } catch {
      setCombinations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (previewAudio) {
      previewAudio.pause();
    }
    setIsPreviewPlaying(false);
    setActivePreviewIndex(null);
  };

  const handlePreview = async (ids: string[], index: number) => {
    // 같은 조합 다시 클릭 시 토글
    if (activePreviewIndex === index && isPreviewPlaying) {
      previewAudio?.pause();
      setIsPreviewPlaying(false);
      return;
    }

    setActivePreviewIndex(index);

    try {
      const response = await fetch("/api/gonmyung/mix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ joakak_ids: ids }),
      });
      if (!response.ok) throw new Error("믹스 실패");
      const data = (await response.json()) as MixApiResponse;

      if (previewAudio) {
        previewAudio.pause();
        previewAudio.src = data.output_url;
        previewAudio.onended = () => {
          setIsPreviewPlaying(false);
        };
        previewAudio.play().catch(() => {
          setIsPreviewPlaying(false);
        });
        setIsPreviewPlaying(true);
      }
    } catch {
      setIsPreviewPlaying(false);
    }
  };

  const handleConfirm = (index: number) => {
    if (previewAudio) {
      previewAudio.pause();
    }
    setIsPreviewPlaying(false);
    setConfirmedIndex(index);

    // 2초 후 패널 닫기
    setTimeout(() => {
      setIsOpen(false);
      setConfirmedIndex(null);
      setActivePreviewIndex(null);
    }, 2000);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* 플로팅 버튼 — 패널 닫혔을 때만 표시 */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-2.5
            bg-zinc-900 border border-zinc-700 rounded-full text-white text-xs tracking-wider
            hover:border-zinc-500 hover:bg-zinc-800 transition-all duration-200
            shadow-lg shadow-black/50"
        >
          <Sparkles size={13} className="text-[#F8F32B]" />
          공명 추천
        </button>
      )}

      {/* 슬라이드업 패널 */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-zinc-950 border-t border-zinc-800 rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto">
          {/* 핸들 바 */}
          <div className="w-10 h-1 bg-zinc-800 rounded-full mx-auto mb-5" />

          {/* 헤더 */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#F8F32B]" />
              <p className="text-white text-sm font-medium tracking-wider">공명의 제안</p>
            </div>
            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
              aria-label="닫기"
            >
              <X size={13} className="text-zinc-400" />
            </button>
          </div>

          {/* 로딩 */}
          {isLoading && (
            <div className="flex flex-col items-center py-10 gap-3">
              <div className="w-6 h-6 border-2 border-zinc-700 border-t-[#F8F32B] rounded-full animate-spin" />
              <p className="text-zinc-500 text-xs tracking-wider">공명이 조각들을 듣고 있습니다...</p>
            </div>
          )}

          {/* 결과 없음 */}
          {!isLoading && combinations.length === 0 && (
            <div className="text-center py-10">
              <p className="text-zinc-600 text-sm">조각이 부족합니다</p>
              <p className="text-zinc-700 text-xs mt-2">먼저 조각을 2개 이상 올려주세요</p>
            </div>
          )}

          {/* 추천 조합 목록 */}
          {!isLoading && combinations.map((combo, index) => (
            <div
              key={index}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-3 space-y-3"
            >
              {/* 이유 */}
              <p className="text-zinc-400 text-xs leading-relaxed">{combo.reason}</p>

              {/* 조각 ID 태그 */}
              <div className="flex gap-2 flex-wrap">
                {combo.ids.map((id) => (
                  <span
                    key={id}
                    className="text-[10px] text-zinc-600 bg-zinc-800 rounded-full px-2 py-0.5 font-mono"
                  >
                    ···{id.slice(-8)}
                  </span>
                ))}
              </div>

              {/* 확정 토스트 */}
              {confirmedIndex === index && (
                <div className="flex items-center gap-2 text-[#F8F32B] text-xs">
                  <Check size={12} />
                  울림으로 확정되었습니다
                </div>
              )}

              {/* 액션 버튼 */}
              {confirmedIndex !== index && (
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handlePreview(combo.ids, index)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-700
                      text-zinc-300 text-xs hover:border-zinc-500 transition-colors"
                  >
                    {activePreviewIndex === index && isPreviewPlaying ? (
                      <Pause size={11} />
                    ) : (
                      <Play size={11} />
                    )}
                    미리 듣기
                  </button>

                  <button
                    onClick={() => handleConfirm(index)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all
                      border border-[#F8F32B]/40 text-[#F8F32B] hover:border-[#F8F32B] hover:bg-[#F8F32B]/5"
                  >
                    <Sparkles size={11} />
                    울림으로 확정
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
