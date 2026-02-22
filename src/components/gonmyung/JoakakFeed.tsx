"use client";

// 조각 피드 — 무한 스크롤, 장르 필터 탭, 인플레이스 확장
import { useState, useEffect, useCallback, useRef } from "react";
import JoakakCard from "./JoakakCard";
import type { Joakak, JoakakListResponse } from "@/lib/gonmyung/types";

interface JoakakFeedProps {
  genreFilter?: string;
  selectionMode?: boolean;
  selectedIds?: string[];
  onSelectToggle?: (joakak: Joakak) => void;
}

const GENRE_TABS = [
  { label: "전체", value: "" },
  { label: "K-Pop", value: "kpop" },
  { label: "Electronic", value: "electronic" },
  { label: "Ambient", value: "ambient" },
  { label: "Hip-hop", value: "hip-hop" },
  { label: "Rock", value: "rock" },
  { label: "Jazz", value: "jazz" },
];

const LIMIT = 20;

export default function JoakakFeed({
  genreFilter,
  selectionMode = false,
  selectedIds = [],
  onSelectToggle,
}: JoakakFeedProps) {
  const [joakakList, setJoakakList] = useState<Joakak[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeGenre, setActiveGenre] = useState(genreFilter ?? "");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastCardRef = useRef<HTMLDivElement | null>(null);

  const fetchJoakak = useCallback(async (pageNum: number, genre: string, reset = false) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(pageNum), limit: String(LIMIT) });
      if (genre) params.set("genre", genre);
      const response = await fetch(`/api/gonmyung/joakak?${params.toString()}`);
      if (!response.ok) throw new Error("목록 로드 실패");
      const data = (await response.json()) as JoakakListResponse;
      setJoakakList((prev) => reset ? data.joakak : [...prev, ...data.joakak]);
      setHasNext(data.has_next);
      setPage(pageNum);
    } catch {
      // 네트워크 오류 시 무시
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 장르 탭 변경 시 리셋
  useEffect(() => {
    setJoakakList([]);
    setPage(1);
    setExpandedId(null);
    fetchJoakak(1, activeGenre, true);
  }, [activeGenre, fetchJoakak]);

  // 무한 스크롤 — 마지막 카드 감지
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !isLoading) {
          fetchJoakak(page + 1, activeGenre);
        }
      },
      { threshold: 0.5 }
    );

    if (lastCardRef.current) {
      observerRef.current.observe(lastCardRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasNext, isLoading, page, activeGenre, fetchJoakak]);

  const handleToggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
      {/* 장르 필터 탭 */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {GENRE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveGenre(tab.value)}
            className={`
              shrink-0 px-4 py-1.5 text-xs tracking-wider transition-all duration-200
              ${activeGenre === tab.value
                ? "bg-white text-black"
                : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 조각 그리드 */}
      {joakakList.length === 0 && !isLoading ? (
        <div className="text-center py-20">
          <p className="text-zinc-600 text-sm">아직 조각이 없습니다</p>
          <p className="text-zinc-700 text-xs mt-2">첫 번째 조각을 올려보세요</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {joakakList.map((joakak, index) => (
            <div
              key={joakak.id}
              ref={index === joakakList.length - 1 ? lastCardRef : null}
            >
              <JoakakCard
                joakak={joakak}
                selectionMode={selectionMode}
                isSelected={selectedIds.includes(joakak.id)}
                onSelect={onSelectToggle}
                isExpanded={expandedId === joakak.id}
                onToggleExpand={() => handleToggleExpand(joakak.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* 로딩 스켈레톤 */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-zinc-950 border border-zinc-900 p-4 h-32 animate-pulse"
            />
          ))}
        </div>
      )}
    </div>
  );
}
