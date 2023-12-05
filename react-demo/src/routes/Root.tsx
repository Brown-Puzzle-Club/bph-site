

import { useState } from 'react';
import { usePageContext } from '../hooks/usePageContext';

export default function Root() {
  const [count, setCount] = useState(0)

  const pageContext = usePageContext<{test: number, test2: number}>();
  const test = pageContext?.test
  const test2 = pageContext?.test2

  return (
    <>
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
  )
}