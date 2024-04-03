import { useDjangoContext } from "@/hooks/useDjangoContext";
import { useMemo, useState } from "react";
import background from "../../../assets/major_cases/colored-thread/background.png";
import { ILink, INode, IThread, NodeAnswer } from "./board_types";
import { collectNodes } from "./nodes";

export default function SVGBoard() {
  const [selectedThread, setSelectedThread] = useState<IThread | null>(null);
  const [selectedNode, setSelectedNode] = useState<INode | null>(null);
  const [links, setLinks] = useState<ILink[]>([]);

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
      // Check if the two nodes are not the same and there is no existing link between them
      if (
        selectedNode.id !== targetNode.id &&
        links.every((link) => link.from.id !== selectedNode.id && link.to.id !== targetNode.id)
      ) {
        // Link the two nodes
        setLinks([...links, { from: selectedNode, to: targetNode, thread: selectedThread }]);
        setSelectedNode(null);
        setSelectedThread(null);
      }
    }
  };

  /**
   * Handler for when a link is clicked
   */
  const handleLinkClick = (targetNode: INode) => {
    // Remove the link
    setLinks(links.filter((link) => link.to.id !== targetNode.id));
    setSelectedNode(null);
    setSelectedThread(null);
  };

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
        onClick={() => handleLinkClick(link.to)}
      />
    ));
  }

  return (
    <div>
      Selected Thread: {selectedThread?.color}
      <br />
      Selected Node: {selectedNode?.id}
      <svg
        width="100%"
        height="600"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <image href={background} width={svgWidth} height={svgHeight} />
        {drawNodes()}
        {drawThreads()}
        {drawLinks()}
      </svg>
    </div>
  );
}
