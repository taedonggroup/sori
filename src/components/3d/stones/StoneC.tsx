"use client"

// 원석 C — 크리스탈 클러스터 (완전각성 상태)
// 레퍼런스: TalkMedia_i_71343ed186ef.png — 뾰족한 수정 군집, 내부 우주 발광
// GLB: /models/stone-c.glb (Blender: 7면 원뿔 × 5 + 암석 베이스)
// 씬 전체를 primitive로 렌더, useFrame에서 emissive 보간
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { useSceneStore, type SceneName } from "@/store/sceneStore"

const EMISSIVE_BY_SCENE: Record<SceneName, number> = {
  stone:     0.5,
  fragments: 1.3,
  upload:    0.7,
  gallery:   0.65,
  profile:   1.6,
}

export default function StoneC() {
  const groupRef = useRef<THREE.Group>(null)
  const scene = useSceneStore((s) => s.scene)
  const currentEmissive = useRef(EMISSIVE_BY_SCENE.stone)

  const { scene: gltfScene } = useGLTF("/models/stone-c.glb")

  useFrame((_, delta) => {
    const speed = Math.min(delta * 1.5, 0.1)
    currentEmissive.current = THREE.MathUtils.lerp(
      currentEmissive.current,
      EMISSIVE_BY_SCENE[scene],
      speed
    )

    // GLB의 모든 메시 머티리얼 emissive 보간
    if (groupRef.current) {
      groupRef.current.traverse((child) => {
        const mesh = child as THREE.Mesh
        if (!mesh.isMesh) return
        const mat = mesh.material as THREE.MeshStandardMaterial
        if (mat?.emissive) {
          mat.emissiveIntensity = currentEmissive.current
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      {/* GLB 씬 전체 렌더 (결정 5개 + 베이스 1개) */}
      <primitive object={gltfScene} />
    </group>
  )
}

useGLTF.preload("/models/stone-c.glb")
