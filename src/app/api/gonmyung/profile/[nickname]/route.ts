// 원석 프로필 조회 프록시
import { NextRequest, NextResponse } from "next/server";

const GONMYUNG_API_URL = process.env.NEXT_PUBLIC_GONMYUNG_API_URL;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ nickname: string }> }
) {
  if (!GONMYUNG_API_URL) {
    return NextResponse.json({ error: "공명 엔진 URL이 설정되지 않았습니다." }, { status: 503 });
  }
  try {
    const { nickname } = await params;
    const response = await fetch(`${GONMYUNG_API_URL}/api/profile/${encodeURIComponent(nickname)}`);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("프로필 조회 오류:", error);
    return NextResponse.json({ error: "프로필을 불러올 수 없습니다." }, { status: 502 });
  }
}
