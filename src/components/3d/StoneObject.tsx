"use client"

// 원석 3D 오브젝트 — 씬 상태별 위치/크기/회전 보간
// stoneType으로 3가지 원석 디자인 선택:
//   A = 검은 현무암 (미각성)     GLB: stone-a.glb
//   B = 균열+금맥+이리데슨트 (각성 중) GLB: stone-b.glb  ← 기본값
//   C = 크리스탈 클러스터 (완전각성) GLB: stone-c.glb
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useSceneStore, type SceneName } from "@/store/sceneStore"
import StoneA from "./stones/StoneA"
import StoneB from "./stones/StoneB"
import StoneC from "./stones/StoneC"

export type StoneType = "A" | "B" | "C"

const STONE_POSITIONS: Record<SceneName, THREE.Vector3> = {
  stone:     new THREE.Vector3(0, 0, 0),
  fragments: new THREE.Vector3(3.5, -2.5, -1),
  upload:    new THREE.Vector3(-3, 0, -2),
  gallery:   new THREE.Vector3(4, -2, 0),
  profile:   new THREE.Vector3(0, -0.5, 0),
}

const STONE_SCALES: Record<SceneName, number> = {
  stone:     1,
  fragments: 0.1,
  upload:    0.25,
  gallery:   0.12,
  profile:   1.3,
}

interface StoneObjectProps {
  stoneType?: StoneType
}

export default function StoneObject({ stoneType = "B" }: StoneObjectProps) {
  const groupRef = useRef<THREE.Group>(null)
  const scene = useSceneStore((s) => s.scene)

  const currentPos   = useRef(new THREE.Vector3(0, 0, 0))
  const currentScale = useRef(1)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const lerpSpeed = Math.min(delta * 1.5, 0.1)

    // 위치 보간
    currentPos.current.lerp(STONE_POSITIONS[scene], lerpSpeed)
    groupRef.current.position.copy(currentPos.current)

    // 크기 보간
    currentScale.current = THREE.MathUtils.lerp(
      currentScale.current,
      STONE_SCALES[scene],
      lerpSpeed
    )
    groupRef.current.scale.setScalar(currentScale.current)

    // 느린 자전
    groupRef.current.rotation.y += delta * 0.08
    groupRef.current.rotation.x += delta * 0.015
  })

  return (
    <group ref={groupRef}>
      {stoneType === "A" && <StoneA />}
      {stoneType === "B" && <StoneB />}
      {stoneType === "C" && <StoneC />}
    </group>
  )
}
