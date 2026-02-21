// 구 공명 생성 API — 비활성화됨
// 현재 구조는 조각(joakak) 기반 커뮤니티 플랫폼으로 전환되었습니다.
// 믹싱: POST /api/gonmyung/mix
// 추천: GET /api/gonmyung/recommend
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "이 API는 더 이상 사용되지 않습니다. /api/gonmyung/mix 를 사용하세요." },
    { status: 410 }
  );
}
