import MarkdownWrapper from "@/components/puzzle/MarkdownWrapper";
import { PuzzleStyle } from "@/utils/constants";
import { cn } from "@/utils/utils";
import { useState } from "react";

export default function MarkdownTest() {
  const [markdown, setMarkdown] = useState("");
  const [puzzleStyle, setPuzzleStyle] = useState<PuzzleStyle>(PuzzleStyle.RED_THREAD);

  return (
    <div className="text-white">
      {/* MARKDOWN INPUT BOX */}
      <div className="flex justify-center">
        <div className="w-1/2">
          <textarea
            className="w-full h-96 p-4 bg-gray-900 text-white"
            placeholder="Markdown goes here..."
            onChange={(e) => setMarkdown(e.target.value)}
          ></textarea>
        </div>
      </div>
      {/* HTML RESULT BOX */}
      <div className="flex justify-center pt-6">
        <div className="w-1/2 flex flex-col justify-around">
          <h1 className="text-3xl text-center pb-5">Markdown Result</h1>
          {/* three buttons to toggle PuzzleStyle */}
          <div className="flex justify-center pb-5">
            <button
              className={cn(
                "p-2 bg-red-500 text-white",
                puzzleStyle == PuzzleStyle.RED_THREAD && "border-2 border-black",
              )}
              onClick={() => setPuzzleStyle(PuzzleStyle.RED_THREAD)}
            >
              Red Thread
            </button>
            <button
              className={cn(
                "p-2 bg-blue-500 text-white",
                puzzleStyle == PuzzleStyle.SOCIAL_DEDUCTION && "border-2 border-black",
              )}
              onClick={() => setPuzzleStyle(PuzzleStyle.SOCIAL_DEDUCTION)}
            >
              Social Deduction
            </button>
            <button
              className={cn(
                "p-2 bg-green-500 text-white",
                puzzleStyle == PuzzleStyle.DATA && "border-2 border-black",
              )}
              onClick={() => setPuzzleStyle(PuzzleStyle.DATA)}
            >
              Data
            </button>
          </div>
          <MarkdownWrapper markdown={markdown} puzzleStyle={puzzleStyle} />
        </div>
      </div>
    </div>
  );
}
