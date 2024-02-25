import { FaEnvelope } from "react-icons/fa";
import logo from "../assets/landing/bpc_logo.svg";

export default function Club () {
  return (
    <div className="club bg-slate-900 text-white h-[90vh] overscroll-contain overflow-hidden overflow-y-auto ">
      <div className="logo flex justify-center items-center pt-2">
        <img className="w-24 h-24 center" src={logo}/>
      </div>
      <h1 className="text-4xl font-bold text-center py-5">Brown Puzzle Club</h1>
      <div className="club-content text-center">
        <div className="initial-blurb">
          <p>If you are a Brown Student that enjoyed our hunt, we highly recommend you get involved with our club!</p>
          <a href="https://listserv.brown.edu/cgi-bin/wa?SUBED1=PUZZLE&A=1" className="dark bg-muted/20 hover:bg-muted/80 btn-gradient-1 flex font-semibold items-center text-center justify-center my-5 mx-[33%] transition-colors duration-300 group">
            <FaEnvelope className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-300"/>
            <p className="px-2 text-slate-400 group-hover:text-white transition-colors duration-300">Join the listserv! (Brown Students)</p>
            <FaEnvelope className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-300"/>
          </a>
        </div>

        <div>
          <div className="dark bg-gradient-to-b from-muted/50 to-muted/80 px-6 py-3 no-underline outline-none focus:shadow-md btn-gradient-1 relative my-2 mx-[5%] md:mx-[20%]">
            <h4 className="text-2xl font-bold">General Body Meeting</h4>
            <p className="text-slate-400 font-semibold pb-2">Mondays from 5:30-6:30PM EDT in Page Robinson 403</p>
            <p className="text-slate-400">Casual puzzle solving across recent hunts, as well as tips for solvers. Snacks sometimes provided :)</p>
            <p className="text-slate-400">It is a very casual meeting, so feel free to drop in whatever weeks you are free!</p>
            <p className="text-slate-400">We always have room for new members! Beginners welcome!</p>
          </div>
          <div className="dark bg-gradient-to-b from-muted/50 to-muted/80 px-6 py-3 no-underline outline-none focus:shadow-md btn-gradient-1 relative my-2 mx-[5%] md:mx-[20%]">
            <h4 className="text-2xl font-bold">Puzzle Hunt Meeting</h4>
            <p className="text-slate-400 font-semibold pb-2">... an undisclosed location and time 🤫</p>
            <p className="text-slate-400">Our weekly planning session for this hunt, involving writers, artists, and tech.</p>
            <p className="text-slate-400">Come to our general body meeting to learn more + get involved!</p>
          </div>
          <div className="dark bg-gradient-to-b from-muted/50 to-muted/80 px-6 py-3 no-underline outline-none focus:shadow-md btn-gradient-1 relative my-2 mx-[5%] md:mx-[20%]">
            <h4 className="text-2xl font-bold">Additional Club Events</h4>
            <p className="text-slate-400">Semesterly trips to Escape Rhode Island!</p>
            <p className="text-slate-400">Coffee chats with members of the greater puzzling communtiy!</p>
          </div>
        </div>
      </div>
    </div>
  )
}