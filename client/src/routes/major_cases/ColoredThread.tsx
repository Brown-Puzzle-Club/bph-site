import background from "@/assets/major_cases/colored-thread/background.jpg";
import board from "@/assets/major_cases/colored-thread/board.png";
import doctor from "@/assets/major_cases/colored-thread/thread-doctor.png";
import gorey from "@/assets/major_cases/colored-thread/thread-gorey.png";
import puss from "@/assets/major_cases/colored-thread/thread-puss.png";
import RelativeAsset from "@/components/RelativeAsset";
import AnswerPins from "@/components/major_cases/colored-thread/AnswerPins";
import SVGBoard from "@/components/major_cases/colored-thread/SVGBoard";
import {
  ILink,
  INode,
  NodeAnswer,
  ThreadType,
} from "@/components/major_cases/colored-thread/board_types";
import {
  HOVER_GLOW,
  THREAD_SELECTED_DOCTOR_GLOW,
  THREAD_SELECTED_GOREY_GLOW,
  THREAD_SELECTED_PUSS_GLOW,
} from "@/components/major_cases/colored-thread/consts";
import { collectNodes } from "@/components/major_cases/colored-thread/nodes";
import { ArtWrapper } from "@/components/minor_cases/CasePageArt";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { useTheme } from "@/hooks/useTheme";
import { BROWN_THEME } from "@/utils/themes";
import { useEffect, useMemo, useState } from "react";

export default function ColoredThread() {
  const [selectedThread, setSelectedThread] = useState<ThreadType | null>(null);
  const [selectedNode, setSelectedNode] = useState<INode | null>(null);
  const [links, setLinks] = useState<ILink[]>([]);

  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(BROWN_THEME);
  });

  const { context } = useDjangoContext();

  const nodes: NodeAnswer[] = useMemo(() => {
    const nodes = collectNodes(context);
    console.log(nodes);
    return nodes;
  }, [context]);

  const toggleThread = (thread: ThreadType) => {
    setSelectedThread(selectedThread !== thread ? thread : null);
  };

  const Threads = () => {
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
        />
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
        />
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
        />
      </>
    );
  };

  const state = {
    nodes,
    selectedThread,
    selectedNode,
    setSelectedNode,
    links,
    setLinks,
  };

  return (
    <div>
      <ArtWrapper background_src={background}>
        <RelativeAsset imageSrc={board} />
        <Threads />
        <AnswerPins {...state} />
        <SVGBoard {...state} />
      </ArtWrapper>
    </div>
  );
}
