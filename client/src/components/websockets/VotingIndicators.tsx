import { useEffect } from "react";

import VotingIndicator from "./VotingIndicator";

interface VotingIndicatorsProps {
  numVotes: number;
}

const VotingIndicators = ({ numVotes }: VotingIndicatorsProps) => {
  useEffect(() => {
    console.log(numVotes);
  }, [numVotes]);

  return (
    <div className="flex justify-center space-x-2">
      {Array(numVotes)
        .fill(0)
        .map((_, i) => (
          <VotingIndicator key={i} />
        ))}
    </div>
  );
};

export default VotingIndicators;
