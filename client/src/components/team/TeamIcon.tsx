import { cn } from "@/utils/utils";
import { useState } from "react";

export default function TeamIcon({
  className,
  emoji_cn,
  emoji,
  color,
  hover_effect,
}: {
  className?: string;
  emoji_cn?: string;
  emoji: string;
  color: string;
  hover_effect?: boolean;
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className={cn(
        "rounded-full w-full h-full flex items-center justify-center border-2 border-white",
        className
      )}
      style={{
        backgroundColor: color,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={cn("", emoji_cn)}>
        {(hover_effect && !hover) || !hover_effect ? emoji : "⚙️"}
      </div>
    </div>
  );
}
