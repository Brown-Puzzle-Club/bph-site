import { useEffect, useRef, useState } from "react";

interface useIntervalProps {
  duration: number;
  callback: () => void;
}

const useInterval = ({ duration, callback }: useIntervalProps) => {
  const [isRunning, setIsRunning] = useState(true);
  const intervalId = useRef<NodeJS.Timeout>();

  useEffect(() => {
    intervalId.current = setInterval(() => {
      if (isRunning) callback();
    }, duration);

    return () => clearInterval(intervalId.current);
  });

  const start = () => {
    if (!isRunning) {
      intervalId.current = setInterval(() => {
        if (isRunning) callback();
      }, duration);
      setIsRunning(true);
    }
  };

  const stop = () => {
    if (isRunning) {
      clearInterval(intervalId.current);
      setIsRunning(false);
    }
  };

  const restart = () => {
    clearInterval(intervalId.current);
    intervalId.current = setInterval(() => {
      if (isRunning) callback();
    }, duration);
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  return { running: isRunning, start, stop, pause, restart };
};

export default useInterval;
