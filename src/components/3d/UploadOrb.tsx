"use client"

// 업로드 씬 전용 — 중앙 발광 구체
// 레퍼런스: 이글루 안개산악 (고립된 공간 + 빛)
// upload 씬에서만 렌더링 (SoriCanvas에서 조건부 마운트)
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function UploadOrb() {
  const meshRef = useRef<THREE.Mesh>(null)

  // 부드러운 pulse 애니메이션
  useFrame((state) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.MeshPhysicalMaterial
    const t = state.clock.elapsedTime
    mat.emissiveIntensity = 0.2 + Math.abs(Math.sin(t * 1.2)) * 0.3
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshPhysicalMaterial
        color="#003333"
        emissive="#00cccc"
        emissiveIntensity={0.3}
        transmission={0.6}
        thickness={2.0}
        roughness={0.1}
        metalness={0}
        transparent
        opacity={0.7}
      />
    </mesh>
  )
}
