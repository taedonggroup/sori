// 구 오디오 프록시 API — 비활성화됨
// 현재 오디오는 Supabase Storage를 통해 직접 스트리밍됩니다.
// 조각 오디오: GET /api/gonmyung/joakak/[id]/audio
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "이 API는 더 이상 사용되지 않습니다. /api/gonmyung/joakak/[id]/audio 를 사용하세요." },
    { status: 410 }
  );
}
