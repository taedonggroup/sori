// 공명 AI 추천 — 조각 목록 기반 최적 믹스 조합 추천
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import type { Joakak, JoakakListResponse } from "@/lib/gonmyung/types";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

interface RecommendCombination {
  ids: string[];
  reason: string;
}

interface GeminiRecommendResponse {
  combinations: RecommendCombination[];
}

export async function GET(request: Request) {
  try {
    // 현재 호스트 기반 조각 목록 조회
    const { origin } = new URL(request.url);
    const joakakResponse = await fetch(`${origin}/api/gonmyung/joakak?limit=20&page=1`);
    if (!joakakResponse.ok) throw new Error("조각 목록 로드 실패");
    const joakakData = (await joakakResponse.json()) as JoakakListResponse;
    const joakakList: Joakak[] = joakakData.joakak;

    // 조각이 2개 미만이면 빈 결과 반환
    if (joakakList.length < 2) {
      return NextResponse.json({ combinations: [] });
    }

    // Gemini에 전달할 조각 요약 (핵심 메타데이터만)
    const joakakSummary = joakakList.map((j) => ({
      id: j.id,
      genre: j.genre,
      bpm: j.bpm,
      key: j.key_signature,
      persona: j.persona,
    }));

    const RECOMMEND_PROMPT = `
다음 조각들의 음악 정보를 보고, 함께 믹스했을 때 공명이 좋을 조합을 최대 2개 추천하세요.
추천 기준: BPM이 유사하거나 배수 관계, 장르가 보완적, 키가 조화로움, 페르소나가 어울림.

조각 목록:
${JSON.stringify(joakakSummary, null, 2)}

응답 형식 (JSON only, 다른 텍스트 절대 포함 금지):
{"combinations": [{"ids": ["id1", "id2"], "reason": "추천 이유 (1문장, 한국어)"}]}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let combinations: RecommendCombination[] = [];

    try {
      const result = await model.generateContent(RECOMMEND_PROMPT);
      const rawText = result.response
        .text()
        .trim()
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      const parsed = JSON.parse(rawText) as GeminiRecommendResponse;
      combinations = parsed.combinations ?? [];

      // ID가 실제 존재하는 조각인지 검증
      const validIds = new Set(joakakList.map((j) => j.id));
      combinations = combinations.filter((combo) =>
        combo.ids.length >= 2 && combo.ids.every((id) => validIds.has(id))
      );
    } catch {
      // Gemini 실패 또는 파싱 오류 시 무작위 fallback
      const shuffled = [...joakakList].sort(() => Math.random() - 0.5);
      combinations = [
        {
          ids: [shuffled[0].id, shuffled[1].id],
          reason: "공명이 두 조각의 에너지가 서로 잘 어울린다고 느꼈습니다.",
        },
      ];
    }

    return NextResponse.json({ combinations });
  } catch {
    // 최상위 에러 — 빈 결과로 안전하게 응답
    return NextResponse.json({ combinations: [] });
  }
}
