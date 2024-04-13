import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export default function ProgressDocs({ children }: { children: ReactNode }) {
  const [scrollPercentage, setScrollPercentage] = useState<number>(0);
  const docsRef = useRef<HTMLDivElement>(null);

  const [headings, setHeadings] = useState<NodeListOf<Element>>();
  const [activeHeadings, setActiveHeadings] = useState<string[]>([]);

  const handleScroll = () => {
    const docsElement = docsRef.current;
    if (docsElement) {
      const scrollTop = docsElement.scrollTop;
      const scrollHeight = docsElement.scrollHeight - docsElement.clientHeight;
      const percentage = (scrollTop / scrollHeight) * 90;
      setScrollPercentage(percentage);
    }
  };

  const getCurrentHeadings = () => {
    const headings = document.querySelectorAll(".docs h1, .docs h2, .docs h3, .docs h4");
    setHeadings(headings);

    const currentHeadings: string[] = [];

    headings.forEach((heading) => {
      const rect = heading.getBoundingClientRect();
      if (
        rect.x >= 0 &&
        rect.y >= 0 &&
        rect.x <= window.innerWidth * 0.95 &&
        rect.y <= window.innerHeight * 0.95
      ) {
        currentHeadings.push(heading.innerHTML.toLowerCase());
      }
    });

    setActiveHeadings(currentHeadings);
  };

  const scrollToAnchor = () => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleLeftDivClick = (heading: Element) => {
    heading.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    getCurrentHeadings();
    scrollToAnchor();
    window.addEventListener("scroll", getCurrentHeadings);
    return () => {
      window.removeEventListener("scroll", getCurrentHeadings);
    };
  }, []);

  return (
    <div className="flex progress-docs h-[90vh]">
      <div className="navbar custom-scroll relative w-1/5 overflow-hidden border-r-4 border-slate-800 h-[90vh] overflow-y-auto overscroll-contain bg-[#02031d]">
        <div className="progress p-4">
          {Array.from(headings || []).map((heading) => (
            <div
              key={heading.id}
              className={`cursor-pointer px-2 py-1 text-sm transition-colors ${
                (activeHeadings.includes(heading.innerHTML.toLowerCase()) && "font-bold") ||
                "text-slate-400"
              } ${(heading.tagName.substring(1) == "1" && "underline font-semibold") || "none"}`}
              style={{
                paddingLeft: `${Math.floor(Number(heading.tagName.substring(1)) / 4)}em`,
              }}
              onClick={() => handleLeftDivClick(heading)}
            >
              {heading.innerHTML}
            </div>
          ))}
        </div>
      </div>
      <div
        className="w-4/5 overflow-y-auto px-10 py-5 overscroll-contain h-[90vh] no-scrollbar"
        ref={docsRef}
        onScroll={() => {
          handleScroll();
          getCurrentHeadings();
        }}
      >
        <div
          className="progress-bar absolute top-[5vh] right-0 bg-[#80a3ff] w-1 rounded-md shadow-[0_0_2px_#ffffff73,inset_0_0_2px_#ffffff73,0_0_5px_#08f,0_0_15px_#08f,0_0_30px_#08f]"
          style={{ height: `${scrollPercentage}%` }}
        ></div>
        <div className="docs">{children}</div>
      </div>
    </div>
  );
}
