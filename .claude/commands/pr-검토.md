---
description: PR 머지 전 검증 파이프라인을 실행하고 검토 리포트를 생성합니다.
---

# PR 검토 워크플로우

$ARGUMENTS 에 PR 번호 또는 브랜치명 입력.

## 자동 실행 순서
1. git fetch origin && git diff develop..HEAD 변경 파일 파악
2. TypeScript 타입 검사 실행
3. ESLint 검사 실행
4. 빌드 성공 확인
5. .env 키 노출 여부 검사
6. review/폴더에 날짜_PR검토.md 저장
7. 통과 시: "머지 가능합니다" 보고
8. 실패 시: 실패 항목과 수정 코드 제시
