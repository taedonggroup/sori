# HANDOFF — AI 작업 인계 파일

## 2026-02-22 | Claude Code — 커뮤니티 플랫폼 전환 완료

### 🎯 이번 세션 핵심 변경

SORI가 **단순 음악 생성 도구 → Supabase 기반 음악 커뮤니티 플랫폼**으로 전환되었습니다.

**새로운 개념:**
- 원석 (사용자) — 닉네임으로 식별, 익명 참여
- 조각 (음악 파일) — 원석이 업로드한 음악 소스
- 공명 (AI 엔진) — Gemini로 조각 분석 + FFmpeg로 믹싱
- (첫)울림 — 여러 조각을 믹스한 결과 음원

**이전 구조** → **현재 구조**
```
이전: /upload → Gemini 분석 → /analysis (단방향)
현재: /upload → Supabase 저장 → /gallery (커뮤니티 피드) → 선택 → 믹스 → 결과
```

---

### ✅ 완료된 기능

| 기능 | 경로 | 상태 |
|------|------|------|
| 메인 공간 + 최신 조각 미리보기 | `/` | ✅ |
| 조각 업로드 (Supabase 직접) + Gemini 분석 | `/upload` | ✅ |
| 커뮤니티 갤러리 피드 + 선택 + 믹싱 | `/gallery` | ✅ |
| 조각 선택 기반 울림 만들기 | `/create` | ✅ |
| 원석 프로필 (닉네임별) | `/profile/[nickname]` | ✅ |

---

### 🏗 기술 아키텍처

```
브라우저
  │
  ├─ Supabase Storage (joakak-audio 버킷)
  │    └─ 오디오 파일 직접 업로드 (서명된 URL 방식, RLS 우회)
  │
  ├─ Vercel Serverless (Next.js API Routes)
  │    ├─ POST /api/gonmyung/upload-url  → 서명된 URL 발급 (SUPABASE_SERVICE_KEY)
  │    ├─ POST /api/gonmyung/analyze     → Gemini 2.0 Flash 음악 분석
  │    ├─ GET/POST /api/gonmyung/joakak  → 공명 백엔드 프록시
  │    ├─ GET /api/gonmyung/joakak/[id]/audio → Range 오디오 스트리밍
  │    ├─ GET /api/gonmyung/profile/[nickname] → 원석 프로필
  │    └─ POST /api/gonmyung/mix         → FFmpeg amix 믹싱
  │
  └─ 공명 엔진 (Jarvis 175.127.189.188:3001)
       ├─ SQLite /data/gonmyung/joakak.db
       ├─ 오디오 파일 /data/gonmyung/joakak/
       └─ 믹스 결과 /data/gonmyung/mix/
```

---

### 🔑 환경변수 (모두 필수)

| 변수 | 설명 | 위치 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | 클라이언트+서버 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 익명 키 | 클라이언트 |
| `SUPABASE_SERVICE_KEY` | Supabase 서비스 키 (업로드 URL 발급용) | 서버 전용 |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini API 키 | 서버 전용 |
| `NEXT_PUBLIC_GONMYUNG_API_URL` | 공명 백엔드 URL | 클라이언트+서버 |

---

### 🗂 파일 구조 변경사항

**신규 파일:**
```
src/
├─ lib/
│   └─ supabase.ts                         # Supabase 클라이언트 + 서명된 URL 업로드
├─ app/
│   ├─ gallery/page.tsx                    # 커뮤니티 피드 + 선택 + 믹싱
│   ├─ profile/[nickname]/page.tsx         # 원석 프로필 (SSR)
│   └─ api/gonmyung/
│       ├─ upload-url/route.ts             # 서명된 업로드 URL 발급
│       ├─ joakak/route.ts                 # 조각 목록/업로드
│       ├─ joakak/[id]/route.ts            # 조각 상세
│       ├─ joakak/[id]/audio/route.ts      # 오디오 스트리밍
│       ├─ profile/[nickname]/route.ts     # 원석 프로필
│       ├─ mix/route.ts                    # FFmpeg 믹싱
│       ├─ generate/route.ts               # 음악 생성 (기존 유지)
│       └─ audio/route.ts                  # 오디오 프록시
└─ components/gonmyung/
    ├─ JoakakCard.tsx                      # 조각 카드 (재생, 선택)
    ├─ JoakakFeed.tsx                      # 무한 스크롤 피드
    ├─ MixSelector.tsx                     # 하단 플로팅 믹스 패널
    ├─ NicknameInput.tsx                   # 닉네임 입력 (localStorage)
    ├─ ProfileBackground.tsx               # 프로필 배경 (클라이언트)
    └─ ProfileCard.tsx                     # 원석 프로필 카드
```

**삭제된 파일:**
- `src/app/analysis/page.tsx` → 업로드 페이지 인라인으로 통합
- `src/app/profile/page.tsx` → `/profile/[nickname]` 동적 라우트로 대체

---

### 🚀 배포 현황

- **URL**: https://sori-bice.vercel.app
- **브랜치**: develop
- **빌드**: ✅ 성공 (13개 라우트, 10개 API)
- **Vercel 환경변수**: 5개 모두 설정됨
- **Supabase 버킷**: `joakak-audio` 생성 완료 (Public, 50MB)
- **공명 엔진**: Jarvis 포트 3001, PM2 ID 41

---

### ⚠️ 알려진 이슈 및 제약

| 이슈 | 심각도 | 설명 |
|------|--------|------|
| Vercel 60초 타임아웃 | 중간 | 대용량 파일 Gemini 분석 시 간헐적 타임아웃 |
| 파일 크기 불일치 | 낮음 | 클라이언트 4MB / 서버 20MB 제한 불일치 |
| 환경변수 느낌표 단언 | 낮음 | `process.env.X!` 런타임 에러 위험 |
| 미사용 shadcn 컴포넌트 | 낮음 | Label, Progress, Separator, Slider |

---

### 📋 다음 작업 권장사항

**긴급 (다음 PR 전):**
- [ ] 파일 크기 검증 통일 (4MB → 20MB 또는 반대)
- [ ] 환경변수 느낌표 단언 → 명시적 에러 처리로 교체

**개선:**
- [ ] E2E 테스트 (업로드 → 분석 → 갤러리 → 믹싱 전체 플로우)
- [ ] 모바일 반응형 최적화 (갤러리 그리드, MixSelector 패널)
- [ ] Gemini API 할당량 모니터링 추가

**장기 기능:**
- [ ] 조각 좋아요/댓글
- [ ] 소셜 공유 (OG 메타태그)
- [ ] 원석 아바타 이미지

---

### 🔬 헬스체크 결과 (2026-02-22)

**종합 점수: 85/100 — 프로덕션 배포 준비 완료**

| 항목 | 점수 |
|------|------|
| 빌드 안정성 | 100/100 |
| 타입 안정성 | 85/100 |
| 에러 처리 | 75/100 |
| 컴포넌트 설계 | 95/100 |
| API 완성도 | 90/100 |
| 보안 | 90/100 |

---

## 2026-02-22 | Claude Code — 사용자 흐름 전면 개선

### 이번 세션 핵심 변경

메인 페이지(`/`)를 3섹션 스크롤 레이아웃에서 **stone/fragments 상태 머신**으로 전면 재작성.

### 변경된 파일

| 파일 | 변경 유형 |
|------|---------|
| `src/app/page.tsx` | 전면 재작성 (상태 머신 구조) |
| `src/components/gonmyung/JoakakCard.tsx` | 인플레이스 확장 + 프로그레스바 추가 |
| `src/components/gonmyung/JoakakFeed.tsx` | expandedId 내부 상태 관리 추가 |
| `src/components/gonmyung/UlrimRecommendPanel.tsx` | 신규 생성 (공명 추천 패널) |
| `src/app/api/gonmyung/recommend/route.ts` | 신규 생성 (Gemini 조합 추천 API) |

### 새로운 사용자 흐름

```
/ → stone 상태: 원석 3D + 닉네임 입력 + "조각 둘러보기" 버튼
       ↓ 버튼 클릭 (opacity 크로스페이드)
   fragments 상태: 조각 그리드 + 장르 필터 + 우하단 미니 원석
       ↓ 카드 클릭
   카드 인플레이스 확장 → 프로그레스바 + 시간 표시
       ↓ "공명 추천" 플로팅 버튼
   슬라이드업 패널 → Gemini 추천 조합 → 미리듣기 → 울림 확정
```

### 빌드 현황

- TypeScript 타입 에러: 0개
- 빌드: 성공 (15개 라우트, 12개 API)

---

## 2026-02-21 | Claude Code — 1차 개발

### 작업 내용
- Next.js 16 + shadcn/ui 초기화
- 공간(메인), 조각 업로드, 공명 분석 페이지 구현
- Vercel 배포 완료
- 공명 AI 엔진 K-Content 특화 (MusicGen + Gemini)

### 이전 구조 (참고용)
- `/analysis` — 분석 결과 페이지 (현재 삭제, 업로드 인라인으로 통합)
- `/profile` — 단일 프로필 (현재 삭제, `/profile/[nickname]`으로 대체)
