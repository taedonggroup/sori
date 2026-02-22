"use client"

// SORI 모바일 하단 탭 네비게이션 — 모바일 앱 UX
import Link from "next/link"
import { usePathname } from "next/navigation"

const TAB_ITEMS = [
  {
    href: "/",
    label: "공간",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle
          cx="10" cy="10" r="5"
          stroke={active ? "#14b8a6" : "#52525b"}
          strokeWidth="1"
        />
        <circle
          cx="10" cy="10" r="1.5"
          fill={active ? "#14b8a6" : "#52525b"}
        />
      </svg>
    ),
  },
  {
    href: "/gallery",
    label: "갤러리",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        {/* 음악 라인들 */}
        {[3, 6, 9, 12, 15].map((x, i) => (
          <line
            key={x}
            x1={x} y1={16 - [6, 10, 8, 12, 5][i]}
            x2={x} y2="16"
            stroke={active ? "#14b8a6" : "#52525b"}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}
      </svg>
    ),
  },
  {
    href: "/upload",
    label: "올리기",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <line x1="10" y1="15" x2="10" y2="5" stroke={active ? "#14b8a6" : "#52525b"} strokeWidth="1.5" />
        <polyline points="6,9 10,5 14,9" stroke={active ? "#14b8a6" : "#52525b"} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        <line x1="4" y1="16" x2="16" y2="16" stroke={active ? "#14b8a6" : "#52525b"} strokeWidth="1" opacity="0.5" />
      </svg>
    ),
  },
  {
    href: "/create",
    label: "울림",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        {/* 믹싱 파형 */}
        <path
          d="M2 10 Q5 6 8 10 Q11 14 14 10 Q17 6 18 10"
          stroke={active ? "#14b8a6" : "#52525b"}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-t border-zinc-900 sm:hidden">
      <div className="flex items-stretch h-16">
        {TAB_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-colors"
            >
              {item.icon(isActive)}
              <span
                className={`text-[9px] tracking-[0.15em] uppercase transition-colors ${
                  isActive ? "text-teal-500" : "text-zinc-600"
                }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
