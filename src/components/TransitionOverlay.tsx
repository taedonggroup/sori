"use client"

// 씬 전환 시 fade-to-black 오버레이
// stone ↔ fragments 카메라 fly-through 연출
import { useSceneStore } from "@/store/sceneStore"

export default function TransitionOverlay() {
  const isTransitioning = useSceneStore((s) => s.isTransitioning)

  return (
    <div
      className="fixed inset-0 bg-black pointer-events-none transition-opacity duration-500"
      style={{ zIndex: 5, opacity: isTransitioning ? 1 : 0 }}
    />
  )
}
