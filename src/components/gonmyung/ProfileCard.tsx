"use client";

// 원석 프로필 카드 — 닉네임, 조각 수, 페르소나 집계
import { Badge } from "@/components/ui/badge";
import type { ProfileResponse } from "@/lib/gonmyung/types";

interface ProfileCardProps {
  profile: ProfileResponse;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-6">
      {/* 닉네임 */}
      <div className="space-y-2">
        <p className="text-zinc-500 text-xs tracking-[0.4em] uppercase">원석 프로필</p>
        <h1 className="text-4xl sm:text-5xl font-light tracking-[0.2em] text-white">
          {profile.nickname}
        </h1>
        <p className="text-zinc-500 text-sm tracking-wider">
          조각 {profile.joakak_count}개
        </p>
      </div>

      {/* 페르소나 집계 태그 */}
      {profile.top_personas.length > 0 && (
        <div className="space-y-3">
          <p className="text-zinc-600 text-xs tracking-[0.3em] uppercase">
            공명이 발견한 정체성
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {profile.top_personas.map((persona, i) => (
              <Badge
                key={persona}
                variant="outline"
                className="px-4 py-2 border-[rgba(74,111,165,0.25)] text-zinc-400 text-sm rounded-full
                  transition-all duration-300 hover:border-[rgba(74,111,165,0.6)] hover:text-white
                  animate-fadeInUp"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {persona}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
