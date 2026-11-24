"use client";

// 믹스 선택 패널 — 슬라이드업 애니메이션 + 공명 노란색 강화
import { useEffect, useState } from "react";

interface MixSelectorProps {
  selectedIds: string[];
  onMix: () => void;
  isMixing: boolean;
}

export default function MixSelector({ selectedIds, onMix, isMixing }: MixSelectorProps) {
  const [visible, setVisible] = useState(false);

  // 선택 수가 2 이상일 때 슬라이드업 등장
  useEffect(() => {
    if (selectedIds.length >= 2) {
      // 짧은 딜레이 후 등장 (더 자연스럽게)
      const timer = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [selectedIds.length]);

  if (selectedIds.length < 2) return null;

  // 선택 수에 따라 강도 변화 (2개: 기본, 3개+: 강화)
  const isIntense = selectedIds.length >= 3;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 px-4 pointer-events-none"
      style={{
        transform: visible ? "translateY(0)" : "translateY(20px)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
      }}
    >
      <div
        className="pointer-events-auto border px-6 py-4 flex items-center gap-6 shadow-2xl shadow-black/70 transition-all duration-300"
        style={{
          background: isIntense
            ? "rgba(9, 9, 11, 0.95)"
            : "rgba(9, 9, 11, 0.90)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderColor: isIntense
            ? "rgba(248, 243, 43, 0.3)"
            : "rgba(39, 39, 42, 0.8)",
          boxShadow: isIntense
            ? "0 0 40px rgba(248, 243, 43, 0.08), 0 -1px 30px rgba(0,0,0,0.8)"
            : "0 -1px 30px rgba(0,0,0,0.8)",
        }}
      >
        {/* 선택 현황 */}
        <div className="text-left">
          <p
            className="text-sm font-medium transition-colors duration-300"
            style={{ color: isIntense ? "#F8F32B" : "#ffffff" }}
          >
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
          className={`px-6 py-2.5 text-sm font-medium tracking-wider transition-all duration-300 ${isMixing
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              : "bg-[#F8F32B] text-black hover:brightness-110"
            }`}
          style={
            !isMixing
              ? { boxShadow: isIntense ? "0 0 20px rgba(248, 243, 43, 0.4)" : "0 0 10px rgba(248, 243, 43, 0.2)" }
              : {}
          }
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
