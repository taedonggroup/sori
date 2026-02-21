// 공명 AI 엔진 — 오디오 파일 검증 유틸리티

export const ALLOWED_EXTENSIONS = ["mp3", "wav", "flac", "m4a"] as const;
export const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB (Vercel 서버리스 body 제한)

// 오디오 파일 형식 및 크기 검증. 유효하면 null, 아니면 에러 메시지 반환
export function validateAudioFile(file: File): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext || !(ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) {
    return "mp3, wav, flac, m4a 파일만 업로드할 수 있습니다.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "파일 크기는 4MB 이하여야 합니다.";
  }
  return null;
}
