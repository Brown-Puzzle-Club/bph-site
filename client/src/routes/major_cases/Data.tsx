import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useDebounce } from "use-debounce";

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
    <div className="py-4 mx-[20%]">
      <h1 className="text-2xl font-bold">Data Major Case</h1>
      <p>
        <a
          href="https://docs.google.com/document/d/1M5AHZp_9G-F7cQ-8NTrw8rORa_hT-rN9MwwDVaudpXo/edit?usp=sharing"
          className="underline hover:text-slate-400"
        >
          Flavor Text
        </a>
      </p>
      <Input
        type="text"
        className="dark text-xl font-mono my-4"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search voice recordings"
      />
      {loading ? (
        <BeatLoader className="justify-center content-center pr-2" color={"#fff"} size={12} />
      ) : (
        <div>
          <ul>
            {results.map((result, index) => (
              <li key={index} className="py-4 border-b border-slate-800">
                <div className="flex justify-between">
                  <div className="text-left border-r border-slate-800 px-2 w-[75%]">
                    {result.transcript}
                  </div>
                  <div className="text-sm text-center border-r border-slate-800 font-mono pr-2 justify-center content-center px-1">
                    {result.characters}, {result.hour}:00PM
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {results.length === 0 && debouncedQuery !== "" && !loading && <div>No results found</div>}
    </div>
  );
}
