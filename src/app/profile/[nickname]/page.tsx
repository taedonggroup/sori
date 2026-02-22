// 원석 프로필 동적 라우트 — 서버사이드 렌더링 (SEO)
import Link from "next/link";
import ProfileCard from "@/components/gonmyung/ProfileCard";
import type { ProfileResponse } from "@/lib/gonmyung/types";

async function getProfile(nickname: string): Promise<ProfileResponse | null> {
  const apiUrl = process.env.NEXT_PUBLIC_GONMYUNG_API_URL;
  if (!apiUrl) return null;
  try {
    const response = await fetch(
      `${apiUrl}/api/profile/${encodeURIComponent(nickname)}`,
      { next: { revalidate: 60 } }
    );
    if (!response.ok) return null;
    return response.json() as Promise<ProfileResponse>;
  } catch {
    return null;
  }
}

interface ProfilePageProps {
  params: Promise<{ nickname: string }>;
}

export default async function 원석프로필페이지({ params }: ProfilePageProps) {
  const { nickname } = await params;
  const decodedNickname = decodeURIComponent(nickname);
  const profile = await getProfile(decodedNickname);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* 상단 헤더 */}
      <header className="border-b border-zinc-900 px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-zinc-600 text-[10px] tracking-[0.5em] uppercase hover:text-zinc-400 transition-colors"
          >
            SORI
          </Link>
          <p className="text-zinc-700 text-[10px] tracking-[0.3em] uppercase">원석 프로필</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 pb-28 sm:pb-10">
        {profile ? (
          <div className="space-y-8">
            <ProfileCard profile={profile} />

            {/* 조각 목록 (최대 5개) */}
            {profile.joakak.length > 0 && (
              <div className="space-y-3">
                <p className="text-zinc-600 text-[10px] tracking-[0.5em] uppercase text-center">
                  조각 아카이브
                </p>
                <div className="w-full">
                  {profile.joakak.slice(0, 5).map((joakak, i) => (
                    <div
                      key={joakak.id}
                      className="border-b border-zinc-900 py-3 flex items-center gap-4 hover:bg-zinc-900/30 px-2 transition-colors"
                    >
                      <span className="text-zinc-700 text-[10px] font-mono w-6 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-zinc-300 text-sm flex-1 truncate">
                        {joakak.original_filename}
                      </p>
                      <div className="flex items-center gap-3 shrink-0">
                        {joakak.genre && (
                          <span className="text-zinc-600 text-[10px] font-mono">{joakak.genre}</span>
                        )}
                        {joakak.bpm && (
                          <span className="text-zinc-700 text-[10px] font-mono">{joakak.bpm}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {profile.joakak.length > 5 && (
                  <p className="text-zinc-700 text-xs text-center tracking-wider">
                    +{profile.joakak.length - 5}개 더
                  </p>
                )}
              </div>
            )}

            {/* 새 조각 올리기 버튼 */}
            <div className="flex justify-center">
              <Link
                href="/upload"
                className="border border-zinc-800 text-zinc-400 text-xs tracking-[0.3em] px-6 py-3 hover:border-zinc-600 hover:text-zinc-200 transition-all uppercase"
              >
                새 조각 올리기
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 py-24">
            <p className="text-zinc-500 text-sm tracking-[0.2em]">원석을 찾을 수 없습니다</p>
            <p className="text-zinc-700 text-[10px] font-mono">@{decodedNickname}</p>
            <Link
              href="/gallery"
              className="text-zinc-600 text-xs tracking-[0.2em] hover:text-zinc-300 transition-colors uppercase inline-block"
            >
              갤러리로 돌아가기
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
