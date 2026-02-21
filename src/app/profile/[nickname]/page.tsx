// 원석 프로필 동적 라우트 — 서버사이드 렌더링 (SEO)
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProfileBackground from "@/components/gonmyung/ProfileBackground";
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
    <main className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* 3D 배경 + 파티클 (클라이언트 컴포넌트) */}
      <ProfileBackground />

      {/* 상단 브랜드 */}
      <header className="fixed top-0 left-0 z-20 p-6 md:p-8">
        <Link href="/">
          <span className="text-zinc-600 text-xs tracking-[0.3em] uppercase font-light hover:text-zinc-400 transition-colors">
            SORI
          </span>
        </Link>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-24">
        {profile ? (
          <div className="w-full max-w-lg space-y-10 animate-fadeInUp">
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
                        border border-zinc-900 bg-black/60 backdrop-blur-sm
                        hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-300"
                      style={{ animationDelay: `${i * 60}ms` }}
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
                          <span className="text-zinc-500 text-xs">{joakak.genre}</span>
                        )}
                        {joakak.bpm && (
                          <>
                            <span className="text-zinc-800 text-xs hidden sm:inline">·</span>
                            <span className="text-zinc-500 text-xs hidden sm:inline">{joakak.bpm}</span>
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

            {/* 액션 버튼 */}
            <div className="flex justify-center">
              <Button
                variant="sori-outline"
                className="px-6 rounded-full text-xs tracking-wider"
                asChild
              >
                <Link href="/upload">새 조각 올리기</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 animate-fadeInUp">
            <p className="text-zinc-500 text-sm">원석을 찾을 수 없습니다</p>
            <p className="text-zinc-700 text-xs">@{decodedNickname}</p>
            <Button variant="sori-ghost" asChild>
              <Link href="/gallery">갤러리로 돌아가기</Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
