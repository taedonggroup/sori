"use client"

// 원석 B — 금빛 균열 + 청보라 이리데슨트 (각성 중)
// GLB: stone-b.glb (Blender 베이크: Voronoi 금맥 albedo + 발광 emit 텍스처 내장)
// 시각 효과: GLB 텍스처 기반 + Fresnel 이리데슨트 셰이더 오버레이
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { useSceneStore, type SceneName } from "@/store/sceneStore"

const EMISSIVE_BY_SCENE: Record<SceneName, number> = {
  stone: 1.2, fragments: 3.5, upload: 2.0, gallery: 1.8, profile: 4.5,
}

// 이리데슨트 Fresnel 셰이더 — GLB 텍스처 위에 오버레이
const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vWorldPos;

  void main() {
    vNormal   = normalize(normalMatrix * normal);
    vUv       = uv;
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vWorldPos;

  uniform sampler2D uAlbedo;
  uniform sampler2D uEmit;
  uniform float     uEmissive;
  uniform float     uTime;

  // 미세 Fresnel 이리데슨트 (시야각 기반)
  vec3 fresnel_irid(vec3 norm) {
    float f = pow(1.0 - abs(dot(norm, vec3(0.0, 0.0, 1.0))), 3.5);
    vec3 teal   = vec3(0.0, 0.80, 0.85);
    vec3 purple = vec3(0.55, 0.0, 0.92);
    return mix(teal, purple, sin(f * 6.28 + uTime * 0.4) * 0.5 + 0.5) * f * 0.55;
  }

  void main() {
    vec4 alb  = texture2D(uAlbedo, vUv);
    vec4 emit = texture2D(uEmit,   vUv);

    vec3 col = alb.rgb;
    col += fresnel_irid(normalize(vNormal));       // 이리데슨트 오버레이
    col += emit.rgb * uEmissive;                   // 발광 텍스처 × 강도

    gl_FragColor = vec4(col, 1.0);
  }
`

export default function StoneB() {
  const groupRef = useRef<THREE.Group>(null)
  const scene    = useSceneStore((s) => s.scene)
  const currentEmissive = useRef(EMISSIVE_BY_SCENE.stone)

  const { scene: gltfScene } = useGLTF("/models/stone-b.glb")

  // GLB에서 geometry와 베이크 텍스처 추출
  const { geometry, albedoTex, emitTex } = useMemo(() => {
    let geometry: THREE.BufferGeometry | null = null
    let albedoTex: THREE.Texture | null       = null
    let emitTex: THREE.Texture | null         = null

    gltfScene.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh || geometry) return
      geometry = mesh.geometry
      const mat = mesh.material as THREE.MeshStandardMaterial
      albedoTex = mat.map            ?? null
      emitTex   = mat.emissiveMap    ?? null
    })
    return { geometry, albedoTex, emitTex }
  }, [gltfScene])

  const uniforms = useMemo(() => ({
    uAlbedo:   { value: albedoTex },
    uEmit:     { value: emitTex  },
    uEmissive: { value: EMISSIVE_BY_SCENE.stone },
    uTime:     { value: 0 },
  }), [albedoTex, emitTex])

  useFrame(({ clock }, delta) => {
    const speed = Math.min(delta * 1.5, 0.1)
    currentEmissive.current = THREE.MathUtils.lerp(
      currentEmissive.current, EMISSIVE_BY_SCENE[scene], speed
    )
    uniforms.uEmissive.value = currentEmissive.current
    uniforms.uTime.value     = clock.getElapsedTime()
  })

  return (
    <mesh geometry={geometry ?? undefined} castShadow receiveShadow>
      {!geometry && <icosahedronGeometry args={[1.2, 1]} />}
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

useGLTF.preload("/models/stone-b.glb")
