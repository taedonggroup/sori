"use client"

// 씬 상태 동기화 컴포넌트 — 페이지 마운트 시 씬 전환, 언마운트 시 stone 복원
// 서버 컴포넌트(SSR)에서도 사용 가능 (클라이언트 컴포넌트로 임포트)
import { useEffect } from "react"
import { useSceneStore, type SceneName } from "@/store/sceneStore"

interface SceneEffectProps {
  scene: SceneName
}

export default function SceneEffect({ scene }: SceneEffectProps) {
  const setScene = useSceneStore((s) => s.setScene)

  useEffect(() => {
    setScene(scene)
    return () => setScene("stone")
  }, [scene, setScene])

  return null
}
