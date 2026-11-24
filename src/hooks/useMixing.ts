"use client";

// 공명 믹싱 공통 훅 — gallery/create 페이지에서 공유
import { useState, useCallback, useEffect } from "react";
import type { Joakak, MixResponse } from "@/lib/gonmyung/types";

interface MixResult {
  outputUrl: string;
  joakakCount: number;
  duration: number;
}

export function useMixing() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isMixing, setIsMixing] = useState(false);
  const [mixResult, setMixResult] = useState<MixResult | null>(null);
  const [mixError, setMixError] = useState<string | null>(null);
  const [mixProgress, setMixProgress] = useState(0);

  // 타이머 기반 진행률 시뮬레이션: 믹싱 중 0→90%, 완료 시 100%
  useEffect(() => {
    if (!isMixing) {
      setMixProgress(0);
      return;
    }
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= 90) {
        clearInterval(interval);
        setMixProgress(90);
      } else {
        setMixProgress(current);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [isMixing]);

  useEffect(() => {
    if (mixResult) setMixProgress(100);
  }, [mixResult]);

  const handleSelectToggle = useCallback((joakak: Joakak) => {
    setSelectedIds((prev) =>
      prev.includes(joakak.id)
        ? prev.filter((id) => id !== joakak.id)
        : [...prev, joakak.id]
    );
  }, []);

  const handleMix = useCallback(async () => {
    if (selectedIds.length < 2) return;
    setIsMixing(true);
    setMixError(null);
    try {
      const response = await fetch("/api/gonmyung/mix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ joakak_ids: selectedIds }),
      });
      if (!response.ok) throw new Error(`믹스 실패 (${response.status})`);
      const data = (await response.json()) as MixResponse;
      setMixResult({
        outputUrl: data.output_url,
        joakakCount: data.joakak_count,
        duration: data.duration,
      });
    } catch (error) {
      setMixError(error instanceof Error ? error.message : "공명 믹스에 실패했습니다.");
    } finally {
      setIsMixing(false);
    }
  }, [selectedIds]);

  const handleReset = useCallback(() => {
    setMixResult(null);
    setSelectedIds([]);
    setMixError(null);
  }, []);

  return {
    selectedIds,
    isMixing,
    mixResult,
    mixError,
    mixProgress,
    handleSelectToggle,
    handleMix,
    handleReset,
  };
}
