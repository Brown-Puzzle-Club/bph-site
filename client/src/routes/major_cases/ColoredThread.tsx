import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect, useMemo, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";

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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { useTheme } from "@/hooks/useTheme";
import { BROWN_THEME } from "@/utils/themes";
import { cn } from "@/utils/utils";

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
        extraClasses={cn(
          "grid place-items-center select-none",
          linkCounts[ThreadType.DOCTOR] != MAX_LINKS[ThreadType.DOCTOR] &&
            `${selectedThread == ThreadType.DOCTOR ? THREAD_SELECTED_DOCTOR_GLOW : `hover:${HOVER_GLOW}`} hover:cursor-pointer`,
        )}
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
        <span className="shadow-lg py-1 px-2 rounded-lg bg-[#7D6723]">
          {linkCounts[ThreadType.DOCTOR]}/{MAX_LINKS[ThreadType.DOCTOR]}
        </span>
      </RelativeAsset>

      <RelativeAsset
        imageSrc={gorey}
        extraClasses={cn(
          "grid place-items-center select-none",
          linkCounts[ThreadType.GOREY] != MAX_LINKS[ThreadType.GOREY] &&
            `${selectedThread == ThreadType.GOREY ? THREAD_SELECTED_GOREY_GLOW : `hover:${HOVER_GLOW}`} hover:cursor-pointer`,
        )}
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
        <span
          className="shadow-lg py-1 px-2 rounded-lg bg-[#7D6723]"
          style={{ left: "25%", bottom: "-20%" }}
        >
          {linkCounts[ThreadType.GOREY]}/{MAX_LINKS[ThreadType.GOREY]}
        </span>
      </RelativeAsset>
      <RelativeAsset
        imageSrc={puss}
        extraClasses={cn(
          "grid place-items-center select-none",
          linkCounts[ThreadType.PUSS] != MAX_LINKS[ThreadType.PUSS] &&
            `${selectedThread == ThreadType.PUSS ? THREAD_SELECTED_PUSS_GLOW : `hover:${HOVER_GLOW}`} hover:cursor-pointer`,
        )}
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
        <span className="shadow-lg py-1 px-2 rounded-lg bg-[#7D6723]">
          {linkCounts[ThreadType.PUSS]}/{MAX_LINKS[ThreadType.PUSS]}
        </span>
      </RelativeAsset>
    </>
  );
};

export default function ColoredThread() {
  const [selectedThread, setSelectedThread] = useState<ThreadType | null>(null);
  const [selectedNode, setSelectedNode] = useState<INode | null>(null);
  const [remountCounter, setRemountCounter] = useState(0);
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

  useEffect(() => {
    if (selectedThread && linkCounts[selectedThread] == MAX_LINKS[selectedThread]) {
      setSelectedThread(null);
      setSelectedNode(null);
    }
  }, [linkCounts, selectedThread]);

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
    <ArtWrapper key={remountCounter} className="select-none" background_src={background}>
      <div
        className="bg-white/80 absolute w-[25vw] p-4 rounded-lg"
        style={{ top: "20%", left: "74%" }}
      >
        <div className="text-black font-mono grid gap-2 text-[0.8vw] max-w-md">
          <p>Greetings, detectives.</p>
          <p>
            An elusive serial killer with ties to the Cult of Lucifer has been killing people across
            Providence. We think the killer may be trying to construct a Sigil representing Lucifer
            in some way.
          </p>
          <p>
            Additionally, their murder methods are intentional, with “subsequent” methods of murder
            being connected with thread to form the sigil.
          </p>
          <p>
            We believe only one killing remains to complete the sigil. If we can work out where and
            how the last murder will happen, we can stop the killer and save the final victim.
          </p>
          <p className="font-bold">
            How is the final victim going to be killed?
            <br />
            Where are they going to be killed?
          </p>
        </div>
      </div>

      <RelativeAsset imageSrc={board} />
      <Threads
        linkCounts={linkCounts}
        selectedThread={selectedThread}
        toggleThread={(thread) =>
          setSelectedThread((currThread) => {
            if (linkCounts[thread] === MAX_LINKS[thread]) return currThread;
            return currThread === thread ? null : thread;
          })
        }
      />
      <AnswerPins {...state} />
      <SVGBoard {...state} links={links} setLinks={setLinks} />
      <div className="flex absolute gap-4" style={{ top: "93%", left: "47%" }}>
        <Button
          onClick={() => {
            setSelectedThread(null);
            setSelectedNode(null);
            setLinks([]);
            setRemountCounter((count) => count + 1);
          }}
        >
          Reset
        </Button>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <FaQuestionCircle />
            </TooltipTrigger>
            <TooltipContent className="grid gap-2 max-w-screen-sm bg-slate-900 border-none text-white">
              <p>Click on a spool (↘️) to toggle making threads of that color.</p>
              <p>
                Click on two pins on the map to make a thread. Clicking the thread will remove it.
              </p>
              <p>
                When you believe you know where the final murder took place, move the solution pin
                (↙️) onto the map where you think it took place. You can make threads from the
                solution pin to find the final puzzle answer.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </ArtWrapper>
  );
}
