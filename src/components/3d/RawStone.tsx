"use client";

// 원석 3D 오브젝트 — Igloo 레퍼런스: 로우폴리 각진 돌 형태, 그레이 (#8D99AE)
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

export default function RawStone() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.08;
    meshRef.current.rotation.x += delta * 0.02;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
      {/* detail=1 → 로우폴리 각진 원석 형태 */}
      <icosahedronGeometry args={[1.6, 1]} />
      <meshStandardMaterial
        color="#8D99AE"
        roughness={0.85}
        metalness={0.05}
        flatShading={true}
      />
    </mesh>
  );
}
