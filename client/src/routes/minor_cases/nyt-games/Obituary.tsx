import axios from "axios";
import { useEffect, useState } from "react";
// Import useEffect
import { FaBars, FaSearch } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

import nytImage from "@/assets/minor_cases/nyt/nyt-image.png";
import nytLogo from "@/assets/minor_cases/nyt/nyt-logo.png";

import SubscriptionModal from "../../../components/puzzle/nyt-games/ObituaryModal";

function Obituary() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";

    if (!isModalOpen) {
      axios
        .get("/api/puzzle/nyt/obituary-check/1,2,3")
        .then((response) => {
          const data = response.data;
          if (response.status === 200 && data.correct === true) {
            closeModal();
            setCorrectAnswer(data.answer);
          }
        })
        .catch((error) => {
          // Handle error if necessary
          console.error("Error fetching data:", error);
        });
    }
  }, [isModalOpen]); // Update overflow style and fetch data based on isModalOpen state

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="font-serif text-black relative">
      <div className="font-serif flex items-center justify-center absolute top-3 w-full z-20">
        <div className="flex justify-center items-center h-full py-2">
          <img className="w-2/12" src={nytLogo} alt="nyt-page-image"></img>
        </div>
      </div>
      <div className={"bg-slate-50" + (isModalOpen ? " opacity-80" : "")}>
        <nav className="bg-white py-3 px-4 flex justify-between items-center relative z-10">
          {/* Left section */}
          <div className="flex items-center">
            <Link to="#" className="text-black font-semibold text-lg">
              <FaBars />
            </Link>
            <Link to="#" className="ml-6 text-black">
              <FaSearch />
            </Link>
          </div>

          {/* Center section */}

          {/* Right section */}
          <div className="font-sans flex items-center">
            <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 mr-2">
              Subscribe
            </button>
            <button
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
              //   onClick={toggleModal}
            >
              Log In
            </button>
          </div>
        </nav>
        {/* Content section with white background */}
        <div className="mt-0 text-center">
          <h2 className="font-serif text-l font-bold text-rose-500 mt-10">OPINION</h2>
          <h2 className="font-serif text-l font-bold text-black">GUEST-ESSAY</h2>
          <div className="flex justify-center items-center mt-4">
            <hr style={{ width: "10%" }} />
          </div>
          <p className="font-serif mt-4 text-5xl text-black font-bold">
            We&apos;re Living Through the &apos;Boring
          </p>
          <p className="font-serif mt-4 text-5xl text-black font-bold">Apocalypse&apos;</p>
          <h3 className="font-serif mt-4 text-m text-zinc-500">Dec. 16, 2021</h3>
          <div className="flex justify-center items-center">
            <img className="w-1/2" src={nytImage} alt="nyt-page-image"></img>
          </div>
          {correctAnswer && (
            <div className="font-serif mt-4 text-lg px-[10%]">
              <ReactMarkdown>{correctAnswer}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {/* Subscription Modal */}
      {isModalOpen && (
        <SubscriptionModal setIsModalOpen={setIsModalOpen} setCorrectAnswer={setCorrectAnswer} />
      )}
    </div>
  );
}

export default Obituary;
