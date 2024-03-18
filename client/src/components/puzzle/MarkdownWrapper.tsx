import { PuzzleStyle } from "@/utils/constants";
import { cn } from "@/utils/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const parseStyle = (style: string) => {
  // assert style is a string of the form "key1: value1; key2: value2; ..."

  const styleObject: { [key: string]: string } = {};
  const styleArray = style.split(";");
  styleArray.forEach((pair) => {
    const [key, value] = pair.split(":");
    if (key && value) styleObject[key.trim()] = value.trim();
  });
  return styleObject;
};

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
  a: (props: { href: string; children: string }) => {
    console.log("PROPS:", props);
    if (["youtube", "embed"].every((el) => props.href.includes(el))) {
      return (
        <div className="videoWrapper">
          <iframe
            src={props.href}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={parseStyle(props.children)}
          ></iframe>
        </div>
      );
    }
    if (["drive", "d"].every((el) => props.href.includes(el))) {
      return (
        <div className="ContentWrapper">
          <iframe
            src={props.href.replace("/view?usp=sharing", "").concat("/preview")}
            frameBorder="0"
            seamless
            scrolling="no"
            style={parseStyle(props.children)}
          ></iframe>
        </div>
      );
    }

    return <a href={props.href}>{props.children}</a>;
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
