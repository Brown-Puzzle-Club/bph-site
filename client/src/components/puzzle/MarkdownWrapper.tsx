import { PuzzleStyle } from "@/utils/constants";
import { cn } from "@/utils/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownComponents: object = {
  // TODO: figure out this typing.. documentation is poor
  //https://github.com/remarkjs/react-markdown?tab=readme-ov-file#components
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  p: (paragraph: { children?: boolean; node?: any }) => {
    const { node } = paragraph;

    if (node.children[0].tagName === "img") {
      const image = node.children[0];
      const metastring = image.properties.alt;
      const alt = metastring?.replace(/ *\{[^)]*\} */g, "");
      const metaWidth = metastring.match(/{([^}]+)x/);
      const metaHeight = metastring.match(/x([^}]+)}/);
      const width = metaWidth ? metaWidth[1] : "768";
      const height = metaHeight ? metaHeight[1] : "432";
      const hasCaption = metastring?.toLowerCase().includes("{caption:");
      const caption = metastring?.match(/{caption: (.*?)}/)?.pop();

      return (
        <div className="postImgWrapper">
          <img src={image.properties.src} width={width} height={height} alt={alt}></img>
          {hasCaption ? (
            <div className="caption" aria-label={caption}>
              {caption}
            </div>
          ) : null}
        </div>
      );
    }
    return <p>{paragraph.children}</p>;
  },
};

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
  );
}
