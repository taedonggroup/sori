"use client"

// 원석 C — 크리스탈 (완전각성 상태)
// 레퍼런스: TalkMedia_i_71343ed186ef.png — 뾰족한 수정 클러스터, 내부 우주 발광
// 구현: 7면 원뿔 크리스탈 바디 + 거친 암석 베이스, MeshPhysicalMaterial 투과
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
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
  const crystalRef = useRef<THREE.Mesh>(null)
  const glowRef    = useRef<THREE.Mesh>(null)
  const scene = useSceneStore((s) => s.scene)
  const currentEmissive = useRef(EMISSIVE_BY_SCENE.stone)

  useFrame((_, delta) => {
    const speed = Math.min(delta * 1.5, 0.1)
    currentEmissive.current = THREE.MathUtils.lerp(
      currentEmissive.current,
      EMISSIVE_BY_SCENE[scene],
      speed
    )

    // 크리스탈 바디 emissive 보간
    if (crystalRef.current) {
      const mat = crystalRef.current.material as THREE.MeshPhysicalMaterial
      mat.emissiveIntensity = currentEmissive.current
    }

    // 내부 glow mesh — 조금 다른 타이밍으로 펄스
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial
      // 사인파로 은은한 호흡 애니메이션
      const pulse = Math.sin(Date.now() * 0.002) * 0.2 + 0.8
      mat.emissiveIntensity = currentEmissive.current * pulse * 0.7
    }
  })

  return (
    <group>
      {/* ── 크리스탈 포인트 (7면 원뿔 = 수정 첨탑) ── */}
      {/* CylinderGeometry(radiusTop, radiusBottom, height, sides)
          radiusTop=0 → 뾰족한 꼭짓점
          7면으로 자연스러운 불규칙 수정 느낌 */}
      <mesh ref={crystalRef} position={[0, 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0, 1.15, 2.5, 7, 1]} />
        <meshPhysicalMaterial
          color={new THREE.Color(0.88, 0.85, 1.0)}   // 약간 청보라빛 투명
          roughness={0.04}
          metalness={0.0}
          transmission={0.86}                          // 86% 투과 (수정)
          ior={1.75}                                   // 석영 굴절률
          thickness={2.2}                              // 광자 감쇠 두께
          emissive={new THREE.Color(0.12, 0.02, 0.52)} // 내부 보라빛 발광
          emissiveIntensity={0.5}
          clearcoat={1.0}
          clearcoatRoughness={0.04}
          flatShading={true}                           // 패싯 결정 느낌
        />
      </mesh>

      {/* ── 내부 발광 코어 (크리스탈 안쪽 우주빛) ── */}
      {/* 바깥에서 보면 transmission을 통해 보임 */}
      <mesh ref={glowRef} position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.45, 8, 8]} />
        <meshStandardMaterial
          color="#000000"
          emissive={new THREE.Color(0.3, 0.05, 0.9)}  // 밝은 보라-청 glow
          emissiveIntensity={0.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* ── 거친 암석 베이스 (땅에서 막 캐낸 느낌) ── */}
      <mesh position={[0, -1.1, 0]} castShadow>
        <icosahedronGeometry args={[0.72, 0]} />
        <meshStandardMaterial
          color="#17101a"
          roughness={0.94}
          metalness={0.05}
          flatShading={true}
          emissive={new THREE.Color(0.08, 0.0, 0.25)}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* ── 베이스 주변 작은 부속 결정들 ── */}
      <mesh position={[0.65, -0.8, 0.3]} rotation={[0, 0.8, 0.3]} castShadow>
        <cylinderGeometry args={[0, 0.32, 0.85, 6, 1]} />
        <meshPhysicalMaterial
          color={new THREE.Color(0.85, 0.82, 1.0)}
          roughness={0.05}
          transmission={0.82}
          ior={1.72}
          thickness={0.8}
          emissive={new THREE.Color(0.1, 0.0, 0.5)}
          emissiveIntensity={0.4}
          flatShading={true}
        />
      </mesh>

      <mesh position={[-0.55, -0.9, -0.25]} rotation={[0, -0.5, -0.2]} castShadow>
        <cylinderGeometry args={[0, 0.25, 0.7, 6, 1]} />
        <meshPhysicalMaterial
          color={new THREE.Color(0.82, 0.85, 1.0)}
          roughness={0.05}
          transmission={0.84}
          ior={1.72}
          thickness={0.7}
          emissive={new THREE.Color(0.05, 0.15, 0.65)}
          emissiveIntensity={0.4}
          flatShading={true}
        />
      </mesh>
    </group>
  )
}
