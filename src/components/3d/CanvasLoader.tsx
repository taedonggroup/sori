"use client"

// 클라이언트 래퍼 — layout.tsx(서버)에서 ssr:false dynamic import 불가
// 이 컴포넌트가 클라이언트에서 SoriCanvas를 지연 로드
import dynamic from "next/dynamic"

const SoriCanvas = dynamic(() => import("./SoriCanvas"), {
  ssr: false,
})

export default function CanvasLoader() {
  return <SoriCanvas />
}
