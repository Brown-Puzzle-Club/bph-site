import pin1 from "@/assets/major_cases/colored-thread/pin1.png";
import pin10 from "@/assets/major_cases/colored-thread/pin10.png";
import pin11 from "@/assets/major_cases/colored-thread/pin11.png";
import pin2 from "@/assets/major_cases/colored-thread/pin2.png";
import pin3 from "@/assets/major_cases/colored-thread/pin3.png";
import pin4 from "@/assets/major_cases/colored-thread/pin4.png";
import pin5 from "@/assets/major_cases/colored-thread/pin5.png";
import pin7 from "@/assets/major_cases/colored-thread/pin7.png";
import pin8 from "@/assets/major_cases/colored-thread/pin8.png";
import pin9 from "@/assets/major_cases/colored-thread/pin9.png";

import RelativeAsset, { AssetProps } from "@/components/RelativeAsset";
import { CSSProperties } from "react";
import { ILink, INode, NodeAnswer, ThreadType } from "./board_types";
import { COLORED_GLOW } from "./consts";

const PIN_HOVER_GLOW = "drop-shadow-[0_15px_15px_rgba(255,255,255,0.4)]";

interface AnswerPin extends AssetProps {
  id: string;
  textStyle?: CSSProperties;
}

export default function AnswerPins({
  nodes,
  selectedThread,
  selectedNode,
  setSelectedNode,
  links,
  setLinks,
}: {
  nodes: NodeAnswer[];
  selectedThread: ThreadType | null;
  selectedNode: INode | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<INode | null>>;
  links: ILink[];
  setLinks: React.Dispatch<React.SetStateAction<ILink[]>>;
}) {
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

  const Pin = (props: AnswerPin) => {
    const node = nodes.find((node) => node.node.id === props.id);
    if (!node) return null;

    return (
      <>
        <RelativeAsset
          extraClasses={`hover:cursor-pointer ${selectedThread && selectedNode && selectedNode.id === props.id ? COLORED_GLOW[selectedThread] : `hover:${PIN_HOVER_GLOW}`}`}
          onClick={() => {
            if (selectedThread) handleNodeClick(node.node);
          }}
          {...props}
        >
          <p
            className="absolute text-black font-mono font-bold text-[1.5vw] text-center"
            style={props.textStyle ? props.textStyle : props.extraStyles}
          >
            {node.answer}
          </p>
        </RelativeAsset>
      </>
    );
  };

  return (
    <>
      <Pin
        id="mr-cat"
        imageSrc={pin1}
        extraStyles={{
          top: "9%",
          left: "28%",
          width: "9%",
          zIndex: 3,
        }}
        textStyle={{
          top: "49%",
          left: "40%",
          transform: "translate(-50%, -50%) rotate(354deg)",
          fontSize: "1.1vw",
        }}
      />
      <Pin
        id="wasting-illness"
        imageSrc={pin2}
        extraStyles={{
          top: "9%",
          left: "54%",
          width: "9%",
          zIndex: 3,
        }}
        textStyle={{
          top: "49%",
          left: "36%",
          transform: "translate(-50%, -50%) rotate(1deg)",
          fontSize: "0.9vw",
        }}
      />
      <Pin
        id="trampled" // penny-puzz
        imageSrc={pin3}
        extraStyles={{
          top: "35%",
          left: "26%",
          width: "9%",
          zIndex: 3,
        }}
        textStyle={{
          top: "49%",
          left: "40%",
          transform: "translate(-50%, -50%) rotate(354deg)",
          fontSize: "1.1vw",
        }}
      />
      <Pin
        id="trampled"
        imageSrc={pin4}
        extraStyles={{
          top: "37%",
          left: "58%",
          width: "10%",
          zIndex: 3,
        }}
        textStyle={{
          top: "66%",
          left: "65%",
          transform: "translate(-50%, -50%) rotate(12deg)",
          fontSize: "1.1vw",
        }}
      />
      <Pin
        id="internal-lacerations"
        imageSrc={pin5}
        extraStyles={{
          top: "53%",
          left: "35%",
          width: "9%",
          zIndex: 3,
        }}
        textStyle={{
          top: "68%",
          left: "38%",
          transform: "translate(-50%, -50%) rotate(354deg)",
          fontSize: "0.85vw",
        }}
      />
      <Pin
        id="ennui"
        imageSrc={pin5} // 6
        extraStyles={{
          top: "52%",
          left: "50%",
          width: "10%",
          zIndex: 3,
        }}
        textStyle={{
          top: "49%",
          left: "40%",
          transform: "translate(-50%, -50%) rotate(354deg)",
          fontSize: "1.1vw",
        }}
      />
      <Pin
        id="shot-out-of-cannon"
        imageSrc={pin7}
        extraStyles={{
          top: "63%",
          left: "31%",
          width: "9%",
          zIndex: 3,
        }}
        textStyle={{
          top: "53%",
          left: "36%",
          transform: "translate(-50%, -50%) rotate(356deg)",
          fontSize: "0.9vw",
        }}
      />
      <Pin
        id="forced-regeneration"
        imageSrc={pin8}
        extraStyles={{
          top: "61%",
          left: "55%",
          width: "8%",
          zIndex: 3,
        }}
        textStyle={{
          top: "49%",
          left: "58%",
          transform: "translate(-50%, -50%) rotate(358deg)",
          fontSize: "0.8vw",
        }}
      />
      <Pin
        id="crushed-neck"
        imageSrc={pin9}
        extraStyles={{
          top: "69%",
          left: "35%",
          width: "9%",
          zIndex: 3,
        }}
        textStyle={{
          top: "51%",
          left: "40%",
          transform: "translate(-50%, -50%) rotate(348deg)",
          fontSize: "1vw",
        }}
      />
      <Pin
        id="trampled" // birbs-at-brown
        imageSrc={pin10}
        extraStyles={{
          top: "72%",
          left: "44%",
          width: "7%",
          zIndex: 3,
        }}
        textStyle={{
          top: "49%",
          left: "40%",
          transform: "translate(-50%, -50%) rotate(354deg)",
          fontSize: "1.1vw",
        }}
      />
      <Pin
        id="trampled" // whaling-ships
        imageSrc={pin11}
        extraStyles={{
          top: "69%",
          left: "51%",
          width: "9%",
          zIndex: 3,
        }}
        textStyle={{
          top: "49%",
          left: "40%",
          transform: "translate(-50%, -50%) rotate(354deg)",
          fontSize: "1.1vw",
        }}
      />
    </>
  );
}
