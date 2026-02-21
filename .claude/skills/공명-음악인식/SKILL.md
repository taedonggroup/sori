---
name: 공명-음악인식
description: |
  음악 파일(조각)의 장르, 악기, BPM, 키를 분석하는 공명 AI 엔진 스킬.
  "조각 분석", "음악 인식", "장르 파악", "공명으로 분석", "BPM 추출",
  "원석 페르소나 정의" 요청 시 자동 호출.
  공명 AI 엔진 구현, 수정, 테스트 작업 시 반드시 이 스킬을 사용.
allowed-tools: Bash, Read, Write, Edit
version: 1.0.0
---

# 공명 음악 인식 스킬

## 역할
조각(음악 파일)을 분석하여 원석의 음악적 정체성을 정의합니다.

## 분석 항목
- 장르: Electronic / Acoustic / Hip-hop / Jazz / Classical / Experimental / Hybrid
- 악기: 감지된 주요 악기 목록 (최대 5개)
- BPM: 분당 비트 수
- 키: 음악의 조성 (예: C Major, A minor)
- 원석 페르소나: 분석 결과 기반 음악적 정체성 키워드 3개

## API 연동 구조
```typescript
// src/lib/공명/analyze.ts
export interface 조각분석결과 {
  장르: string;
  악기: string[];
  BPM: number;
  키: string;
  원석_페르소나: [string, string, string];
}

export async function 공명분석(파일: File): Promise<조각분석결과>
```

## 구현 시 주의사항
- 파일 크기 제한: 25MB 이하
- 지원 형식: mp3, wav, flac, m4a
- 분석 소요 시간: 5~15초 (로딩 UI 필수)
- Vercel 서버리스 타임아웃 10초 주의 → Edge Runtime 또는 분할 처리

## 출력 JSON 형식
```json
{
  "장르": "Electronic",
  "악기": ["신디사이저", "드럼머신", "베이스"],
  "BPM": 128,
  "키": "F minor",
  "원석_페르소나": ["몽환적", "실험적", "도시적"]
}
```
