"use client";

// 파티클 배경 컴포넌트 — 우주 공간 속 별 효과
import { useEffect, useRef } from "react";

interface 파티클 {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
  direction: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 캔버스 초기 크기 설정
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 파티클 생성
    const 파티클목록: 파티클[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.2 + 0.2,
      opacity: Math.random() * 0.7 + 0.1,
      speed: Math.random() * 0.15 + 0.02,
      direction: Math.random() * Math.PI * 2,
    }));

    // 리사이즈 시 캔버스 크기 + 파티클 위치 재초기화
    const 크기조정 = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      파티클목록.forEach((p) => {
        p.x = Math.random() * canvas.width;
        p.y = Math.random() * canvas.height;
      });
    };
    window.addEventListener("resize", 크기조정);

    let 애니메이션ID: number;

    const 그리기 = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      파티클목록.forEach((p) => {
        // 파티클 이동
        p.x += Math.cos(p.direction) * p.speed;
        p.y += Math.sin(p.direction) * p.speed;

        // 경계 처리 (반대편으로 등장)
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // 별 그리기
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      });

      애니메이션ID = requestAnimationFrame(그리기);
    };

    그리기();

    return () => {
      window.removeEventListener("resize", 크기조정);
      cancelAnimationFrame(애니메이션ID);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
