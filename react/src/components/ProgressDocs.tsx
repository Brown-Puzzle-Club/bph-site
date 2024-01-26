

import { ReactNode } from 'react';

export default function ProgressDocs({ children }: { children: ReactNode }) {
  return (
    <div className="progress-docs">
      <div className="progress"></div>
      <div className="docs py-10 px-20">{children}</div>
    </div>
  )
}