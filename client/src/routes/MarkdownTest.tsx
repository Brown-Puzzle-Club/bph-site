import MarkdownWrapper from "@/components/markdown/MarkdownWrapper";
import { PuzzleStyle } from "@/utils/constants";
import { useState } from "react";

export default function MarkdownTest() {
  const [markdown, setMarkdown] = useState("");

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
        <div className="w-1/2">
          <h1 className="text-3xl text-center pb-5">Markdown Result</h1>
          <MarkdownWrapper markdown={markdown}puzzleStyle={PuzzleStyle.DEFAULT}/>
        </div>
      </div>
    </div>
  );
}
