import { useEffect, useState } from "react";
import { cloneElement } from "react";
import { Toaster } from "react-hot-toast";

import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import { useNotification } from "@/hooks/useNotification";
import { useTheme } from "@/hooks/useTheme";
import { DEFAULT_THEME } from "@/utils/themes";

import Bluenoir from "./bluenoir/Bluenoir";
import CaseVoting from "./websockets/CaseVoting";

export const PageWrapper = ({ route }: { route: React.ReactElement }) => {
  const { theme } = useTheme();
  const [votingOpen, setVotingOpen] = useState(false);
  const [blueNoirOpen, setBlueNoirOpen] = useState(false);
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
      <Bluenoir show={blueNoirOpen} setShow={(open) => setBlueNoirOpen(open)} />
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
          // Define default options
          className: "bg-[#363636] text-white",
          duration: 5000,
        }}
      />
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
