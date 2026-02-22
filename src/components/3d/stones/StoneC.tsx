"use client"

// 원석 C — 크리스탈 클러스터 (완전각성)
// GLB: stone-c.glb (Blender 베이크: 우주 발광 emit 텍스처 내장, 5결정 + 베이스)
// 머티리얼: GLB 내장 텍스처 + emissive 강도 보간
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { useSceneStore, type SceneName } from "@/store/sceneStore"

const EMISSIVE_BY_SCENE: Record<SceneName, number> = {
  stone: 1.5, fragments: 4.0, upload: 2.2, gallery: 2.0, profile: 5.0,
}

export default function StoneC() {
  const groupRef = useRef<THREE.Group>(null)
  const scene    = useSceneStore((s) => s.scene)
  const currentEmissive = useRef(EMISSIVE_BY_SCENE.stone)

  const { scene: gltfScene } = useGLTF("/models/stone-c.glb")

  useFrame((_, delta) => {
    const speed = Math.min(delta * 1.5, 0.1)
    currentEmissive.current = THREE.MathUtils.lerp(
      currentEmissive.current, EMISSIVE_BY_SCENE[scene], speed
    )
    groupRef.current?.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh) return
      const mat = mesh.material as THREE.MeshStandardMaterial
      if (mat?.emissive) mat.emissiveIntensity = currentEmissive.current
    })
  })

  return (
    <group ref={groupRef}>
      <primitive object={gltfScene} />
    </group>
  )
}

useGLTF.preload("/models/stone-c.glb")
