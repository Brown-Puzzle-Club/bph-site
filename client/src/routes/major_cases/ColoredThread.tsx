import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect, useMemo, useState } from "react";

import background from "@/assets/major_cases/colored-thread/background.jpg";
import board from "@/assets/major_cases/colored-thread/board.png";
import doctor from "@/assets/major_cases/colored-thread/thread-doctor.png";
import gorey from "@/assets/major_cases/colored-thread/thread-gorey.png";
import puss from "@/assets/major_cases/colored-thread/thread-puss.png";
import RelativeAsset from "@/components/RelativeAsset";
import AnswerPins from "@/components/major_cases/colored-thread/AnswerPins";
import SVGBoard from "@/components/major_cases/colored-thread/SVGBoard";
import {
  HOVER_GLOW,
  MAX_LINKS,
  THREAD_SELECTED_DOCTOR_GLOW,
  THREAD_SELECTED_GOREY_GLOW,
  THREAD_SELECTED_PUSS_GLOW,
  emptyCounts,
} from "@/components/major_cases/colored-thread/consts";
import { collectNodes } from "@/components/major_cases/colored-thread/nodes";
import type {
  ILink,
  INode,
  NodeAnswer,
} from "@/components/major_cases/colored-thread/types/BoardTypes";
import { ThreadType } from "@/components/major_cases/colored-thread/types/BoardTypes";
import { ArtWrapper } from "@/components/minor_cases/CasePageArt";
import { Button } from "@/components/ui/button";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { useTheme } from "@/hooks/useTheme";
import { BROWN_THEME } from "@/utils/themes";

interface ThreadsProps {
  selectedThread: ThreadType | null;
  toggleThread: (thread: ThreadType) => void;
  linkCounts: Record<ThreadType, number>;
}

const Threads = ({ selectedThread, toggleThread, linkCounts }: ThreadsProps) => {
  return (
    <>
      <RelativeAsset
        imageSrc={doctor}
        extraClasses={`${selectedThread == ThreadType.DOCTOR ? THREAD_SELECTED_DOCTOR_GLOW : `hover:${HOVER_GLOW}`} hover:cursor-pointer`}
        extraStyles={{
          top: "86%",
          left: "57%",
          width: "4%",
          zIndex: 10,
        }}
        onClick={() => {
          toggleThread(ThreadType.DOCTOR);
        }}
      >
        <span className="absolute bg-[#7D6723]" style={{ left: "25%", bottom: "-25%" }}>
          {linkCounts[ThreadType.DOCTOR]}/{MAX_LINKS[ThreadType.DOCTOR]}
        </span>
      </RelativeAsset>
      <RelativeAsset
        imageSrc={gorey}
        extraClasses={`${selectedThread == ThreadType.GOREY ? THREAD_SELECTED_GOREY_GLOW : `hover:${HOVER_GLOW}`} hover:cursor-pointer`}
        extraStyles={{
          top: "86%",
          left: "62%",
          width: "4%",
          zIndex: 10,
        }}
        onClick={() => {
          toggleThread(ThreadType.GOREY);
        }}
      >
        <span className="absolute bg-[#7D6723]" style={{ left: "25%", bottom: "-20%" }}>
          {linkCounts[ThreadType.GOREY]}/{MAX_LINKS[ThreadType.GOREY]}
        </span>
      </RelativeAsset>
      <RelativeAsset
        imageSrc={puss}
        extraClasses={`${selectedThread == ThreadType.PUSS ? THREAD_SELECTED_PUSS_GLOW : `hover:${HOVER_GLOW}`} hover:cursor-pointer`}
        extraStyles={{
          top: "86%",
          left: "67%",
          width: "4.5%",
          zIndex: 10,
        }}
        onClick={() => {
          toggleThread(ThreadType.PUSS);
        }}
      >
        <span className="absolute bg-[#7D6723]" style={{ left: "25%", bottom: "-30%" }}>
          {linkCounts[ThreadType.PUSS]}/{MAX_LINKS[ThreadType.PUSS]}
        </span>
      </RelativeAsset>
    </>
  );
};

export default function ColoredThread() {
  const [selectedThread, setSelectedThread] = useState<ThreadType | null>(null);
  const [selectedNode, setSelectedNode] = useState<INode | null>(null);
  const [links, setLinks] = useLocalStorage<ILink[]>("colored-thread-links", []);
  const { data: context } = useDjangoContext();
  const { setTheme } = useTheme();
  const nodes: NodeAnswer[] = useMemo(() => collectNodes(context), [context]);
  const linkCounts = useMemo(() => {
    return links.reduce(
      (acc, link) => {
        acc[link.thread] += 1;
        return acc;
      },
      { ...emptyCounts },
    );
  }, [links]);

  useEffect(() => {
    setTheme(BROWN_THEME);
  });

  const handleNodeClick = (targetNode: INode) => {
    if (selectedThread) {
      if (!selectedNode) {
        // Select the node
        setSelectedNode(targetNode);
      } else if (targetNode.id === selectedNode.id) {
        // Deselect the node
        setSelectedNode(null);
      } else {
        const isLinked = (link: ILink) =>
          [selectedNode.id, targetNode.id].every((id) => link.from.id === id || link.to.id === id);

        console.log(linkCounts[selectedThread], MAX_LINKS[selectedThread]);

        if (!links.some(isLinked) && linkCounts[selectedThread] < MAX_LINKS[selectedThread]) {
          // Link the two nodes
          setLinks([...links, { from: selectedNode, to: targetNode, thread: selectedThread }]);
          setSelectedNode(targetNode);
        }
      }
    }
  };

  const state = { nodes, selectedThread, selectedNode, setSelectedNode, handleNodeClick };

  return (
    <div>
      <ArtWrapper className="select-none" background_src={background}>
        <RelativeAsset imageSrc={board} />
        <Threads
          linkCounts={linkCounts}
          selectedThread={selectedThread}
          toggleThread={(thread) =>
            setSelectedThread((currThread) => (currThread === thread ? null : thread))
          }
        />
        <AnswerPins {...state} />
        <SVGBoard {...state} links={links} setLinks={setLinks} />
        <Button
          className="absolute"
          onClick={() => {
            setSelectedThread(null);
            setSelectedNode(null);
            setLinks([]);
          }}
        >
          Reset
        </Button>
      </ArtWrapper>
    </div>
  );
}
