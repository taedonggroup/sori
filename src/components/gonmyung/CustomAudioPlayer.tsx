"use client";

// 커스텀 오디오 플레이어 — SORI 브랜드 디자인 (공명 노란색 + 틸)
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface CustomAudioPlayerProps {
    src: string;
    title?: string;
    subtitle?: string;
    autoPlay?: boolean;
}

export default function CustomAudioPlayer({
    src,
    title = "울림",
    subtitle,
    autoPlay = false,
}: CustomAudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (autoPlay && audioRef.current) {
            audioRef.current.play().catch(() => { });
            setIsPlaying(true);
        }
    }, [autoPlay]);

    const handlePlayToggle = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(() => setIsPlaying(false));
            setIsPlaying(true);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = value;
            setCurrentTime(value);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setVolume(value);
        if (audioRef.current) audioRef.current.volume = value;
        setIsMuted(value === 0);
    };

    const handleMuteToggle = () => {
        if (!audioRef.current) return;
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        audioRef.current.muted = newMuted;
    };

    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div
            className="w-full bg-zinc-950 border border-zinc-800 p-6 space-y-5 relative overflow-hidden"
            style={{ boxShadow: "inset 0 0 40px rgba(248, 243, 43, 0.02)" }}
        >
            {/* 배경 발광 효과 (재생 중) */}
            {isPlaying && (
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{ background: "radial-gradient(ellipse at center, #F8F32B 0%, transparent 70%)" }}
                />
            )}

            <audio
                ref={audioRef}
                src={src}
                onEnded={() => setIsPlaying(false)}
                onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
                onLoadedMetadata={() => {
                    setDuration(audioRef.current?.duration ?? 0);
                    setIsLoading(false);
                }}
                onWaiting={() => setIsLoading(true)}
                onCanPlay={() => setIsLoading(false)}
                preload="metadata"
            />

            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-zinc-600 text-[10px] tracking-[0.5em] uppercase">울림</p>
                    {subtitle && (
                        <p className="text-zinc-400 text-xs mt-0.5">{subtitle}</p>
                    )}
                </div>
                {/* 이퀄라이저 시각화 (재생 중) */}
                {isPlaying && (
                    <div className="flex items-end gap-[3px] h-5">
                        <div className="w-[3px] bg-[#F8F32B] rounded-sm animate-wave-eq-1" />
                        <div className="w-[3px] bg-[#F8F32B] rounded-sm animate-wave-eq-2" style={{ animationDelay: "0.15s" }} />
                        <div className="w-[3px] bg-[#F8F32B] rounded-sm animate-wave-eq-3" style={{ animationDelay: "0.05s" }} />
                        <div className="w-[3px] bg-[#F8F32B] rounded-sm animate-wave-eq-4" style={{ animationDelay: "0.25s" }} />
                        <div className="w-[3px] bg-[#F8F32B] rounded-sm animate-wave-eq-5" style={{ animationDelay: "0.1s" }} />
                    </div>
                )}
            </div>

            {/* 컨트롤 */}
            <div className="flex items-center gap-5">
                {/* 재생/정지 버튼 */}
                <button
                    onClick={handlePlayToggle}
                    disabled={isLoading}
                    className={`w-12 h-12 border flex items-center justify-center transition-all duration-300 shrink-0 ${isPlaying
                            ? "border-[#F8F32B] text-[#F8F32B]"
                            : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                    style={isPlaying ? { boxShadow: "0 0 16px rgba(248, 243, 43, 0.3)" } : {}}
                    aria-label={isPlaying ? "일시정지" : "재생"}
                >
                    {isLoading ? (
                        <div className="w-4 h-4 border border-zinc-600 border-t-zinc-300 rounded-full animate-spin" />
                    ) : isPlaying ? (
                        <Pause size={16} />
                    ) : (
                        <Play size={16} className="ml-0.5" />
                    )}
                </button>

                {/* 시크바 + 시간 */}
                <div className="flex-1 space-y-2">
                    <input
                        type="range"
                        min={0}
                        max={duration || 1}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-px appearance-none cursor-pointer gonmyung-slider"
                        style={{
                            background: `linear-gradient(to right, #F8F32B ${progressPercent}%, #27272a ${progressPercent}%)`,
                        }}
                    />
                    <div className="flex justify-between">
                        <span className="text-zinc-600 text-[10px] font-mono">{formatTime(currentTime)}</span>
                        <span className="text-zinc-600 text-[10px] font-mono">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* 볼륨 */}
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={handleMuteToggle}
                        className="text-zinc-600 hover:text-zinc-400 transition-colors"
                        aria-label={isMuted ? "음소거 해제" : "음소거"}
                    >
                        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 h-px appearance-none cursor-pointer gonmyung-slider"
                        style={{
                            background: `linear-gradient(to right, #71717a ${(isMuted ? 0 : volume) * 100}%, #27272a ${(isMuted ? 0 : volume) * 100}%)`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
