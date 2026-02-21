"use client";

// 원석 3D 오브젝트 — 블랙 우주 공간에 떠있는 유기적 돌 형태
// IcosahedronGeometry detail 2 + noise displacement + MeshPhysicalMaterial
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { IcosahedronGeometry, type Mesh } from "three";

// 간단한 3D noise 함수 (Math.sin/cos 조합)
function simpleNoise(x: number, y: number, z: number): number {
  const n1 = Math.sin(x * 1.2 + y * 0.9) * Math.cos(z * 1.1 + x * 0.8);
  const n2 = Math.sin(y * 1.5 + z * 0.7) * Math.cos(x * 1.3 + z * 0.6);
  const n3 = Math.sin(z * 1.0 + x * 1.1) * Math.cos(y * 0.9 + x * 0.5);
  return (n1 + n2 + n3) / 3;
}

export default function RawStone() {
  const meshRef = useRef<Mesh>(null);

  // 정점에 noise displacement를 적용한 유기적 원석 지오메트리
  const geometry = useMemo(() => {
    const geo = new IcosahedronGeometry(1.6, 2);
    const positions = geo.attributes.position;
    const vertex = { x: 0, y: 0, z: 0 };

    for (let i = 0; i < positions.count; i++) {
      vertex.x = positions.getX(i);
      vertex.y = positions.getY(i);
      vertex.z = positions.getZ(i);

      // 정점 방향 벡터의 길이
      const length = Math.sqrt(
        vertex.x * vertex.x + vertex.y * vertex.y + vertex.z * vertex.z
      );

      // noise 기반 displacement (0.85 ~ 1.15 범위)
      const noiseValue = simpleNoise(vertex.x * 2, vertex.y * 2, vertex.z * 2);
      const displacement = 1 + noiseValue * 0.15;

      // 정점을 방향 벡터를 따라 displacement 적용
      const scale = (displacement * 1.6) / length;
      positions.setXYZ(i, vertex.x * scale, vertex.y * scale, vertex.z * scale);
    }

    positions.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);

  // 느린 자전 애니메이션
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.08;
    meshRef.current.rotation.x += delta * 0.02;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow>
      <meshPhysicalMaterial
        color="#8D99AE"
        roughness={0.6}
        metalness={0.15}
        clearcoat={0.4}
        emissive="#2a2a4e"
        emissiveIntensity={0.2}
        flatShading={true}
      />
    </mesh>
  );
}
