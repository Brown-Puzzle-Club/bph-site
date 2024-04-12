import axios from "axios";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

import ConnectionsBox from "@/components/puzzle/nyt-games/connections/ConnectionsBox";

function Connections() {
  const [unfilteredWords, setUnfilteredWords] = useState<string[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]); // Changed state to store words

  const [matches, setMatches] = useState<string[]>([]);

  const [currRound, setRound] = useState<number>(1);
  // const [connections, setConnections] = useState<{ words: string[]; category: string }[]>([]);
  const [usedWordIndices, setUsedWords] = useState<number[]>([]);
  const [answer, setAnswer] = useState<boolean>(false);

  const [submitting, setSubmitting] = useState<boolean>(false);

  // function checkElements(array1: string[], array2: string[]): boolean {
  //   // Convert arrays to sets for efficient membership checking
  //   const set1 = new Set(array1);
  //   const set2 = new Set(array2);

  //   // Check if all elements in array1 are present in array2
  //   for (const elem of set1) {
  //       if (!set2.has(elem)) {
  //           return false;
  //       }
  //   }
  //   return true;
  // }

  useEffect(() => {
    if (currRound === 5) {
      // End the game
      return;
    }
    // Fetch connections data for the current round from the endpoint using axios
    axios
      .get(`/api/puzzle/nyt/get-round-words/${currRound}/`)
      .then((response) => {
        const data = response.data;

        setUnfilteredWords(data["Words"]);

        const filteredWords = data["Words"].filter(
          (_word: string, index: number) => !usedWordIndices.includes(index),
        );
        setWords(filteredWords);
      })
      .catch((error) => console.error("Error fetching words for round:", currRound, error));
  }, [currRound, usedWordIndices]);

  const handleBoxClick = (word: string) => {
    // Changed parameter to word
    if (selectedWords.length < 4 || selectedWords.includes(word)) {
      // Check for words instead of indices
      setSelectedWords((prevSelected) => {
        if (prevSelected.includes(word)) {
          return prevSelected.filter((w) => w !== word);
        } else {
          return [...prevSelected, word];
        }
      });
    }
  };

  const submitGroups = () => {
    const sanitizedWords = selectedWords.map((word) => word.replace(" N/A", ""));
    console.log(sanitizedWords);
    setSubmitting(true);
    axios
      .get(`/api/puzzle/nyt/connections-guess/${currRound}/${sanitizedWords.join(",")}`)
      .then((response) => {
        const data = response.data;
        if (data.Category) {
          const connectionCategory = data.Category;
          const answer = data.answer || false;
          setAnswer(answer);
          setMatches([
            ...matches,
            `${connectionCategory}: ${sanitizedWords.join(", ")}${answer ? ` (YOU WIN!)` : ""}`,
          ]);
          setRound(currRound + 1);

          const updatedWords = words.filter((word) => !selectedWords.includes(word));
          setSelectedWords([]);
          const updatedIndices = selectedWords.map((word) =>
            unfilteredWords.findIndex((w) => w === word),
          );
          setUsedWords((prevUsedWords) => [...prevUsedWords, ...updatedIndices]);

          const groupedWords = [];
          while (updatedWords.length > 0) {
            groupedWords.push(updatedWords.splice(0, 4));
          }
          setWords(groupedWords.flat());
        } else {
          console.log("No matching category found");
          alert("no match! :(");
          // Handle case when no matching category is found
        }
      })
      .catch((error) => {
        console.error("Error fetching connections guess:", error);
        // Handle error
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const restartGame = () => {
    // Reset all state variables to their initial values
    setWords([]);
    setSelectedWords([]);
    setMatches([]);
    setRound(1);
    setAnswer(false);
    setUsedWords([]);
  };

  return (
    <div className="scale-x-100 pt-10 pb-20 w-full bg-white align-middle flex flex-col justify-center">
      <div className="flex flex-row items-baseline">
        <h1 className="text-4xl font-bold px-10 py-5 text-black connections-title">Connections</h1>
        <p className="text-black connections-date text-2xl">Sometime, Never</p>
      </div>
      <hr />
      <div className="mx-20 w-2/3 min-w-[500px] flex flex-col pt-5 self-center">
        <h2 className="text-center text-black connections-prompt">Create four groups of four!</h2>
        {matches.length !== 0 && (
          <div className="flex flex-row justify-center">
            <div className="flex justify-center mt-4 flex-col w-3/4 gap-2">
              {matches.map((match, index) => {
                const color = `connections-${index}`;
                return (
                  <div
                    key={index}
                    className={`${color} text-black rounded-md h-20 flex-col justify-center align-center`}
                  >
                    <div className="h-[15px]" />
                    <p className="self-center text-center connections-answer-category uppercase text-xl py-0 -my-1">
                      {match.split(":")[0]}
                    </p>
                    <p className="self-center text-center connections-answer-text text-xl -my-1">
                      {match.split(":")[1]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {words.length != 0 ? (
          <div className="flex justify-center mt-0">
            <div className="grid grid-cols-4 gap-2 mt-[10px] w-3/4">
              {words.map((word, index) => (
                <ConnectionsBox
                  key={index}
                  index={index}
                  word={word}
                  isSelected={selectedWords.includes(word)} // Check for words instead of indices
                  onClick={() => handleBoxClick(word)} // Pass word instead of index
                />
              ))}
            </div>
          </div>
        ) : (
          !answer && (
            <BeatLoader
              className="justify-center content-center text-center p-4"
              color={"#fff"}
              size={12}
            />
          )
        )}

        <div className="flex justify-center mt-4 gap-4">
          <button
            className="mt-4 text-black outline font-bold py-2 px-4 rounded-full"
            onClick={restartGame}
          >
            {" "}
            Restart{" "}
          </button>
          <button
            className="mt-4 text-black outline font-bold py-2 px-4 rounded-full h-12"
            onClick={submitGroups}
            disabled={selectedWords.length !== 4 || submitting}
            style={{ opacity: selectedWords.length !== 4 || submitting ? 0.5 : 1 }}
          >
            Submit
          </button>
        </div>
        {answer && ( // Conditionally render answer
          <div className="flex justify-center mt-4">
            <div className="bg-yellow-300 text-black font-bold py-2 px-4 rounded0-full">{`You win!`}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Connections;
