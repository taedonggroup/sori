"use client"

// 원석 B — 균열 원석 (각성 중 상태)
// 레퍼런스: IMG_9790.PNG — 금빛 균열 맥 + 청록/보라 이리데슨트 발광
// GLB: /models/stone-b.glb (원석 A와 동일 형태, 다른 머티리얼)
// 시각 효과: Voronoi GLSL 셰이더로 금빛 균열 + Fresnel 이리데슨트
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { useSceneStore, type SceneName } from "@/store/sceneStore"

const EMISSIVE_BY_SCENE: Record<SceneName, number> = {
  stone:     0.35,
  fragments: 1.0,
  upload:    0.55,
  gallery:   0.48,
  profile:   1.2,
}

// ─── Vertex Shader ────────────────────────────────────────────
const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

// ─── Fragment Shader ──────────────────────────────────────────
// Voronoi 엣지 거리 → 금빛 균열 맥
// Fresnel 각도   → 청록/보라 이리데슨트
// 높이 기반      → 상단=어두운 회색, 하단=청보라 내부 발광
const fragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  uniform float uTime;
  uniform float uEmissive;

  vec2 hash22(vec2 p) {
    p = fract(p * vec2(443.897, 441.423));
    p += dot(p, p + 19.19);
    return fract(vec2(p.x * p.y, p.x + p.y));
  }

  // Voronoi 엣지 거리 (균열 맥 패턴)
  float voronoiEdge(vec2 p) {
    vec2 ip = floor(p);
    vec2 fp = fract(p);
    float d1 = 10.0, d2 = 10.0;

    for (int x = -1; x <= 1; x++) {
      for (int y = -1; y <= 1; y++) {
        vec2 n    = vec2(float(x), float(y));
        vec2 cell = hash22(ip + n);
        // 시간에 따라 균열이 매우 천천히 움직임
        cell = 0.5 + 0.45 * sin(uTime * 0.12 + 6.28318 * cell);
        vec2 diff = n + cell - fp;
        float d = length(diff);
        if (d < d1) { d2 = d1; d1 = d; }
        else if (d < d2) { d2 = d; }
      }
    }
    return d2 - d1;
  }

  void main() {
    // 두 방향 Voronoi 겹침 → 불규칙 균열 패턴
    vec2 uv1 = vWorldPos.xz * 1.9;
    vec2 uv2 = vWorldPos.xy * 1.4 + vec2(0.31, 0.73);
    float vein     = min(voronoiEdge(uv1), voronoiEdge(uv2));
    float veinMask = 1.0 - smoothstep(0.0, 0.085, vein);

    // Fresnel: 시야각에 따라 색상 변환
    float fresnel = pow(
      1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0),
      3.2
    );

    // 팔레트
    vec3 darkGrey = vec3(0.055, 0.055, 0.075);
    vec3 teal     = vec3(0.0,   0.72,  0.76);
    vec3 purple   = vec3(0.52,  0.0,   0.88);
    vec3 gold     = vec3(0.95,  0.62,  0.09);

    // 높이 기반 색상 (상단=어두움, 하단=청보라)
    float heightT = clamp(vWorldPos.y * 0.52 + 0.52, 0.0, 1.0);
    float angle   = atan(vWorldPos.z, vWorldPos.x) * 0.15915 + 0.5;

    vec3 innerColor = mix(teal, purple, angle);
    vec3 baseColor  = mix(innerColor, darkGrey, pow(heightT, 0.52) * 0.93);

    // Fresnel 이리데슨트 오버레이
    baseColor = mix(baseColor, mix(teal, purple, 1.0 - fresnel), fresnel * 0.68);

    // 금빛 균열 합성
    vec3 finalColor = mix(baseColor, gold, veinMask * 0.9);

    // 내부 발광 (emissive glow)
    vec3 glowColor = mix(purple * 0.55, teal * 0.65, 1.0 - heightT);
    finalColor += glowColor * uEmissive * (0.55 + 0.45 * (1.0 - veinMask));

    gl_FragColor = vec4(finalColor, 1.0);
  }
`

export default function StoneB() {
  const meshRef = useRef<THREE.Mesh>(null)
  const scene = useSceneStore((s) => s.scene)
  const currentEmissive = useRef(EMISSIVE_BY_SCENE.stone)

  const { scene: gltfScene } = useGLTF("/models/stone-b.glb")

  const geometry = useMemo(() => {
    let geo: THREE.BufferGeometry | null = null
    gltfScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && !geo) {
        geo = (child as THREE.Mesh).geometry
      }
    })
    return geo
  }, [gltfScene])

  // uniforms은 한 번만 생성 (리렌더마다 새 객체 방지)
  const uniforms = useMemo(
    () => ({
      uTime:     { value: 0 },
      uEmissive: { value: EMISSIVE_BY_SCENE.stone },
    }),
    []
  )

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return
    const speed = Math.min(delta * 1.5, 0.1)
    currentEmissive.current = THREE.MathUtils.lerp(
      currentEmissive.current,
      EMISSIVE_BY_SCENE[scene],
      speed
    )
    uniforms.uTime.value     = clock.getElapsedTime()
    uniforms.uEmissive.value = currentEmissive.current
  })

  return (
    <mesh ref={meshRef} geometry={geometry ?? undefined} castShadow receiveShadow>
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
