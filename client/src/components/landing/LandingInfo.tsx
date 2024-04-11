import type React from "react";
import { HashLink as Link } from "react-router-hash-link";

import blueno_what from "@/assets/landing/blueno_what.svg";
import blueno_when from "@/assets/landing/blueno_when.svg";

const SVG_FILTER =
  "invert(100%) sepia(0%) saturate(0%) hue-rotate(158deg) brightness(104%) contrast(102%)";
// i think it might be a bit too busy with the other elements.
const HOVER_EFFECT_ACTIVE = false;

const LandingInfo: React.FC = () => {
  return (
    <div
      className="landinginfo pt-5"
      style={{
        mask: "linear-gradient(rgb(255, 255, 255) 70%, rgba(0, 0, 0, 0) 100%)",
        WebkitMask: "linear-gradient(rgb(255, 255, 255) 70%, rgba(0, 0, 0, 0) 100%)",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-9 gap-4 p-5 pb-10">
        <div
          className="what-box col-start-1 col-span-5 md:col-start-2 md:col-span-3 text-center dark bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md btn-gradient-1 relative"
          onMouseEnter={() => {
            if (HOVER_EFFECT_ACTIVE)
              (document.getElementsByClassName("blueno_when")[0] as HTMLElement).style.filter =
                "none";
          }}
          onMouseLeave={() => {
            (document.getElementsByClassName("blueno_when")[0] as HTMLElement).style.filter =
              SVG_FILTER;
          }}
        >
          <div className="absolute" style={{ top: "-30px", left: "-19px" }}>
            <img
              src={blueno_when}
              className="blueno_when transition ease-in-out duration-200 h-28 w-28 opacity-75"
              style={{ filter: SVG_FILTER }}
            />
          </div>
          <h1 className="text-2xl font-bold">WHAT</h1>
          <div className="border-b border-sky-500 mx-auto mt-2 w-10"></div>
          <p className="text-muted-foreground leading-tight pt-6">
            Brown&apos;s second annual puzzlehunt, run by{" "}
            <Link className="underline font-semibold" to="/credits">
              Brown Puzzle Club
            </Link>
            , offering experiences for both in-person and remote solvers. We are a novice-friendly
            hunt!
          </p>
          <p className="pt-3 italic font-light">
            &gt;{" "}
            <Link smooth className="hover:underline" to="/info#FAQ">
              what is a puzzlehunt?
            </Link>
          </p>
        </div>
        <div
          className="when-box col-start-1 col-span-5 md:col-start-6 md:col-span-3 text-center dark bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md btn-gradient-1 relative"
          onMouseEnter={() => {
            if (HOVER_EFFECT_ACTIVE)
              (document.getElementsByClassName("blueno_what")[0] as HTMLElement).style.filter =
                "none";
          }}
          onMouseLeave={() => {
            (document.getElementsByClassName("blueno_what")[0] as HTMLElement).style.filter =
              SVG_FILTER;
          }}
        >
          <div className="absolute" style={{ top: "-30px", right: "-30px" }}>
            <img
              src={blueno_what}
              alt=""
              className="blueno_what transition ease-in-out duration-200 h-32 w-32 opacity-75"
              style={{ filter: SVG_FILTER }}
            />
          </div>
          <h1 className="text-2xl font-bold">WHEN</h1>
          <div className="border-b border-sky-500 mx-auto mt-2 w-10"></div>
          <p className="text-muted-foreground leading-tight pt-6">
            The hunt will begin on:
            <br />
            <span className="font-semibold underline decoration-dashed cursor-help">
              Saturday, April 13th 2024 @ 12:00PM EDT
            </span>
            <br />
            <br />
            and end on:
            <br />
            <span className="font-semibold underline decoration-dashed cursor-help">
              Sunday, April 14th 2024 @ 6:00PM EDT
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingInfo;
