import { cn } from "@/utils/utils";

export default function Spoiler({ bodyText, className }: { bodyText: string; className?: string }) {
  return (
    <span
      className={cn(
        "blur-sm hover:blur-none transition ease-in-out duration-300 font-bold",
        className,
      )}
    >
      {bodyText}
    </span>
  );
}
