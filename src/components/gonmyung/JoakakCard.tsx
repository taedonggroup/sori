"use client";

// 조각 카드 — 재생, 선택 모드, 닉네임 링크
import { useState, useRef } from "react";
import Link from "next/link";
import { Play, Pause, Check } from "lucide-react";
import type { Joakak } from "@/lib/gonmyung/types";

interface JoakakCardProps {
  joakak: Joakak;
  selectionMode?: boolean;
  isSelected?: boolean;
  onSelect?: (joakak: Joakak) => void;
}

export default function JoakakCard({
  joakak,
  selectionMode = false,
  isSelected = false,
  onSelect,
}: JoakakCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const handleCardClick = () => {
    if (selectionMode && onSelect) {
      onSelect(joakak);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div
      className={`
        relative bg-zinc-950 border rounded-2xl p-4 transition-all duration-200
        ${selectionMode ? "cursor-pointer" : ""}
        ${isSelected
          ? "border-[#F8F32B] shadow-[0_0_15px_rgba(248,243,43,0.15)]"
          : "border-zinc-800 hover:border-zinc-600"
        }
      `}
      onClick={handleCardClick}
    >
      {/* 선택 오버레이 */}
      {selectionMode && isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#F8F32B] flex items-center justify-center z-10">
          <Check size={14} className="text-black" />
        </div>
      )}

      {/* 오디오 엘리먼트 (숨김) */}
      <audio
        ref={audioRef}
        src={`/api/gonmyung/joakak/${joakak.id}/audio`}
        onEnded={() => setIsPlaying(false)}
        preload="none"
      />

      {/* 카드 내용 */}
      <div className="flex items-start gap-3">
        {/* 재생 버튼 */}
        <button
          onClick={handlePlayToggle}
          className="shrink-0 w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800
            flex items-center justify-center hover:border-zinc-600 transition-colors mt-0.5"
          aria-label={isPlaying ? "일시정지" : "재생"}
        >
          {isPlaying ? (
            <Pause size={14} className="text-white" />
          ) : (
            <Play size={14} className="text-white ml-0.5" />
          )}
        </button>

        {/* 파일 정보 */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <p className="text-white text-sm font-medium truncate">
            {joakak.original_filename}
          </p>

          {/* 닉네임 링크 */}
          <Link
            href={`/profile/${encodeURIComponent(joakak.nickname)}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs hover:underline transition-colors"
            style={{ color: "#F8F32B" }}
          >
            @{joakak.nickname}
          </Link>

          {/* 메타데이터 태그 */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {joakak.genre && (
              <span className="text-zinc-400 text-[10px] bg-zinc-900 border border-zinc-800 rounded-full px-2 py-0.5">
                {joakak.genre}
              </span>
            )}
            {joakak.bpm && (
              <span className="text-zinc-500 text-[10px] bg-zinc-900 border border-zinc-800 rounded-full px-2 py-0.5">
                {joakak.bpm} BPM
              </span>
            )}
            {joakak.key_signature && (
              <span className="text-zinc-500 text-[10px] bg-zinc-900 border border-zinc-800 rounded-full px-2 py-0.5">
                {joakak.key_signature}
              </span>
            )}
          </div>

          {/* 하단 정보 */}
          <div className="flex items-center justify-between mt-1">
            <span className="text-zinc-700 text-[10px]">
              재생 {joakak.play_count}회
            </span>
            <span className="text-zinc-700 text-[10px]">
              {formatFileSize(joakak.file_size)}
            </span>
          </div>
        </div>
      </div>

      {/* 페르소나 태그 (있을 경우) */}
      {joakak.persona.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-zinc-900">
          {joakak.persona.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-zinc-500 text-[10px] tracking-wider"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
