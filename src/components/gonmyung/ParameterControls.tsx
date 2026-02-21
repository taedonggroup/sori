"use client";

// 공명 엔진 — 파라미터 슬라이더 (길이, 공명 강도)
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

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
          <Label className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
            길이
          </Label>
          <span className="text-[#F8F32B] text-sm font-medium tabular-nums">
            {duration}초
          </span>
        </div>
        <Slider
          min={5}
          max={30}
          value={[duration]}
          onValueChange={([value]) => onDurationChange(value)}
          aria-label="길이"
        />
        <div className="flex justify-between text-zinc-700 text-[10px]">
          <span>5초</span>
          <span>30초</span>
        </div>
      </div>

      {/* 공명 강도 슬라이더 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
            공명 강도
          </Label>
          <span className="text-[#F8F32B] text-sm font-medium tabular-nums">
            {intensity}
          </span>
        </div>
        <Slider
          min={1}
          max={10}
          value={[intensity]}
          onValueChange={([value]) => onIntensityChange(value)}
          aria-label="공명 강도"
        />
        <div className="flex justify-between text-zinc-700 text-[10px]">
          <span>약</span>
          <span>강</span>
        </div>
      </div>
    </div>
  );
}
