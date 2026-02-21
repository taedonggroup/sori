"use client"

// 파티클 별자리 — Teal(80%) + Gold(20%) 2000개 입자
// 레퍼런스: 파티클비행기우주 (검정 배경 + Teal/Gold 혼합)
import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface StarfieldProps {
  count?: number
}

export default function Starfield({ count = 2000 }: StarfieldProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // 구형 분포 — 카메라 기준 15~60 유닛 거리에 균등 배치
      const radius = 15 + Math.random() * 45
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      if (Math.random() < 0.8) {
        // Teal #00cccc (80%)
        colors[i * 3] = 0
        colors[i * 3 + 1] = 0.8
        colors[i * 3 + 2] = 0.8
      } else {
        // Gold #F8F32B (20%)
        colors[i * 3] = 0.973
        colors[i * 3 + 1] = 0.953
        colors[i * 3 + 2] = 0.169
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    return geo
  }, [count])

  // 매우 느린 전체 회전 (우주 유영 느낌)
  useFrame((_, delta) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y += delta * 0.01
    pointsRef.current.rotation.x += delta * 0.003
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={2.5}
        vertexColors
        sizeAttenuation={false}
        transparent
        opacity={0.9}
        depthWrite={false}
        fog={false}
      />
    </points>
  )
}
