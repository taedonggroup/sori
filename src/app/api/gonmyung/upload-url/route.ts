// 서명된 업로드 URL 발급 — 서버 전용 서비스 키 사용 (RLS 우회)
// 브라우저가 이 URL로 직접 Supabase에 업로드 → anon 키 RLS 정책 불필요
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const STORAGE_BUCKET = "joakak-audio";

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_KEY?.trim();

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Supabase 설정이 누락되었습니다." }, { status: 503 });
  }

  try {
    const body = await request.json() as { filename?: string; contentType?: string };
    const { filename = "audio.mp3", contentType = "audio/mpeg" } = body;

    const ext = filename.split(".").pop()?.toLowerCase() ?? "mp3";
    const path = `uploads/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    // 서비스 키로 클라이언트 생성 (RLS 우회)
    const adminSupabase = createClient(supabaseUrl, serviceKey);

    const { data, error } = await adminSupabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUploadUrl(path);

    if (error || !data) {
      console.error("서명된 URL 생성 실패:", error);
      return NextResponse.json({ error: "업로드 URL 생성에 실패했습니다." }, { status: 500 });
    }

    // 업로드 후 사용할 public URL 미리 계산 (trim으로 개행 제거)
    const baseUrl = supabaseUrl.replace(/\/$/, "");
    const publicUrl = `${baseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path,
      publicUrl,
      contentType,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("업로드 URL 발급 오류:", msg);
    return NextResponse.json({ error: `업로드 URL 발급 실패: ${msg}` }, { status: 500 });
  }
}
