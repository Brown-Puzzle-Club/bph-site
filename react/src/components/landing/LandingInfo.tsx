import React from 'react';

import clock from '@/assets/landing/clock.svg';
import question from '@/assets/landing/question.svg';

const LandingInfo: React.FC = () => {
  return (
    <div className='landinginfo pt-5'
      style={{
        mask: "linear-gradient(rgb(255, 255, 255) 70%, rgba(0, 0, 0, 0) 100%)",
        WebkitMask: "linear-gradient(rgb(255, 255, 255) 70%, rgba(0, 0, 0, 0) 100%)",
      }}>
      <div className="grid grid-cols-1 md:grid-cols-9 gap-4 p-5 pb-10">
        <div className="what-box col-start-1 col-span-5 md:col-start-2 md:col-span-3 text-center dark bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md btn-gradient-1 relative">
          <div className="question-mark absolute rotate-[333deg]" style={{top: "-74px",left: "-67px",}}>
            <img src={question} alt="Question Mark" className="h-44 w-44" style={{filter: "invert(100%) sepia(0%) saturate(0%) hue-rotate(158deg) brightness(104%) contrast(102%)",}}/>
          </div>
          <h1 className="text-2xl font-bold">WHAT</h1>
          <div className="border-b border-sky-500 mx-auto mt-2 w-10"></div>
          <p className="text-muted-foreground leading-tight pt-6">Brown's second annual puzzlehunt, run by <a className="underline font-semibold" href="/credits">Brown Puzzle Club</a>, offering experiences for both in-person and remote solvers. We are a novice friendly hunt!</p>
          <p className='pt-3 italic font-light'>&gt; <a className="hover:underline" href="/rules">what is a puzzlehunt?</a></p>
        </div>
        <div className="when-box col-start-1 col-span-5 md:col-start-6 md:col-span-3 text-center dark bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md btn-gradient-1 relative">
          <div className="clock absolute rotate-[30deg]" style={{top: "-30px",right: "-30px",}}>
            <img src={clock} alt="Clock" className="h-24 w-24" style={{filter: "invert(100%) sepia(0%) saturate(0%) hue-rotate(158deg) brightness(104%) contrast(102%)",}}/>
          </div>
          <h1 className="text-2xl font-bold">WHEN</h1>
          <div className="border-b border-sky-500 mx-auto mt-2 w-10"></div>
          <p className="text-muted-foreground leading-tight pt-6">
            The hunt will kickoff:
            <br/><span className='font-semibold underline decoration-dashed cursor-help'>Saturday, April 13th 2024 @ 12:00PM EDT</span> 
            <br/><br/>and close:
            <br/><span className='font-semibold underline decoration-dashed cursor-help'>Sunday, April 14th 2024 @ 6:00PM EDT</span></p>
        </div>
      </div>
    </div>
  );
};

export default LandingInfo;
