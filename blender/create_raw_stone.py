"""
SORI 원석(Raw Stone) 3D 모델 생성 스크립트
Blender 5.0 Python API — 헤드리스 실행용

출력: public/models/raw-stone.glb (GLTF Binary)
"""

import bpy
import bmesh
import math
import random
import os
import sys

# --- 설정 ---
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "models")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "raw-stone.glb")
SEED = 42

random.seed(SEED)

# --- 씬 초기화 ---
bpy.ops.wm.read_factory_settings(use_empty=True)

# --- 원석 메쉬 생성 ---
bpy.ops.mesh.primitive_ico_sphere_add(
    subdivisions=3,
    radius=1.0,
    location=(0, 0, 0),
)
stone = bpy.context.active_object
stone.name = "RawStone"

# --- BMesh로 정점 변형 (유기적 돌 형태) ---
bm = bmesh.new()
bm.from_mesh(stone.data)

for vert in bm.verts:
    x, y, z = vert.co
    length = math.sqrt(x * x + y * y + z * z)
    if length == 0:
        continue

    # 다중 주파수 noise (저주파 큰 변형 + 고주파 미세 질감)
    # 저주파: 큰 덩어리 형태
    low_freq = (
        math.sin(x * 1.8 + y * 0.7) * math.cos(z * 1.3 + x * 0.5) * 0.18
        + math.sin(y * 2.1 + z * 0.9) * math.cos(x * 1.6) * 0.12
        + math.sin(z * 1.4 + x * 1.2) * math.cos(y * 0.8) * 0.10
    )

    # 중주파: 면의 울퉁불퉁
    mid_freq = (
        math.sin(x * 4.5 + z * 3.2) * math.cos(y * 3.8) * 0.06
        + math.sin(y * 5.1 + x * 2.7) * math.cos(z * 4.0) * 0.04
    )

    # 고주파: 미세 표면 질감
    high_freq = (
        math.sin(x * 9.0 + y * 7.5 + z * 8.0) * 0.015
        + math.cos(x * 12.0 + z * 10.0) * 0.01
    )

    displacement = 1.0 + low_freq + mid_freq + high_freq

    # 방향 벡터를 따라 스케일
    scale = displacement / length
    vert.co.x = x * scale
    vert.co.y = y * scale
    vert.co.z = z * scale

bm.to_mesh(stone.data)
bm.free()

# --- Subdivision Surface 모디파이어 (부드러움 조절) ---
subsurf = stone.modifiers.new(name="Subsurf", type='SUBSURF')
subsurf.levels = 1
subsurf.render_levels = 2
bpy.ops.object.modifier_apply(modifier=subsurf.name)

# --- Smooth Shading + Smooth by Angle 모디파이어 (Blender 5.0) ---
stone.data.shade_smooth()
smooth_mod = stone.modifiers.new(name="SmoothByAngle", type='SMOOTH')
smooth_mod.factor = 1.0
smooth_mod.iterations = 1
bpy.ops.object.modifier_apply(modifier=smooth_mod.name)

# --- PBR 머티리얼 생성 ---
mat = bpy.data.materials.new(name="RawStoneMaterial")
mat.use_nodes = True
nodes = mat.node_tree.nodes
links = mat.node_tree.links

# 기존 노드 정리
for node in nodes:
    nodes.remove(node)

# Principled BSDF
bsdf = nodes.new("ShaderNodeBsdfPrincipled")
bsdf.location = (0, 0)

# Base Color: #8D99AE (BRUCE 지정 컬러)
bsdf.inputs["Base Color"].default_value = (0.306, 0.361, 0.467, 1.0)  # #8D99AE sRGB → linear approx

# Roughness: 돌 질감
bsdf.inputs["Roughness"].default_value = 0.65

# Metallic: 약간의 금속성
bsdf.inputs["Metallic"].default_value = 0.12

# Coat (Clearcoat in Blender 4+)
bsdf.inputs["Coat Weight"].default_value = 0.35
bsdf.inputs["Coat Roughness"].default_value = 0.2

# Emission: 미세한 내부 발광 (#2a2a4e)
bsdf.inputs["Emission Color"].default_value = (0.027, 0.027, 0.059, 1.0)
bsdf.inputs["Emission Strength"].default_value = 0.3

# Material Output
output = nodes.new("ShaderNodeOutputMaterial")
output.location = (300, 0)
links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])

# --- Texture Coordinate + Noise로 러프니스 변화 ---
tex_coord = nodes.new("ShaderNodeTexCoord")
tex_coord.location = (-800, 0)

noise_tex = nodes.new("ShaderNodeTexNoise")
noise_tex.location = (-500, 0)
noise_tex.inputs["Scale"].default_value = 6.0
noise_tex.inputs["Detail"].default_value = 8.0
noise_tex.inputs["Roughness"].default_value = 0.7

# ColorRamp: noise를 roughness 범위(0.5~0.85)로 매핑
ramp = nodes.new("ShaderNodeValToRGB")
ramp.location = (-250, -200)
ramp.color_ramp.elements[0].position = 0.3
ramp.color_ramp.elements[0].color = (0.5, 0.5, 0.5, 1.0)
ramp.color_ramp.elements[1].position = 0.7
ramp.color_ramp.elements[1].color = (0.85, 0.85, 0.85, 1.0)

links.new(tex_coord.outputs["Object"], noise_tex.inputs["Vector"])
links.new(noise_tex.outputs["Fac"], ramp.inputs["Fac"])
links.new(ramp.outputs["Color"], bsdf.inputs["Roughness"])

# --- Bump Map으로 미세 표면 디테일 ---
bump_noise = nodes.new("ShaderNodeTexNoise")
bump_noise.location = (-500, -400)
bump_noise.inputs["Scale"].default_value = 15.0
bump_noise.inputs["Detail"].default_value = 12.0
bump_noise.inputs["Roughness"].default_value = 0.8

bump = nodes.new("ShaderNodeBump")
bump.location = (-200, -400)
bump.inputs["Strength"].default_value = 0.15
bump.inputs["Distance"].default_value = 0.02

links.new(tex_coord.outputs["Object"], bump_noise.inputs["Vector"])
links.new(bump_noise.outputs["Fac"], bump.inputs["Height"])
links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])

# 머티리얼 적용
stone.data.materials.append(mat)

# --- 출력 디렉토리 생성 ---
os.makedirs(OUTPUT_DIR, exist_ok=True)

# --- GLTF Binary (.glb) 내보내기 ---
bpy.ops.export_scene.gltf(
    filepath=OUTPUT_FILE,
    export_format='GLB',
    use_selection=True,
    export_apply=True,
    export_materials='EXPORT',
    export_normals=True,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
)

print(f"\n=== 원석 모델 생성 완료 ===")
print(f"출력: {OUTPUT_FILE}")
print(f"정점 수: {len(stone.data.vertices)}")
print(f"면 수: {len(stone.data.polygons)}")

file_size = os.path.getsize(OUTPUT_FILE)
print(f"파일 크기: {file_size / 1024:.1f} KB")
