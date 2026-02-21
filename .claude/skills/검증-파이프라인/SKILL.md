---
name: 검증-파이프라인
description: |
  코드 품질, 빌드, 타입 검증을 자동으로 실행하는 스킬.
  "검증해줘", "PR 전 체크", "빌드 확인", "타입 에러 확인" 요청 시 사용.
  REVIEWER.md의 검증 체크리스트를 자동화합니다.
allowed-tools: Bash, Read, Write
version: 1.0.0
---

# 검증 파이프라인 스킬

## 자동 실행 순서
1. TypeScript 타입 검사: `npx tsc --noEmit`
2. ESLint 검사: `npm run lint`
3. 빌드 테스트: `npm run build`
4. 보안 체크: .env 키 하드코딩 여부 grep 검사
5. HANDOFF.md 업데이트 여부 확인

## 결과 보고 형식
각 단계 통과/실패 여부와 실패 시 원인 + 수정 코드 제시.
review/ 폴더에 YYYYMMDD_검증.md 파일로 결과 저장.
