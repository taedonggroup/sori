"""
SORI 원석 3종 Blender 텍스처 베이크 모델링
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

문제: Blender 절차적 텍스처는 GLB 내보내기 시 제외됨
해결: numpy로 텍스처 픽셀을 직접 생성 → Blender 이미지에 주입 → GLB 임베드

원석 A — 검은 현무암 (미각성)           → stone-a.glb
원석 B — 금빛 균열 + 청보라 이리데슨트  → stone-b.glb
원석 C — 크리스탈 클러스터 (우주 발광)  → stone-c.glb

실행: blender --background --python scripts/model_stones.py
"""

import bpy
import bmesh
import math
import random
import numpy as np
import os

OUTPUT_DIR = "/Users/seungmin/Desktop/SORI/public/models"
TMP_DIR    = "/tmp/sori_textures"
TEX_SIZE   = 512

os.makedirs(TMP_DIR, exist_ok=True)

# ═══════════════════════════════════════════════════════════
#  공통 유틸리티
# ═══════════════════════════════════════════════════════════

def clear():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    for x in list(bpy.data.materials): bpy.data.materials.remove(x)
    for x in list(bpy.data.images):    bpy.data.images.remove(x)


def perturb(obj, strength=0.22, seed=42):
    rng = random.Random(seed)
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    for v in bm.verts:
        v.co.x += rng.uniform(-strength,       strength)
        v.co.y += rng.uniform(-strength,       strength)
        v.co.z += rng.uniform(-strength * 0.7, strength * 0.7)
    bm.to_mesh(obj.data)
    bm.free()


def decimate(obj, ratio):
    bpy.context.view_layer.objects.active = obj
    m = obj.modifiers.new("Dec", 'DECIMATE')
    m.ratio = ratio
    bpy.ops.object.modifier_apply(modifier="Dec")


def flat(obj):
    for p in obj.data.polygons: p.use_smooth = False
    obj.data.update()


def unwrap(obj):
    """Smart UV Project (헤드리스 호환)"""
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=66, island_margin=0.02)
    bpy.ops.object.mode_set(mode='OBJECT')


def save_png(arr_rgb, filename):
    """numpy float32 RGB (H×W×3) → PNG 파일 저장"""
    path = os.path.join(TMP_DIR, filename)
    size = arr_rgb.shape[0]
    # Blender는 하단-왼쪽 원점 → flipud
    rgba = np.ones((size, size, 4), dtype=np.float32)
    rgba[:, :, :3] = np.flipud(arr_rgb)
    img = bpy.data.images.new(filename.replace('.png',''), size, size, alpha=False)
    img.pixels = rgba.flatten().tolist()
    img.filepath_raw = path
    img.file_format = 'PNG'
    img.save()
    return path, img


def make_pbr_material(obj, name, albedo_img, emit_img=None,
                      roughness=0.85, metallic=0.05,
                      transmission=0.0, ior=1.5,
                      emit_strength=2.0):
    """베이크된 텍스처를 사용하는 Principled BSDF 머티리얼"""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    N = mat.node_tree.nodes
    L = mat.node_tree.links
    N.clear()

    out  = N.new("ShaderNodeOutputMaterial")
    bsdf = N.new("ShaderNodeBsdfPrincipled")
    L.new(bsdf.outputs["BSDF"], out.inputs["Surface"])

    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value  = metallic

    for key in ("Transmission Weight", "Transmission"):
        if key in bsdf.inputs:
            bsdf.inputs[key].default_value = transmission
            break
    if "IOR" in bsdf.inputs:
        bsdf.inputs["IOR"].default_value = ior

    uv = N.new("ShaderNodeTexCoord")

    alb_n = N.new("ShaderNodeTexImage")
    alb_n.image = albedo_img
    L.new(uv.outputs["UV"], alb_n.inputs["Vector"])
    L.new(alb_n.outputs["Color"], bsdf.inputs["Base Color"])

    if emit_img:
        emit_n = N.new("ShaderNodeTexImage")
        emit_n.image = emit_img
        L.new(uv.outputs["UV"], emit_n.inputs["Vector"])
        if "Emission Color" in bsdf.inputs:
            L.new(emit_n.outputs["Color"], bsdf.inputs["Emission Color"])
            bsdf.inputs["Emission Strength"].default_value = emit_strength
        elif "Emission" in bsdf.inputs:
            # Blender 3.x 이전 단일 Emission 입력
            L.new(emit_n.outputs["Color"], bsdf.inputs["Emission"])

    obj.data.materials.append(mat)
    return mat


def export_glb(objects, path):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objects: o.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format='GLB',
        use_selection=True,
        export_materials='EXPORT',
        export_normals=True,
        export_image_format='AUTO',   # 이미지 자동 임베드
    )
    print(f"  ✓ {os.path.basename(path)}")


# ═══════════════════════════════════════════════════════════
#  텍스처 생성 (numpy, Cycles/Blender 렌더 불필요)
# ═══════════════════════════════════════════════════════════

def voronoi_edge(size, n_pts, seed):
    """Voronoi 셀 경계 거리 맵 (0~1) — 주기적 경계 포함"""
    rng  = np.random.RandomState(seed)
    pts  = rng.uniform(0, size, (n_pts, 2))
    # 9개 타일 — 경계 이음새 방지
    offsets = np.array([[i*size, j*size] for i in [-1,0,1] for j in [-1,0,1]])
    pts_t   = np.vstack([pts + o for o in offsets])

    y_idx, x_idx = np.mgrid[0:size, 0:size]
    coords = np.stack([x_idx, y_idx], -1).reshape(-1, 2).astype(np.float32)

    # 배치 처리 (메모리 절약)
    d1 = np.full(size*size, 1e9, np.float32)
    d2 = np.full(size*size, 1e9, np.float32)
    bs = 2048
    for i in range(0, len(coords), bs):
        batch = coords[i:i+bs]
        dists = np.linalg.norm(batch[:,None] - pts_t[None,:], axis=-1)
        sd    = np.sort(dists, axis=1)
        d1[i:i+bs] = sd[:, 0]
        d2[i:i+bs] = sd[:, 1]

    edge = (d2 - d1).reshape(size, size)
    return edge / (edge.max() + 1e-6)


def gen_stone_a_albedo(size):
    """A — 극도로 어두운 현무암, 위에서 빛 받는 미세한 변화"""
    rng   = np.random.RandomState(10)
    noise = rng.uniform(0, 1, (size, size)) * 0.025
    y     = np.linspace(1, 0, size)[:, None]       # 위 = 밝음
    base  = np.array([0.045, 0.045, 0.060])
    arr   = base[None, None] * np.ones((size, size, 3)) + noise[:,:,None]*0.4 + y * np.ones((1, size, 3)) * 0.035
    # 약간의 청회색 변화 (top = 밝은 회색, bottom = 더 어둡게)
    arr[:,:,2] += y[:,0] * 0.01
    return np.clip(arr, 0, 0.12)   # 최대 밝기 제한 → 진한 검은돌


def gen_stone_b_albedo(size):
    """B — 금빛 균열 맥 위에 청록/보라 그라디언트"""
    # ── 균열 패턴 (두 레이어 겹침) ──
    edge1 = voronoi_edge(size, n_pts=22, seed=42)
    edge2 = voronoi_edge(size, n_pts=48, seed=123)

    w1, w2 = 0.075, 0.045
    crack1 = np.clip(1 - edge1 / w1, 0, 1) ** 2.5
    crack2 = np.clip(1 - edge2 / w2, 0, 1) ** 3.0 * 0.55
    crack  = np.clip(crack1 + crack2, 0, 1)

    # ── 높이 기반 색상 그라디언트 ──
    #   y=0(상단) → 어두운 회색
    #   y=0.45   → 청록
    #   y=1(하단) → 보라
    y = np.linspace(0, 1, size)[:, None] * np.ones((1, size))

    dark   = np.array([0.060, 0.060, 0.080])
    teal   = np.array([0.000, 0.560, 0.700])
    purple = np.array([0.450, 0.000, 0.840])

    t_dt = np.clip((y - 0.10) / 0.40, 0, 1)   # dark → teal
    t_tp = np.clip((y - 0.50) / 0.50, 0, 1)   # teal → purple

    base = np.zeros((size, size, 3))
    for c in range(3):
        col = dark[c] + t_dt * (teal[c]   - dark[c])
        col = col    + t_tp * (purple[c]  - teal[c])
        base[:,:,c] = col

    # ── 균열에 금빛 혼합 ──
    gold = np.array([0.960, 0.610, 0.075])
    c3   = crack[:,:,None]
    out  = base * (1 - c3 * 0.88) + gold[None,None] * c3 * 0.88
    return np.clip(out, 0, 1)


def gen_stone_b_emit(size):
    """B — 균열 라인 금빛 발광 + 하단 청보라 내부 글로우"""
    edge1 = voronoi_edge(size, n_pts=22, seed=42)
    edge2 = voronoi_edge(size, n_pts=48, seed=123)
    crack = np.clip(1 - edge1/0.055, 0, 1)**2.5 + \
            np.clip(1 - edge2/0.040, 0, 1)**3.0 * 0.45
    crack = np.clip(crack, 0, 1)

    y      = np.linspace(0, 1, size)[:, None] * np.ones((1, size))
    purple = np.array([0.45, 0.00, 0.88])
    teal   = np.array([0.00, 0.72, 0.76])
    gold   = np.array([0.96, 0.60, 0.06])

    # 내부 글로우 (하단 청보라)
    t      = np.clip((y - 0.35) / 0.65, 0, 1)
    glow   = np.zeros((size, size, 3))
    for c in range(3):
        glow[:,:,c] = (teal[c] * (1-t) + purple[c] * t) * 0.45

    # 균열 금빛 발광
    vein   = gold[None,None] * crack[:,:,None]
    return np.clip(glow + vein, 0, 1)


def gen_stone_c_albedo(size):
    """C — 크리스탈: 밝고 투명한 기본색 + 하단 금빛 먼지"""
    y    = np.linspace(0, 1, size)[:, None] * np.ones((1, size))
    base = np.array([0.88, 0.86, 1.00])   # 살짝 청보라빛 투명

    arr  = base[None,None] * np.ones((size, size, 3))

    # 하단으로 갈수록 불투명한 금빛 원석 베이스
    t    = np.clip((y - 0.75) / 0.25, 0, 1)
    rng  = np.random.RandomState(55)
    gold_n = rng.uniform(0, 1, (size, size))[:,:,None] * 0.2
    gold = np.array([0.30, 0.18, 0.04])
    for c in range(3):
        arr[:,:,c] = arr[:,:,c] * (1 - t) + (gold[c] + gold_n[:,:,0]*0.3) * t
    return np.clip(arr, 0, 1)


def gen_stone_c_emit(size):
    """C — 우주 내부 발광: 청록+보라 성운 + 별빛 반짝임 + 금빛 먼지"""
    rng = np.random.RandomState(77)
    emit = np.zeros((size, size, 3))

    # ── 방사형 성운 코어 ──
    cy, cx = size//2, size//2
    yi, xi = np.mgrid[0:size, 0:size]
    dist   = np.sqrt((xi-cx)**2 + (yi-cy)**2) / (size * 0.55)
    dist   = np.clip(dist, 0, 1)

    teal   = np.array([0.00, 0.90, 0.95])
    purple = np.array([0.55, 0.00, 0.98])
    blue   = np.array([0.10, 0.22, 0.98])

    for c in range(3):
        core = teal[c] * (1-dist) + blue[c] * dist
        emit[:,:,c] = core * 0.65

    # ── 성운 소용돌이 노이즈 ──
    # +2 여유분 → kron 후 슬라이싱 시 항상 size×size 보장
    n1 = rng.uniform(0, 1, (size//6 + 2, size//6 + 2))
    n1 = np.kron(n1, np.ones((6, 6)))[:size, :size]
    n2 = rng.uniform(0, 1, (size//3 + 2, size//3 + 2))
    n2 = np.kron(n2, np.ones((3, 3)))[:size, :size]
    nebula = n1 * 0.4 + n2 * 0.25
    for c in range(3):
        emit[:,:,c] = np.clip(emit[:,:,c] + nebula * purple[c] * 0.45, 0, 1)

    # ── 별빛 반짝임 ──
    n_stars = 200
    sy  = rng.randint(0, size, n_stars)
    sx  = rng.randint(0, size, n_stars)
    sb  = rng.uniform(0.5, 1.0, n_stars)
    for i in range(n_stars):
        emit[sy[i], sx[i]] = [sb[i], sb[i]*0.92, sb[i]*0.85]
        # 별 주변 glow
        for dy in range(-2, 3):
            for dx in range(-2, 3):
                ny, nx = sy[i]+dy, sx[i]+dx
                if 0 <= ny < size and 0 <= nx < size and (dy or dx):
                    f = max(0, 1 - (abs(dy)+abs(dx)) / 2.5) * sb[i] * 0.25
                    emit[ny, nx] = np.clip(emit[ny, nx] + f, 0, 1)

    # ── 하단 금빛 먼지 ──
    y       = np.linspace(0, 1, size)
    gold_m  = np.clip((y - 0.60) / 0.40, 0, 1)[:,None] * np.ones((1, size))
    gold_n2 = rng.uniform(0, 1, (size, size)) * 0.5
    gold_m *= gold_n2
    emit[:,:,0] = np.clip(emit[:,:,0] + gold_m * 0.90, 0, 1)
    emit[:,:,1] = np.clip(emit[:,:,1] + gold_m * 0.48, 0, 1)
    emit[:,:,2] = np.clip(emit[:,:,2] + gold_m * 0.04, 0, 1)

    return np.clip(emit, 0, 1)


# ═══════════════════════════════════════════════════════════
#  원석 빌드 함수
# ═══════════════════════════════════════════════════════════

def build_stone_a():
    print("\n[1/3] 원석 A — 검은 현무암...")
    clear()

    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, radius=1.2, location=(0,0,0))
    obj = bpy.context.active_object
    obj.name = "StoneA"
    obj.scale = (1.0, 0.88, 0.93)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    perturb(obj, strength=0.24, seed=42)
    decimate(obj, ratio=0.35)
    flat(obj)
    unwrap(obj)

    print("  텍스처 생성 중...")
    albedo_arr = gen_stone_a_albedo(TEX_SIZE)
    _, alb_img = save_png(albedo_arr, "stone_a_albedo.png")

    make_pbr_material(obj, "StoneA_Mat", alb_img, roughness=0.96, metallic=0.07)
    export_glb([obj], os.path.join(OUTPUT_DIR, "stone-a.glb"))


def build_stone_b():
    print("\n[2/3] 원석 B — 금빛 균열 원석...")
    clear()

    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, radius=1.2, location=(0,0,0))
    obj = bpy.context.active_object
    obj.name = "StoneB"
    obj.scale = (1.0, 0.88, 0.93)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    perturb(obj, strength=0.24, seed=42)
    decimate(obj, ratio=0.35)
    flat(obj)
    unwrap(obj)

    print("  텍스처 생성 중...")
    alb_arr  = gen_stone_b_albedo(TEX_SIZE)
    emit_arr = gen_stone_b_emit(TEX_SIZE)
    _, alb_img  = save_png(alb_arr,  "stone_b_albedo.png")
    _, emit_img = save_png(emit_arr, "stone_b_emit.png")

    make_pbr_material(obj, "StoneB_Mat", alb_img, emit_img,
                      roughness=0.68, metallic=0.12, emit_strength=2.5)
    export_glb([obj], os.path.join(OUTPUT_DIR, "stone-b.glb"))


def add_crystal(parent_col, vertices, r1, depth, loc, rot_deg, mat, name):
    bpy.ops.mesh.primitive_cone_add(
        vertices=vertices, radius1=r1, radius2=0.0, depth=depth,
        location=loc,
        rotation=tuple(math.radians(a) for a in rot_deg)
    )
    obj = bpy.context.active_object
    obj.name = name
    flat(obj)
    unwrap(obj)
    obj.data.materials.append(mat)
    return obj


def build_stone_c():
    print("\n[3/3] 원석 C — 크리스탈 클러스터...")
    clear()

    print("  텍스처 생성 중...")
    alb_arr  = gen_stone_c_albedo(TEX_SIZE)
    emit_arr = gen_stone_c_emit(TEX_SIZE)
    _, alb_img  = save_png(alb_arr,  "stone_c_albedo.png")
    _, emit_img = save_png(emit_arr, "stone_c_emit.png")

    # 크리스탈 공통 머티리얼 (Principled BSDF + Transmission)
    def make_crystal_mat(name, emit_strength):
        mat = bpy.data.materials.new(name)
        mat.use_nodes = True
        N = mat.node_tree.nodes
        L = mat.node_tree.links
        N.clear()
        out  = N.new("ShaderNodeOutputMaterial")
        bsdf = N.new("ShaderNodeBsdfPrincipled")
        L.new(bsdf.outputs["BSDF"], out.inputs["Surface"])

        uv = N.new("ShaderNodeTexCoord")

        alb_n = N.new("ShaderNodeTexImage")
        alb_n.image = alb_img
        L.new(uv.outputs["UV"], alb_n.inputs["Vector"])
        L.new(alb_n.outputs["Color"], bsdf.inputs["Base Color"])

        emit_n = N.new("ShaderNodeTexImage")
        emit_n.image = emit_img
        L.new(uv.outputs["UV"], emit_n.inputs["Vector"])
        if "Emission Color" in bsdf.inputs:
            L.new(emit_n.outputs["Color"], bsdf.inputs["Emission Color"])
            bsdf.inputs["Emission Strength"].default_value = emit_strength
        elif "Emission" in bsdf.inputs:
            L.new(emit_n.outputs["Color"], bsdf.inputs["Emission"])

        bsdf.inputs["Roughness"].default_value  = 0.04
        bsdf.inputs["Metallic"].default_value   = 0.0
        for key in ("Transmission Weight", "Transmission"):
            if key in bsdf.inputs:
                bsdf.inputs[key].default_value = 0.85
                break
        if "IOR" in bsdf.inputs:
            bsdf.inputs["IOR"].default_value = 1.75
        return mat

    mat_main  = make_crystal_mat("Crystal_Main_Mat",  2.8)
    mat_sub   = make_crystal_mat("Crystal_Sub_Mat",   2.0)
    mat_small = make_crystal_mat("Crystal_Small_Mat", 1.5)

    objects = []

    # 주 결정
    bpy.ops.mesh.primitive_cone_add(
        vertices=7, radius1=1.05, radius2=0.0, depth=2.7,
        location=(0.0, 0.0, 1.35),
        rotation=(math.radians(4), math.radians(3), math.radians(18))
    )
    c_main = bpy.context.active_object
    c_main.name = "Crystal_Main"
    flat(c_main)
    unwrap(c_main)
    c_main.data.materials.append(mat_main)
    objects.append(c_main)

    # 보조 결정 A
    bpy.ops.mesh.primitive_cone_add(
        vertices=6, radius1=0.60, radius2=0.0, depth=1.75,
        location=(0.85, 0.20, 0.88),
        rotation=(math.radians(18), math.radians(2), math.radians(-12))
    )
    c2 = bpy.context.active_object; c2.name = "Crystal_A"
    flat(c2); unwrap(c2); c2.data.materials.append(mat_sub); objects.append(c2)

    # 보조 결정 B
    bpy.ops.mesh.primitive_cone_add(
        vertices=6, radius1=0.50, radius2=0.0, depth=1.45,
        location=(-0.75, -0.10, 0.73),
        rotation=(math.radians(-16), math.radians(6), math.radians(10))
    )
    c3 = bpy.context.active_object; c3.name = "Crystal_B"
    flat(c3); unwrap(c3); c3.data.materials.append(mat_sub); objects.append(c3)

    # 소형 결정 C
    bpy.ops.mesh.primitive_cone_add(
        vertices=5, radius1=0.35, radius2=0.0, depth=0.95,
        location=(0.32, -0.72, 0.48),
        rotation=(math.radians(22), 0, math.radians(8))
    )
    c4 = bpy.context.active_object; c4.name = "Crystal_C"
    flat(c4); unwrap(c4); c4.data.materials.append(mat_small); objects.append(c4)

    # 소형 결정 D
    bpy.ops.mesh.primitive_cone_add(
        vertices=5, radius1=0.26, radius2=0.0, depth=0.72,
        location=(-0.40, -0.60, 0.36),
        rotation=(math.radians(-20), math.radians(5), math.radians(-6))
    )
    c5 = bpy.context.active_object; c5.name = "Crystal_D"
    flat(c5); unwrap(c5); c5.data.materials.append(mat_small); objects.append(c5)

    # 암석 베이스 (어두운 재질 별도)
    bpy.ops.mesh.primitive_ico_sphere_add(
        subdivisions=2, radius=0.90, location=(0.0, 0.0, -0.40)
    )
    base = bpy.context.active_object; base.name = "Crystal_Base"
    base.scale.z = 0.36
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    perturb(base, strength=0.18, seed=77)
    flat(base)
    unwrap(base)

    # 베이스: 어두운 암석 + 금빛 발광 약간
    base_alb = np.ones((TEX_SIZE, TEX_SIZE, 3)) * np.array([0.055, 0.035, 0.070])
    base_alb += np.random.RandomState(88).uniform(0, 1, (TEX_SIZE, TEX_SIZE, 3)) * 0.015
    base_emit_arr = gen_stone_c_emit(TEX_SIZE) * 0.2  # 희미하게
    _, base_alb_img  = save_png(base_alb, "stone_c_base_albedo.png")
    _, base_emit_img = save_png(base_emit_arr, "stone_c_base_emit.png")
    make_pbr_material(base, "Crystal_Base_Mat", base_alb_img, base_emit_img,
                      roughness=0.93, metallic=0.05, emit_strength=0.6)
    objects.append(base)

    export_glb(objects, os.path.join(OUTPUT_DIR, "stone-c.glb"))


# ═══════════════════════════════════════════════════════════
#  실행
# ═══════════════════════════════════════════════════════════
if __name__ == "__main__":
    print("=" * 55)
    print("  SORI 원석 3종 텍스처 베이크 모델링")
    print("=" * 55)
    build_stone_a()
    build_stone_b()
    build_stone_c()
    print("\n" + "=" * 55)
    print("  완료! GLB 파일:")
    for f in ["stone-a.glb", "stone-b.glb", "stone-c.glb"]:
        path = os.path.join(OUTPUT_DIR, f)
        size = os.path.getsize(path) // 1024
        print(f"   {f}  ({size}KB)")
    print("=" * 55)
