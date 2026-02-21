"use client";

// 조각 카드 — 재생, 선택 모드, 인플레이스 확장, 닉네임 링크
import { useState, useRef } from "react";
import Link from "next/link";
import { Play, Pause, Check, X } from "lucide-react";
import type { Joakak } from "@/lib/gonmyung/types";

interface JoakakCardProps {
  joakak: Joakak;
  selectionMode?: boolean;
  isSelected?: boolean;
  onSelect?: (joakak: Joakak) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export default function JoakakCard({
  joakak,
  selectionMode = false,
  isSelected = false,
  onSelect,
  isExpanded = false,
  onToggleExpand,
}: JoakakCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
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
    } else if (!selectionMode && onToggleExpand) {
      onToggleExpand();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const value = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div
      className={`
        relative bg-zinc-950 border rounded-2xl p-4 transition-all duration-300
        ${selectionMode || (!isExpanded && onToggleExpand) ? "cursor-pointer" : ""}
        ${isSelected
          ? "border-[#F8F32B] shadow-[0_0_15px_rgba(248,243,43,0.15)]"
          : isExpanded
            ? "border-zinc-600"
            : "border-zinc-800 hover:border-zinc-600"
        }
      `}
      onClick={!isExpanded ? handleCardClick : undefined}
    >
      {/* 선택 오버레이 */}
      {selectionMode && isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#F8F32B] flex items-center justify-center z-10">
          <Check size={14} className="text-black" />
        </div>
      )}

      {/* 확장 상태 닫기 버튼 */}
      {isExpanded && !selectionMode && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleExpand?.(); }}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors z-10"
          aria-label="닫기"
        >
          <X size={12} className="text-zinc-400" />
        </button>
      )}

      {/* 오디오 엘리먼트 (숨김) */}
      <audio
        ref={audioRef}
        src={`/api/gonmyung/joakak/${joakak.id}/audio`}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
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
          <p className="text-white text-sm font-medium truncate pr-8">
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

      {/* 확장 영역: 프로그레스바 */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-16 mt-3" : "max-h-0"
        }`}
      >
        <input
          type="range"
          min={0}
          max={duration || 1}
          value={currentTime}
          onChange={handleSeek}
          onClick={(e) => e.stopPropagation()}
          className="w-full h-1 appearance-none rounded-full cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3
            [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
          style={{
            background: duration
              ? `linear-gradient(to right, #ffffff ${(currentTime / duration) * 100}%, #3f3f46 ${(currentTime / duration) * 100}%)`
              : "#3f3f46",
          }}
        />
        <div className="flex justify-between mt-1.5">
          <span className="text-zinc-600 text-[10px]">{formatTime(currentTime)}</span>
          <span className="text-zinc-600 text-[10px]">{formatTime(duration)}</span>
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
