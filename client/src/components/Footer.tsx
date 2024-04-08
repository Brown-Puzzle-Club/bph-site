import type { CSSProperties } from "react";
import { FaInstagram } from "react-icons/fa";

import { cn } from "@/utils/utils";

export default function Footer({
  className,
  extraStyle,
}: {
  className?: string;
  extraStyle?: CSSProperties;
}) {
  return (
    <div
      className={cn("footer bg-intherit text-white text-center p-3", className)}
      style={extraStyle}
    >
      <a
        href="https://www.instagram.com/brownpuzzlehunt/"
        className="border-r-2 border-muted-foreground pr-3"
      >
        <FaInstagram
          className="inline-block text-muted-foreground hover:text-white transition-colors"
          size={24}
        />
      </a>
      <span className="text-muted-foreground pl-3">
        powered by{" "}
        <a
          className="underline font-semibold hover:text-white transition-colors"
          href="https://github.com/galacticpuzzlehunt/gph-site/tree/master"
        >
          gph-site
        </a>
      </span>
    </div>
  );
}
