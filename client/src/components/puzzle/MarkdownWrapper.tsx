import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { PuzzleStyle } from "@/utils/constants";
import { cn } from "@/utils/utils";

import { MarkdownComponents } from "./MarkdownComponent";

export default function MarkdownWrapper({
  markdown,
  className,
  puzzleStyle,
}: {
  markdown: string;
  className?: string;
  puzzleStyle?: PuzzleStyle;
}) {
  return (
    <div className="flex justify-center items-center">
      <div
        className={cn(puzzleStyle ? puzzleStyle?.valueOf() : "puzzle-default", className) + "outer"}
      >
        <ReactMarkdown
          className={cn(puzzleStyle ? puzzleStyle?.valueOf() : "puzzle-default", className)}
          remarkPlugins={[remarkGfm]}
          components={MarkdownComponents}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
