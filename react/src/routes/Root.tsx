import { useState } from "react";
import { usePageContext } from "../hooks/usePageContext";

import thing from "../assets/thing.svg";
import viteLogo from "../assets/vite.svg";

export default function Root() {
  const [count, setCount] = useState(0);

  const pageContext = usePageContext<{ test: number; test2: number }>();
  const test = pageContext?.test;
  const test2 = pageContext?.test2;

  return (
    <>
      <a href="https://vitejs.dev" target="_blank">
        <img src={viteLogo} alt="Vite logo" />
      </a>
      <a href="https://react.dev" target="_blank">
        <img src={thing} className="thing" alt="thing" style={{ width: 50 }} />
      </a>
      <h1>Vite + React</h1>
      <div className="card">
        <p>test: {test}</p>
        <p>test2: {test2}</p>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <a href="/route-two">routeTwo</a>
    </>
  );
}
