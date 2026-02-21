# SORI 프로젝트 — 검증자 온보딩 가이드

> 외부 검증자를 위한 시작 가이드입니다.
> 검증자는 코드 읽기와 검증 리포트 작성만 수행합니다.

---

## Step 1 — Claude Code 설치

```bash
npm install -g @anthropic-ai/claude-code
```

설치 후 로그인:
```bash
claude login
```

---

## Step 2 — 저장소 클론

```bash
git clone https://github.com/taedonggroup/sori.git
cd sori
```

> 저장소에 대한 **쓰기(push) 권한은 없습니다.** 읽기 전용입니다.

---

## Step 3 — Claude Code 실행

```bash
claude
```

Claude에게 이렇게 말하세요:
```
REVIEWER.md 읽고 검증자 모드로 시작해줘
```

Claude가 REVIEWER.md를 읽고 **검증 전용 모드**로 전환됩니다.

---

## Step 4 — 검증 수행

최신 코드로 업데이트 후 검증 시작:

```bash
git fetch origin
git checkout develop
git pull origin develop
```

Claude와 함께 검증:
```
develop 브랜치 코드 전체 검증해줘
```

---

## Step 5 — 결과 제출 (2가지 방법)

### 방법 A — GitHub 이슈 등록 (버그 발견 시)
Claude에게: `발견한 버그를 GitHub 이슈로 등록해줘`

### 방법 B — 검증 리포트 작성
Claude에게: `오늘 검증 결과를 review/ 폴더에 리포트로 저장해줘`

---

## 주의 사항

- `git push` 명령은 권한이 없어 실행되지 않습니다
- 코드를 직접 수정하지 마세요
- 발견한 문제는 반드시 GitHub Issues로 보고해주세요
