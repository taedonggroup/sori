// 공명 AI 엔진 API Route — Gemini로 음악 파일 직접 분석
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

// 지원 형식 목록
const 지원형식: Record<string, string> = {
  "mp3": "audio/mp3",
  "wav": "audio/wav",
  "flac": "audio/flac",
  "m4a": "audio/mp4",
  "aac": "audio/aac",
  "ogg": "audio/ogg",
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const 파일 = formData.get("file") as File | null;

    if (!파일) {
      return NextResponse.json({ error: "조각 파일이 없습니다." }, { status: 400 });
    }

    // 파일 형식 검증
    const 확장자 = 파일.name.split(".").pop()?.toLowerCase() ?? "";
    const mimeType = 지원형식[확장자];
    if (!mimeType) {
      return NextResponse.json(
        { error: "지원하지 않는 형식입니다. mp3, wav, flac, m4a만 가능합니다." },
        { status: 400 }
      );
    }

    // 파일 크기 검증 (25MB)
    if (파일.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: "파일 크기는 25MB 이하여야 합니다." },
        { status: 400 }
      );
    }

    // 파일을 base64로 변환
    const 버퍼 = await 파일.arrayBuffer();
    const base64 = Buffer.from(버퍼).toString("base64");

    // Gemini 2.0 Flash로 음악 직접 분석
    const 모델 = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const 프롬프트 = `
당신은 전문 음악 분석가입니다. 이 음악 파일을 듣고 아래 JSON 형식으로만 응답하세요.
다른 텍스트는 절대 포함하지 마세요.

{
  "장르": "Electronic | Acoustic | Hip-hop | Jazz | Classical | Experimental | Hybrid | Pop | Rock | R&B | Folk 중 하나",
  "악기": ["감지된 주요 악기 최대 5개 (한국어로)"],
  "BPM": 숫자만,
  "키": "예: C Major, A minor, F# minor 등",
  "원석_페르소나": ["음악적 정체성을 나타내는 감성 키워드 3개 (한국어 형용사)"]
}

예시:
{
  "장르": "Electronic",
  "악기": ["신디사이저", "드럼머신", "베이스", "패드"],
  "BPM": 128,
  "키": "F minor",
  "원석_페르소나": ["몽환적", "실험적", "도시적"]
}
`;

    const 결과 = await 모델.generateContent([
      { text: 프롬프트 },
      {
        inlineData: {
          mimeType,
          data: base64,
        },
      },
    ]);

    const 응답텍스트 = 결과.response.text().trim();

    // JSON 파싱 (마크다운 코드블록 제거)
    const 정제된텍스트 = 응답텍스트
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const 분석결과 = JSON.parse(정제된텍스트);

    return NextResponse.json(분석결과);
  } catch (error) {
    console.error("공명 분석 오류:", error);
    return NextResponse.json(
      { error: "공명 분석 중 오류가 발생했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
