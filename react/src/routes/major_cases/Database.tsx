import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

interface VoiceRecording {
  uuid: string;
  transcript: string;
  audio_url: string;
  characters: string;
  timestamp: string;
}

export default function Database() {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [results, setResults] = useState<VoiceRecording[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (debouncedQuery !== "") {
      setLoading(true);
      fetch(
        `/api/search_voice_recordings/?q=${encodeURIComponent(debouncedQuery)}`
      )
        .then((response) => response.json())
        .then((data) => setResults(data.results))
        .finally(() => setLoading(false));
    }
  }, [debouncedQuery]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search voice recordings"
      />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {results.map((result, index) => (
            <li key={index}>{result.transcript}</li>
          ))}
        </ul>
      )}
      {results.length === 0 && debouncedQuery !== "" && !loading && (
        <div>No results found</div>
      )}
    </div>
  );
}
