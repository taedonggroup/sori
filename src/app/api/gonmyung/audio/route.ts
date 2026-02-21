// 공명 오디오 파일 프록시 — Mixed Content 방지
// /api/gonmyung/audio?file=kpop_xxx.wav → http://jarvis:3001/api/audio/kpop_xxx.wav
import { NextRequest, NextResponse } from "next/server";

const GONMYUNG_API_URL = process.env.NEXT_PUBLIC_GONMYUNG_API_URL;

export async function GET(request: NextRequest) {
  const filename = request.nextUrl.searchParams.get("file");

  if (!filename || !GONMYUNG_API_URL) {
    return NextResponse.json({ error: "파일을 찾을 수 없습니다." }, { status: 400 });
  }

  try {
    const response = await fetch(`${GONMYUNG_API_URL}/api/audio/${filename}`);

    if (!response.ok) {
      return NextResponse.json({ error: "오디오 파일을 불러올 수 없습니다." }, { status: response.status });
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("오디오 프록시 오류:", error);
    return NextResponse.json({ error: "오디오 로드 실패" }, { status: 502 });
  }
}
