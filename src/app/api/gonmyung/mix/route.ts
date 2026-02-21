// FFmpeg 믹스 프록시 — 오디오 URL 재작성 포함
import { NextRequest, NextResponse } from "next/server";

const GONMYUNG_API_URL = process.env.NEXT_PUBLIC_GONMYUNG_API_URL;

function rewriteMixUrl(url: string | null): string | null {
  if (!url) return null;
  // /api/audio/mix/mix_xxx.wav → /api/gonmyung/audio?file=mix%2Fmix_xxx.wav
  const match = url.match(/\/api\/audio\/(.+)/);
  if (match) {
    return `/api/gonmyung/audio?file=${encodeURIComponent(match[1])}`;
  }
  return url;
}

export async function POST(request: NextRequest) {
  if (!GONMYUNG_API_URL) {
    return NextResponse.json({ error: "공명 엔진 URL이 설정되지 않았습니다." }, { status: 503 });
  }
  try {
    const body = await request.json();
    const response = await fetch(`${GONMYUNG_API_URL}/api/mix`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    // 오디오 URL 재작성
    if (data.output_url) {
      data.output_url = rewriteMixUrl(data.output_url) ?? data.output_url;
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("믹스 오류:", error);
    return NextResponse.json({ error: "믹스 생성에 실패했습니다." }, { status: 502 });
  }
}
