import axios from "axios";
import { type PropsWithChildren, useEffect, useState } from "react";
// Import useEffect
import { FaBars, FaSearch } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

import nytLogo from "@/assets/minor_cases/nyt/nyt-teaser2.png";

import SubscriptionModal from "../../../components/puzzle/nyt-games/ObituaryModal";

function Obituary() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);

  useEffect(() => {
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
          <img className="w-4/12" src={nytLogo} alt="nyt-page-image"></img>
        </div>
      </div>
      <div
        className="bg-slate-50"
        style={
          isModalOpen
            ? {
                background:
                  "linear-gradient(to bottom, rgba(249, 250, 251, 1) 65%, rgba(249, 250, 251, 0.6) 100%)",
              }
            : {}
        }
      >
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
          <p className="font-serif text-l font-bold italic text-black mt-10">
            What was the name of the victim?
          </p>
          <h2 className="font-serif text-l font-bold text-rose-500 ">OBITUARY</h2>
          <div className="flex justify-center items-center mt-4">
            <hr style={{ width: "10%" }} />
          </div>
          <h1 className="font-serif mt-4 text-5xl text-black font-bold max-w-4xl mx-auto">
            Mat Synge, the Genius Behind the BYT Games, is Dead at 55
          </h1>
          <h3 className="font-serif mt-4 text-m text-zinc-500">Apr. 13, 2024</h3>
          {/* <div className="flex justify-center items-center">
            <img className="w-1/2" src={nytImage} alt="nyt-page-image"></img>
          </div> */}
          <div className="max-w-2xl mx-auto mt-4 text-justify leading-8 space-y-4">
            <ReactMarkdown
              components={{
                p: ({ ...props }: PropsWithChildren) => <p className="pl-4">{props.children}</p>,
              }}
            >
              {`Born to loving parents Rhonda and Bernard Synge in Yeehaw Junction, Florida, Mat Synge (1969-2024) grew up in a small house surrounded by his 27 brothers and sisters. Money was tight, so his parents made extra cash by providing a home for disabled alligators. Synge was often known to reminisce on his childhood full of reptiles, an upbringing that inspired such Wordle answers as #325 (GECKO) and #952 (SNAKE). 

Synge loved all things puzzle from a young age, winning the grand ultimate super extreme national crossword competition every consecutive year since age 5. His parents and teachers praised him as a prodigy, with his fourth-grade teacher Mrs. Williams recalling, “He once turned in a 17-page essay on the Great Gatsby, and I was floored to find that the entire composition was a palindrome!” Synge breezed through school, and then received a scholarship to Florida State University through a scholarship granted by the Puzzling Prodigies Foundation for those Gifted with Wordplay. When asked for a comment on his passing, the foundation noted that his application review committee was floored by his ability to utilize previously unheard-of synonyms for common words, a skill that would later prove useful in his invention of the now widely beloved game, Connections. Synge majored in puzzle production with a minor in wordplay, graduating as the valedictorian of his class (see Wordle #15, GRADE). 
	
Shortly after graduation, Synge moved to Boo York City to pursue his dream of writing puzzles for the most excellent games section in all of the country. Initially unable to find a job, he worked briefly as a tour guide for a NYC ghost tour, hence Wordle #687 (GHOUL). For the rest of his life, Synge would claim that he could commune with the dead, often purporting to consult the spirits of famous writers such as Dickens, Hemingway, and Shakespeare when afflicted with writer’s block. One day while on the way home from the Smallpox Memorial Hospital, Synge was mauled by a particularly large subway rat. His injuries left him unconscious for days, but a xenografted pig heart saved his life, inspiring Wordle #767 (HEART). 
  
This near-death experience prompted Synge to finally fulfill his dreams of submitting a puzzle to the Boo York Times. His confounding crossword captivated curious curators, landing him a permanent gig on the BYT Games team. As the first human to evolve past the need for sleep, he wrote hundreds of thousands of award-winning puzzles during the 168 hours each week he was contracted to work. We have Synge to thank for such innovative games as Wordle, Connections, and Letterboxed. Not all of his ideas were hits, such as a quiz on the preferred sock colors of various historical figures, and the inadvertent establishment of a cryptocurrency-based gambling ring based on the functionality of a random McDonald’s ice cream machine (see Wordle #672, BROKE). Regardless of his missteps, his contributions to the newspaper puzzling industry will never be forgotten. 
  
His puzzles sparked a whole new generation of dedicated solvers and revolutionized the word games community. Though a household name for true puzzle enthusiasts, Synge is better known by his pseudonym…

` + (correctAnswer ?? "")}
            </ReactMarkdown>
          </div>
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
