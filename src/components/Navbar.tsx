"use client"

// SORI 글로벌 네비게이션 — 데스크탑 상단 바 (모바일은 MobileNav 하단 탭 사용)
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_LINKS = [
  { href: "/gallery", label: "갤러리" },
  { href: "/upload", label: "조각 올리기" },
  { href: "/create", label: "(첫)울림" },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-zinc-900 hidden sm:block">
      <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-white text-xs tracking-[0.6em] uppercase font-light group-hover:text-zinc-300 transition-colors">
            SORI
          </span>
          <span className="text-zinc-800 text-[10px] tracking-widest">/ 공명</span>
        </Link>

        {/* 데스크탑 메뉴 */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-xs tracking-[0.2em] uppercase transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-zinc-600 hover:text-zinc-300"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
