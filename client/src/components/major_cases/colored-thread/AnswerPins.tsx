import type { CSSProperties } from "react";

import pin1 from "@/assets/major_cases/colored-thread/pin1.png";
import pin2 from "@/assets/major_cases/colored-thread/pin2.png";
import pin3 from "@/assets/major_cases/colored-thread/pin3.png";
import pin4 from "@/assets/major_cases/colored-thread/pin4.png";
import pin5 from "@/assets/major_cases/colored-thread/pin5.png";
import pin7 from "@/assets/major_cases/colored-thread/pin7.png";
import pin8 from "@/assets/major_cases/colored-thread/pin8.png";
import pin9 from "@/assets/major_cases/colored-thread/pin9.png";
import pin10 from "@/assets/major_cases/colored-thread/pin10.png";
import pin11 from "@/assets/major_cases/colored-thread/pin11.png";
import type { AssetProps } from "@/components/RelativeAsset";
import RelativeAsset from "@/components/RelativeAsset";
import { cn } from "@/utils/utils";

import { COLORED_GLOW } from "./consts";
import type { INode, NodeAnswer, ThreadType } from "./types/BoardTypes";

export const PIN_HOVER_GLOW = "drop-shadow-[0_15px_15px_rgba(255,255,255,0.4)]";

interface AnswerPin extends AssetProps {
  id: string;
  nodes: NodeAnswer[];
  selectedThread: ThreadType | null;
  selectedNode: INode | null;
  handleNodeClick: (node: INode) => void;
  textStyle?: CSSProperties;
}

const formatAnswer = (answer: string) => {
  // remove everything after the word ON, if it exists
  const answer_upper = answer.toUpperCase();
  const index = answer_upper.indexOf(" ON");
  return index === -1 ? answer : answer_upper.substring(0, index);
};

const Pin = ({ nodes, selectedThread, selectedNode, handleNodeClick, ...props }: AnswerPin) => {
  const node = nodes.find((node) => node.node.id === props.id);
  if (!node) return null;

  return (
    <RelativeAsset
      extraClasses={cn(
        "select-none",
        selectedThread ? "hover:cursor-pointer" : "pointer-events-none",
        selectedThread &&
          (selectedNode && selectedNode.id === props.id
            ? COLORED_GLOW[selectedThread]
            : "hover:drop-shadow-[0_15px_15px_rgba(255,255,255,0.4)]"),
      )}
      onClick={() => {
        if (selectedThread) handleNodeClick(node.node);
      }}
      {...props}
    >
      <p
        className="absolute text-[#000000e6] font-mono font-bold text-[1.5vw] text-center select-none"
        style={props.textStyle ? props.textStyle : props.extraStyles}
      >
        {formatAnswer(node.answer)}
      </p>
    </RelativeAsset>
  );
};

interface AnswerPinsProps {
  nodes: NodeAnswer[];
  selectedThread: ThreadType | null;
  selectedNode: INode | null;
  handleNodeClick: (node: INode) => void;
}

export default function AnswerPins(props: AnswerPinsProps) {
  return (
    <>
      <Pin
        {...props}
        id="cats"
        imageSrc={pin1}
        extraStyles={{
          top: "9%",
          left: "30%",
          width: "9%",
          zIndex: 3,
        }}
        textStyle={{
          top: "49%",
          left: "40%",
          transform: "translate(-50%, -50%) rotate(354deg)",
          fontSize: "0.9vw",
        }}
      />
      <Pin
        {...props}
        id="wasting-illness"
        imageSrc={pin2}
        extraStyles={{
          top: "9%",
          left: "51.7%",
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
        {...props}
        id="penny"
        imageSrc={pin3}
        extraStyles={{
          top: "35%",
          left: "26%",
          width: "9%",
          zIndex: 3,
        }}
        textStyle={{
          top: "59%",
          left: "34%",
          transform: "translate(-50%, -50%) rotate(6deg)",
          fontSize: "0.9vw",
        }}
      />
      <Pin
        {...props}
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
        {...props}
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
        {...props}
        id="ennui"
        imageSrc={pin5} // 6
        extraStyles={{
          top: "52%",
          left: "50%",
          width: "9%",
          zIndex: 3,
        }}
        textStyle={{
          top: "67%",
          left: "35%",
          transform: "translate(-50%, -50%) rotate(354deg)",
          fontSize: "1.3vw",
        }}
      />
      <Pin
        {...props}
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
        {...props}
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
        {...props}
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
        {...props}
        id="whales"
        imageSrc={pin10}
        extraStyles={{
          top: "72%",
          left: "44%",
          width: "7%",
          zIndex: 3,
        }}
        textStyle={{
          top: "59%",
          left: "40%",
          transform: "translate(-50%, -50%) rotate(2deg)",
          fontSize: "1.1vw",
        }}
      />
      <Pin
        {...props}
        id="birbs-at-brown"
        imageSrc={pin11}
        extraStyles={{
          top: "69%",
          left: "51%",
          width: "9%",
          zIndex: 3,
        }}
        textStyle={{
          top: "55%",
          left: "63%",
          transform: "translate(-50%, -50%) rotate(355deg)",
          fontSize: "0.9vw",
        }}
      />
    </>
  );
}
