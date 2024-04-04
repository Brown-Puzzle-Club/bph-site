import { useDjangoContext } from "@/hooks/useDjangoContext";
import { useMemo, useRef, useState } from "react";
import background from "../../../assets/major_cases/colored-thread/background.png";
import { ILink, INode, IThread, NodeAnswer } from "./board_types";
import { collectNodes } from "./nodes";

interface Position {
  x: number;
  y: number;
  coords: {
    x?: number;
    y?: number;
  };
}

export default function SVGBoard() {
  const [selectedThread, setSelectedThread] = useState<IThread | null>(null);
  const [selectedNode, setSelectedNode] = useState<INode | null>(null);
  const [links, setLinks] = useState<ILink[]>([]);
  const [solutionPinPos, setSolutionPinPos] = useState<Position>({
    x: 300,
    y: 540,
    coords: {},
  });

  const { context } = useDjangoContext();

  /**
   * TODO: Fix this later by adding a scale factor.
   */
  const svgWidth = 1000;
  const svgHeight = 600;

  const nodes: NodeAnswer[] = useMemo(() => {
    if (!context) return [] as NodeAnswer[];
    const nodes = collectNodes(context);
    console.log(nodes);
    return nodes;
  }, [context]);

  const threads: IThread[] = [
    { color: "red", x: 576, y: 505 },
    { color: "green", x: 622, y: 505 },
    { color: "blue", x: 665, y: 505 },
  ];

  /**
   * Handler for when a thread is clicked.
   */
  const handleThreadClick = (thread: IThread) => {
    if (selectedThread?.color === thread.color) {
      setSelectedThread(null);
      return;
    }
    setSelectedThread(thread);
  };

  /**
   * Handler for when a node is clicked.
   */
  const handleNodeClick = (targetNode: INode) => {
    if (selectedThread) {
      if (!selectedNode) {
        // Select the node
        setSelectedNode(targetNode);
        return;
      }
      // Check if the two nodes are not the same and there is no existing link between them
      if (
        selectedNode.id !== targetNode.id &&
        !links.some(
          (link) =>
            (link.from.id === selectedNode.id && link.to.id === targetNode.id) ||
            (link.from.id === targetNode.id && link.to.id === selectedNode.id),
        )
      ) {
        // Link the two nodes
        setLinks([...links, { from: selectedNode, to: targetNode, thread: selectedThread }]);
        setSelectedNode(null);
      }
    }
  };

  /**
   * Handler for when a link is clicked.
   */
  const handleLinkClick = (sourceNode: INode, targetNode: INode) => {
    // Remove the link
    setLinks(
      links.filter((link) => link.from.id !== sourceNode.id || link.to.id !== targetNode.id),
    );
    setSelectedNode(null);
    setSelectedThread(null);
  };

  /**
   * Handler for when the mouse is moved for the solution pin.
   */
  const handleMouseMove = useRef((e: MouseEvent) => {
    setSolutionPinPos((position: Position) => {
      const xDiff = position.coords.x !== undefined ? position.coords.x - e.pageX : 0;
      const yDiff = position.coords.y !== undefined ? position.coords.y - e.pageY : 0;
      if (
        position.x - xDiff < 260 ||
        position.x - xDiff > 715 ||
        position.y - yDiff < 60 ||
        position.y - yDiff > 510
      ) {
        return position;
      }
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

  /**
   * Handler for when the mouse is pressed down for the solution pin.
   */
  const handleMouseDown = (e: React.MouseEvent<SVGCircleElement, MouseEvent>) => {
    const pageX = e.pageX;
    const pageY = e.pageY;
    setSolutionPinPos((position: Position) =>
      Object.assign({}, position, {
        coords: {
          x: pageX,
          y: pageY,
        },
      }),
    );
    document.addEventListener("mousemove", handleMouseMove.current);
  };

  /**
   * Handler for when the mouse is released for the solution pin.
   */
  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove.current);
    setSolutionPinPos((position) => Object.assign({}, position, { coords: {} }));
    // Dynamically update any links that are connected to the solution pin
    const updatedLinks = links.map((link) => {
      if (link.to.id === "solution-pin") {
        return { ...link, to: { id: "solution-pin", x: solutionPinPos.x, y: solutionPinPos.y } };
      }
      if (link.from.id === "solution-pin") {
        return { ...link, from: { id: "solution-pin", x: solutionPinPos.x, y: solutionPinPos.y } };
      }
      return link;
    });
    setLinks(updatedLinks);
  };

  /**
   * Draw the nodes on the SVG board.
   */
  function drawNodes() {
    return nodes.map((node, index) => (
      <circle
        key={index}
        cx={node.node.x}
        cy={node.node.y}
        r="5"
        fill="black"
        style={{
          cursor: "pointer",
        }}
        onClick={() => handleNodeClick(node.node)}
      />
    ));
  }

  /**
   * Draw the threads on the SVG board.
   */
  function drawThreads() {
    return threads.map((thread, index) => (
      <rect
        key={index}
        x={thread.x}
        y={thread.y}
        width="30"
        height="50"
        fill={thread.color}
        style={{
          cursor: "pointer",
        }}
        onClick={() => handleThreadClick(thread)}
      />
    ));
  }

  /**
   * Draw the links on the SVG board.
   */
  function drawLinks() {
    return links.map((link, index) => (
      <line
        key={index}
        x1={link.from.x}
        y1={link.from.y}
        x2={link.to.x}
        y2={link.to.y}
        stroke={link.thread.color}
        strokeWidth="2"
        style={{
          cursor: "pointer",
        }}
        onClick={() => handleLinkClick(link.from, link.to)}
      />
    ));
  }

  /**
   * Draw the solution pin on the SVG board.
   */
  function drawSolutionPin() {
    return (
      <circle
        cx={solutionPinPos.x}
        cy={solutionPinPos.y}
        r={15}
        fill="yellow"
        stroke="yellow"
        strokeWidth="1"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={() => {
          handleNodeClick({ id: "solution-pin", x: solutionPinPos.x, y: solutionPinPos.y });
        }}
        style={{
          cursor: "pointer",
        }}
      />
    );
  }

  return (
    <div className="absolute">
      Selected Thread: {selectedThread?.color}
      <br />
      Selected Node: {selectedNode?.id}
      <svg
        width="100%"
        height="600"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* <image href={background} width={svgWidth} height={svgHeight} /> */}
        {drawNodes()}
        {drawThreads()}
        {drawLinks()}
        {drawSolutionPin()}
      </svg>
    </div>
  );
}
