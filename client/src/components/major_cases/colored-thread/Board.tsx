import { useEffect, useRef, useState } from "react";
import background from "../../../assets/major_cases/colored-thread/background.png";
import { ILink, INode, IThread } from "./board_types";

export default function Board() {
  const [selectedThread, setSelectedThread] = useState<IThread | null>(null);
  const [selectedNode, setSelectedNode] = useState<INode | null>(null);
  const [links, setLinks] = useState<ILink[]>([]);

  const threads: IThread[] = [
    { color: "red", x: 57.85, y: 87 },
    { color: "green", x: 62.5, y: 87 },
    { color: "blue", x: 67, y: 87 },
  ];

  const nodes: INode[] = [
    { id: "bear-attack", x: 33, y: 13 },
    { id: "wasting-illness", x: 60.2, y: 12 },
    { id: "sleigh-accident", x: 32, y: 38 },
    { id: "self-immolation", x: 62.75, y: 39 },
    { id: "ennui", x: 41, y: 57 },
    { id: "hunting-accident", x: 37.75, y: 63 },
    { id: "radiation-poisoning", x: 41.5, y: 70.5 },
    { id: "run-through", x: 47.2, y: 73 },
    { id: "trampled", x: 54.25, y: 58 },
    { id: "sentient-energy-attack", x: 57, y: 62.5 },
    { id: "high-voltage-electrocution", x: 52.25, y: 70 },
  ];

  /**
   * Handler for when a thread is clicked
   */
  const handleThreadClick = (thread: IThread) => {
    if (selectedThread?.color === thread.color) {
      setSelectedThread(null);
      return;
    }
    setSelectedThread(thread);
  };

  /**
   * Handler for when a node is clicked
   */
  const handleNodeClick = (targetNode: INode) => {
    if (selectedThread) {
      if (!selectedNode) {
        // Select the node
        setSelectedNode(targetNode);
        return;
      }
      if (selectedNode.id !== targetNode.id) {
        // Link the two nodes
        setLinks([...links, { from: selectedNode, to: targetNode, thread: selectedThread }]);
        setSelectedNode(null);
        setSelectedThread(null);
      }
    }
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // A separate function to encapsulate drawing logic
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && canvas.parentElement) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background image
        const backgroundImg = new Image();
        backgroundImg.src = background;
        backgroundImg.onload = () => {
          ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

          // Drawing links after the background has been loaded and drawn
          links.forEach((link) => {
            const { from, to, thread } = link;

            ctx.beginPath();
            ctx.moveTo(
              from.x * (canvas.width / 100) + (window.innerWidth * 0.0125) / 2,
              from.y * (canvas.height / 100) + (window.innerHeight * 0.0225) / 2,
            );
            ctx.lineTo(
              to.x * (canvas.width / 100) + (window.innerWidth * 0.0125) / 2,
              to.y * (canvas.height / 100) + (window.innerHeight * 0.0225) / 2,
            );
            ctx.strokeStyle = thread.color;
            ctx.lineWidth = 3;
            ctx.stroke();
          });
        };
      }
    }
  };

  useEffect(() => {
    drawCanvas();

    // Setup resize event listener
    const handleResize = () => {
      drawCanvas(); // Redraw canvas on resize
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [links]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="relative" />
      {/* <img className="relative w-full h-full" src={background} /> */}

      {/* THREADS */}
      {threads.map((thread) => (
        <div
          key={thread.color}
          className={`absolute cursor-pointer z-10 w-[2.5%] h-[8%] bg-${thread.color}-500`}
          style={{ top: `${thread.y}%`, left: `${thread.x}%` }}
          onClick={() => handleThreadClick(thread)}
        />
      ))}

      {/* NODES */}
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute cursor-pointer z-10 w-[1.25%] h-[2.25%] bg-pink-500"
          style={{ top: `${node.y}%`, left: `${node.x}%` }}
          onClick={() => handleNodeClick(node)}
        />
      ))}
    </div>
  );
}
