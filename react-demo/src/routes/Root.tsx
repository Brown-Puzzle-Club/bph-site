import { useState } from "react";
import { usePageContext } from "../hooks/usePageContext";

import react2Logo from "../assets/react2.svg";
import reactLogo from "../assets/react.svg";
import viteLogo from "../assets/vite.svg";
import vite2Logo from "../assets/vite2.svg";
import thing from "../assets/thing.svg";

react2Logo;

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
      <a href="https://vitejs.dev" target="_blank">
        <img src={vite2Logo} alt="Vite2 logo" />
      </a>
      <a href="https://react.dev" target="_blank">
        <img src={reactLogo} alt="React logo" />
      </a>
      <a href="https://react.dev" target="_blank">
        <img src={react2Logo} alt="React2 logo" />
      </a>
      <a href="https://react.dev" target="_blank">
        <img src={thing} className="thing" alt="thing" />
      </a>
      <h1>Vite + React (+ Django eventually)! 🤪🤪🤪</h1>
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
