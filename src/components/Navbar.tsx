"use client"

// SORI 글로벌 네비게이션 바
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_LINKS = [
  { href: "/", label: "공간" },
  { href: "/gallery", label: "갤러리" },
  { href: "/upload", label: "조각 올리기" },
  { href: "/create", label: "(첫)울림" },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-900">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-teal-400 text-xs tracking-[0.3em] uppercase font-medium group-hover:text-teal-300 transition-colors">
            SORI
          </span>
          <span className="text-zinc-700 text-xs">/ 공명</span>
        </Link>

        {/* 메뉴 링크 */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
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
