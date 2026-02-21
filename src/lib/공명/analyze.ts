// 공명 AI 엔진 — 타입 정의 및 분석 함수

export interface 조각분석결과 {
  장르: string;
  악기: string[];
  BPM: number;
  키: string;
  원석_페르소나: [string, string, string];
}

// 현재는 mock 데이터 반환 (STEP 7에서 실제 AI 연동)
export async function 공명분석(파일: File): Promise<조각분석결과> {
  // 파일 형식 검증
  const 지원형식 = ["audio/mpeg", "audio/wav", "audio/flac", "audio/mp4"];
  if (!지원형식.includes(파일.type) && !파일.name.match(/\.(mp3|wav|flac|m4a)$/i)) {
    throw new Error("지원하지 않는 파일 형식입니다. mp3, wav, flac, m4a만 가능합니다.");
  }

  // 파일 크기 검증 (25MB)
  const 최대크기 = 25 * 1024 * 1024;
  if (파일.size > 최대크기) {
    throw new Error("파일 크기가 25MB를 초과합니다.");
  }

  // API 호출
  const formData = new FormData();
  formData.append("file", 파일);

  const 응답 = await fetch("/api/공명/analyze", {
    method: "POST",
    body: formData,
  });

  if (!응답.ok) {
    throw new Error("공명 분석 중 오류가 발생했습니다.");
  }

  return 응답.json();
}
