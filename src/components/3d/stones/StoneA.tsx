"use client"

// 원석 A — 검은 현무암 (미각성)
// GLB: stone-a.glb (Blender 베이크 텍스처 내장)
// 머티리얼: GLB 내장 PBR 텍스처 사용 + emissive 보간
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { useSceneStore, type SceneName } from "@/store/sceneStore"

const EMISSIVE_BY_SCENE: Record<SceneName, number> = {
  stone: 0.0, fragments: 0.08, upload: 0.04, gallery: 0.04, profile: 0.14,
}

export default function StoneA() {
  const groupRef = useRef<THREE.Group>(null)
  const scene    = useSceneStore((s) => s.scene)
  const currentEmissive = useRef(0)

  const { scene: gltfScene } = useGLTF("/models/stone-a.glb")

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

useGLTF.preload("/models/stone-a.glb")
