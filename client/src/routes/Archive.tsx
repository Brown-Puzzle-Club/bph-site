import { useState } from "react";
import { HashLink as Link } from "react-router-hash-link";

import cthulu_blueno from "../assets/landing/chibi_blueno.png";

const ArchiveCard = ({
  year,
  title,
  desc,
  url,
  image,
}: {
  year: string;
  title: string;
  desc: string;
  url: string;
  image?: string;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="archive-card flex items-center justify-center space-x-5 btn-gradient-bot py-4 first:pt-0 last:border-b-0 last:pb-0 ">
      {image ? (
        <div className="flex-shrink-0">
          <img
            className="w-20 h-20 object-cover"
            src={image}
            alt="chibi cthulu blueno"
            style={{
              animationIterationCount: 1,
              animation: hovered ? "shakeImg 0.5s ease-in-out" : "none",
            }}
          />
        </div>
      ) : null}
      <div>
        <h4 className="text-xl text-slate-400 pb-5">
          <strong className="font-bold text-white">BPH {year}</strong>
          {" - "}
          <Link
            smooth
            to={url}
            className="underline"
            onMouseEnter={() => {
              setHovered(true);
            }}
            onMouseLeave={() => {
              setHovered(false);
            }}
          >
            {title}
          </Link>
        </h4>
        <p className="text-slate-400 text-lg">{desc}</p>
      </div>
    </div>
  );
};

export default function Archive() {
  return (
    <div className="archive bg-slate-900 text-white h-[90vh] overscroll-contain overflow-hidden overflow-y-auto ">
      <h1 className="text-4xl font-bold text-center py-5">Hunt Archive</h1>
      <div className="archive-content text-center dark bg-gradient-to-b from-muted/50 to-muted/80 p-4 no-underline outline-none focus:shadow-md btn-gradient-1 relative mx-[5%] md:mx-[25%]">
        <ArchiveCard year="2024" title="???" desc="This hunt!" url="/" />
        <ArchiveCard
          year="2023"
          title="Blueno Resurrection Society"
          desc="Help the BRS complete their ritual!"
          url="https://2023.brownpuzzlehunt.com"
          image={cthulu_blueno}
        />
      </div>
    </div>
  );
}
