// 조각 목록 조회 + 업로드 프록시
import { NextRequest, NextResponse } from "next/server";

const GONMYUNG_API_URL = process.env.NEXT_PUBLIC_GONMYUNG_API_URL;

export async function GET(request: NextRequest) {
  if (!GONMYUNG_API_URL) {
    return NextResponse.json({ error: "공명 엔진 URL이 설정되지 않았습니다." }, { status: 503 });
  }
  try {
    const searchParams = request.nextUrl.searchParams.toString();
    const url = `${GONMYUNG_API_URL}/api/joakak/list${searchParams ? `?${searchParams}` : ""}`;
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("조각 목록 조회 오류:", error);
    return NextResponse.json({ error: "조각 목록을 불러올 수 없습니다." }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  if (!GONMYUNG_API_URL) {
    return NextResponse.json({ error: "공명 엔진 URL이 설정되지 않았습니다." }, { status: 503 });
  }
  try {
    // Supabase URL 방식: JSON으로 { audio_url, nickname, filename, analysis } 수신
    const body = await request.json() as {
      audio_url: string;
      nickname: string;
      filename: string;
      analysis: string;
    };
    const response = await fetch(`${GONMYUNG_API_URL}/api/joakak/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("조각 업로드 오류:", error);
    return NextResponse.json({ error: "조각 업로드에 실패했습니다." }, { status: 502 });
  }
}
