import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";

import { cn } from "@/utils/utils";

import extraPinPng from "../../../assets/major_cases/colored-thread/extrapin.png";
import { COLORED_GLOW, THREAD_COLOR } from "./consts";
import type { ILink, INode, NodeAnswer, ThreadType } from "./types/BoardTypes";

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

interface Position {
  x: number;
  y: number;
  coords: {
    x?: number;
    y?: number;
  };
}

const lineVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: "spring", duration: 1.5, bounce: 0 },
      opacity: { duration: 0.01 },
    },
  },
};

interface LinksProps {
  links: ILink[];
  handleLinkClick: (sourceNode: INode, targetNode: INode) => void;
}

const Links = ({ links, handleLinkClick }: LinksProps) => {
  return (
    <AnimatePresence>
      {links.map((link) => {
        // Adjust the coordinates if 'solution-pin' is involved
        const x1 = link.from.id === "solution-pin" ? link.from.x + 2 : link.from.x;
        const y1 = link.from.id === "solution-pin" ? link.from.y + 2 : link.from.y;
        const x2 = link.to.id === "solution-pin" ? link.to.x + 2 : link.to.x;
        const y2 = link.to.id === "solution-pin" ? link.to.y + 2 : link.to.y;

        return (
          <motion.line
            variants={lineVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="cursor-not-allowed"
            key={link.from.id + link.to.id}
            {...{ x1, y1, x2, y2 }}
            stroke={THREAD_COLOR[link.thread]}
            strokeWidth="0.5"
            onClick={() => handleLinkClick(link.from, link.to)}
          />
        );
      })}
    </AnimatePresence>
  );
};

interface NodesProps {
  nodes: NodeAnswer[];
  setSelectedNode: (node: INode | null) => void;
}

const Nodes = ({ nodes, setSelectedNode }: NodesProps) => {
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
};
interface SolutionPinProps {
  selectedThread: ThreadType | null;
  selectedNode: INode | null;
  handleNodeClick: (node: INode) => void;
  links: ILink[];
  setLinks: (links: ILink[]) => void;
  svgEleRef: React.RefObject<SVGSVGElement>;
}

const SolutionPin = ({
  selectedThread,
  selectedNode,
  handleNodeClick,
  links,
  setLinks,
  svgEleRef,
}: SolutionPinProps) => {
  const [solutionPinPos, setSolutionPinPos] = useState<Position>({ x: 22, y: 90, coords: {} });

  /**
   * Handler for when the mouse is moved for the solution pin.
   */
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const svgCoords = screenToSvgCoords(
        e as unknown as React.MouseEvent<SVGImageElement, MouseEvent>,
        svgEleRef.current,
      );
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
    [svgEleRef],
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

  return (
    <svg id="example1" xmlns="http://www.w3.org/2000/svg">
      <image
        id="solution-pin"
        // GLOW DOES NOT WORK :(
        className={cn(
          `cursor-pointer select-none`,
          `${selectedThread && selectedNode && selectedNode.id === "solution-pin" ? COLORED_GLOW[selectedThread] : `hover:drop-shadow-[0_15px_15px_rgba(255,255,255,0.4)]`}`,
        )}
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
        onClick={() => {
          if (selectedThread) {
            handleNodeClick({
              id: "solution-pin",
              x: solutionPinPos.x,
              y: solutionPinPos.y,
            });
          }
        }}
      />
    </svg>
  );
};

interface SVGBoardProps {
  selectedThread: ThreadType | null;
  selectedNode: INode | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<INode | null>>;
  handleNodeClick: (node: INode) => void;
  links: ILink[];
  setLinks: React.Dispatch<React.SetStateAction<ILink[]>>;
  nodes: NodeAnswer[];
}

export default function SVGBoard({
  selectedThread,
  selectedNode,
  setSelectedNode,
  handleNodeClick,
  links,
  setLinks,
  nodes,
}: SVGBoardProps) {
  const svgEleRef = useRef<SVGSVGElement>(null);

  const handleLinkClick = (sourceNode: INode, targetNode: INode) => {
    setSelectedNode(null);
    setLinks((oldLinks) =>
      oldLinks.filter((link) => link.from.id !== sourceNode.id || link.to.id !== targetNode.id),
    );
  };

  return (
    <div className="absolute inset-0">
      <svg
        ref={svgEleRef}
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Nodes nodes={nodes} setSelectedNode={setSelectedNode} />
        <Links links={links} handleLinkClick={handleLinkClick} />
        <SolutionPin
          selectedThread={selectedThread}
          selectedNode={selectedNode}
          handleNodeClick={handleNodeClick}
          links={links}
          setLinks={setLinks}
          svgEleRef={svgEleRef}
        />
      </svg>
    </div>
  );
}
