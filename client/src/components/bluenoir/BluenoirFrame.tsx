import { forwardRef } from "react";

import frame from "@/assets/bluenoir/frame.png";
import frame_bg from "@/assets/bluenoir/frame_bg.png";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useBPHStore from "@/stores/useBPHStore";
import { BluenoirReactionImage } from "@/utils/bluenoir_dialogue";

import { IDLE_TIMER } from "./Bluenoir";

const BluenoirFrame = forwardRef<HTMLDivElement>((_props, ref) => {
  const open = useBPHStore((state) => state.bluenoirOpen);
  const toggleOpen = useBPHStore((state) => state.toggleBluenoirOpen);
  const dialogue = useBPHStore((state) => state.bluenoirDialogue);
  const speak = useBPHStore((state) => state.bluenoirSpeak);
  const restart = useBPHStore((state) => state.restartIdleTimer);

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger>
          <div ref={ref} className="cursor-pointer h-[100px] w-[100px]">
            <div className="h-[70px] w-[70px] absolute mx-[12px] my-[12px]">
              <img
                className="select-none"
                src={BluenoirReactionImage[dialogue.reaction]}
                style={{
                  backgroundImage: `url(${frame_bg})`,
                }}
              />
            </div>
            <div
              onDoubleClick={() => {
                if (!open) {
                  speak();
                } else {
                  toggleOpen();
                }
                restart(speak, IDLE_TIMER * 1000);
              }}
              className="h-[100px] w-[100px] absolute mx-auto my-auto"
            >
              <img className="select-none" src={frame} />
            </div>
          </div>
        </TooltipTrigger>
        {!open && (
          <TooltipContent className="bg-slate-900 text-white border-none">
            <p>Double Click Me!</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
});
BluenoirFrame.displayName = "BluenoirFrame";

export default BluenoirFrame;
