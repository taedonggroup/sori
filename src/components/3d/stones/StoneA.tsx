"use client"

// 원석 A — 검은 현무암 (미각성 상태)
// 레퍼런스: IMG_9789.PNG — 무광 패싯, 흑요석/현무암 질감
// GLB: /models/stone-a.glb (Blender: IcoSphere + 버텍스 변위 + Decimate 0.35)
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { useSceneStore, type SceneName } from "@/store/sceneStore"

const EMISSIVE_BY_SCENE: Record<SceneName, number> = {
  stone:     0.04,
  fragments: 0.18,
  upload:    0.09,
  gallery:   0.09,
  profile:   0.28,
}

export default function StoneA() {
  const meshRef = useRef<THREE.Mesh>(null)
  const scene = useSceneStore((s) => s.scene)
  const currentEmissive = useRef(EMISSIVE_BY_SCENE.stone)

  const { scene: gltfScene } = useGLTF("/models/stone-a.glb")

  const geometry = useMemo(() => {
    let geo: THREE.BufferGeometry | null = null
    gltfScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && !geo) {
        geo = (child as THREE.Mesh).geometry
      }
    })
    return geo
  }, [gltfScene])

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
      {!geometry && <icosahedronGeometry args={[1.2, 1]} />}
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

useGLTF.preload("/models/stone-a.glb")
