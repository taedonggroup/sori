"use client";

// 공명 엔진 — 공명 로딩 애니메이션 (Canvas 파티클 + 발광 구체)
import { useEffect, useRef, useCallback } from "react";

interface ResonanceLoaderProps {
  isLoading: boolean;
  progress: number;
  currentStep: string;
}

interface ResonanceParticle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  angle: number;
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
  alpha: number;
}

const PARTICLE_COUNT = 80;
const CANVAS_SIZE = 300;
const CENTER = CANVAS_SIZE / 2;
const RESONANCE_COLOR = { r: 248, g: 243, b: 43 };

const LOADING_MAIN_MESSAGE = "흩어진 조각들을 모아서 공명의 주파수를 맞추는 중입니다.";

function createParticles(): ResonanceParticle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 80;
    return {
      x: CENTER + Math.cos(angle) * distance,
      y: CENTER + Math.sin(angle) * distance,
      targetX: CENTER,
      targetY: CENTER,
      angle: Math.random() * Math.PI * 2,
      orbitRadius: 30 + Math.random() * 60,
      orbitSpeed: 0.005 + Math.random() * 0.015,
      size: 1 + Math.random() * 2,
      alpha: 0.3 + Math.random() * 0.7,
    };
  });
}

function getPhase(progress: number): number {
  if (progress < 30) return 0;
  if (progress < 75) return 1;
  return 2;
}

export default function ResonanceLoader({
  isLoading,
  progress,
  currentStep,
}: ResonanceLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ResonanceParticle[]>(createParticles());
  const animationIdRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  // progress를 ref로 관리하여 animate 콜백 재생성 방지
  const progressRef = useRef(progress);
  useEffect(() => { progressRef.current = progress; }, [progress]);

  const drawWaveform = useCallback(
    (ctx: CanvasRenderingContext2D, time: number) => {
      const waveY = CANVAS_SIZE - 30;
      const waveWidth = 200;
      const startX = CENTER - waveWidth / 2;

      ctx.beginPath();
      ctx.strokeStyle = `rgba(${RESONANCE_COLOR.r}, ${RESONANCE_COLOR.g}, ${RESONANCE_COLOR.b}, 0.4)`;
      ctx.lineWidth = 1;

      for (let i = 0; i <= waveWidth; i++) {
        const x = startX + i;
        const amplitude = 8 * Math.sin(time * 0.003 + i * 0.05);
        const y = waveY + amplitude * Math.sin(time * 0.002 + i * 0.08);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    },
    []
  );

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    timeRef.current += 16;
    const time = timeRef.current;
    const phase = getPhase(progressRef.current);
    const particles = particlesRef.current;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // 중심 발광 구체
    const glowIntensity = phase >= 1 ? 0.3 + Math.sin(time * 0.003) * 0.15 : 0.1;
    const glowRadius = phase >= 1 ? 40 + Math.sin(time * 0.002) * 10 : 20;
    const gradient = ctx.createRadialGradient(
      CENTER,
      CENTER,
      0,
      CENTER,
      CENTER,
      glowRadius
    );
    gradient.addColorStop(
      0,
      `rgba(${RESONANCE_COLOR.r}, ${RESONANCE_COLOR.g}, ${RESONANCE_COLOR.b}, ${glowIntensity})`
    );
    gradient.addColorStop(1, "rgba(248, 243, 43, 0)");
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // 파티클 업데이트 및 그리기
    particles.forEach((particle) => {
      if (phase === 0) {
        // Phase 0: 중심으로 천천히 수렴
        const convergenceSpeed = 0.008;
        particle.x += (particle.targetX - particle.x) * convergenceSpeed;
        particle.y += (particle.targetY - particle.y) * convergenceSpeed;
      } else if (phase === 1) {
        // Phase 1: 원형 궤도로 돌기
        particle.angle += particle.orbitSpeed;
        particle.x =
          CENTER + Math.cos(particle.angle) * particle.orbitRadius;
        particle.y =
          CENTER + Math.sin(particle.angle) * particle.orbitRadius;
      } else {
        // Phase 2: 궤도 반경 축소하며 최종 수렴
        particle.orbitRadius *= 0.995;
        particle.angle += particle.orbitSpeed * 1.5;
        particle.x =
          CENTER + Math.cos(particle.angle) * particle.orbitRadius;
        particle.y =
          CENTER + Math.sin(particle.angle) * particle.orbitRadius;
      }

      // 파티클 그리기
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${RESONANCE_COLOR.r}, ${RESONANCE_COLOR.g}, ${RESONANCE_COLOR.b}, ${particle.alpha})`;
      ctx.fill();
    });

    // Phase 1 이후 하단 주파수 파형
    if (phase >= 1) {
      drawWaveform(ctx, time);
    }

    animationIdRef.current = requestAnimationFrame(animate);
  }, [drawWaveform]);

  useEffect(() => {
    if (!isLoading) return;

    particlesRef.current = createParticles();
    timeRef.current = 0;
    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationIdRef.current);
    };
  }, [isLoading, animate]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      {/* 캔버스 애니메이션 */}
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="mb-8"
      />

      {/* 메인 메시지 */}
      <p className="text-zinc-300 text-sm font-light tracking-wide mb-3 text-center px-8">
        {LOADING_MAIN_MESSAGE}
      </p>

      {/* 스텝 메시지 */}
      <p className="text-[#F8F32B] text-xs tracking-wider mb-6 animate-pulse">
        {currentStep}
      </p>

      {/* 진행 바 */}
      <div className="w-60 h-px bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: `rgb(${RESONANCE_COLOR.r}, ${RESONANCE_COLOR.g}, ${RESONANCE_COLOR.b})`,
            boxShadow: `0 0 8px rgba(${RESONANCE_COLOR.r}, ${RESONANCE_COLOR.g}, ${RESONANCE_COLOR.b}, 0.6)`,
          }}
        />
      </div>

      {/* 진행률 텍스트 */}
      <p className="text-zinc-600 text-[10px] mt-2 tabular-nums">
        {Math.round(progress)}%
      </p>
    </div>
  );
}
