"use client";

// 조각 업로드 페이지 — Supabase 직접 업로드 → Gemini 분석 인라인 표시 → 갤러리 저장
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import ParticleBackground from "@/components/ParticleBackground";
import NicknameInput from "@/components/gonmyung/NicknameInput";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { validateAudioFile } from "@/lib/gonmyung/validation";
import { TEST_SAMPLES, SAMPLE_LICENSE } from "@/lib/gonmyung/samples";
import { uploadAudioToSupabase } from "@/lib/supabase";
import type { 조각분석결과 } from "@/lib/gonmyung/types";

// 분석 결과 인라인 표시 컴포넌트
function 분석결과인라인({ 파일이름, 결과 }: { 파일이름: string; 결과: 조각분석결과 }) {
  const 페르소나색상 = [
    { border: "border-purple-800/50", text: "text-purple-300" },
    { border: "border-blue-800/50", text: "text-blue-300" },
    { border: "border-white/20", text: "text-white" },
  ];
  return (
    <Card className="bg-zinc-950 border-zinc-800 rounded-2xl py-0 animate-fadeInUp w-full">
      <CardContent className="p-5 space-y-4">
        <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase">
          공명 분석 완료 — {파일이름}
        </p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-zinc-600 text-xs mb-1">장르</p>
            <p className="text-white text-sm font-medium">{결과.장르}</p>
          </div>
          <div>
            <p className="text-zinc-600 text-xs mb-1">BPM</p>
            <p className="text-white text-sm font-medium">{결과.BPM}</p>
          </div>
          <div>
            <p className="text-zinc-600 text-xs mb-1">키</p>
            <p className="text-white text-sm font-medium">{결과.키}</p>
          </div>
        </div>
        {결과.악기.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {결과.악기.map((악기) => (
              <Badge key={악기} variant="outline" className="border-zinc-700 text-zinc-400 rounded-full text-xs">
                {악기}
              </Badge>
            ))}
          </div>
        )}
        {결과.원석_페르소나.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {결과.원석_페르소나.slice(0, 3).map((키워드, 인덱스) => {
              const 색상 = 페르소나색상[인덱스] ?? 페르소나색상[2];
              return (
                <Card key={인덱스} className={`bg-zinc-950 border ${색상.border} rounded-xl py-0`}>
                  <CardContent className="p-3 text-center">
                    <p className={`${색상.text} text-xs font-medium`}>{키워드}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function 조각업로드() {
  const router = useRouter();
  const 파일입력참조 = useRef<HTMLInputElement>(null);

  const [닉네임, 닉네임설정] = useState("");
  const [선택된조각, 선택된조각설정] = useState<File | null>(null);
  const [드래그중, 드래그중설정] = useState(false);
  const [업로드중, 업로드중설정] = useState(false);
  const [분석중, 분석중설정] = useState(false);
  const [에러메시지, 에러메시지설정] = useState<string | null>(null);
  const [분석결과, 분석결과설정] = useState<조각분석결과 | null>(null);
  const [supabaseUrl, supabaseUrl설정] = useState<string | null>(null);
  const [진행단계, 진행단계설정] = useState<string>("");

  const 파일크기표시 = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const 조각선택처리 = useCallback((파일: File) => {
    에러메시지설정(null);
    분석결과설정(null);
    supabaseUrl설정(null);
    const validationError = validateAudioFile(파일);
    if (validationError) {
      에러메시지설정(validationError);
      return;
    }
    선택된조각설정(파일);
  }, []);

  const 드래그오버처리 = useCallback((e: React.DragEvent) => { e.preventDefault(); 드래그중설정(true); }, []);
  const 드래그나감처리 = useCallback(() => { 드래그중설정(false); }, []);
  const 드롭처리 = useCallback((e: React.DragEvent) => {
    e.preventDefault(); 드래그중설정(false);
    const 파일 = e.dataTransfer.files[0];
    if (파일) 조각선택처리(파일);
  }, [조각선택처리]);
  const 파일변경처리 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const 파일 = e.target.files?.[0];
    if (파일) 조각선택처리(파일);
  };

  // Supabase 업로드 → Gemini 분석
  const 공명에게들려주기 = async (targetFile: File = 선택된조각!) => {
    if (!targetFile) return;
    분석결과설정(null);
    supabaseUrl설정(null);
    에러메시지설정(null);

    try {
      // 1단계: Supabase Storage에 직접 업로드 (Vercel 경유 없음)
      분석중설정(true);
      진행단계설정("공명에게 전달 중...");
      const audioUrl = await uploadAudioToSupabase(targetFile);
      supabaseUrl설정(audioUrl);

      // 2단계: Vercel에 URL만 전달 → Gemini 분석 (작은 JSON)
      진행단계설정("공명이 듣는 중...");
      const 응답 = await fetch("/api/gonmyung/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: audioUrl, filename: targetFile.name }),
      });

      if (!응답.ok) {
        const 에러 = await 응답.json() as { error?: string };
        throw new Error(에러.error ?? "분석에 실패했습니다.");
      }

      const 결과 = (await 응답.json()) as 조각분석결과;
      분석결과설정(결과);
      if (!선택된조각) 선택된조각설정(targetFile);
    } catch (error) {
      에러메시지설정(error instanceof Error ? error.message : "오류가 발생했습니다.");
    } finally {
      분석중설정(false);
      진행단계설정("");
    }
  };

  // 샘플 선택 → Supabase 업로드 → Gemini 분석
  const 샘플분석하기 = async (samplePath: string, sampleTitle: string) => {
    에러메시지설정(null);
    분석결과설정(null);
    분석중설정(true);
    진행단계설정("샘플 불러오는 중...");
    try {
      const response = await fetch(samplePath);
      const blob = await response.blob();
      const file = new File([blob], `${sampleTitle}.mp3`, { type: "audio/mpeg" });
      선택된조각설정(file);
      await 공명에게들려주기(file);
    } catch {
      에러메시지설정("샘플 분석에 실패했습니다.");
      분석중설정(false);
      진행단계설정("");
    }
  };

  // Jarvis에 URL + 분석 결과 전송 → 저장 → /gallery 이동
  const 갤러리에올리기 = async () => {
    if (!선택된조각 || !분석결과 || !supabaseUrl || !닉네임 || 닉네임.length < 2) return;
    업로드중설정(true);
    에러메시지설정(null);
    try {
      const 응답 = await fetch("/api/gonmyung/joakak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audio_url: supabaseUrl,
          nickname: 닉네임,
          filename: 선택된조각.name,
          analysis: JSON.stringify({
            장르: 분석결과.장르,
            악기: 분석결과.악기,
            BPM: 분석결과.BPM,
            키: 분석결과.키,
            원석_페르소나: 분석결과.원석_페르소나,
          }),
        }),
      });
      if (!응답.ok) {
        const 에러 = await 응답.json() as { error?: string };
        throw new Error(에러.error ?? "업로드에 실패했습니다.");
      }
      router.push("/gallery");
    } catch (error) {
      에러메시지설정(error instanceof Error ? error.message : "업로드 오류가 발생했습니다.");
    } finally {
      업로드중설정(false);
    }
  };

  const 닉네임유효 = 닉네임.length >= 2 && 닉네임.length <= 16;
  const 로딩중 = 분석중 || 업로드중;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center space-y-8">
        {/* 헤더 */}
        <div className="text-center space-y-3">
          <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase">조각 업로드</p>
          <h1 className="text-3xl font-light text-white tracking-tight">당신의 조각을 공명에게</h1>
          <p className="text-zinc-600 text-sm">공명이 당신의 음악을 듣고 분석합니다</p>
        </div>

        {/* 닉네임 입력 */}
        <div className="w-full animate-fadeInUp" style={{ animationDelay: "0.05s" }}>
          <NicknameInput value={닉네임} onChange={닉네임설정} />
        </div>

        {/* 원형 업로드 존 */}
        <div
          className={`
            w-56 h-56 rounded-full border-2 border-dashed
            flex flex-col items-center justify-center
            cursor-pointer transition-all duration-500
            ${드래그중 ? "border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              : 선택된조각 ? "border-white" : "border-zinc-700 hover:border-zinc-500"}
          `}
          onDragOver={드래그오버처리}
          onDragLeave={드래그나감처리}
          onDrop={드롭처리}
          onClick={() => 파일입력참조.current?.click()}
        >
          <input ref={파일입력참조} type="file" accept=".mp3,.wav,.flac,.m4a" className="hidden" onChange={파일변경처리} />
          {선택된조각 ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="flex items-end gap-1 h-8">
                {[0,1,2,3,4].map((i) => (
                  <div key={i} className="w-1 bg-white rounded-full animate-soundwave" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <div className="text-center px-6">
                <p className="text-white text-xs font-medium truncate max-w-[160px]">{선택된조각.name}</p>
                <p className="text-zinc-500 text-xs mt-1">{파일크기표시(선택된조각.size)}</p>
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

        <p className="text-zinc-700 text-xs tracking-wider">mp3 · wav · flac · m4a · 최대 50MB</p>

        {/* 진행 상태 */}
        {진행단계 && (
          <p className="text-zinc-400 text-sm animate-pulse">{진행단계}</p>
        )}

        {/* 에러 메시지 */}
        {에러메시지 && <p className="text-red-400 text-sm text-center">{에러메시지}</p>}

        {/* 분석 결과 인라인 */}
        {분석결과 && 선택된조각 && (
          <div className="w-full">
            <분석결과인라인 파일이름={선택된조각.name} 결과={분석결과} />
          </div>
        )}

        {/* 버튼 영역 */}
        <div className="flex flex-col items-center gap-3 w-full">
          {!분석결과 && (
            <Button variant="sori-outline" size="sori-lg" className="max-w-xs"
              disabled={!선택된조각 || 로딩중} onClick={() => 공명에게들려주기()}>
              {분석중 ? "공명이 듣는 중..." : "공명에게 들려주기"}
            </Button>
          )}
          {분석결과 && (
            <>
              <Button variant="sori-primary" size="sori-lg" className="max-w-xs"
                disabled={!닉네임유효 || 로딩중} onClick={갤러리에올리기}>
                {업로드중 ? "올리는 중..." : "갤러리에 올리기"}
              </Button>
              {!닉네임유효 && <p className="text-zinc-600 text-xs">닉네임을 먼저 입력해주세요</p>}
              <Button variant="sori-ghost" size="sori-lg" className="max-w-xs text-sm"
                onClick={() => 공명에게들려주기()} disabled={로딩중}>
                다시 분석하기
              </Button>
            </>
          )}
        </div>

        {/* 샘플 테스트 */}
        <div className="mt-6 space-y-4 animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
          <p className="text-zinc-600 text-xs tracking-[0.2em] uppercase text-center">
            또는 샘플 조각으로 바로 테스트
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
            {TEST_SAMPLES.map((sample) => (
              <button key={sample.filename} onClick={() => 샘플분석하기(sample.path, sample.title)}
                disabled={로딩중}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-left
                  hover:border-zinc-600 transition-all duration-200
                  disabled:opacity-40 disabled:cursor-not-allowed">
                <p className="text-white text-xs truncate">{sample.title}</p>
                <p className="text-zinc-600 text-[10px] mt-1">{sample.genre}</p>
              </button>
            ))}
          </div>
          <p className="text-zinc-700 text-[9px] text-center">{SAMPLE_LICENSE}</p>
        </div>
      </div>
    </main>
  );
}
