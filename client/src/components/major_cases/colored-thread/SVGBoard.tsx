import { useCallback, useRef, useState } from "react";
import extraPinPng from "../../../assets/major_cases/colored-thread/extrapin.png";
import { THREAD_COLOR } from "./consts";
import { ILink, INode, NodeAnswer, ThreadType } from "./types/BoardTypes";

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
  const svgEleRef = useRef<SVGSVGElement>(null);
  const [solutionPinPos, setSolutionPinPos] = useState<Position>({
    x: 22,
    y: 90,
    coords: {},
  });

  /**
   * Function that converts screen coordinates to SVG coordinates.
   */
  function screenToSvgCoords(
    e: React.MouseEvent<SVGImageElement, MouseEvent>,
    svgEl: SVGSVGElement | null,
  ) {
    if (!svgEl) return { x: 0, y: 0 };
    let pt = svgEl.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    pt = pt.matrixTransform(svgEl.getScreenCTM()!.inverse());
    return { x: pt.x, y: pt.y };
  }

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
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const svgCoords = screenToSvgCoords(e, svgEleRef.current);
      setSolutionPinPos((position) => {
        const xDiff = position.coords.x !== undefined ? position.coords.x - svgCoords.x : 0;
        const yDiff = position.coords.y !== undefined ? position.coords.y - svgCoords.y : 0;
        const newX = position.x - xDiff;
        const newY = position.y - yDiff;
        if (newX < 5 || newX > 85 || newY < 5 || newY > 85) return position;
        return {
          x: newX,
          y: newY,
          coords: svgCoords,
        };
      });
    },
    [setSolutionPinPos],
  );

  /**
   * Handler for when the mouse is pressed down for the solution pin.
   */
  const handleMouseDown = (e: React.MouseEvent<SVGImageElement, MouseEvent>) => {
    const svgCoords = screenToSvgCoords(e, svgEleRef.current);
    setSolutionPinPos((position) => ({
      ...position,
      coords: svgCoords,
    }));
    document.addEventListener("mousemove", handleMouseMove);
  };

  /**
   * Handler for when the mouse is released for the solution pin.
   */
  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
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
    return nodes.map((node) => (
      <circle
        key={node.node.id}
        cx={node.node.x}
        cy={node.node.y}
        r={0}
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
    ));
  }

  /**
   * Draw the links on the SVG board.
   */
  function drawLinks() {
    return links.map((link, index) => {
      // Adjust the coordinates if 'solution-pin' is involved
      const x1 = link.from.id === "solution-pin" ? link.from.x + 2 : link.from.x;
      const y1 = link.from.id === "solution-pin" ? link.from.y + 2 : link.from.y;
      const x2 = link.to.id === "solution-pin" ? link.to.x + 2 : link.to.x;
      const y2 = link.to.id === "solution-pin" ? link.to.y + 2 : link.to.y;

      return (
        <line
          key={link.from.id + link.to.id + index}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={THREAD_COLOR[link.thread]}
          strokeWidth="0.5"
          style={{
            cursor: "pointer",
            zIndex: 10,
          }}
          onClick={() => handleLinkClick(link.from, link.to)}
        />
      );
    });
  }

  /**
   * Draw the solution pin on the SVG board.
   */
  function drawSolutionPin() {
    return (
      <svg id="example1" xmlns="http://www.w3.org/2000/svg">
        <image
          id="solution-pin"
          x={solutionPinPos.x}
          y={solutionPinPos.y}
          width="5"
          height="5"
          href={extraPinPng}
          onMouseUp={handleMouseUp}
          onMouseDown={handleMouseDown}
          style={{
            cursor: "pointer",
          }}
          onClick={() =>
            setSelectedNode({
              id: "solution-pin",
              x: solutionPinPos.x,
              y: solutionPinPos.y,
            })
          }
        />
      </svg>
    );
  }

  return (
    <div className="absolute inset-0">
      <svg
        ref={svgEleRef}
        width="100vw"
        height="100%"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {drawNodes()}
        {drawLinks()}
        {drawSolutionPin()}
      </svg>
    </div>
  );
}
