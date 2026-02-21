# SORI 프로젝트 — 협업자 온보딩 가이드

> 처음 합류하는 바이브 코더를 위한 시작 가이드입니다.
> 아래 순서대로 따라하면 10분 안에 개발 환경이 준비됩니다.

---

## Step 1 — Claude Code 설치

Claude Code가 없다면 먼저 설치하세요.

```bash
npm install -g @anthropic-ai/claude-code
```

설치 후 로그인:

```bash
claude login
```

> Anthropic 계정이 없다면 https://claude.ai 에서 가입 후 API 키 발급

---

## Step 2 — 저장소 클론

```bash
git clone https://github.com/taedonggroup/sori.git
cd sori
```

---

## Step 3 — Claude Code 실행

```bash
claude
```

프로젝트 폴더에서 실행하면 **Claude가 CLAUDE.md를 자동으로 읽고**
SORI 프로젝트 컨텍스트로 대화를 시작합니다.

---

## Step 4 — 작업 시작 전 HANDOFF.md 확인

Claude에게 이렇게 말하세요:

```
HANDOFF.md 읽고 현재 상태 요약해줘
```

---

## Step 5 — 내 브랜치 생성 후 작업

```bash
git checkout develop
git pull origin develop
git checkout -b feature/내작업명
```

Claude와 함께 개발 후:

```bash
git add .
git commit -m "feat: 기능 설명"
git push origin feature/내작업명
```

GitHub에서 `develop` 브랜치로 PR 생성

---

## Step 6 — 작업 완료 후 HANDOFF.md 업데이트

Claude에게 이렇게 말하세요:

```
오늘 작업 내용을 HANDOFF.md에 업데이트해줘
```

---

## 자주 쓰는 Claude 명령어

| 명령 | 설명 |
|------|------|
| `HANDOFF.md 확인해줘` | 현재 프로젝트 상태 파악 |
| `PR 만들어줘` | GitHub PR 자동 생성 |
| `코드 리뷰해줘` | 변경사항 리뷰 |
| `버그 고쳐줘` | 에러 분석 및 수정 |

---

## 문의

GitHub Issues: https://github.com/taedonggroup/sori/issues
