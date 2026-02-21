"use client";

// 공명 엔진 — 파라미터 슬라이더 (길이, 공명 강도)

interface ParameterControlsProps {
  duration: number;
  intensity: number;
  onDurationChange: (value: number) => void;
  onIntensityChange: (value: number) => void;
}

export default function ParameterControls({
  duration,
  intensity,
  onDurationChange,
  onIntensityChange,
}: ParameterControlsProps) {
  return (
    <div className="space-y-6">
      {/* 길이 슬라이더 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="gonmyung-duration" className="text-zinc-500 text-xs tracking-[0.2em] uppercase">
            길이
          </label>
          <span className="text-[#F8F32B] text-sm font-medium tabular-nums">
            {duration}초
          </span>
        </div>
        <input
          id="gonmyung-duration"
          type="range"
          min={5}
          max={30}
          value={duration}
          onChange={(event) => onDurationChange(Number(event.target.value))}
          aria-valuemin={5}
          aria-valuemax={30}
          aria-valuenow={duration}
          aria-valuetext={`${duration}초`}
          className="gonmyung-slider w-full"
        />
        <div className="flex justify-between text-zinc-700 text-[10px]">
          <span>5초</span>
          <span>30초</span>
        </div>
      </div>

      {/* 공명 강도 슬라이더 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="gonmyung-intensity" className="text-zinc-500 text-xs tracking-[0.2em] uppercase">
            공명 강도
          </label>
          <span className="text-[#F8F32B] text-sm font-medium tabular-nums">
            {intensity}
          </span>
        </div>
        <input
          id="gonmyung-intensity"
          type="range"
          min={1}
          max={10}
          value={intensity}
          onChange={(event) => onIntensityChange(Number(event.target.value))}
          aria-valuemin={1}
          aria-valuemax={10}
          aria-valuenow={intensity}
          aria-valuetext={`강도 ${intensity}`}
          className="gonmyung-slider w-full"
        />
        <div className="flex justify-between text-zinc-700 text-[10px]">
          <span>약</span>
          <span>강</span>
        </div>
      </div>
    </div>
  );
}
