// 원석 프로필 — 닉네임 없이 접근 시 갤러리로 리다이렉트
import { redirect } from "next/navigation";

export default function ProfileIndex() {
  redirect("/gallery");
}
