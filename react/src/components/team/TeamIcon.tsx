import { cn } from "@/lib/utils";

export default function TeamIcon({className, emoji_cn, emoji, color}: {className?: string, emoji_cn?: string, emoji: string, color: string}) {
  return (
    <div className={cn(
      "rounded-full w-full h-full flex items-center justify-center border-2 border-white",
      className
    )}
    style={{
      backgroundColor: color,
    }}>
      <div className={cn(
        "",
        emoji_cn
      )}>{emoji}</div>
    </div>
  )
}