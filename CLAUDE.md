# SORI 프로젝트 — Claude Code 지시서

> 이 파일을 읽은 Claude는 SORI 프로젝트의 개발자로서 역할을 수행합니다.

## 프로젝트 정보
- **프로젝트명**: SORI
- **회사**: 태동 (TEDONG)
- **GitHub 조직**: taedonggroup
- **저장소**: https://github.com/taedonggroup/sori
- **Vercel 팀**: taedong-group-3568

## ⚠️ 프로젝트 전용 명칭 (절대 변경 금지)
이 프로젝트는 고유한 명칭 체계를 사용합니다. 코드, 주석, UI 텍스트 모두 아래 명칭을 따릅니다.

| 일반 용어 | SORI 명칭 | 설명 |
|---|---|---|
| 사용자 | 원석 | 서비스를 이용하는 사람 |
| 음악 파일 | 조각 | 업로드하는 음악 소스 |
| AI | 공명 | 음악 분석 AI 엔진 이름 |
| 완성된 음원 | (첫)울림 | 공명이 생성한 결과물 |
| 메인 페이지 | 공간 | 서비스 랜딩/메인 화면 |

## 기술 스택
- **Framework**: Next.js 14 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **언어**: TypeScript (strict 모드)
- **배포**: Vercel
- **저장소**: GitHub (taedonggroup/sori)

## 주요 기능
1. 공간 (메인 페이지) — 원석을 맞이하는 랜딩
2. 조각 업로드 — 원석이 음악 파일을 올리는 기능
3. 공명 분석 — AI가 장르, 악기, BPM, 키를 분석
4. 원석 페르소나 — 분석 결과 기반 음악적 정체성 3줄 요약
5. (첫)울림 생성 — 프로듀싱 방향 및 완성 음원 가이드

## 공명 AI 엔진 스펙
- 입력: 음악 파일 (mp3, wav, flac)
- 출력: { 장르, 악기[], BPM, 키, 원석_페르소나[3] }
- 분석 API: (확정 후 기재)

## 언어 설정
- 모든 응답은 **한국어**로 작성
- 코드 주석은 한국어로 작성
- UI 텍스트는 SORI 명칭 체계 사용

## 브랜치 전략
- `main` — 배포 브랜치 (직접 커밋 금지, PR만)
- `develop` — 통합 개발 브랜치
- `feature/기능명` — 기능 개발 (여기서 작업)

## 협업 규칙
1. 작업 시작 전 `HANDOFF.md` 확인
2. 작업 완료 후 `HANDOFF.md` 업데이트
3. develop으로 PR → 검증자 리뷰 후 머지
4. 커밋 메시지 한국어 작성

## 커밋 메시지 형식
```
feat: 조각 업로드 기능 추가
fix: 공명 분석 API 오류 수정
style: 공간 메인 디자인 변경
docs: HANDOFF 업데이트
```

## 코드 스타일
- TypeScript strict 모드 필수
- 컴포넌트 단위 파일 분리
- 환경변수 반드시 .env 사용 (.env 커밋 금지)
- 폴더명/파일명 영어, UI 텍스트만 한국어 SORI 명칭

## 검증 단계 (PR 전 필수)
1. 기능 동작 확인
2. TypeScript 에러 없음 (npx tsc --noEmit)
3. 빌드 성공 (npm run build)
4. HANDOFF.md 업데이트 완료
