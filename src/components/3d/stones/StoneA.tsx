"use client"

// 원석 A — 검은 현무암 (미각성 상태)
// 레퍼런스: IMG_9789.PNG — 무광 패싯, 어두운 흑요석 질감
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useSceneStore, type SceneName } from "@/store/sceneStore"

const EMISSIVE_BY_SCENE: Record<SceneName, number> = {
  stone:     0.04,
  fragments: 0.18,
  upload:    0.09,
  gallery:   0.09,
  profile:   0.28,
}

interface StoneAProps {
  geometry: THREE.BufferGeometry | null
}

export default function StoneA({ geometry }: StoneAProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const scene = useSceneStore((s) => s.scene)
  const currentEmissive = useRef(EMISSIVE_BY_SCENE.stone)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const speed = Math.min(delta * 1.5, 0.1)
    currentEmissive.current = THREE.MathUtils.lerp(
      currentEmissive.current,
      EMISSIVE_BY_SCENE[scene],
      speed
    )
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = currentEmissive.current
  })

  return (
    <mesh ref={meshRef} geometry={geometry ?? undefined} castShadow receiveShadow>
      {/* GLB 로드 전 폴백 지오메트리 */}
      {!geometry && <icosahedronGeometry args={[1.6, 1]} />}
      <meshStandardMaterial
        color="#0c0c0f"
        roughness={0.96}
        metalness={0.07}
        emissive="#1e1e22"
        emissiveIntensity={0.04}
        flatShading={true}
      />
    </mesh>
  )
}
