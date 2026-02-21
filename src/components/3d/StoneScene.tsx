"use client";

// 원석 3D 씬 — Igloo 레퍼런스: 안개 낀 산악 지형, 모노크롬 그레이
// FogExp2 + Ground + 원석 오브젝트 + 조명 구성
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import RawStone from "./RawStone";

// 안개 색상 = 배경색과 동일하게 맞춰 자연스러운 소실 표현
const FOG_COLOR = "#b8c4cc";
const BG_COLOR = "#b8c4cc";

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial color="#9aa5b4" roughness={1} />
    </mesh>
  );
}

function MountainSilhouette({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <coneGeometry args={[3, 6, 6]} />
      <meshStandardMaterial color="#8a95a3" roughness={1} flatShading />
    </mesh>
  );
}

export default function StoneScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.5, 6], fov: 55 }}
      style={{ background: BG_COLOR }}
    >
      {/* 안개 — 원거리 오브젝트 소실, Igloo 핵심 기법 */}
      <fog attach="fog" args={[FOG_COLOR, 8, 22]} />

      {/* 조명 */}
      <ambientLight intensity={1.2} color="#d4dde6" />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.5}
        color="#ffffff"
        castShadow
      />
      <directionalLight position={[-4, 3, -3]} intensity={0.4} color="#ccd5de" />

      {/* 원석 */}
      <RawStone />

      {/* 지형 */}
      <Ground />

      {/* 산악 실루엣 — 안개에 소실되는 원경 */}
      <MountainSilhouette position={[-12, 1, -15]} />
      <MountainSilhouette position={[10, 0.5, -18]} />
      <MountainSilhouette position={[-6, 2, -20]} />
      <MountainSilhouette position={[18, 1, -16]} />
      <MountainSilhouette position={[0, 3, -25]} />

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
