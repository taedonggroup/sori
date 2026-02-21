# SORI 웹디자인 레퍼런스 — Manus AI 디자인 기획용

> **문서 유형**: 디자인 레퍼런스 기획서
> **작성일**: 2026-02-22
> **버전**: v1.0
> **상태**: 배포 완료 / 디자인 개선 기획 중
> **작성**: 태동(TEDONG) 개발팀
> **수신**: Manus AI 디자인 기획 팀

---

## 목차

1. 서비스 개요
2. 현재 사용자 흐름
3. 페이지별 구조 상세
4. 디자인 시스템
5. 3D 씬 시스템
6. 컴포넌트 목록
7. 개선이 필요한 영역
8. 디자인 방향성 제언
9. 다음 단계

---

## 1. 서비스 개요

### 1.1 기본 정보

| 항목 | 내용 |
|------|------|
| 서비스명 | SORI (소리) |
| 회사 | 태동 (TEDONG) |
| 라이브 URL | https://sori-bice.vercel.app |
| 서비스 성격 | AI 음악 분석 + 커뮤니티 믹싱 플랫폼 |
| 배포 환경 | Vercel (프론트엔드), Jarvis 서버 175.127.189.188:5002 (AI 엔진) |
| 저장소 | Supabase Storage — joakak-audio 버킷(클라우드 파일 저장소) |

### 1.2 기술 스택 (비개발자용 설명)

| 기술 | 역할 | 비고 |
|------|------|------|
| Next.js 16 | 웹 페이지 프레임워크(앱 기반 웹 구조) | React 19 기반 |
| TailwindCSS 4 | 디자인 유틸리티(CSS 작성 도구) | 유틸리티 클래스 방식 |
| Three.js + R3F | 3D 그래픽 렌더링(브라우저 내 3D 장면) | WebGL 기반 |
| Zustand | 상태 관리(씬 전환 상태 저장) | 경량 상태 라이브러리 |
| Gemini 2.0 Flash | 음악 분석 AI | Google AI |
| Claude Sonnet | 포트폴리오 리뷰 AI | Anthropic AI |
| shadcn/ui | UI 컴포넌트 기본 라이브러리 | 커스텀 변형 적용 |

### 1.3 SORI 고유 명칭 체계 (반드시 준수)

SORI 서비스는 일반적인 음악 플랫폼 용어 대신 고유한 명칭 체계를 사용합니다. 디자인 기획 시 이 명칭을 모든 UI 텍스트에 그대로 적용해야 합니다.

| 일반 용어 | SORI 명칭 | 의미 |
|-----------|-----------|------|
| 사용자 / 유저 | 원석 | 서비스를 이용하는 사람. 아직 갈고 닦이지 않은 원석 같은 존재 |
| 음악 파일 | 조각 | 원석이 업로드하는 음악 소스. 완성되지 않은 하나의 조각 |
| AI 엔진 | 공명 | 음악을 분석하는 AI. 소리의 공명처럼 깊이 듣는다 |
| 완성된 음원 | (첫)울림 | 공명이 여러 조각을 믹스해 만들어 낸 결과물 |
| 메인 페이지 | 공간 | 원석이 처음 도착하는 장소. 모든 것이 시작되는 공간 |

### 1.4 서비스 철학 및 분위기

SORI는 음악을 "물건"이 아닌 "에너지"로 보는 철학을 가집니다.

- **어둠 속의 광원**: 순수한 검은 배경(#000000) 위에 발광하는 물체들
- **우주적 고요함**: 무중력 속에 떠다니는 원석과 조각들
- **공명의 신비**: 눈에 보이지 않는 소리를 3D 시각적으로 표현
- **접근의 장벽 낮추기**: 복잡한 음악 이론 없이 누구나 참여

---

## 2. 현재 사용자 흐름

### 2.1 핵심 여정 (Core User Journey)

```
[공간 /]          [업로드 /upload]        [갤러리 /gallery]      [프로필 /profile/닉네임]
    |                    |                       |                        |
원석 도착         조각 드래그앤드롭          다른 조각들 탐색           내 조각 아카이브
닉네임 입력       공명이 분석               2개 이상 선택              페르소나 배지
버튼 2개          결과 인라인 표시          공명이 믹스                 조각 목록 (최대 5)
    |                    |                       |
조각 올리기 →     갤러리에 올리기 →        (첫)울림 오디오 플레이어
조각 둘러보기 →   /gallery 이동            다시 선택하기 / 공간으로
```

### 2.2 상태 전환 다이어그램

공간(/) 페이지는 단일 페이지 내에서 두 가지 상태로 전환됩니다.

```
STONE 상태 (기본)
  - 중앙에 3D 원석 크게 표시
  - 하단 닉네임 입력 + 버튼 2개
  - 버튼: [조각 올리기] [조각 둘러보기 →]
            |                  |
       /upload 이동      FRAGMENTS 상태로 전환 (페이지 이동 없음)
                               |
FRAGMENTS 상태
  - 헤더: "← 공간으로" + "조각들"
  - 무한 스크롤 조각 피드
  - 우하단: 미니 원석 버튼 (72x72 원형)
  - 플로팅: 울림 추천 패널
  - 버튼 클릭 → STONE 상태로 복귀
```

### 2.3 3D 씬 연동 흐름

각 페이지 이동 시 3D 배경의 원석 위치와 크기가 자동으로 변합니다.

```
공간(stone)  →  공간(fragments)  →  /upload    →  /gallery    →  /profile
원석 중앙       원석 우하단 소형    원석 좌측 소형  원석 우측 소형  원석 중앙 대형
scale: 1.0      scale: 0.1         scale: 0.25    scale: 0.12    scale: 1.3
                파티클 등장         업로드 구체 등장              강한 내부 발광
```

---

## 3. 페이지별 구조 상세

### 3.1 공간 (/) — 메인 랜딩

#### STONE 상태 레이아웃

```
┌─────────────────────────────────────┐
│                                     │
│  POWERED BY 공명        (최상단 중앙, │
│  S  O  R  I             zinc-600)   │
│                                     │
│                                     │
│       [3D 원석 — 화면 전체 배경]     │
│       Three.js Canvas fixed z-0     │
│       (HTML 오버레이가 위에 올라감)  │
│                                     │
│                                     │
│  ┌──────────────────────────────┐   │
│  │   원석 이름 [________________]│   │
│  │   당신의 이름을 알려주세요   │   │
│  └──────────────────────────────┘   │
│                                     │
│   [  조각 올리기  ]  조각 둘러보기 → │
│   (outline btn)     (ghost btn)     │
│                                     │
└─────────────────────────────────────┘
```

#### FRAGMENTS 상태 레이아웃

```
┌─────────────────────────────────────┐
│  ← 공간으로    조각들               │
│  (zinc-500)                         │
├─────────────────────────────────────┤
│                                     │
│  [JoakakCard]  무한 스크롤          │
│  [JoakakCard]                       │
│  [JoakakCard]                       │
│  [JoakakCard]                       │
│  ...                                │
│                                     │
│                          [◎]        │
│                     72x72 원형      │
│                     미니 원석 버튼   │
│                                     │
│  [울림 추천 패널 — 플로팅]           │
└─────────────────────────────────────┘
```

#### 현재 구현 상태

- 3D 캔버스(Three.js)는 layout.tsx에서 항상 마운트. 각 페이지는 HTML 오버레이만 담당
- 닉네임은 localStorage(브라우저 로컬 저장소)에 저장되어 다음 방문 시 자동 복원
- 전환 시 검은 오버레이(TransitionOverlay) fade-to-black 연출 후 상태 전환

---

### 3.2 조각 업로드 (/upload)

#### 레이아웃 구조

```
┌─────────────────────────────────────┐
│                                     │
│  [3D 배경: 발광하는 구체(UploadOrb) │
│   중앙에 고정. 원석은 좌측 소형]    │
│                                     │
│        조각 업로드          (헤더)  │
│  당신의 조각을 공명에게             │
│  공명이 당신의 음악을 듣고 분석합니다│
│                                     │
│  ┌────────────────────────────────┐ │
│  │  원석 이름 [________________] │ │
│  └────────────────────────────────┘ │
│                                     │
│            ╔══════════╗             │
│            ║          ║             │
│            ║  ♪ 조각을║             │
│            ║  놓아주세요║            │
│            ║  (224x224)║            │
│            ╚══════════╝             │
│   원형 점선 테두리, 드래그앤드롭    │
│                                     │
│   mp3 · wav · flac · m4a · 최대 50MB│
│                                     │
│      [공명에게 들려주기]             │
│         (outline 버튼)              │
│                                     │
│  ─── 또는 샘플 조각으로 바로 테스트 ─ │
│  [샘플1] [샘플2] [샘플3]             │
│  [샘플4] [샘플5] [샘플6]  (2-3열)   │
│                                     │
└─────────────────────────────────────┘
```

#### 분석 완료 후 인라인 결과 표시

```
┌─────────────────────────────────────┐
│  공명 분석 완료 — filename.mp3      │
│                                     │
│  장르          BPM          키      │
│  K-Pop         128          C#m     │
│                                     │
│  [신디사이저] [기타] [드럼] [피아노] │
│  (악기 배지 목록)                   │
│                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────┐│
│  │ 몽환적인 │ │ 도시적인 │ │감성적││
│  │  감성    │ │  에너지  │ │  인  ││
│  │(purple)  │ │ (blue)   │ │(white)││
│  └──────────┘ └──────────┘ └──────┘│
│            (페르소나 카드 3개)      │
│                                     │
│      [갤러리에 올리기]  (primary)   │
│      [다시 분석하기]   (ghost)      │
│                                     │
└─────────────────────────────────────┘
```

#### 진행 단계별 상태 텍스트

| 단계 | 표시 텍스트 | 비고 |
|------|-------------|------|
| 파일 선택 후 대기 | — | 버튼 활성화 |
| Supabase 업로드 중 | 공명에게 전달 중... | animate-pulse |
| Gemini 분석 중 | 공명이 듣는 중... | animate-pulse |
| 분석 완료 | 분석결과 인라인 표시 | fadeInUp 애니메이션 |
| 갤러리 저장 중 | 올리는 중... | 버튼 텍스트 변경 |

---

### 3.3 조각 갤러리 (/gallery)

#### 레이아웃 구조

```
┌─────────────────────────────────────┐
│                                     │
│  [3D 배경: 원석 우측 소형]          │
│                                     │
│  ← 공간으로                         │
│  조각 갤러리         [조각 올리기]  │
│                                     │
│  조각을 선택해 공명으로 믹스하거나,  │
│  재생 버튼으로 들어보세요 (안내문)  │
│                                     │
│  [JoakakCard — 선택 모드 가능]      │
│  [JoakakCard]                       │
│  [JoakakCard]                       │
│  [JoakakCard] ...                   │
│                                     │
├─────────────────────────────────────┤
│  [2개 조각 선택됨]    [공명으로 믹스]│
│  (MixSelector 플로팅 패널)          │
└─────────────────────────────────────┘
```

#### 믹스 결과 화면

```
┌─────────────────────────────────────┐
│        공명 완료           (subtitle)│
│  2개의 조각이 하나의 울림이 되었습니다│
│                                     │
│  ┌─────────────────────────────────┐│
│  │         울림            (label) ││
│  │  [오디오 플레이어 — 기본 HTML]  ││
│  │  재생 시간: 30초                ││
│  └─────────────────────────────────┘│
│                                     │
│  [다시 선택하기]  [공간으로]        │
│                                     │
└─────────────────────────────────────┘
```

#### ResonanceLoader (공명 로딩 오버레이)

믹스 진행 중 화면 전체를 덮는 3단계 파티클 애니메이션 오버레이입니다.

- 배경: 반투명 검은 오버레이
- 중앙: 파티클 애니메이션 (3단계 진행)
- 하단: "조각들을 공명으로 믹싱하는 중..." 텍스트

---

### 3.4 원석 프로필 (/profile/[닉네임])

#### 레이아웃 구조

```
┌─────────────────────────────────────┐
│  SORI                (좌상단 고정)  │
│                                     │
│                                     │
│  [3D 배경: 원석 중앙 대형, 강한     │
│   내부 발광 — emissiveIntensity 0.9]│
│                                     │
│                                     │
│         @닉네임           (h1)     │
│      조각 5개 · 페르소나 배지들     │
│      (ProfileCard)                  │
│                                     │
│  ────── 조각 아카이브 ──────        │
│  01  filename.mp3    K-Pop · 128    │
│  02  filename2.wav   Electronic     │
│  03  filename3.flac  Ambient · 90   │
│  04  ...                            │
│  05  ...                            │
│  +3개 더                            │
│                                     │
│         [새 조각 올리기]            │
│                                     │
└─────────────────────────────────────┘
```

#### ProfileCard 컴포넌트 구성

- 닉네임 h1 태그 (크게 표시)
- 조각 개수 (예: "조각 5개")
- top_personas 배지 목록 (페르소나 키워드, 노란색 #F8F32B)

---

## 4. 디자인 시스템

### 4.1 컬러 팔레트

| 용도 | 색상값 | 설명 |
|------|--------|------|
| 배경 | `#000000` | 순수 검정 — 절대 변경 금지 |
| 기본 텍스트 | `#ffffff` | 흰색 |
| 보조 텍스트 1 | `#a1a1a1` (zinc-400) | 일반 설명 텍스트 |
| 보조 텍스트 2 | `#71717a` (zinc-500) | 약한 설명 텍스트 |
| 배경 텍스트 | `#52525b` (zinc-600) | 힌트, 레이블 |
| 카드 배경 | `#18181b` (zinc-950) | 카드, 패널 배경 |
| 테두리 | `#27272a` (zinc-800) | 기본 테두리 |
| 강조 테두리 | `#3f3f46` (zinc-700) | 호버 상태 테두리 |
| **공명 브랜드 (핵심)** | `#F8F32B` | 밝은 노란색/황금색. 선택 상태, 버튼, 페르소나 등 |
| 3D 파티클 (틸) | `#00cccc` | Starfield와 FragmentParticles |
| 페르소나 1 | `purple-300 / purple-800` | 첫 번째 페르소나 카드 |
| 페르소나 2 | `blue-300 / blue-800` | 두 번째 페르소나 카드 |
| 페르소나 3 | `white / white/20` | 세 번째 페르소나 카드 |
| 에러 | `red-400` | 오류 메시지 |

**중요**: #F8F32B (공명 노란색)은 SORI 브랜드의 핵심 컬러입니다. 선택 상태, 활성화된 버튼, 페르소나 해시태그, 프로그레스바에 일관되게 사용됩니다.

### 4.2 타이포그래피

| 요소 | 스타일 | 예시 |
|------|--------|------|
| 브랜드명 (S O R I) | text-2xl, font-thin, tracking-[0.4em] | 자간 매우 넓게 |
| 서브 브랜드 | text-xs, tracking-[0.5em], uppercase | POWERED BY 공명 |
| 페이지 제목 | text-2xl ~ text-3xl, font-light | 당신의 조각을 공명에게 |
| 섹션 라벨 | text-xs, tracking-[0.3em ~ 0.5em], uppercase | 조각 업로드 |
| 카드 파일명 | text-sm, font-medium | 일반 텍스트 |
| 닉네임 링크 | text-xs, color #F8F32B | @닉네임 |
| 메타 정보 | text-[10px] | 10px 매우 작은 텍스트 |
| 닉네임 입력 라벨 | text-xs, zinc-600, tracking wide | 원석 이름 |
| 폰트 패밀리 | Geist Sans (기본) + Geist Mono (모노) | — |

**타이포그래피 원칙**: font-thin / font-light 를 기본으로, 무게감보다 여백과 자간으로 고급스러움을 표현합니다.

### 4.3 버튼 시스템

shadcn/ui를 기반으로 SORI 전용 변형(variant)을 정의합니다.

#### sori-primary (주 행동 버튼)
```
배경: transparent
테두리: border border-[#F8F32B]/60 (노란색 60% 투명도)
텍스트: text-[#F8F32B] (노란색)
호버: border-[#F8F32B] + shadow-[0_0_20px_rgba(248,243,43,0.3)] (노란 발광)
용도: 갤러리에 올리기, 공명으로 믹스 등 핵심 전환 행동
```

#### sori-outline (보조 행동 버튼)
```
배경: transparent
테두리: border border-white/60 (흰색 60% 투명도)
텍스트: text-white
호버: border-white + shadow-[0_0_20px_rgba(255,255,255,0.15)] (흰 발광)
용도: 조각 올리기, 조각 갤러리, 공간으로 등 이동 행동
```

#### sori-ghost (약한 행동 버튼)
```
배경: transparent
테두리: 없음
텍스트: text-zinc-500
호버: text-white
용도: 다시 분석하기, 조각 둘러보기 → 등 선택적 행동
```

#### sori-lg 사이즈
```
width: w-full (최대 max-w-xs 컨테이너 내)
padding: py-4
border-radius: rounded-full (완전한 원형 버튼)
font: text-sm tracking-wider
```

### 4.4 카드 컴포넌트 (JoakakCard)

```
배경: bg-zinc-950 (#18181b)
테두리: border-zinc-800 (기본) → border-zinc-600 (호버) → border-[#F8F32B] (선택됨)
선택 시 글로우: shadow-[0_0_15px_rgba(248,243,43,0.15)]
border-radius: rounded-2xl
padding: p-4
```

**카드 내부 구성 (위→아래)**
1. 재생 버튼 (원형 36px) + 파일명 + 닉네임 링크
2. 장르 / BPM / 키 배지 (10px 라운드 필)
3. 재생수 / 파일 크기 (10px 하단 정보)
4. 확장 시: 프로그레스 슬라이더 (노란색 진행바)
5. 페르소나 해시태그 (있을 경우, 노란색 #F8F32B)

**선택 모드 (갤러리에서 활성화)**
- 카드 클릭 시 노란 테두리 + 우상단 체크 배지 (노란 원 + 검은 체크)
- 선택 해제: 동일 클릭으로 토글

### 4.5 입력 컴포넌트 (NicknameInput)

```
라벨: "원석 이름" — text-xs, zinc-600, tracking-[0.2em]
입력창 배경: bg-zinc-900
입력창 테두리: border-zinc-800
placeholder: "당신의 이름을 알려주세요"
placeholder 색상: zinc-600
최소 2자, 최대 16자 검증
```

### 4.6 애니메이션 시스템

모든 애니메이션은 globals.css에 @keyframes로 정의되어 있습니다.

| 애니메이션 이름 | 설명 | 사용 위치 |
|----------------|------|-----------|
| `soundwave` | 5개 바가 서로 다른 타이밍으로 높이 변화 | 파일 선택 완료 시 원형 업로드 존 내부 |
| `ripple` | scale + opacity 펄스 | 인터랙션 피드백 |
| `fadeInUp` | translateY(10px→0) + opacity 0→1 | 분석 결과 등장, 카드 등장 |
| `float` | Y축 미세 부유 | 3D 오브젝트 보조 |
| `glow-pulse` | 그림자 강도 진동 | 발광 오브젝트 |
| `animate-pulse` | Tailwind 기본 펄스 | 로딩 텍스트 |

**전환 타이밍 원칙**
- 마우스 오버 반응: 200ms
- 색상 전환: 300ms
- 페이지 페이드: 500ms
- 카드 확장: 300ms (ease-in-out)

### 4.7 배지 / 태그 스타일

| 종류 | 스타일 | 예시 |
|------|--------|------|
| 악기 배지 | border-zinc-700, text-zinc-400, rounded-full, text-xs | [기타] [피아노] |
| 장르/BPM/키 태그 | bg-zinc-900, border-zinc-800, rounded-full, 10px | [K-Pop] [128 BPM] |
| 페르소나 해시태그 | text-zinc-500, 10px, tracking-wider | #몽환적인 |
| 선택 체크 배지 | bg-[#F8F32B], text-black, rounded-full, 24px | 체크 아이콘 |

### 4.8 플로팅 패널 (MixSelector)

```
위치: position fixed, bottom: 0, left: 0, right: 0
배경: bg-zinc-950/80 (80% 불투명)
블러: backdrop-blur-md (배경 블러 효과)
내용: "{N}개 조각 선택됨" + [공명으로 믹스] 버튼
```

---

## 5. 3D 씬 시스템

### 5.1 아키텍처 개요

3D는 페이지 전환과 무관하게 항상 화면 전체 배경에 고정됩니다.

```
layout.tsx (Next.js 레이아웃 — 모든 페이지 공통)
  └── SoriCanvas (fixed, full-viewport, z-index: 0)
        ├── Starfield (2000개 파티클, 틸 80% + 골드 20%, 2.5px)
        ├── StoneObject (메인 원석 3D 오브젝트)
        ├── FragmentParticles (60개 틸 구체 — fragments/upload씬)
        ├── UploadOrb (발광 구체 반경 1.5 — upload씬)
        └── CameraController (씬별 카메라 위치 제어)

각 페이지 (z-index: 10 이상)
  ├── SceneEffect (씬 전환 트리거, Zustand sceneStore 연동)
  └── HTML 오버레이 UI 컴포넌트들
```

**핵심 원칙**: SoriCanvas는 항상 마운트 상태. SSR(서버사이드 렌더링) 비활성화 필수 (dynamic import 사용).

### 5.2 씬별 3D 상태

| 씬 이름 | 원석 위치 | 원석 크기 | 특수 오브젝트 | 카메라 위치 |
|---------|-----------|-----------|---------------|-------------|
| stone | [0, 0, 0] 중앙 | scale: 1.0 | 없음 | [0, 1.5, 6] |
| fragments | [3.5, -2.5, -1] 우하단 | scale: 0.1 | FragmentParticles (60개 틸 구체) | — |
| upload | [-3, 0, -2] 좌측 | scale: 0.25 | UploadOrb (발광 구체, 반경 1.5) | — |
| gallery | [4, -2, 0] 우측 | scale: 0.12 | 없음 | — |
| profile | [0, -0.5, 0] 중앙 | scale: 1.3 | 강한 내부 발광 (emissive: 0.9) | — |

### 5.3 씬 전환 연출

stone → fragments 전환 시 카메라 fly-through 연출:
1. TransitionOverlay 페이드 인 (검정으로)
2. 씬 상태 변경 (Zustand sceneStore)
3. 원석 위치/크기 애니메이션 이동
4. TransitionOverlay 페이드 아웃

### 5.4 Starfield 스펙

```
파티클 수: 2,000개
색상 구성: 틸(#00cccc) 80% + 골드(#F8F32B) 20%
크기: 2.5px 고정
분포: 구형 랜덤 분포
안개: FogExp2 (근거리: 40, 원거리: 200)
```

### 5.5 원석(RawStone) 재질 스펙

```
geometry: IcosahedronGeometry (이코사헤드론 — 다면체 돌 모양)
재질: MeshStandardMaterial
  - color: #ffffff (흰색)
  - roughness: 0.8 (거칠기)
  - metalness: 0.2 (금속감)
  - emissive: #4444ff → 프로필씬에서 강하게
emissiveIntensity: 0.1 (기본) → 0.9 (profile 씬)
조명: PointLight 2개 (틸 + 흰색)
```

---

## 6. 컴포넌트 목록

### 6.1 3D 컴포넌트 (src/components/3d/)

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| SoriCanvas | SoriCanvas.tsx | 전체 3D 씬 컨테이너. layout에서 마운트 |
| StoneObject | StoneObject.tsx | 씬별 위치/크기가 변하는 메인 원석 |
| RawStone | RawStone.tsx | 원석 기본 지오메트리 + 재질 |
| Starfield | Starfield.tsx | 배경 별빛 2000개 파티클 |
| FragmentParticles | FragmentParticles.tsx | fragments 씬 60개 틸 구체 |
| UploadOrb | UploadOrb.tsx | upload 씬 발광 구체 |
| CameraController | CameraController.tsx | 씬별 카메라 위치 제어 |
| CanvasLoader | CanvasLoader.tsx | 3D 로딩 폴백(대기 화면) |
| StoneScene | StoneScene.tsx | 씬 조합 컴포넌트 (dynamic import 필수) |

### 6.2 서비스 컴포넌트 (src/components/gonmyung/)

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| JoakakCard | JoakakCard.tsx | 조각 카드 (재생, 선택, 확장, 닉네임 링크) |
| JoakakFeed | JoakakFeed.tsx | 무한 스크롤 조각 목록 |
| NicknameInput | NicknameInput.tsx | 원석 이름 입력 (localStorage 연동) |
| MixSelector | MixSelector.tsx | 선택된 조각 목록 + 믹스 버튼 (플로팅) |
| ProfileCard | ProfileCard.tsx | 원석 프로필 카드 (닉네임 + 페르소나 배지) |
| ResonanceLoader | ResonanceLoader.tsx | 믹스 진행 중 전체화면 오버레이 |
| UlrimRecommendPanel | UlrimRecommendPanel.tsx | AI 추천 조각 조합 패널 (플로팅) |
| ResultPanel | ResultPanel.tsx | 믹스 결과 오디오 플레이어 패널 |
| GenreGrid | GenreGrid.tsx | 장르 필터 탭/그리드 |
| ProfileBackground | ProfileBackground.tsx | 프로필 페이지 배경 효과 |
| ParameterControls | ParameterControls.tsx | 믹스 파라미터 조절 컨트롤 |

### 6.3 공통 컴포넌트 (src/components/)

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| SceneEffect | SceneEffect.tsx | 씬 전환 트리거 (Zustand sceneStore 연동) |
| TransitionOverlay | TransitionOverlay.tsx | 씬 전환 검은 페이드 오버레이 |
| ParticleBackground | ParticleBackground.tsx | 추가 파티클 배경 효과 |

### 6.4 UI 기본 컴포넌트 (src/components/ui/) — shadcn/ui 기반

| 컴포넌트 | 커스터마이징 |
|---------|-------------|
| Button | sori-primary / sori-outline / sori-ghost 변형 추가 |
| Card + CardContent | zinc-950 배경, zinc-800 테두리 기본 적용 |
| Badge | outline 변형 기본 (border-zinc-700, text-zinc-400) |
| Input | zinc-900 배경, zinc-800 테두리 |
| Slider | 노란색(#F8F32B) 진행 표시 |
| Progress | 노란색(#F8F32B) 진행 표시 |

### 6.5 데이터 타입 (src/lib/gonmyung/types.ts)

```typescript
// 조각 (음악 파일) 데이터 구조
interface Joakak {
  id: string                    // 고유 ID
  nickname: string              // 업로드한 원석의 닉네임
  original_filename: string     // 원본 파일명
  genre: string | null          // 장르 (Gemini 분석 결과)
  bpm: number | null            // 템포 (Gemini 분석 결과)
  key_signature: string | null  // 음악 키 (Gemini 분석 결과)
  instruments: string[]         // 악기 목록 (Gemini 분석 결과)
  persona: string[]             // 원석 페르소나 키워드 3개
  duration: number | null       // 재생 시간 (초)
  file_size: number             // 파일 크기 (bytes)
  created_at: string            // 업로드 일시
  play_count: number            // 재생 횟수
}

// 원석 프로필 응답 구조
interface ProfileResponse {
  nickname: string              // 닉네임
  joakak_count: number          // 총 조각 수
  top_personas: string[]        // 상위 페르소나 키워드
  joakak: Joakak[]              // 조각 목록
}

// 분석 결과 타입
interface 조각분석결과 {
  장르: string
  악기: string[]
  BPM: number
  키: string
  원석_페르소나: string[]       // 3개
}
```

### 6.6 API 엔드포인트 목록

| 메서드 | 경로 | 역할 |
|--------|------|------|
| GET | /api/gonmyung/joakak | 조각 목록 (page, limit, genre 필터) |
| POST | /api/gonmyung/joakak | 새 조각 저장 (분석 결과 포함) |
| GET | /api/gonmyung/joakak/[id]/audio | 오디오 스트리밍 |
| POST | /api/gonmyung/analyze | Gemini 음악 분석 요청 |
| POST | /api/gonmyung/mix | FFmpeg 믹스 요청 |
| GET | /api/gonmyung/recommend | Gemini 추천 조합 조회 |
| POST | /api/gonmyung/upload-url | Supabase 서명 URL 발급 |
| GET | /api/gonmyung/profile/[nickname] | 원석 프로필 조회 |

---

## 7. 개선이 필요한 영역

현재 서비스의 주요 UX/디자인 문제점을 우선순위별로 정리합니다.

### 7.1 High Priority (즉시 개선 필요)

| # | 문제 | 현재 상태 | 영향 |
|---|------|-----------|------|
| H1 | 네비게이션 부재 | 페이지 간 명확한 이동 경로 없음. 각 페이지에서 다른 페이지로 가려면 뒤로가기 등 우회 필요 | 신규 사용자 이탈 높음 |
| H2 | 신규 사용자 온보딩 없음 | 처음 방문한 사람이 무엇을 해야 할지 즉시 알기 어려움 | 첫 전환율 저하 |
| H3 | /create 페이지 중복 | /upload와 내용이 사실상 동일. 경로 정리 필요 | 코드 중복, 사용자 혼란 |
| H4 | 업로드 성공 피드백 부족 | "갤러리에 올리기" 클릭 후 /gallery로 이동할 뿐, 성공 축하 화면 없음 | 서비스 감성 경험 손실 |

### 7.2 Medium Priority (1~2주 내 개선 권장)

| # | 문제 | 현재 상태 | 영향 |
|---|------|-----------|------|
| M1 | 갤러리 장르 필터 비주얼 약함 | GenreGrid 컴포넌트가 존재하나 시각적으로 단조로움 | 탐색 경험 저하 |
| M2 | 믹스 결과 오디오 플레이어 미디자인 | HTML 기본 audio 태그에 invert 필터만 적용 | 브랜드 감성 불일치 |
| M3 | 프로필 페이지 단조로움 | 배경 발광 외에 개성 없음. 조각 목록도 텍스트만 나열 | 프로필 공유 동기 부족 |
| M4 | 소셜 공유 기능 없음 | 프로필 URL 공유, 조각 공유 기능 전혀 없음 | 바이럴 성장 불가 |
| M5 | UlrimRecommendPanel 노출 시점 불명확 | 항상 표시 vs 조건부 표시 정의 불분명 | 사용자 혼란 |

### 7.3 Low Priority (향후 개선)

| # | 문제 | 현재 상태 |
|---|------|-----------|
| L1 | 모바일 반응형 미검증 | 데스크탑 중심으로 개발. 모바일 레이아웃 전환점(breakpoint) 테스트 미완 |
| L2 | 3D 성능 최적화 | 저사양 기기에서 Three.js Canvas 성능 미검증 |
| L3 | 다크 모드/라이트 모드 없음 | 순수 블랙 고정. 접근성 이슈 가능 |
| L4 | 조각 삭제/관리 기능 없음 | 올린 조각을 삭제하거나 수정하는 기능 없음 |

---

## 8. 디자인 방향성 제언

### 8.1 현재 디자인의 강점 (계승할 것)

1. **블랙 + 발광 오브젝트** 조합: 음악의 신비로움을 잘 표현. 절대 유지
2. **공명 노란색(#F8F32B)** 포인트: 어둠 속 밝은 빛처럼 사용. 과하지 않게 유지
3. **3D 원석의 씬별 이동**: 시각적 연속성이 탁월. 강화 방향으로 발전
4. **얇은 폰트 + 넓은 자간**: 고급스럽고 차분한 분위기 연출. 계승
5. **원형 UI 요소**: 업로드 존, 버튼, 미니 원석 등 원형 모티브. 일관성 유지

### 8.2 레퍼런스 이미지 분석 및 디자인 방향

팀 공유 폴더(taedonggroup/sori-shared 05_reference)에 있는 이미지 기반 방향성입니다.

| 레퍼런스 | 적용 방향 |
|---------|-----------|
| 이글루 안개산악 | FogExp2(거리 안개 효과) 깊이감. 공간감 있는 단색 분위기. 갤러리 배경 |
| 여성실루엣별하늘 | 실루엣 + 별하늘. 슬로건 무드. 공간(/) 랜딩 영역 분위기 강화 |
| 3D인체인터랙티브 | 반투명 오브젝트 내부 발광(Transmission). 원석 재질 고도화 힌트 |
| 파티클비행기우주 | 검정 배경 + 틸/골드 파티클 구름. Starfield 현재 방향과 일치, 강화 |
| 인체의신비 | 내부 발광 전환 애니메이션(emissive 변화). 프로필 씬 원석에 적용 가능 |
| 비행하는고래 | 무중력 부유감, 카메라 fly-through 공간감. 씬 전환 연출에 참조 |

### 8.3 페이지별 개선 방향 제언

#### 공간 (/) — 랜딩

**현재**: 텍스트 + 3D 원석 + 버튼 2개. 단순하고 임팩트 있음.

**제언**:
- 처음 방문 시 짧은 온보딩 애니메이션 (텍스트가 하나씩 등장하는 방식)
- "POWERED BY 공명 / S O R I" 브랜드 영역에 미세한 glow-pulse 애니메이션 추가 고려
- 닉네임 입력창 하단에 "이미 원석이라면? →" 같은 갤러리 직행 링크 추가
- STONE → FRAGMENTS 전환 버튼에 hover 시 파티클 스포크 효과

#### 업로드 (/upload) — 핵심 전환 페이지

**현재**: 업로드 존 + 분석 결과 표시. 기능적으로 완성됨.

**제언**:
- 업로드 완료(갤러리에 올리기) 후 축하 화면 추가: "(첫)울림이 공간에 울립니다" 등
- 분석 중 진행 상태를 더 시각적으로: 원형 진행 바 또는 파형 애니메이션
- 샘플 섹션을 더 시각적으로: 앨범아트 스타일의 작은 썸네일 카드
- 업로드 성공 후 /profile/[닉네임] 또는 /gallery 선택 옵션 제공

#### 갤러리 (/gallery) — 커뮤니티 허브

**현재**: 피드 + 선택 + 믹스. 기능적으로 완성됨. 시각적 단조로움.

**제언**:
- 장르 필터를 탭이 아닌 색상 코딩된 칩(pill) 형태로: K-Pop(핑크), Electronic(시안), Ambient(퍼플)
- 믹스 결과 오디오 플레이어를 커스텀 디자인으로 교체 (HTML 기본 플레이어 제거)
- 믹스 성공 시 "(첫)울림" 화면에 파티클 등장 + 공유 버튼 추가
- 선택된 조각 수가 늘어날수록 MixSelector 패널이 확장되는 효과

#### 프로필 (/profile/[닉네임]) — 정체성 페이지

**현재**: 텍스트 위주. 3D 배경만 인상적.

**제언**:
- 페르소나 배지를 크고 시각적으로 표현 (현재 작은 텍스트 배지)
- 조각 아카이브 목록에 미니 파형(waveform) 시각화 추가
- 프로필 URL 공유 버튼 (클립보드 복사 또는 QR)
- 방문자에게는 "이 원석에게 조각 들려주기" CTA(클릭 유도 버튼) 표시

### 8.4 전체적인 UX 개선 방향

#### 내비게이션 (가장 시급)

현재 페이지 간 이동이 각 페이지의 개별 링크/버튼에 의존하므로, 어떤 형태로든 전역 내비게이션이 필요합니다.

**제안 A**: 미니멀 하단 탭바 (모바일 친화)
```
[공간]  [갤러리]  [올리기]  [프로필]
 ◎       ≡        +         ○
```

**제안 B**: 투명 상단 네비바 (데스크탑 친화)
```
S O R I       [갤러리]  [조각 올리기]  [@닉네임]
```

**제안 C**: 사이드 아이콘 내비게이션 (디자인 감성 유지)
```
(좌측 고정, 아이콘만)
○ — 공간
≡ — 갤러리
+ — 올리기
◎ — 프로필
```

#### 브랜드 아이덴티티 강화

- "S O R I" 브랜드 로고를 SVG 또는 커스텀 폰트로 교체하여 어디서든 일관되게 사용
- 공명(AI) 분석 중 애니메이션에 음파 형태의 시각 효과 도입
- 업로드 성공, 믹스 완료 등 주요 순간(moment)에 더 극적인 연출 추가

---

## 다음 단계

Manus AI 디자인 기획을 위한 권장 작업 순서입니다.

### Phase 1 — 현황 파악 (0.5일)
- [ ] https://sori-bice.vercel.app 직접 접속하여 전체 사용자 흐름 체험
- [ ] 본 문서의 페이지별 구조와 실제 화면 대조 확인
- [ ] 현재 디자인 시스템 컬러, 폰트, 버튼 스타일 스크린샷 캡처

### Phase 2 — 와이어프레임 기획 (1~2일)
- [ ] 4개 페이지(공간, 업로드, 갤러리, 프로필) 와이어프레임 작성
- [ ] 내비게이션 방식 확정 (A/B/C안 중 선택)
- [ ] 온보딩 플로우 기획 (신규 원석 첫 방문 시나리오)
- [ ] 모바일 반응형 레이아웃 기획

### Phase 3 — 비주얼 디자인 (2~3일)
- [ ] 기존 디자인 시스템 기반 UI 컴포넌트 재디자인
- [ ] 업로드 성공 / 믹스 완료 화면 디자인
- [ ] 커스텀 오디오 플레이어 디자인
- [ ] 아이콘 시스템 정의 (Lucide React 기반)

### Phase 4 — 핸드오프 (0.5일)
- [ ] 디자인 스펙 문서 작성 (컬러값, 여백, 폰트 크기)
- [ ] Claude Code(개발팀)에 구현 가이드 전달
- [ ] HANDOFF.md 업데이트

---

## 참고 파일 경로

| 파일 | 경로 | 역할 |
|------|------|------|
| 메인 페이지 | /Users/seungmin/Desktop/SORI/src/app/page.tsx | 공간 / 상태 머신 |
| 업로드 페이지 | /Users/seungmin/Desktop/SORI/src/app/upload/page.tsx | 조각 업로드 |
| 갤러리 페이지 | /Users/seungmin/Desktop/SORI/src/app/gallery/page.tsx | 갤러리 + 믹스 |
| 프로필 페이지 | /Users/seungmin/Desktop/SORI/src/app/profile/[nickname]/page.tsx | 원석 프로필 |
| 씬 스토어 | /Users/seungmin/Desktop/SORI/src/store/sceneStore.ts | 3D 씬 상태 관리 |
| 3D 캔버스 | /Users/seungmin/Desktop/SORI/src/components/3d/SoriCanvas.tsx | 3D 씬 컨테이너 |
| 조각 카드 | /Users/seungmin/Desktop/SORI/src/components/gonmyung/JoakakCard.tsx | 조각 카드 UI |
| 버튼 변형 | /Users/seungmin/Desktop/SORI/src/components/ui/button.tsx | SORI 버튼 스타일 |
| 데이터 타입 | /Users/seungmin/Desktop/SORI/src/lib/gonmyung/types.ts | TypeScript 타입 |
| 글로벌 스타일 | /Users/seungmin/Desktop/SORI/src/app/globals.css | 애니메이션 정의 |

---

*본 문서는 태동(TEDONG) 개발팀이 Manus AI 디자인 기획을 위해 작성한 SORI 서비스 종합 레퍼런스 문서입니다.*
*작성일 2026-02-22 / 버전 v1.0*
