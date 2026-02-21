"use client";

// 원석 3D 오브젝트 — Blender 생성 GLB 모델 로드
// 962정점, PBR 머티리얼 (Noise Roughness + Bump Map 포함)
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { Mesh, Group } from "three";

export default function RawStone() {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF("/models/raw-stone.glb");

  // 느린 자전 애니메이션
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.08;
    groupRef.current.rotation.x += delta * 0.015;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene.clone(true)} castShadow scale={1.6} />
    </group>
  );
}

// GLB 프리로드
useGLTF.preload("/models/raw-stone.glb");
