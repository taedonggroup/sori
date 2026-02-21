// 조각 오디오 스트리밍 프록시 (Range 헤더 지원)
import { NextRequest, NextResponse } from "next/server";

const GONMYUNG_API_URL = process.env.NEXT_PUBLIC_GONMYUNG_API_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!GONMYUNG_API_URL) {
    return NextResponse.json({ error: "공명 엔진 URL이 설정되지 않았습니다." }, { status: 503 });
  }
  try {
    const { id } = await params;
    const range = request.headers.get("range");
    const fetchHeaders: HeadersInit = {};
    if (range) fetchHeaders["Range"] = range;

    const response = await fetch(`${GONMYUNG_API_URL}/api/joakak/${id}/audio`, {
      headers: fetchHeaders,
    });

    if (!response.ok && response.status !== 206) {
      return NextResponse.json({ error: "오디오를 불러올 수 없습니다." }, { status: response.status });
    }

    const responseHeaders: Record<string, string> = {
      "Content-Type": response.headers.get("Content-Type") ?? "audio/mpeg",
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=3600",
    };
    const contentRange = response.headers.get("Content-Range");
    if (contentRange) responseHeaders["Content-Range"] = contentRange;
    const contentLength = response.headers.get("Content-Length");
    if (contentLength) responseHeaders["Content-Length"] = contentLength;

    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("오디오 스트리밍 오류:", error);
    return NextResponse.json({ error: "오디오 스트리밍 실패" }, { status: 502 });
  }
}
