// 공명 AI 엔진 생성 프록시 — HTTPS(Vercel) → HTTP(Jarvis) Mixed Content 해결
import { NextRequest, NextResponse } from "next/server";

const GONMYUNG_API_URL = process.env.NEXT_PUBLIC_GONMYUNG_API_URL;

// 외부 HTTP 오디오 URL → 프록시 경로로 변환
function rewriteAudioUrl(url: string | null): string | null {
  if (!url) return null;
  // /api/audio/xxx.wav 패턴에서 파일명 추출
  const match = url.match(/\/api\/audio\/([^/?]+)/);
  if (match) {
    return `/api/gonmyung/audio?file=${encodeURIComponent(match[1])}`;
  }
  return url;
}

export async function POST(request: NextRequest) {
  if (!GONMYUNG_API_URL) {
    return NextResponse.json(
      { error: "공명 엔진 URL이 설정되지 않았습니다." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(`${GONMYUNG_API_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // 오디오 URL을 프록시 경로로 재작성
    if (data.outputs) {
      data.outputs.full_mix = rewriteAudioUrl(data.outputs.full_mix);
      if (data.outputs.stems) {
        data.outputs.stems.drums = rewriteAudioUrl(data.outputs.stems.drums);
        data.outputs.stems.bass = rewriteAudioUrl(data.outputs.stems.bass);
        data.outputs.stems.melody = rewriteAudioUrl(data.outputs.stems.melody);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("공명 생성 프록시 오류:", error);
    return NextResponse.json(
      { error: "공명 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 502 }
    );
  }
}
