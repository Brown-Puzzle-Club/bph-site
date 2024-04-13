import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useDebounce } from "use-debounce";

import databg from "@/assets/major_cases/data/databg.png";
import dataleftcassette from "@/assets/major_cases/data/dataleftcassette.png";
import datarightcasette from "@/assets/major_cases/data/datarightcasette.png";
import datasearch from "@/assets/major_cases/data/datasearch.png";
import { Input } from "@/components/ui/input";

interface VoiceRecording {
  uuid: string;
  transcript: string;
  audio_url: string;
  characters: string;
  hour: string;
}

export default function Data() {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [results, setResults] = useState<VoiceRecording[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (debouncedQuery !== "") {
      setLoading(true);
      fetch(`/api/puzzle/data/search/?q=${encodeURIComponent(debouncedQuery)}`)
        .then((response) => response.json())
        .then((data) => setResults(data.results))
        .finally(() => setLoading(false));
    }
  }, [debouncedQuery]);

  return (
    <div
      className="flex justify-center h-full items-center"
      style={{
        backgroundImage: `url(${databg})`,
        backgroundSize: "cover",
      }}
    >
      <div className="py-4 mx-[2%] w-full flex flex-col items-center">
        <h1 className="text-2xl font-bold">Data Major Case</h1>
        <p>
          <a
            href="https://docs.google.com/document/d/1M5AHZp_9G-F7cQ-8NTrw8rORa_hT-rN9MwwDVaudpXo/edit?usp=sharing"
            className="underline hover:text-slate-400"
          >
            Flavor Text
          </a>
        </p>
        <div
          className="bg-contain bg-no-repeat pt-2 pb-2 w-full relative aspect-[7/1] w-[70%]"
          style={{
            backgroundImage: `url(${datasearch})`,
          }}
        >
          <Input
            type="text"
            className="absolute bg-transparent text-xl text-black font-mono my-4 border-none outline-none shadow-none text-white px-2 py-1 focus:outline-none focus-visible:ring-offset-0 ring-offset-0 border-0 w-[80%]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search voice recordings"
            style={{ top: "10%", left: "10%" }}
          />
        </div>

        {loading ? (
          <BeatLoader className="justify-center content-center pr-2" color={"#fff"} size={12} />
        ) : (
          <div>
            <ul>
              {results.map((result, index) => (
                <>
                  <li key={index} className="py-5 text-black">
                    <div className="flex justify-between " style={{}}>
                      <div
                        className="bg-contain bg-no-repeat aspect-ratio-[15/17] bg-right"
                        style={{
                          backgroundImage: `url(${dataleftcassette})`,
                          width: "40%",
                          transform: " scale(1.3)",
                        }}
                      ></div>
                      <div
                        className="w-full flex-col justify-center px-3"
                        style={{
                          backgroundColor: "#c29bb0",
                        }}
                      >
                        <div className="text-sm text-center  font-mono justify-center ">
                          {result.characters}, {result.hour}:00PM
                        </div>
                        <div className="text-left px-2 w-full">{result.transcript}</div>
                      </div>

                      <div
                        className="bg-contain bg-left bg-no-repeat aspect-ratio-[15/17]"
                        style={{
                          backgroundImage: `url(${datarightcasette})`,
                          width: "40%",
                          transform: " scale(1.3)",
                        }}
                      ></div>
                    </div>
                  </li>
                </>
              ))}
            </ul>
          </div>
        )}
        {results.length === 0 && debouncedQuery !== "" && !loading && <div>No results found</div>}
      </div>
    </div>
  );
}
