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
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* 상단 심플 뒤로가기 */}
      <header className="px-6 py-4 border-b border-zinc-900">
        <Link
          href="/"
          className="text-zinc-500 text-sm hover:text-zinc-300 flex items-center gap-1 transition-colors"
        >
          ← SORI
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {profile ? (
          <div className="space-y-8">
            <ProfileCard profile={profile} />

            {/* 조각 목록 (최대 5개) */}
            {profile.joakak.length > 0 && (
              <div className="space-y-3">
                <p className="text-zinc-600 text-xs tracking-[0.4em] uppercase text-center">
                  조각 아카이브
                </p>
                <div className="w-full space-y-2">
                  {profile.joakak.slice(0, 5).map((joakak, i) => (
                    <div
                      key={joakak.id}
                      className="group flex items-center justify-between p-3 rounded-lg
                        border border-zinc-800 bg-zinc-900
                        hover:border-zinc-700 hover:bg-zinc-800 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-zinc-700 text-xs font-mono w-5 shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="text-zinc-300 text-sm truncate group-hover:text-white transition-colors">
                          {joakak.original_filename}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        {joakak.genre && (
                          <span className="text-zinc-500 text-xs">
                            {joakak.genre}
                          </span>
                        )}
                        {joakak.bpm && (
                          <>
                            <span className="text-zinc-800 text-xs hidden sm:inline">
                              ·
                            </span>
                            <span className="text-zinc-500 text-xs hidden sm:inline">
                              {joakak.bpm}
                            </span>
                          </>
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
                className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2 rounded-lg text-sm transition-colors"
              >
                새 조각 올리기
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 py-24">
            <p className="text-zinc-500 text-sm">원석을 찾을 수 없습니다</p>
            <p className="text-zinc-700 text-xs">@{decodedNickname}</p>
            <Link
              href="/gallery"
              className="text-zinc-400 hover:text-zinc-200 px-4 py-2 rounded-lg text-sm transition-colors inline-block"
            >
              갤러리로 돌아가기
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
