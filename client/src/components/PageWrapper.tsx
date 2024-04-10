import { cloneElement, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import { useNotification } from "@/hooks/useNotification";
import { useTheme } from "@/hooks/useTheme";
import useBPHStore from "@/stores/useBPHStore";
import { DEFAULT_THEME } from "@/utils/themes";

import Bluenoir from "./bluenoir/Bluenoir";
import CaseVoting from "./websockets/CaseVoting";

const randomStrings = [
  "Tch ... Just my luck, I get the rookies shoved off on me.",
  "What's happening, kid? The name's Bluenoir. I'm in charge of the BIB's intern program this year. Though, I suppose you probably knew that already ...",
  "Unfortunately, we can't exactly offer you a pretty first impression. BIB's been swamped up to our ears ever since Carberry bit the linoleum.",
  "Seems like every bit of scum in the city decided to take the chief's 'leave of absence' as an invitation to dustup all the attractive scenery.",
  "Yep, you heard it here first. Prison break. Not even Providence's finest hoosegows could contain the excitement of Carberry's untimely demise. Three of our most notorious serial killers are now out roaming the streets.",
];

export const PageWrapper = ({ route }: { route: React.ReactElement }) => {
  const { theme } = useTheme();
  const [votingOpen, setVotingOpen] = useState(false);
  const speak = useBPHStore((state) => state.bluenoirSpeak);
  useNotification();

  useEffect(() => {
    console.log(votingOpen);
  }, [votingOpen]);

  return (
    <div
      className={`react-page text-white`}
      style={{
        backgroundColor: theme.bg_color ? theme.bg_color : DEFAULT_THEME.bg_color,
      }}
    >
      <Bluenoir />
      <Navbar />
      <div
        className="content min-h-[90vh] pb-2"
        style={{
          backgroundColor: theme.content_color ? theme.content_color : DEFAULT_THEME.content_color,
        }}
      >
        {cloneElement(route, { setVotingOpen: (open: boolean) => setVotingOpen(open) })}
      </div>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          className: "text-white rounded-lg bg-slate-900 p-3 pr-4 shadow-md shadow-slate-800",
          duration: 5000,
        }}
      />
      <button
        className="bg-red-400"
        onClick={() => speak(randomStrings[Math.floor(Math.random() * randomStrings.length)], true)}
      >
        test
      </button>
      <CaseVoting
        path="ws/puzzles"
        open={votingOpen}
        onOpenChange={(open) => setVotingOpen(open)}
      />
      <Footer
        extraStyle={{
          backgroundColor: theme.footer_color ? theme.footer_color : DEFAULT_THEME.footer_color,
        }}
      />
    </div>
  );
};
