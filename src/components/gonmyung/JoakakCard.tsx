"use client";

// 조각 카드 — 상업용 수준 인터랙션 개선: 선택 글로우, 공명 노란색 브랜드 통일
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
      audioRef.current.play().catch(() => setIsPlaying(false));
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
        relative border transition-all duration-300
        ${selectionMode || (!isExpanded && onToggleExpand) ? "cursor-pointer" : ""}
        ${isSelected
          ? "border-[#F8F32B] bg-[rgba(248,243,43,0.03)]"
          : isExpanded
            ? "border-zinc-700 bg-zinc-950/50"
            : "border-zinc-900 hover:border-zinc-700 bg-black"
        }
      `}
      style={
        isSelected
          ? { boxShadow: "0 0 20px rgba(248, 243, 43, 0.12), inset 0 0 20px rgba(248, 243, 43, 0.03)" }
          : {}
      }
      onClick={!isExpanded ? handleCardClick : undefined}
    >
      {/* 선택 표시 — 공명 노란색 */}
      {selectionMode && isSelected && (
        <div
          className="absolute top-3 right-3 w-5 h-5 bg-[#F8F32B] flex items-center justify-center z-10"
          style={{ boxShadow: "0 0 8px rgba(248, 243, 43, 0.6)" }}
        >
          <Check size={11} className="text-black" strokeWidth={3} />
        </div>
      )}

      {/* 확장 닫기 */}
      {isExpanded && !selectionMode && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleExpand?.(); }}
          className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-zinc-400 transition-colors z-10"
          aria-label="닫기"
        >
          <X size={12} />
        </button>
      )}

      {/* 오디오 */}
      <audio
        ref={audioRef}
        src={`/api/gonmyung/joakak/${joakak.id}/audio`}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        preload="none"
      />

      {/* 카드 본문 */}
      <div className="p-4 flex items-start gap-3">
        {/* 재생 버튼 */}
        <button
          onClick={handlePlayToggle}
          className={`shrink-0 w-9 h-9 border flex items-center justify-center transition-all duration-200 mt-0.5 ${isPlaying
              ? "border-[#F8F32B] text-[#F8F32B]"
              : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
            }`}
          style={isPlaying ? { boxShadow: "0 0 10px rgba(248, 243, 43, 0.3)" } : {}}
          aria-label={isPlaying ? "일시정지" : "재생"}
        >
          {isPlaying ? (
            // 재생 중: 이퀄라이저 애니메이션
            <div className="flex items-end gap-[2px] h-3">
              <div className="w-[2px] bg-[#F8F32B] rounded-sm animate-wave-eq-1" />
              <div className="w-[2px] bg-[#F8F32B] rounded-sm animate-wave-eq-2" style={{ animationDelay: "0.1s" }} />
              <div className="w-[2px] bg-[#F8F32B] rounded-sm animate-wave-eq-3" style={{ animationDelay: "0.2s" }} />
            </div>
          ) : (
            <Play size={13} className="ml-0.5" />
          )}
        </button>

        {/* 파일 정보 */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <p className="text-white text-sm font-light truncate pr-6 leading-tight">
            {joakak.original_filename}
          </p>

          {/* 닉네임 — 공명 노란색 */}
          <Link
            href={`/profile/${encodeURIComponent(joakak.nickname)}`}
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] text-[#F8F32B]/60 hover:text-[#F8F32B] tracking-[0.15em] transition-colors"
          >
            @{joakak.nickname}
          </Link>

          {/* 음악 메타데이터 */}
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            {joakak.genre && (
              <span className="text-[10px] font-mono tracking-wide px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400">
                {joakak.genre}
              </span>
            )}
            {joakak.bpm && (
              <span className="text-zinc-600 text-[10px] font-mono">
                {joakak.bpm} BPM
              </span>
            )}
            {joakak.key_signature && (
              <span className="text-zinc-700 text-[10px] font-mono">
                {joakak.key_signature}
              </span>
            )}
          </div>

          {/* 하단 통계 */}
          <div className="flex items-center justify-between mt-1">
            <span className="text-zinc-800 text-[10px] font-mono">
              {joakak.play_count}회
            </span>
            <span className="text-zinc-800 text-[10px] font-mono">
              {formatFileSize(joakak.file_size)}
            </span>
          </div>
        </div>
      </div>

      {/* 확장 영역: 시크바 — 공명 노란색 */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-20 pb-4 px-4" : "max-h-0"
          }`}
      >
        <input
          type="range"
          min={0}
          max={duration || 1}
          value={currentTime}
          onChange={handleSeek}
          onClick={(e) => e.stopPropagation()}
          className="w-full h-px appearance-none cursor-pointer gonmyung-slider"
          style={{
            background: duration
              ? `linear-gradient(to right, #F8F32B ${(currentTime / duration) * 100}%, #27272a ${(currentTime / duration) * 100}%)`
              : "#27272a",
          }}
        />
        <div className="flex justify-between mt-2">
          <span className="text-zinc-700 text-[10px] font-mono">{formatTime(currentTime)}</span>
          <span className="text-zinc-700 text-[10px] font-mono">{formatTime(duration)}</span>
        </div>
      </div>

      {/* 페르소나 태그 — 공명 노란색 계열 */}
      {joakak.persona.length > 0 && (
        <div className="flex flex-wrap gap-1 px-4 pb-3 pt-0 border-t border-zinc-900">
          {joakak.persona.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[#F8F32B]/40 text-[10px] tracking-[0.15em] font-mono hover:text-[#F8F32B]/70 transition-colors">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
