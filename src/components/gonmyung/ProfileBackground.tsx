"use client";

// 프로필 배경 — 3D 씬 + 파티클 (클라이언트 전용)
import { Component, type ReactNode, type ErrorInfo, Suspense } from "react";
import dynamic from "next/dynamic";
import ParticleBackground from "@/components/ParticleBackground";

// Three.js SSR 제외
const StoneScene = dynamic(() => import("@/components/3d/StoneScene"), {
  ssr: false,
  loading: () => <div className="w-full h-full" />,
});

class StoneErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("3D 렌더링 오류:", error, info);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export default function ProfileBackground() {
  return (
    <>
      <ParticleBackground />
      <div className="absolute inset-0">
        <StoneErrorBoundary fallback={<div className="w-full h-full" />}>
          <Suspense fallback={<div className="w-full h-full" />}>
            <StoneScene />
          </Suspense>
        </StoneErrorBoundary>
      </div>
    </>
  );
}
