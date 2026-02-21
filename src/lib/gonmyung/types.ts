// 공명(GONMYUNG) AI 엔진 타입 정의

// K-Content 핵심 장르 우선순위 구분
export type GenreTier = "core" | "standard";

export interface GonmyungPreset {
  id: number;
  genre: string;
  name: string;
  mood: string;
  tier: GenreTier;
  isKContent?: boolean;
  base_frequency: number;
  bpm: [number, number];
  eq: { low: number; mid: number; high: number };
  reverb: number;
  compression: number;
}

// K-Content 특화 메타데이터
export interface KContentMetadata {
  targetScene: string;    // 예: "비 오는 날 카페", "복수극 오프닝"
  emotionTags: string[];  // 예: ["서정적", "긴장감"]
  targetAudience: string; // 예: "K-드라마 PD", "아이돌 프로듀서"
}

// 조각 분석 결과 타입
export interface 조각분석결과 {
  장르: string;
  악기: string[];
  BPM: number;
  키: string;
  원석_페르소나: string[];
}

export interface GenerateRequest {
  genre: string;
  duration: number;
  mood: string;
}

export interface GenerateResponse {
  success: boolean;
  genre: string;
  mood: string;
  duration: number;
  preset_applied: string;
  preset_eq: { low: number; mid: number; high: number };
  preset_reverb: number;
  mode: "ai" | "simulation";
  outputs: {
    full_mix: string;
    stems: {
      drums: string | null;
      bass: string | null;
      melody: string | null;
    };
  };
}

// 갤러리 조각 타입
export interface Joakak {
  id: string;
  nickname: string;
  original_filename: string;
  genre: string | null;
  bpm: number | null;
  key_signature: string | null;
  instruments: string[];
  persona: string[];
  duration: number | null;
  file_size: number;
  created_at: string;
  play_count: number;
}

export interface JoakakListResponse {
  joakak: Joakak[];
  total: number;
  page: number;
  has_next: boolean;
}

export interface ProfileResponse {
  nickname: string;
  joakak_count: number;
  top_personas: string[];
  joakak: Joakak[];
}

export interface MixRequest {
  joakak_ids: string[];
  duration?: number;
}

export interface MixResponse {
  success: boolean;
  output_url: string;
  joakak_count: number;
  duration: number;
}
