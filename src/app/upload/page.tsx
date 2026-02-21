"use client";

// 조각 업로드 페이지 — 이글루: 고립된 공간, 빛의 대비
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import ParticleBackground from "@/components/ParticleBackground";
import { validateAudioFile } from "@/lib/gonmyung/validation";
import { TEST_SAMPLES, SAMPLE_LICENSE } from "@/lib/gonmyung/samples";

export default function 조각업로드() {
  const router = useRouter();
  const 파일입력참조 = useRef<HTMLInputElement>(null);
  const [선택된조각, 선택된조각설정] = useState<File | null>(null);
  const [드래그중, 드래그중설정] = useState(false);
  const [업로드중, 업로드중설정] = useState(false);
  const [에러메시지, 에러메시지설정] = useState<string | null>(null);

  const 파일크기표시 = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const 조각선택처리 = useCallback((파일: File) => {
    에러메시지설정(null);
    const validationError = validateAudioFile(파일);
    if (validationError) {
      에러메시지설정(validationError);
      return;
    }
    선택된조각설정(파일);
  }, []);

  const 드래그오버처리 = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    드래그중설정(true);
  }, []);

  const 드래그나감처리 = useCallback(() => {
    드래그중설정(false);
  }, []);

  const 드롭처리 = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    드래그중설정(false);
    const 파일 = e.dataTransfer.files[0];
    if (파일) 조각선택처리(파일);
  }, [조각선택처리]);

  const 파일변경처리 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const 파일 = e.target.files?.[0];
    if (파일) 조각선택처리(파일);
  };

  // 샘플 선택 핸들러
  const 샘플분석하기 = async (samplePath: string, sampleTitle: string) => {
    업로드중설정(true);
    에러메시지설정(null);
    try {
      const response = await fetch(samplePath);
      const blob = await response.blob();
      const file = new File([blob], `${sampleTitle}.mp3`, { type: "audio/mpeg" });

      const formData = new FormData();
      formData.append("file", file);

      const apiResponse = await fetch("/api/gonmyung/analyze", {
        method: "POST",
        body: formData,
      });

      if (!apiResponse.ok) {
        const 에러 = await apiResponse.json();
        throw new Error(에러.error ?? `분석 실패: ${apiResponse.status}`);
      }

      const 결과 = await apiResponse.json();
      const params = new URLSearchParams({
        name: `${sampleTitle}.mp3`,
        result: JSON.stringify(결과),
      });
      router.push(`/analysis?${params.toString()}`);
    } catch (error) {
      에러메시지설정(error instanceof Error ? error.message : "샘플 분석에 실패했습니다.");
    } finally {
      업로드중설정(false);
    }
  };

  const 공명에게들려주기 = async () => {
    if (!선택된조각) return;
    업로드중설정(true);
    에러메시지설정(null);

    try {
      const formData = new FormData();
      formData.append("file", 선택된조각);

      const 응답 = await fetch("/api/gonmyung/analyze", {
        method: "POST",
        body: formData,
      });

      if (!응답.ok) {
        const 에러 = await 응답.json();
        throw new Error(에러.error ?? "분석에 실패했습니다.");
      }

      const 결과 = await 응답.json();

      const params = new URLSearchParams({
        name: 선택된조각.name,
        result: JSON.stringify(결과),
      });
      router.push(`/analysis?${params.toString()}`);
    } catch (error) {
      에러메시지설정(error instanceof Error ? error.message : "오류가 발생했습니다.");
    } finally {
      업로드중설정(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center space-y-10">
        {/* 헤더 */}
        <div className="text-center space-y-3">
          <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase">
            조각 업로드
          </p>
          <h1 className="text-3xl font-light text-white tracking-tight">
            당신의 조각을 공명에게
          </h1>
          <p className="text-zinc-600 text-sm">
            공명이 당신의 음악을 듣고 분석합니다
          </p>
        </div>

        {/* 원형 업로드 존 */}
        <div
          className={`
            w-60 h-60 rounded-full border-2 border-dashed
            flex flex-col items-center justify-center
            cursor-pointer transition-all duration-500 relative
            ${드래그중
              ? "border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              : 선택된조각
                ? "border-white"
                : "border-zinc-700 hover:border-zinc-500"
            }
          `}
          onDragOver={드래그오버처리}
          onDragLeave={드래그나감처리}
          onDrop={드롭처리}
          onClick={() => 파일입력참조.current?.click()}
        >
          <input
            ref={파일입력참조}
            type="file"
            accept=".mp3,.wav,.flac,.m4a"
            className="hidden"
            onChange={파일변경처리}
          />

          {선택된조각 ? (
            <div className="flex flex-col items-center space-y-4">
              {/* 음악 파형 애니메이션 — 5개 bar */}
              <div className="flex items-end gap-1 h-10">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className="w-1 bg-white rounded-full animate-soundwave"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  />
                ))}
              </div>
              <div className="text-center px-6">
                <p className="text-white text-sm font-medium truncate max-w-[180px]">
                  {선택된조각.name}
                </p>
                <p className="text-zinc-500 text-xs mt-1">
                  {파일크기표시(선택된조각.size)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <div className="text-3xl text-zinc-600">&#9835;</div>
              <div className="text-center">
                <p className="text-zinc-400 text-sm">조각을 놓아주세요</p>
                <p className="text-zinc-700 text-xs mt-1">또는 클릭하여 선택</p>
              </div>
            </div>
          )}
        </div>

        {/* 지원 형식 안내 */}
        <p className="text-zinc-700 text-xs tracking-wider">
          mp3 · wav · flac · m4a · 최대 25MB
        </p>

        {/* 에러 메시지 영역 (WARN-3: alert 제거, 인라인 표시) */}
        {에러메시지 && (
          <p className="text-red-400 text-sm text-center">{에러메시지}</p>
        )}

        {/* 공명에게 들려주기 버튼 — 흰 outline + hover glow */}
        <button
          className={`
            w-full max-w-xs py-4 rounded-full text-sm tracking-wider
            border border-white/60 text-white
            transition-all duration-300
            ${선택된조각 && !업로드중
              ? "hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.98]"
              : "opacity-30 cursor-not-allowed"
            }
          `}
          disabled={!선택된조각 || 업로드중}
          onClick={공명에게들려주기}
        >
          {업로드중 ? "공명에게 전달 중..." : "공명에게 들려주기"}
        </button>

        {/* 샘플 조각으로 테스트 */}
        <div className="mt-8 space-y-4 animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
          <div className="text-center">
            <p className="text-zinc-600 text-xs tracking-[0.2em] uppercase">
              또는 샘플 조각으로 바로 테스트
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
            {TEST_SAMPLES.map((sample) => (
              <button
                key={sample.filename}
                onClick={() => 샘플분석하기(sample.path, sample.title)}
                disabled={업로드중}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-left
                  hover:border-zinc-600 transition-all duration-200
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <p className="text-white text-xs truncate">{sample.title}</p>
                <p className="text-zinc-600 text-[10px] mt-1">{sample.genre}</p>
              </button>
            ))}
          </div>

          <p className="text-zinc-700 text-[9px] text-center">
            {SAMPLE_LICENSE}
          </p>
        </div>
      </div>
    </main>
  );
}
