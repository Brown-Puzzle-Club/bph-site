import React from "react";
import { useGesture } from "react-use-gesture";

import angry from "@/assets/bluenoir/angry.png";
import happy from "@/assets/bluenoir/happy.png";
import sad from "@/assets/bluenoir/sad.png";

export default function Story() {
  const images = [angry, happy, sad];

  const [positions, setPositions] = React.useState([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);

  useGesture(
    {
      onDrag: ({ event, movement: [,] }) => {
        event.preventDefault();
      },
      onDragEnd: () => {
        // const pos = centered ? CENTER : getNearestSnapPoint({ x: x.get(), y: y.get() });
        // const centeredPositionX = pos.x * innerWidth - (measureRef.current?.offsetWidth ?? 0) / 2;
        // const centeredPositionY = pos.y * innerHeight - (measureRef.current?.offsetHeight ?? 0) / 2;
        // animate(x, centeredPositionX);
        // animate(y, centeredPositionY);
        // animate(scale, centered ? 2 : 1);
        // setPosition(pos);
      },
    },
    {
      drag: { initial: () => [x.get(), y.get()], filterTaps: true },
      domTarget: dragRef,
      eventOptions: { passive: false },
    },
  );

  return (
    <div className="bg-slate-900 text-white h-[90vh] overscroll-contain overflow-hidden overflow-y-auto ">
      <h1 className="text-4xl font-bold text-center py-5">The Final Verdict</h1>
      <div className="flex justify-center">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Image ${index + 1}`}
            className="w-32 h-32 mx-2"
            style={{ transform: `translate(${positions[index].x}px, ${positions[index].y}px)` }}
            {...bind(index)}
          />
        ))}
      </div>
    </div>
  );
}
