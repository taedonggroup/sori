"use client"

// SORI 글로벌 네비게이션 — 상업용 서비스 수준으로 개선
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const NAV_LINKS = [
  { href: "/gallery", label: "갤러리" },
  { href: "/upload", label: "조각 올리기" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [nickname, setNickname] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)

  // localStorage에서 닉네임 읽기
  useEffect(() => {
    const stored = localStorage.getItem("sori-nickname")
    if (stored) setNickname(stored)

    // 다른 탭/컴포넌트에서 닉네임 변경 시 동기화
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "sori-nickname") setNickname(e.newValue)
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  // 스크롤 감지 → 배경 블러 강화
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 hidden sm:block transition-all duration-500 ${
        scrolled
          ? "bg-black/90 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-black/60 backdrop-blur-md border-b border-white/[0.03]"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-white text-xs tracking-[0.6em] uppercase font-light group-hover:animate-glow-brand transition-all duration-300">
            SORI
          </span>
          <span className="text-zinc-800 text-[9px] tracking-widest group-hover:text-zinc-600 transition-colors">
            / 공명
          </span>
        </Link>

        {/* 데스크탑 메뉴 */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
                  isActive
                    ? "text-white"
                    : "text-zinc-600 hover:text-zinc-300"
                }`}
              >
                {link.label}
                {/* 액티브 언더라인 — 공명 노란색 */}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-px bg-[#F8F32B]" style={{ boxShadow: "0 0 6px rgba(248, 243, 43, 0.6)" }} />
                )}
              </Link>
            )
          })}

          {/* 구분선 */}
          <div className="w-px h-4 bg-zinc-900 mx-2" />

          {/* 닉네임 또는 프로필 링크 */}
          {nickname ? (
            <Link
              href={`/profile/${encodeURIComponent(nickname)}`}
              className="px-3 py-1.5 text-[10px] tracking-[0.2em] text-[#F8F32B] border border-[#F8F32B]/30 hover:border-[#F8F32B]/60 hover:bg-[#F8F32B]/5 transition-all duration-300 uppercase"
              style={{ boxShadow: "none" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 10px rgba(248, 243, 43, 0.2)"
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none"
              }}
            >
              @{nickname}
            </Link>
          ) : (
            <Link
              href="/upload"
              className="px-3 py-1.5 text-[10px] tracking-[0.2em] text-zinc-600 hover:text-zinc-400 transition-colors uppercase"
            >
              원석 되기
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
