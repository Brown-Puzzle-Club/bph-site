import { useRef, useState } from "react";

type Position = {
  x: number;
  y: number;
  coords: {
    x?: number;
    y?: number;
  };
};

const Circle = () => {
  const [position, setPosition] = useState<Position>({ x: 50, y: 50, coords: {} });

  const handleMouseMove = useRef((e: MouseEvent) => {
    setPosition((position: Position) => {
      const xDiff = position.coords.x !== undefined ? position.coords.x - e.pageX : 0;
      const yDiff = position.coords.y !== undefined ? position.coords.y - e.pageY : 0;
      return {
        x: position.x - xDiff,
        y: position.y - yDiff,
        coords: {
          x: e.pageX,
          y: e.pageY,
        },
      };
    });
  });

  const handleMouseDown = (e: React.MouseEvent<SVGCircleElement, MouseEvent>) => {
    const pageX = e.pageX;
    const pageY = e.pageY;
    setPosition((position: Position) =>
      Object.assign({}, position, {
        coords: {
          x: pageX,
          y: pageY,
        },
      }),
    );
    document.addEventListener("mousemove", handleMouseMove.current);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove.current);
    setPosition((position) => Object.assign({}, position, { coords: {} }));
  };

  return (
    <circle
      cx={position.x}
      cy={position.y}
      r={25}
      fill="white"
      stroke="red"
      strokeWidth="1"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    />
  );
};

const DragTest = () => {
  return (
    <svg
      style={{
        border: "1px solid white",
        height: "200px",
        width: "100%",
      }}
    >
      <Circle />
    </svg>
  );
};

export default DragTest;
