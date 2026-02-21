"use client";

// 원석 3D 오브젝트 — 하이브리드 방식
// Blender 지오메트리(유기적 형태) + Three.js 머티리얼(flatShading 각진 면)
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { type BufferGeometry } from "three";
import type { Group, Mesh } from "three";

export default function RawStone() {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF("/models/raw-stone.glb");

  // Blender 모델에서 지오메트리만 추출
  const geometry = useMemo(() => {
    let geo: BufferGeometry | null = null;
    scene.traverse((child) => {
      if ((child as Mesh).isMesh && !geo) {
        geo = (child as Mesh).geometry.clone();
      }
    });
    return geo;
  }, [scene]);

  // 느린 자전 애니메이션
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.08;
    groupRef.current.rotation.x += delta * 0.015;
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry ?? undefined} castShadow scale={1.6}>
        {/* 폴백: GLB 로드 실패 시 기본 다면체 */}
        {!geometry && <icosahedronGeometry args={[1.6, 1]} />}
        <meshPhysicalMaterial
          color="#8D99AE"
          roughness={0.6}
          metalness={0.15}
          clearcoat={0.4}
          clearcoatRoughness={0.2}
          emissive="#2a2a4e"
          emissiveIntensity={0.2}
          flatShading={true}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/raw-stone.glb");
