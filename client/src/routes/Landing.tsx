import { useEffect, useState } from "react";

import LandingInfo from "../components/landing/LandingInfo";
import LandingSplash from "../components/landing/LandingSplash";

const userAgent = navigator.userAgent.toLowerCase();
const isMobileDevice = /iphone|ipad|ipod|android|blackberry|windows phone|iemobile|webos/i.test(
  userAgent,
);

export default function Landing() {
  const [visitedBefore, setVisitedBefore] = useState(false);

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem("visitedBefore");
    if (hasVisitedBefore) {
      setVisitedBefore(true);
    }
  }, []);

  const dismissAlert = () => {
    setVisitedBefore(true);
    localStorage.setItem("visitedBefore", "true");
  };

  return (
    <div className="landing bg-[#02031d] text-white">
      {!visitedBefore && isMobileDevice ? (
        <div className="alert z-40 backdrop-blur-sm h-screen w-screen flex items-center fixed justify-center">
          <div className="text-lg tracking-wide md:text-base md:tracking-normal text-center text-base dark bg-slate-900 from-muted/50 to-muted/80 p-6 no-underline outline-none focus:shadow-md btn-gradient-1 relative mx-[5%] md:mx-[20%]">
            <p className="mb-4">This site is best viewed on a computer.</p>
            <button
              onClick={dismissAlert}
              className="rounded-md px-6 py-2 font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}
      <LandingSplash />
      <LandingInfo />
    </div>
  );
}
