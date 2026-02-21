"use client"

// 원석 3D 오브젝트 — 씬 상태별 위치/크기/발광 반응
// 레퍼런스: VibrantWellness(transmission 발광) + 인체의신비(emissive 트랜지션)
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { useSceneStore, type SceneName } from "@/store/sceneStore"

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

const STONE_EMISSIVE: Record<SceneName, number> = {
  stone:     0.25,
  fragments: 0.8,
  upload:    0.4,
  gallery:   0.4,
  profile:   0.9,
}

export default function StoneObject() {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const scene = useSceneStore((s) => s.scene)

  const { scene: gltfScene } = useGLTF("/models/raw-stone.glb")

  // Blender 모델에서 지오메트리만 추출
  const geometry = useMemo(() => {
    let geo: THREE.BufferGeometry | null = null
    gltfScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && !geo) {
        geo = (child as THREE.Mesh).geometry.clone()
      }
    })
    return geo
  }, [gltfScene])

  // 현재 보간 중인 값들
  const currentPos = useRef(new THREE.Vector3(0, 0, 0))
  const currentScale = useRef(1)
  const currentEmissive = useRef(0.25)

  useFrame((_, delta) => {
    if (!groupRef.current || !meshRef.current) return

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

    // 발광 강도 보간
    const mat = meshRef.current.material as THREE.MeshPhysicalMaterial
    currentEmissive.current = THREE.MathUtils.lerp(
      currentEmissive.current,
      STONE_EMISSIVE[scene],
      lerpSpeed
    )
    mat.emissiveIntensity = currentEmissive.current

    // 느린 자전 애니메이션
    groupRef.current.rotation.y += delta * 0.08
    groupRef.current.rotation.x += delta * 0.015
  })

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} geometry={geometry ?? undefined} castShadow>
        {/* 폴백: GLB 로드 실패 시 기본 다면체 */}
        {!geometry && <icosahedronGeometry args={[1.6, 1]} />}
        <meshPhysicalMaterial
          color="#8D99AE"
          roughness={0.6}
          metalness={0.15}
          clearcoat={0.4}
          clearcoatRoughness={0.2}
          emissive="#2a2a4e"
          emissiveIntensity={0.25}
          flatShading={true}
          transmission={0.05}
          thickness={1.0}
        />
      </mesh>
    </group>
  )
}

useGLTF.preload("/models/raw-stone.glb")
