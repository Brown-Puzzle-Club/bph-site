import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import { Toaster } from "react-hot-toast";
import { useTheme } from "@/hooks/useTheme";
import { DEFAULT_THEME } from "@/utils/themes";
import { useNotification } from "@/hooks/useNotification";
import CaseVoting from "./websockets/CaseVoting";
import { useEffect, useState } from "react";
import { cloneElement } from "react";
import Bluenoir from "./bluenoir/Bluenoir";

export const PageWrapper = ({ route }: { route: React.ReactElement }) => {
  const { theme } = useTheme();
  const [votingOpen, setVotingOpen] = useState(false);
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
      <Bluenoir show={true} setShow={() => {}} />
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
