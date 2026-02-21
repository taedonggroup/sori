"use client";

// 원석 닉네임 입력 컴포넌트 — localStorage 연동, 2-16자 검증
import { useEffect } from "react";

interface NicknameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function NicknameInput({ value, onChange }: NicknameInputProps) {
  // 컴포넌트 마운트 시 저장된 닉네임 로드
  useEffect(() => {
    const saved = localStorage.getItem("sori_nickname");
    if (saved && !value) {
      onChange(saved);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    // 유효한 길이일 때만 저장
    if (newValue.length >= 2 && newValue.length <= 16) {
      localStorage.setItem("sori_nickname", newValue);
    }
  };

  const isInvalid = value.length > 0 && (value.length < 2 || value.length > 16);

  return (
    <div className="space-y-2">
      <label className="text-zinc-500 text-xs tracking-[0.3em] uppercase">
        원석 닉네임
      </label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="닉네임을 입력하세요 (2-16자)"
        maxLength={16}
        className={`
          w-full bg-zinc-950 border rounded-xl px-4 py-3 text-white text-sm
          placeholder:text-zinc-700 focus:outline-none transition-colors
          ${isInvalid ? "border-red-800/60 focus:border-red-600" : "border-zinc-800 focus:border-zinc-600"}
        `}
      />
      {isInvalid && (
        <p className="text-red-400 text-xs">닉네임은 2-16자여야 합니다.</p>
      )}
    </div>
  );
}
