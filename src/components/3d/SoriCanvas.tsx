"use client"

// 단일 Three.js 캔버스 — 전체 앱에서 항상 마운트 유지
// layout.tsx에 고정 배치 (z-index: 0 배경)
import { Canvas } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import { useSceneStore } from "@/store/sceneStore"
import Starfield from "./Starfield"
import StoneObject from "./StoneObject"
import CameraController from "./CameraController"
import FragmentParticles from "./FragmentParticles"
import UploadOrb from "./UploadOrb"

export default function SoriCanvas() {
  const scene = useSceneStore((s) => s.scene)

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 6], fov: 55 }}
        gl={{ alpha: false, antialias: true }}
        style={{ background: "#000000" }}
      >
        {/* 이글루 레퍼런스: 깊이감 안개 — 별자리에 영향 없이 원거리만 */}
        <fog attach="fog" args={["#000005", 40, 200]} />

        {/* 환경맵 — night preset으로 우주 반사 */}
        <Environment preset="night" />

        {/* 조명 4점 */}
        <ambientLight intensity={0.3} color="#aabbcc" />
        <directionalLight position={[5, 8, 5]} intensity={2.0} color="#ffffff" castShadow />
        <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#4a6fa5" />
        <directionalLight position={[0, 2, -6]} intensity={1.2} color="#6677aa" />

        {/* 파티클 별자리 (항상 표시) */}
        <Starfield count={2000} />

        {/* 원석 (항상 표시, 씬별 크기/위치 변화) */}
        <StoneObject />

        {/* 카메라 보간 컨트롤러 */}
        <CameraController />

        {/* 조각 공간 전용 파티클 */}
        {scene === "fragments" && <FragmentParticles count={60} />}

        {/* 업로드 씬 전용 발광 구체 */}
        {scene === "upload" && <UploadOrb />}
      </Canvas>
    </div>
  )
}
