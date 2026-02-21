// Supabase 클라이언트 — 서명된 업로드 URL 방식 (RLS 우회)
// 흐름: 브라우저 → /api/gonmyung/upload-url (서비스 키로 서명) → signedUrl로 직접 업로드
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const STORAGE_BUCKET = "joakak-audio";

// 서버에서 서명된 URL 발급 → 브라우저가 직접 Supabase에 업로드
export async function uploadAudioToSupabase(file: File): Promise<string> {
  // 1단계: 서버에서 서명된 업로드 URL 발급
  const urlResponse = await fetch("/api/gonmyung/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type || "audio/mpeg",
    }),
  });

  if (!urlResponse.ok) {
    const err = await urlResponse.json() as { error?: string };
    throw new Error(err.error ?? "업로드 URL 발급에 실패했습니다.");
  }

  const { signedUrl, publicUrl } = await urlResponse.json() as {
    signedUrl: string;
    token: string;
    path: string;
    publicUrl: string;
    contentType: string;
  };

  // 2단계: 서명된 URL로 브라우저에서 직접 Supabase에 PUT 업로드
  const uploadResponse = await fetch(signedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "audio/mpeg" },
    body: file,
  });

  if (!uploadResponse.ok) {
    const text = await uploadResponse.text();
    throw new Error(`Supabase 업로드 실패 (${uploadResponse.status}): ${text}`);
  }

  return publicUrl;
}
