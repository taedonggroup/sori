import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-light transition-all disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none tracking-[0.15em]",
  {
    variants: {
      variant: {
        default: "bg-white text-black hover:bg-zinc-200",
        destructive: "border border-red-900 text-red-400 hover:border-red-700",
        outline: "border border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white",
        secondary: "bg-zinc-900 text-zinc-300 hover:bg-zinc-800",
        ghost: "text-zinc-500 hover:text-zinc-200",
        link: "text-teal-500 underline-offset-4 hover:underline",
        // SORI 뮤직 프로 variants
        "sori-primary":
          "border border-white/40 text-white bg-transparent hover:bg-white/5 hover:border-white/70",
        "sori-outline":
          "border border-zinc-800 text-zinc-400 bg-transparent hover:border-zinc-600 hover:text-zinc-200",
        "sori-ghost":
          "text-zinc-600 bg-transparent hover:text-zinc-300",
        "sori-teal":
          "border border-teal-700 text-teal-400 bg-transparent hover:border-teal-500 hover:text-teal-300",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        xs: "h-7 px-3 text-[10px]",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-7",
        icon: "size-11",
        "icon-sm": "size-9",
        // SORI 전용 사이즈 — 모바일 터치 최적화
        "sori-lg": "w-full py-4 text-xs tracking-[0.25em] uppercase",
        "sori-sm": "py-2.5 px-5 text-xs tracking-[0.2em] uppercase",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
