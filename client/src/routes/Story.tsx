import { FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useDjangoContext, useStoryUnlocks } from "@/hooks/useDjangoContext";
import useBPHStore from "@/stores/useBPHStore";
import { BluenoirStories } from "@/utils/bluenoir_dialogue";

export default function Story() {
  const { data: story_unlocks } = useStoryUnlocks();
  const dispatchBluenoir = useBPHStore((state) => state.setStoryline);
  const { data: context } = useDjangoContext();

  return (
    <div className="bg-slate-900 text-white h-[90vh] overscroll-contain overflow-hidden overflow-y-auto ">
      <h1 className="text-4xl font-bold text-center py-5">The Story So Far...</h1>
      <div className="text-center dark bg-gradient-to-b from-muted/50 to-muted/80 p-4 no-underline outline-none focus:shadow-md btn-gradient-1 relative mx-[5%] md:mx-[25%]">
        {story_unlocks
          ?.sort((a, b) => (a.unlock_datetime < b.unlock_datetime ? -1 : 1))
          .map(
            (unlock) =>
              BluenoirStories[unlock.storyline] && (
                <div
                  key={unlock.storyline}
                  className="flex items-center justify-between py-4 first:pt-0 last:border-b-0 last:pb-0 border-b-4 border-slate-800"
                >
                  <div className="flex items-center space-x-5">
                    <FaPlay
                      className="w-10 h-10 text-white hover:text-slate-400 hover:cursor-pointer transition-colors duration-300"
                      onClick={() => dispatchBluenoir(unlock.storyline)}
                    />
                    <h2 className="text-2xl font-bold">
                      {BluenoirStories[unlock.storyline]?.title}
                    </h2>
                  </div>
                  <p className="text-lg text-right font-mono">
                    {BluenoirStories[unlock.storyline]?.description}
                  </p>
                </div>
              ),
          )}
      </div>
      {context?.hunt_context.hunt_is_closed && (
        <div className="flex flex-col items-center p-4">
          <div className="shadow-[0_35px_60px_-15px_rgba(255,255,255,0.)]">
            <Button className="text-2xl">
              <Link
                to={"/final-verdict"}
                className="text-shadow"
                style={{
                  textShadow: "0 0 10px #fff",
                }}
              >
                The Final Verdict
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
