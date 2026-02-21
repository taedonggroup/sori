"use client"

// 카메라 컨트롤러 — 씬별 카메라 위치 부드러운 보간
// 레퍼런스: 비행하는고래 (무중력 유영), 우주/공간 이동
import { useRef, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { useSceneStore, type SceneName } from "@/store/sceneStore"

const CAMERA_CONFIG: Record<SceneName, { position: THREE.Vector3; lookAt: THREE.Vector3 }> = {
  stone:     { position: new THREE.Vector3(0, 1.5, 6),  lookAt: new THREE.Vector3(0, 0, 0) },
  fragments: { position: new THREE.Vector3(0, 0.5, -5), lookAt: new THREE.Vector3(0, 0, -12) },
  upload:    { position: new THREE.Vector3(0, 1, 5),    lookAt: new THREE.Vector3(0, 0, 0) },
  gallery:   { position: new THREE.Vector3(0, 3, 6),    lookAt: new THREE.Vector3(0, 0, 0) },
  profile:   { position: new THREE.Vector3(0, 0.5, 4),  lookAt: new THREE.Vector3(0, 0, 0) },
}

export default function CameraController() {
  const { camera } = useThree()
  const scene = useSceneStore((s) => s.scene)

  const targetPosition = useRef(CAMERA_CONFIG.stone.position.clone())
  const targetLookAt = useRef(CAMERA_CONFIG.stone.lookAt.clone())
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0))

  useEffect(() => {
    const config = CAMERA_CONFIG[scene]
    targetPosition.current.copy(config.position)
    targetLookAt.current.copy(config.lookAt)
  }, [scene])

  useFrame((_, delta) => {
    const lerpSpeed = Math.min(delta * 1.5, 0.1)

    // 카메라 위치 보간
    camera.position.lerp(targetPosition.current, lerpSpeed)

    // LookAt 방향 보간
    currentLookAt.current.lerp(targetLookAt.current, lerpSpeed)
    camera.lookAt(currentLookAt.current)
  })

  return null
}
