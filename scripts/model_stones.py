"""
SORI 원석 3종 Blender 자동 모델링 스크립트
실행: blender --background --python scripts/model_stones.py

원석 A — 검은 현무암 (미각성)   → public/models/stone-a.glb
원석 B — 균열 원석 (각성 중)    → public/models/stone-b.glb  [StoneB ShaderMaterial용 동일 형태]
원석 C — 크리스탈 클러스터 (완전각성) → public/models/stone-c.glb
"""

import bpy
import bmesh
import math
import random

OUTPUT_DIR = "/Users/seungmin/Desktop/SORI/public/models"


# ─────────────────────────────────────────────────────────────
#  공통 유틸리티
# ─────────────────────────────────────────────────────────────

def clear_scene():
    """씬 전체 초기화"""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    for mat in list(bpy.data.materials):
        bpy.data.materials.remove(mat)


def perturb_vertices(obj, strength: float = 0.20, seed: int = 42):
    """버텍스를 랜덤 변위시켜 자연스러운 바위 실루엣 생성"""
    rng = random.Random(seed)
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bm.verts.ensure_lookup_table()
    for v in bm.verts:
        v.co.x += rng.uniform(-strength,        strength)
        v.co.y += rng.uniform(-strength,        strength)
        v.co.z += rng.uniform(-strength * 0.7,  strength * 0.7)
    bm.to_mesh(obj.data)
    bm.free()
    obj.data.update()


def apply_modifier(obj, mod_name: str):
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier=mod_name)


def decimate(obj, ratio: float):
    mod = obj.modifiers.new("Decimate", 'DECIMATE')
    mod.ratio = ratio
    apply_modifier(obj, "Decimate")


def flat_shading(obj):
    for poly in obj.data.polygons:
        poly.use_smooth = False
    obj.data.update()


def smooth_shading(obj):
    for poly in obj.data.polygons:
        poly.use_smooth = True
    obj.data.update()


def make_material(name: str,
                  base_color: tuple,
                  roughness: float = 0.9,
                  metallic: float = 0.05,
                  transmission: float = 0.0,
                  ior: float = 1.5,
                  emission_color: tuple | None = None,
                  emission_strength: float = 0.0) -> bpy.types.Material:
    """Principled BSDF PBR 머티리얼 생성 (Blender 4/5 호환)"""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    out  = nodes.new("ShaderNodeOutputMaterial")
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])

    bsdf.inputs["Base Color"].default_value = (*base_color, 1.0)
    bsdf.inputs["Roughness"].default_value  = roughness
    bsdf.inputs["Metallic"].default_value   = metallic

    # Transmission (Blender 4.0+ = "Transmission Weight", 이전 = "Transmission")
    for key in ("Transmission Weight", "Transmission"):
        if key in bsdf.inputs:
            bsdf.inputs[key].default_value = transmission
            break

    if "IOR" in bsdf.inputs:
        bsdf.inputs["IOR"].default_value = ior

    # Emission (Blender 4.0+ 분리형, 이전 단일형 모두 지원)
    if emission_color:
        if "Emission Color" in bsdf.inputs:
            bsdf.inputs["Emission Color"].default_value    = (*emission_color, 1.0)
            bsdf.inputs["Emission Strength"].default_value = emission_strength
        elif "Emission" in bsdf.inputs:
            scaled = tuple(c * emission_strength for c in emission_color)
            bsdf.inputs["Emission"].default_value = (*scaled, 1.0)

    return mat


def export_glb(objects: list, filepath: str):
    """지정 오브젝트들을 GLB로 내보내기"""
    bpy.ops.object.select_all(action='DESELECT')
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]

    bpy.ops.export_scene.gltf(
        filepath=filepath,
        export_format='GLB',
        use_selection=True,
        export_materials='EXPORT',
        export_normals=True,
    )
    print(f"  ✓ 내보내기 완료: {filepath}")


# ─────────────────────────────────────────────────────────────
#  원석 A — 검은 현무암 (IMG_9789 기반)
#  특징: 무광 패싯, 흑요석 질감, 약간 납작한 다면체
# ─────────────────────────────────────────────────────────────

def build_stone_a():
    print("\n[1/3] 원석 A — 검은 현무암 모델링 중...")
    clear_scene()

    # 기반 구체 (subdivisions=3 → 320 faces)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, radius=1.2, location=(0, 0, 0))
    obj = bpy.context.active_object
    obj.name = "StoneA"

    # 약간 납작하게 (이미지 원석은 세로로 조금 짧음)
    obj.scale = (1.0, 0.88, 0.93)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    # 버텍스 랜덤 변위 → 자연스러운 바위 실루엣
    perturb_vertices(obj, strength=0.24, seed=42)

    # Decimate → 저폴리 패싯 바위 느낌 (ratio 0.35 → ~110 faces)
    decimate(obj, ratio=0.35)

    # Flat shading (패싯 강조)
    flat_shading(obj)

    # 머티리얼: 흑요석/현무암 (극도 무광, 매우 어둡게)
    mat = make_material(
        "StoneA_Mat",
        base_color=(0.045, 0.045, 0.060),
        roughness=0.96,
        metallic=0.07,
    )
    obj.data.materials.append(mat)

    export_glb([obj], f"{OUTPUT_DIR}/stone-a.glb")


# ─────────────────────────────────────────────────────────────
#  원석 B — 균열 원석 (IMG_9790 기반)
#  특징: 원석 A와 동일 형태, 중간 밝기 머티리얼
#  → Three.js ShaderMaterial이 금빛 균열+이리데슨트 효과 담당
# ─────────────────────────────────────────────────────────────

def build_stone_b():
    print("\n[2/3] 원석 B — 균열 원석 모델링 중...")
    clear_scene()

    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, radius=1.2, location=(0, 0, 0))
    obj = bpy.context.active_object
    obj.name = "StoneB"

    obj.scale = (1.0, 0.88, 0.93)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    # 동일 seed → 원석 A와 같은 실루엣 (이미지 속 같은 돌)
    perturb_vertices(obj, strength=0.24, seed=42)
    decimate(obj, ratio=0.35)
    flat_shading(obj)

    mat = make_material(
        "StoneB_Mat",
        base_color=(0.08, 0.08, 0.10),
        roughness=0.65,
        metallic=0.15,
    )
    obj.data.materials.append(mat)

    export_glb([obj], f"{OUTPUT_DIR}/stone-b.glb")


# ─────────────────────────────────────────────────────────────
#  원석 C — 크리스탈 클러스터 (TalkMedia 기반)
#  특징: 중앙 큰 수정 + 소형 결정들 + 암석 베이스
# ─────────────────────────────────────────────────────────────

def build_stone_c():
    print("\n[3/3] 원석 C — 크리스탈 클러스터 모델링 중...")
    clear_scene()

    crystals = []

    # ── 주 결정 (7면 원뿔, 살짝 기울어짐)
    bpy.ops.mesh.primitive_cone_add(
        vertices=7, radius1=1.05, radius2=0.0, depth=2.7,
        location=(0.0, 0.0, 1.35),
        rotation=(math.radians(4), math.radians(3), math.radians(18))
    )
    c_main = bpy.context.active_object
    c_main.name = "Crystal_Main"
    flat_shading(c_main)
    c_main.data.materials.append(make_material(
        "Crystal_Main",
        base_color=(0.88, 0.86, 1.0),
        roughness=0.04, metallic=0.0,
        transmission=0.88, ior=1.75,
        emission_color=(0.12, 0.02, 0.55), emission_strength=0.9,
    ))
    crystals.append(c_main)

    # ── 보조 결정 A (오른쪽, 6면)
    bpy.ops.mesh.primitive_cone_add(
        vertices=6, radius1=0.60, radius2=0.0, depth=1.75,
        location=(0.85, 0.20, 0.88),
        rotation=(math.radians(18), math.radians(2), math.radians(-12))
    )
    c2 = bpy.context.active_object
    c2.name = "Crystal_A"
    flat_shading(c2)
    c2.data.materials.append(make_material(
        "Crystal_A",
        base_color=(0.85, 0.82, 1.0),
        roughness=0.05, metallic=0.0,
        transmission=0.85, ior=1.73,
        emission_color=(0.08, 0.02, 0.52), emission_strength=0.75,
    ))
    crystals.append(c2)

    # ── 보조 결정 B (왼쪽, 6면)
    bpy.ops.mesh.primitive_cone_add(
        vertices=6, radius1=0.50, radius2=0.0, depth=1.45,
        location=(-0.75, -0.10, 0.73),
        rotation=(math.radians(-16), math.radians(6), math.radians(10))
    )
    c3 = bpy.context.active_object
    c3.name = "Crystal_B"
    flat_shading(c3)
    c3.data.materials.append(make_material(
        "Crystal_B",
        base_color=(0.82, 0.86, 1.0),
        roughness=0.05, metallic=0.0,
        transmission=0.84, ior=1.72,
        emission_color=(0.05, 0.15, 0.65), emission_strength=0.75,
    ))
    crystals.append(c3)

    # ── 소형 결정 C (앞-오른쪽, 5면)
    bpy.ops.mesh.primitive_cone_add(
        vertices=5, radius1=0.35, radius2=0.0, depth=0.95,
        location=(0.32, -0.72, 0.48),
        rotation=(math.radians(22), math.radians(0), math.radians(8))
    )
    c4 = bpy.context.active_object
    c4.name = "Crystal_C"
    flat_shading(c4)
    c4.data.materials.append(make_material(
        "Crystal_C",
        base_color=(0.86, 0.88, 1.0),
        roughness=0.06, metallic=0.0,
        transmission=0.82, ior=1.70,
        emission_color=(0.10, 0.10, 0.60), emission_strength=0.6,
    ))
    crystals.append(c4)

    # ── 소형 결정 D (뒤-왼쪽, 5면)
    bpy.ops.mesh.primitive_cone_add(
        vertices=5, radius1=0.26, radius2=0.0, depth=0.72,
        location=(-0.40, -0.60, 0.36),
        rotation=(math.radians(-20), math.radians(5), math.radians(-6))
    )
    c5 = bpy.context.active_object
    c5.name = "Crystal_D"
    flat_shading(c5)
    c5.data.materials.append(make_material(
        "Crystal_D",
        base_color=(0.84, 0.86, 1.0),
        roughness=0.06, metallic=0.0,
        transmission=0.82, ior=1.70,
        emission_color=(0.12, 0.05, 0.58), emission_strength=0.55,
    ))
    crystals.append(c5)

    # ── 암석 베이스 (납작한 이코스피어 + 변위)
    bpy.ops.mesh.primitive_ico_sphere_add(
        subdivisions=2, radius=0.90, location=(0.0, 0.0, -0.40)
    )
    base = bpy.context.active_object
    base.name = "Crystal_Base"
    base.scale.z = 0.36
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    perturb_vertices(base, strength=0.18, seed=77)
    flat_shading(base)
    base.data.materials.append(make_material(
        "Crystal_Base",
        base_color=(0.055, 0.035, 0.075),
        roughness=0.93, metallic=0.05,
        emission_color=(0.08, 0.0, 0.25), emission_strength=0.3,
    ))
    crystals.append(base)

    export_glb(crystals, f"{OUTPUT_DIR}/stone-c.glb")


# ─────────────────────────────────────────────────────────────
#  실행
# ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 50)
    print("  SORI 원석 3종 자동 모델링 시작")
    print("=" * 50)

    build_stone_a()
    build_stone_b()
    build_stone_c()

    print("\n" + "=" * 50)
    print("  모든 GLB 파일 생성 완료")
    print(f"  저장 위치: {OUTPUT_DIR}/")
    print("   stone-a.glb  stone-b.glb  stone-c.glb")
    print("=" * 50)
