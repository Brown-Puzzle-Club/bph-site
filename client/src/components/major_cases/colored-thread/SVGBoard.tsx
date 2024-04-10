import { useRef, useState } from "react";
import { ILink, INode, NodeAnswer, ThreadType } from "./types/BoardTypes";
import { THREAD_COLOR } from "./consts";

interface Position {
  x: number;
  y: number;
  coords: {
    x?: number;
    y?: number;
  };
}

export default function SVGBoard({
  setSelectedNode,
  links,
  setLinks,
  nodes,
}: {
  selectedThread: ThreadType | null;
  selectedNode: INode | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<INode | null>>;
  links: ILink[];
  setLinks: React.Dispatch<React.SetStateAction<ILink[]>>;
  nodes: NodeAnswer[];
}) {
  const [solutionPinPos, setSolutionPinPos] = useState<Position>({
    x: 300,
    y: 540,
    coords: {},
  });

  /**
   * TODO: Fix this later by adding a scale factor.
   */
  const svgWidth = window.innerWidth;
  const svgHeight = window.innerHeight;

  /**
   * Handler for when a link is clicked.
   */
  const handleLinkClick = (sourceNode: INode, targetNode: INode) => {
    // Remove the link
    setLinks(
      links.filter((link) => link.from.id !== sourceNode.id || link.to.id !== targetNode.id),
    );
    setSelectedNode(null);
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
    setSolutionPinPos((position: Position) => ({
      ...position,
      coords: {
        x: pageX,
        y: pageY,
      },
    }));
    document.addEventListener("mousemove", handleMouseMove.current);
  };

  /**
   * Handler for when the mouse is released for the solution pin.
   */
  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove.current);
    setSolutionPinPos((position) => ({ ...position, coords: {} }));
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
    return nodes.map((node) =>
      node.node.id === "wasting-illness" ? (
        <circle
          key={node.node.id}
          cx={node.node.x}
          cy={node.node.y}
          r={15}
          fill="green"
          stroke="yellow"
          strokeWidth="1"
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            setSelectedNode(node.node);
          }}
        />
      ) : (
        <circle
          key={node.node.id}
          cx={node.node.x}
          cy={node.node.y}
          r={15}
          fill="white"
          stroke="black"
          strokeWidth="2"
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            setSelectedNode(node.node);
          }}
        />
      ),
    );
  }

  /**
   * Draw the links on the SVG board.
   */
  function drawLinks() {
    return links.map((link, index) => (
      <line
        key={link.from.id + link.to.id + index}
        x1={link.from.x}
        y1={link.from.y}
        x2={link.to.x}
        y2={link.to.y}
        stroke={THREAD_COLOR[link.thread]}
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
          // TOOD: reimplement solution pin with image on AnswerPins side maybe?
          // handleNodeClick({ id: "solution-pin", x: solutionPinPos.x, y: solutionPinPos.y });
        }}
        style={{
          cursor: "pointer",
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0">
      <svg
        width="100vw"
        height="100%"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>{drawNodes()}</g>

        {drawLinks()}
        {drawSolutionPin()}
      </svg>
    </div>
  );
}
