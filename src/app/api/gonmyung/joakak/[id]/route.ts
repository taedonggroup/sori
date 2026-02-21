// 특정 조각 상세 조회 프록시
import { NextRequest, NextResponse } from "next/server";

const GONMYUNG_API_URL = process.env.NEXT_PUBLIC_GONMYUNG_API_URL;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!GONMYUNG_API_URL) {
    return NextResponse.json({ error: "공명 엔진 URL이 설정되지 않았습니다." }, { status: 503 });
  }
  try {
    const { id } = await params;
    const response = await fetch(`${GONMYUNG_API_URL}/api/joakak/${id}`);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("조각 상세 조회 오류:", error);
    return NextResponse.json({ error: "조각을 불러올 수 없습니다." }, { status: 502 });
  }
}
