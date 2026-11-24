"use client";

// 조각 업로드 페이지 — 상업용 디자인 개선: 진행 단계 시각화 + 성공 축하 화면 + 페르소나 카드 개선
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NicknameInput from "@/components/gonmyung/NicknameInput";
import { validateAudioFile } from "@/lib/gonmyung/validation";
import { TEST_SAMPLES, SAMPLE_LICENSE } from "@/lib/gonmyung/samples";
import { uploadAudioToSupabase } from "@/lib/supabase";
import type { 조각분석결과 } from "@/lib/gonmyung/types";

// 업로드 진행 단계
type 진행단계타입 = "idle" | "uploading" | "analyzing" | "done";

const PERSONA_COLORS = [
  { bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.4)", text: "#c084fc" },   // purple
  { bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.4)", text: "#60a5fa" },   // blue
  { bg: "rgba(248,243,43,0.08)", border: "rgba(248,243,43,0.4)", text: "#F8F32B" },  // brand
];

// 분석 결과 인라인 표시 컴포넌트 (개선)
function 분석결과인라인({ 파일이름, 결과 }: { 파일이름: string; 결과: 조각분석결과 }) {
  return (
    <div className="bg-black border border-zinc-800 p-5 space-y-5 animate-fadeInUp w-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <p className="text-zinc-600 text-[10px] tracking-[0.5em] uppercase">공명 분석 완료</p>
        <p className="text-zinc-700 text-[10px] font-mono truncate max-w-[180px]">{파일이름}</p>
      </div>

      {/* 수치 데이터 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="border border-zinc-900 p-3 text-center">
          <p className="text-zinc-600 text-[9px] tracking-widest uppercase mb-2">GENRE</p>
          <p className="text-[#00cccc] font-mono text-sm font-medium">{결과.장르}</p>
        </div>
        <div className="border border-zinc-900 p-3 text-center">
          <p className="text-zinc-600 text-[9px] tracking-widest uppercase mb-2">BPM</p>
          <p className="text-white font-mono text-xl font-thin">{결과.BPM}</p>
        </div>
        <div className="border border-zinc-900 p-3 text-center">
          <p className="text-zinc-600 text-[9px] tracking-widest uppercase mb-2">KEY</p>
          <p className="text-white font-mono text-xl font-thin">{결과.키}</p>
        </div>
      </div>

      {/* 악기 태그 */}
      {결과.악기.length > 0 && (
        <div className="border-t border-zinc-900 pt-4">
          <p className="text-zinc-700 text-[9px] tracking-widest uppercase mb-2">악기</p>
          <div className="flex flex-wrap gap-1.5">
            {결과.악기.map((악기) => (
              <span key={악기} className="border border-zinc-800 text-zinc-400 text-[10px] px-2.5 py-1 font-mono tracking-wide">
                {악기}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 원석 페르소나 — 개선된 카드 */}
      {결과.원석_페르소나.length > 0 && (
        <div className="border-t border-zinc-900 pt-4">
          <p className="text-zinc-700 text-[9px] tracking-widest uppercase mb-3">원석 페르소나</p>
          <div className="grid grid-cols-3 gap-2">
            {결과.원석_페르소나.slice(0, 3).map((키워드, 인덱스) => {
              const color = PERSONA_COLORS[인덱스] ?? PERSONA_COLORS[0];
              return (
                <div
                  key={인덱스}
                  className="p-3 text-center relative overflow-hidden"
                  style={{
                    background: color.bg,
                    border: `1px solid ${color.border}`,
                  }}
                >
                  <p
                    className="text-xs font-medium tracking-wide"
                    style={{ color: color.text }}
                  >
                    {키워드}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// 진행 단계 표시 컴포넌트
function 진행단계표시({ 단계 }: { 단계: 진행단계타입 }) {
  const 단계들 = [
    { id: "uploading" as const, label: "공명에게 전달" },
    { id: "analyzing" as const, label: "공명이 듣는 중" },
    { id: "done" as const, label: "분석 완료" },
  ];

  const 현재인덱스 = 단계들.findIndex((s) => s.id === 단계);

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-0">
        {단계들.map((s, i) => {
          const isActive = 단계 === s.id;
          const isDone = 현재인덱스 > i;
          return (
            <div key={s.id} className="flex items-center flex-1">
              <div className={`flex items-center gap-2 flex-1 ${i > 0 ? "ml-0" : ""}`}>
                {/* 연결선 */}
                {i > 0 && (
                  <div
                    className="h-px flex-1 transition-colors duration-500"
                    style={{ background: isDone || isActive ? "#F8F32B" : "#27272a" }}
                  />
                )}
                {/* 단계 점 */}
                <div
                  className="w-2 h-2 rounded-full shrink-0 transition-all duration-500"
                  style={{
                    background: isDone ? "#F8F32B" : isActive ? "#F8F32B" : "#27272a",
                    boxShadow: isActive ? "0 0 8px rgba(248, 243, 43, 0.6)" : "none",
                    animation: isActive ? "glow-pulse-brand 1.5s ease-in-out infinite" : "none",
                  }}
                />
                {/* 레이블 */}
                {i < 단계들.length - 1 && <div className="h-px flex-1 bg-zinc-900" />}
              </div>
            </div>
          );
        })}
      </div>
      {/* 레이블 행 */}
      <div className="flex justify-between">
        {단계들.map((s, i) => {
          const isActive = 단계 === s.id;
          const isDone = 현재인덱스 > i;
          return (
            <p
              key={s.id}
              className="text-[9px] tracking-wider transition-colors duration-300"
              style={{
                color: isDone || isActive ? "#F8F32B" : "#3f3f46",
                textAlign: i === 0 ? "left" : i === 단계들.length - 1 ? "right" : "center",
                flex: 1,
              }}
            >
              {s.label}
            </p>
          );
        })}
      </div>
    </div>
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
  const [진행단계, 진행단계설정] = useState<진행단계타입>("idle");
  const [업로드성공, 업로드성공설정] = useState(false);

  const 파일크기표시 = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const 조각선택처리 = useCallback((파일: File) => {
    에러메시지설정(null);
    분석결과설정(null);
    supabaseUrl설정(null);
    진행단계설정("idle");
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

  const 공명에게들려주기 = async (targetFile: File = 선택된조각!) => {
    if (!targetFile) return;
    분석결과설정(null);
    supabaseUrl설정(null);
    에러메시지설정(null);

    try {
      분석중설정(true);
      진행단계설정("uploading");
      const audioUrl = await uploadAudioToSupabase(targetFile);
      supabaseUrl설정(audioUrl);

      진행단계설정("analyzing");
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
      진행단계설정("done");
      if (!선택된조각) 선택된조각설정(targetFile);
    } catch (error) {
      에러메시지설정(error instanceof Error ? error.message : "오류가 발생했습니다.");
      진행단계설정("idle");
    } finally {
      분석중설정(false);
    }
  };

  // 샘플 분석
  const 샘플분석하기 = async (samplePath: string, sampleTitle: string) => {
    에러메시지설정(null);
    분석결과설정(null);
    분석중설정(true);
    진행단계설정("uploading");
    try {
      const response = await fetch(samplePath);
      const blob = await response.blob();
      const file = new File([blob], `${sampleTitle}.mp3`, { type: "audio/mpeg" });
      const validationError = validateAudioFile(file);
      if (validationError) {
        에러메시지설정(validationError);
        분석중설정(false);
        진행단계설정("idle");
        return;
      }
      선택된조각설정(file);
      await 공명에게들려주기(file);
    } catch {
      에러메시지설정("샘플 분석에 실패했습니다.");
      분석중설정(false);
      진행단계설정("idle");
    }
  };

  // 갤러리에 올리기
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
      // 성공 축하 화면 표시 후 이동
      업로드성공설정(true);
    } catch (error) {
      에러메시지설정(error instanceof Error ? error.message : "업로드 오류가 발생했습니다.");
    } finally {
      업로드중설정(false);
    }
  };

  const 닉네임유효 = 닉네임.length >= 2 && 닉네임.length <= 16;
  const 로딩중 = 분석중 || 업로드중;

  // ✨ 성공 축하 화면
  if (업로드성공) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 pt-16">
        <div className="w-full max-w-sm text-center space-y-8 animate-fadeInUp">
          {/* 발광 원형 */}
          <div
            className="w-20 h-20 mx-auto flex items-center justify-center border border-[#F8F32B]/30 animate-orb-pulse"
          >
            <span className="text-[#F8F32B] text-2xl animate-glow-brand">✦</span>
          </div>

          <div className="space-y-3">
            <p className="text-[#F8F32B] text-[10px] tracking-[0.6em] uppercase animate-glow-brand">
              (첫)울림
            </p>
            <h1 className="text-2xl font-thin text-white tracking-widest leading-relaxed">
              조각이 공간에<br />울리기 시작했습니다
            </h1>
            <p className="text-zinc-600 text-sm">당신의 음악이 다른 원석들과 공명할 준비를 마쳤습니다</p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push("/gallery")}
              className="w-full btn-sori-primary py-4 text-sm tracking-[0.2em]"
            >
              갤러리에서 보기 →
            </button>
            <button
              onClick={() => router.push(`/profile/${encodeURIComponent(닉네임)}`)}
              className="w-full text-zinc-600 py-3 text-sm tracking-[0.2em] hover:text-zinc-400 transition-colors"
            >
              내 프로필 보기
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-start px-4 py-12 pb-28 sm:pb-8 relative overflow-hidden pt-20">
      <div className="w-full max-w-lg flex flex-col items-center space-y-8">
        {/* 뒤로가기 */}
        <div className="w-full">
          <Link
            href="/"
            className="text-zinc-600 text-[10px] tracking-widest hover:text-zinc-400 transition-colors uppercase"
          >
            ← 공간으로
          </Link>
        </div>

        {/* 헤더 */}
        <div className="text-center space-y-2">
          <p className="text-zinc-600 text-[10px] tracking-[0.5em] uppercase">조각 업로드</p>
          <h1 className="text-2xl font-thin text-white tracking-widest">당신의 조각을 공명에게</h1>
          <p className="text-zinc-700 text-xs">공명이 당신의 음악을 듣고 분석합니다</p>
        </div>

        {/* 닉네임 입력 */}
        <div className="w-full animate-fadeInUp" style={{ animationDelay: "0.05s" }}>
          <NicknameInput value={닉네임} onChange={닉네임설정} />
        </div>

        {/* 업로드 존 */}
        <div
          className={`
            w-full max-w-sm h-48 border border-dashed
            flex flex-col items-center justify-center
            cursor-pointer transition-all duration-500 relative overflow-hidden
            ${드래그중
              ? "border-[#F8F32B]/60 bg-[rgba(248,243,43,0.03)]"
              : 선택된조각
                ? "border-zinc-700 bg-zinc-950"
                : "border-zinc-800 hover:border-zinc-600"
            }
          `}
          style={드래그중 ? { boxShadow: "inset 0 0 20px rgba(248,243,43,0.06)" } : {}}
          onDragOver={드래그오버처리}
          onDragLeave={드래그나감처리}
          onDrop={드롭처리}
          onClick={() => 파일입력참조.current?.click()}
        >
          <input ref={파일입력참조} type="file" accept=".mp3,.wav,.flac,.m4a" className="hidden" onChange={파일변경처리} />

          {선택된조각 ? (
            <div className="flex flex-col items-center space-y-3">
              {/* 이퀄라이저 바 5개 */}
              <div className="flex items-end gap-1 h-8">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#F8F32B] rounded-sm"
                    style={{
                      animation: `soundwave ${1.2 + i * 0.1}s ease-in-out infinite`,
                      animationDelay: `${i * 0.15}s`,
                      boxShadow: "0 0 4px rgba(248, 243, 43, 0.4)",
                    }}
                  />
                ))}
              </div>
              <div className="text-center px-6">
                <p className="text-white text-xs font-medium truncate max-w-[200px]">{선택된조각.name}</p>
                <p className="text-zinc-600 text-[10px] mt-1 font-mono">{파일크기표시(선택된조각.size)}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <div className="flex items-end gap-0.5 h-6 opacity-20">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-0.5 bg-zinc-600" style={{ height: `${8 + Math.sin(i) * 8}px` }} />
                ))}
              </div>
              <div className="text-center">
                <p className="text-zinc-500 text-sm tracking-wide">조각을 놓아주세요</p>
                <p className="text-zinc-700 text-[10px] mt-1 tracking-widest">또는 클릭하여 선택</p>
              </div>
            </div>
          )}
        </div>

        <p className="text-zinc-700 text-[10px] tracking-widest uppercase">mp3 · wav · flac · m4a · 최대 50mb</p>

        {/* 진행 단계 시각화 */}
        {진행단계 !== "idle" && (
          <div className="w-full max-w-sm animate-fadeInUp">
            <진행단계표시 단계={진행단계} />
          </div>
        )}

        {/* 에러 메시지 */}
        {에러메시지 && (
          <p className="text-red-400 text-sm text-center">{에러메시지}</p>
        )}

        {/* 분석 결과 인라인 */}
        {분석결과 && 선택된조각 && (
          <div className="w-full">
            <분석결과인라인 파일이름={선택된조각.name} 결과={분석결과} />
          </div>
        )}

        {/* 버튼 영역 */}
        <div className="flex flex-col items-center gap-3 w-full">
          {!분석결과 && (
            <button
              className="w-full btn-sori-outline py-4 text-sm tracking-[0.2em] disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={!선택된조각 || 로딩중}
              onClick={() => 공명에게들려주기()}
            >
              {분석중 ? "공명이 듣는 중..." : "공명에게 들려주기"}
            </button>
          )}
          {분석결과 && (
            <>
              <button
                className="w-full btn-sori-primary py-4 text-sm tracking-[0.2em] disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={!닉네임유효 || 로딩중}
                onClick={갤러리에올리기}
              >
                {업로드중 ? "올리는 중..." : "갤러리에 올리기"}
              </button>
              {!닉네임유효 && (
                <p className="text-zinc-700 text-[10px] tracking-widest">닉네임을 먼저 입력해주세요 (2자 이상)</p>
              )}
              <button
                className="w-full text-zinc-600 py-3 text-sm tracking-[0.2em] hover:text-zinc-400 transition-colors disabled:opacity-30"
                onClick={() => 공명에게들려주기()}
                disabled={로딩중}
              >
                다시 분석하기
              </button>
            </>
          )}
        </div>

        {/* 샘플 테스트 */}
        <div className="mt-6 space-y-4 animate-fadeInUp w-full" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-4 justify-center">
            <div className="flex-1 max-w-12 h-px bg-zinc-900" />
            <p className="text-zinc-700 text-[10px] tracking-[0.5em] uppercase">샘플 조각으로 테스트</p>
            <div className="flex-1 max-w-12 h-px bg-zinc-900" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-zinc-900 max-h-56 overflow-y-auto">
            {TEST_SAMPLES.map((sample) => (
              <button
                key={sample.filename}
                onClick={() => 샘플분석하기(sample.path, sample.title)}
                disabled={로딩중}
                className="bg-black p-3 text-left hover:bg-zinc-950 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                <p className="text-white text-xs truncate group-hover:text-[#F8F32B] transition-colors">{sample.title}</p>
                <p className="text-zinc-700 text-[10px] mt-1 font-mono">{sample.genre}</p>
              </button>
            ))}
          </div>
          <p className="text-zinc-800 text-[9px] text-center tracking-wider">{SAMPLE_LICENSE}</p>
        </div>
      </div>
    </main>
  );
}
