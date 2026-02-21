"use client"

// 조각 탐색 씬 전용 — Teal 발광 구체 파티클
// fragments 씬에서만 렌더링 (SoriCanvas에서 조건부 마운트)
import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface FragmentParticlesProps {
  count?: number
}

interface ParticleData {
  position: [number, number, number]
  phase: number
  speed: number
}

export default function FragmentParticles({ count = 60 }: FragmentParticlesProps) {
  const groupRef = useRef<THREE.Group>(null)

  const particles = useMemo<ParticleData[]>(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 12, // x: -6..6
        (Math.random() - 0.5) * 6,  // y: -3..3
        Math.random() * 12 - 10,    // z: -10..2
      ] as [number, number, number],
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5,
    }))
  }, [count])

  // 각 구체 독립 pulse 애니메이션
  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.children.forEach((child, i) => {
      if (!(child instanceof THREE.Mesh)) return
      const particle = particles[i]
      if (!particle) return
      const mat = child.material as THREE.MeshStandardMaterial
      const t = state.clock.elapsedTime * particle.speed + particle.phase
      mat.emissiveIntensity = 0.3 + Math.abs(Math.sin(t)) * 0.6
    })
  })

  return (
    <group ref={groupRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial
            color="#00cccc"
            emissive="#00cccc"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}
