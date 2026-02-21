"use client";

// 원석 3D 씬 — 블랙 우주 공간에 원석이 떠있는 느낌
// Environment night 반사맵 + 키/필/림/앰비언트 4점 조명
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import RawStone from "./RawStone";

export default function StoneScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.5, 6], fov: 55 }}
      gl={{ alpha: true }}
      style={{ background: "transparent" }}
    >
      {/* 환경맵 — night preset으로 우주 감성 반사 */}
      <Environment preset="night" />

      {/* 앰비언트 — 낮은 기본 조도 */}
      <ambientLight intensity={0.3} color="#aabbcc" />

      {/* 키 라이트 — 우상단 백색 강한 조명 */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={2.0}
        color="#ffffff"
        castShadow
      />

      {/* 필 라이트 — 좌하단 블루 약한 보조 조명 */}
      <directionalLight
        position={[-4, -2, -3]}
        intensity={0.6}
        color="#4a6fa5"
      />

      {/* 림 라이트 — 후방 윤곽 강조 */}
      <directionalLight
        position={[0, 2, -6]}
        intensity={1.2}
        color="#6677aa"
      />

      {/* 원석 */}
      <RawStone />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  );
}
