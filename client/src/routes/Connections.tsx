import { useState, useEffect } from 'react';
import ConnectionsBox from "@/components/ConnectionsBox";
import axios from 'axios';

function Connections() {
  const [unfilteredWords, setUnfilteredWords] = useState<string[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]); // Changed state to store words

  const [matches, setMatches] = useState<string[]>([]);

  const [currRound, setRound] = useState<number>(1);
  // const [connections, setConnections] = useState<{ words: string[]; category: string }[]>([]);
  const [usedWordIndices, setUsedWords] = useState<number[]>([]);
  const [answer, setAnswer] = useState<string>("");


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
    axios.get(`/api/nyt/get-round-words/${currRound}/`)
        .then(response => {
            
            const data = response.data;

            setUnfilteredWords(data["Words"]);
          
            const filteredWords = data["Words"].filter((word: string, index: number) => !usedWordIndices.includes(index));
            setWords(filteredWords);
        })
        .catch(error => console.error('Error fetching words for round:', currRound, error));
  }, [currRound]);

  const handleBoxClick = (word: string) => { // Changed parameter to word
    if (selectedWords.length < 4 || selectedWords.includes(word)) { // Check for words instead of indices
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
    const sanitizedWords = selectedWords.map(word => word.replace(" N/A", ""));
    console.log(sanitizedWords)
    axios.get(`/api/nyt/connections-guess/${currRound}/${sanitizedWords.join(',')}`)
      .then(response => {
        const data = response.data;
        if (data.Category) {
          const connectionCategory = data.Category;
          const answer = data.Answer || "";
          setMatches([...matches, `${connectionCategory}: ${sanitizedWords.join(", ")}${answer ? ` (${answer})` : ""}`]);
          setRound(currRound + 1);

          const updatedWords = words.filter(word => !selectedWords.includes(word));
          setSelectedWords([]);
          const updatedIndices = selectedWords.map(word => unfilteredWords.findIndex(w => w === word));
          setUsedWords(prevUsedWords => [...prevUsedWords, ...updatedIndices]);

          const groupedWords = [];
          while (updatedWords.length > 0) {
            groupedWords.push(updatedWords.splice(0, 4));
          }
          setWords(groupedWords.flat());
          if (data.Answer !== "") {
            setAnswer(data.Answer);
            localStorage.setItem('answer', data.Answer);
          }
        } else {
          console.log("No matching category found");
          // Handle case when no matching category is found
        }
      })
      .catch(error => {
        console.error('Error fetching connections guess:', error);
        // Handle error
      });
  };

  const restartGame = () => {
    // Reset all state variables to their initial values
    setWords([]);
    setSelectedWords([]);
    setMatches([]);
    setRound(1);
    setAnswer("");
    setUsedWords([]);
  };

  return (
    <div className="mx-20">
      <h1 className="text-4xl font-bold text-center py-5 text-white">Connections</h1>
      <h2 className="text-center text-white">Create four groups of four!</h2>

      {matches.length !== 0 && (
        <div className="flex justify-center mt-4 flex-col">
          {matches.map((match, index) => (
            <div key={index} className="bg-green-500 text-white font-bold py-2 px-4 rounded mb-2">
              {match}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-4">
        <div className="grid grid-cols-4 gap-4 mt-10 w-3/4">
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
      <div className="flex justify-center mt-4">
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={submitGroups}
          disabled={selectedWords.length !== 4}
          style={{ opacity: selectedWords.length !== 4 ? 0.5 : 1 }}
        >
          Submit
        </button>
        <button
          className="ml-4 mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={restartGame}
        > Restart </button>
      </div>
      {answer && ( // Conditionally render answer
      <div className="flex justify-center mt-4">
        <div className="bg-yellow-300 text-black font-bold py-2 px-4 rounded">
          {`Answer: ${answer}`} {/* Display the answer */}
        </div>
      </div>
    )}
    </div>
  );
}

export default Connections;
