import { ReactNode, useEffect, useRef, useState } from 'react';

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
      const percentage = (scrollTop / scrollHeight) * 100;
      setScrollPercentage(percentage);
    }
  };

  const getCurrentHeadings = () => {
    const headings = document.querySelectorAll('.docs h1, .docs h2, .docs h3, .docs h4');
    setHeadings(headings)

    const currentHeadings: string[] = [];

    headings.forEach((heading, i) => {
      const rect = heading.getBoundingClientRect();
      console.log(i, rect)
      if ((rect.x >= 0 && rect.y >= 0) && (rect.x <= window.innerWidth*.95 && rect.y <= window.innerHeight*.95)) {
        currentHeadings.push(heading.innerHTML.toLowerCase());
      }
    });

    setActiveHeadings(currentHeadings);
  };
  
  const handleLeftDivClick = (heading: Element) => {
    heading.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    getCurrentHeadings()
    window.addEventListener('scroll', getCurrentHeadings);
    return () => {
      window.removeEventListener('scroll', getCurrentHeadings);
    };
  }, []);
  
  return (
    <div className="flex progress-docs h-[90vh]">
      <div className="relative w-1/5 overflow-hidden border-r-2 border-slate-800 h-[90vh]">
          <div
            className="progress-bar absolute top-0 right-0 bg-indigo-500 w-1 rounded-full shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#08f,0_0_15px_#08f,0_0_30px_#08f]"
            style={{ height: `${scrollPercentage}%` }}
          ></div>
          <div className="progress p-4">
            {Array.from(headings || []).map((heading) => (
            <div
              key={heading.id}
              className={`cursor-pointer px-2 py-1 text-sm transition-colors ${activeHeadings.includes(heading.innerHTML.toLowerCase()) && 'font-bold' || 'text-slate-400'} ${heading.tagName.substring(1) == '1' && 'underline font-semibold' || 'none'}`}
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
      <div className="w-4/5 overflow-y-auto px-10 py-5 overscroll-contain h-[90vh] no-scrollbar"
      ref={docsRef}
      onScroll={() => { handleScroll(); getCurrentHeadings();}}>
        <div className="docs">
            {children}
        </div>
      </div>
    </div>
  );
}
