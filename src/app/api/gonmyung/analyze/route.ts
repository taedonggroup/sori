// 공명 AI 엔진 — Gemini 음악 분석 (Supabase URL 방식)
// 파일은 브라우저→Supabase 직접 업로드, Vercel에는 URL만 전달
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

const MIME_MAP: Record<string, string> = {
  mp3: "audio/mp3",
  wav: "audio/wav",
  flac: "audio/flac",
  m4a: "audio/mp4",
};

const GEMINI_PROMPT = `
당신은 전문 음악 분석가입니다. 이 음악 파일을 듣고 아래 JSON 형식으로만 응답하세요.
다른 텍스트는 절대 포함하지 마세요.

{
  "장르": "Electronic | Acoustic | Hip-hop | Jazz | Classical | Experimental | Hybrid | Pop | Rock | R&B | Folk 중 하나",
  "악기": ["감지된 주요 악기 최대 5개 (한국어로)"],
  "BPM": 숫자만,
  "키": "예: C Major, A minor, F# minor 등",
  "원석_페르소나": ["음악적 정체성을 나타내는 감성 키워드 3개 (한국어 형용사)"]
}
`;

// Vercel Hobby 플랜 기본값 10s → 최대 허용치로 설정
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { url?: string; filename?: string };
    const { url, filename } = body;

    if (!url) {
      return NextResponse.json({ error: "오디오 URL이 없습니다." }, { status: 400 });
    }

    // 확장자로 MIME 타입 결정
    const ext = (filename ?? url).split(".").pop()?.toLowerCase() ?? "mp3";
    const mimeType = MIME_MAP[ext] ?? "audio/mp3";

    // Supabase에서 파일 다운로드
    let fileResponse: Response;
    try {
      fileResponse = await fetch(url);
    } catch (fetchError) {
      const msg = fetchError instanceof Error ? fetchError.message : String(fetchError);
      console.error("파일 다운로드 네트워크 오류:", msg);
      return NextResponse.json({ error: `파일에 접근할 수 없습니다: ${msg}` }, { status: 400 });
    }

    if (!fileResponse.ok) {
      console.error("파일 다운로드 실패:", fileResponse.status, url);
      if (fileResponse.status === 404) {
        return NextResponse.json(
          { error: "파일을 찾을 수 없습니다. Supabase 버킷(joakak-audio)이 생성되어 있는지 확인하세요." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: `파일 로드 실패 (HTTP ${fileResponse.status})` },
        { status: 400 }
      );
    }

    const buffer = await fileResponse.arrayBuffer();
    const fileSizeMB = buffer.byteLength / (1024 * 1024);

    // 20MB 초과 시 Gemini inline 방식 거부 (Vercel 메모리 한계)
    if (fileSizeMB > 20) {
      return NextResponse.json(
        { error: `파일이 너무 큽니다 (${fileSizeMB.toFixed(1)}MB). 20MB 이하 파일을 사용해주세요.` },
        { status: 413 }
      );
    }

    const base64 = Buffer.from(buffer).toString("base64");

    // Gemini 2.0 Flash로 분석
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    let result;
    try {
      result = await model.generateContent([
        { text: GEMINI_PROMPT },
        { inlineData: { mimeType, data: base64 } },
      ]);
    } catch (geminiError) {
      const msg = geminiError instanceof Error ? geminiError.message : String(geminiError);
      console.error("Gemini API 오류:", msg);
      if (msg.includes("429") || msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED")) {
        return NextResponse.json(
          { error: "공명이 지금 쉬고 있습니다. 잠시 후 다시 시도해주세요. (API 할당량 초과)" },
          { status: 429 }
        );
      }
      if (msg.includes("API_KEY") || msg.includes("API key")) {
        return NextResponse.json(
          { error: "Gemini API 키가 유효하지 않습니다." },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { error: `공명 분석 중 오류: ${msg}` },
        { status: 500 }
      );
    }

    const rawText = result.response.text().trim()
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    let 분석결과: Record<string, unknown>;
    try {
      분석결과 = JSON.parse(rawText) as Record<string, unknown>;
    } catch {
      console.error("Gemini 응답 JSON 파싱 실패:", rawText);
      return NextResponse.json({ error: "분석 결과를 해석할 수 없습니다. 다시 시도해주세요." }, { status: 500 });
    }

    if (typeof 분석결과.장르 !== "string" || !Array.isArray(분석결과.악기) || typeof 분석결과.BPM !== "number") {
      console.error("Gemini 결과 검증 실패:", 분석결과);
      return NextResponse.json({ error: "분석 결과가 불완전합니다. 다시 시도해주세요." }, { status: 500 });
    }

    return NextResponse.json(분석결과);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("공명 분석 오류:", msg);
    return NextResponse.json({ error: `공명 분석 중 오류가 발생했습니다: ${msg}` }, { status: 500 });
  }
}
