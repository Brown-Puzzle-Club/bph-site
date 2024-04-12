import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter, redirect } from "react-router-dom";

import { Locked } from "./components/LockedContent";
import { PageWrapper } from "./components/PageWrapper";
import MajorCaseWrapper from "./components/major_cases/MajorCaseWrapper";
import { ThemeContextProvider } from "./hooks/useTheme";
import AdminPanel from "./routes/Admin";
import Archive from "./routes/Archive";
import Club from "./routes/Club";
import Contact from "./routes/Contact";
import Credits from "./routes/Credits";
import ErrorPage, { Error404 } from "./routes/ErrorPage";
import EventPage from "./routes/EventPage";
import InfoPage from "./routes/InfoPage";
import Landing from "./routes/Landing";
import Leaderboard from "./routes/Leaderboard";
import MarkdownTest from "./routes/MarkdownTest";
import MinorCasePage from "./routes/MinorCasePage";
import MyTeamPage from "./routes/MyTeamPage";
import PuzzleList from "./routes/PuzzleList";
import PuzzlePage from "./routes/PuzzlePage";
import RegisterForm from "./routes/Register";
import Story from "./routes/Story";
import TeamPage from "./routes/TeamPage";
import ColoredThread from "./routes/major_cases/ColoredThread";
import Data from "./routes/major_cases/Data";
import SocialDeduction from "./routes/major_cases/SocialDeduction";
import "./styles/index.css";
import "./styles/puzzlestyle-data.css";
import "./styles/puzzlestyle-red-thread.css";
import "./styles/puzzlestyle-soc-deduction.css";
import { HUNT_HAS_STARTED, IS_ADMIN, IS_MAJOR_CASE_UNLOCKED } from "./utils/auth";
import { MajorCaseEnum } from "./utils/constants";

try {
  axios.defaults.headers.common["X-CSRFToken"] = Cookies.get("csrftoken");
} catch (e) {
  console.error("Error setting CSRF token in axios headers");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      retryDelay: (attemptIndex) => Math.min(3000 * 2 ** attemptIndex, 60000), // max 60 seconds
    },
  },
});

const Redirect = ({ to }: { to: string }) => {
  redirect(to);
  return <Error404 />;
};

const router = createBrowserRouter([
  {
    errorElement: <PageWrapper route={<ErrorPage />} />,
    children: [
      {
        path: "/",
        element: <PageWrapper route={<Landing />} />,
      },
      {
        path: "/info",
        element: <PageWrapper route={<InfoPage />} />,
      },
      {
        path: "/credits",
        element: <PageWrapper route={<Credits />} />,
      },
      {
        path: "/club",
        element: <PageWrapper route={<Club />} />,
      },
      {
        path: "/contact",
        element: <PageWrapper route={<Contact />} />,
      },
      {
        path: "/leaderboard",
        element: <PageWrapper route={<Leaderboard />} />,
      },
      {
        path: "/my-team",
        element: <PageWrapper route={<MyTeamPage />} />,
      },
      {
        path: "/team/:teamId",
        element: <PageWrapper route={<TeamPage />} />,
      },
      {
        path: "/archive",
        element: <PageWrapper route={<Archive />} />,
      },
      {
        path: "/register",
        element: <PageWrapper route={<RegisterForm />} />,
      },
      {
        path: "/markdown-test",
        element: <PageWrapper route={<MarkdownTest />} />,
      },
      {
        path: "/puzzles",
        element: (
          <PageWrapper
            route={
              <Locked condition={HUNT_HAS_STARTED}>
                <PuzzleList />
              </Locked>
            }
          />
        ),
      },
      {
        path: "/eventpage",
        element: (
          <PageWrapper
            route={
              <Locked condition={HUNT_HAS_STARTED}>
                <EventPage />
              </Locked>
            }
          />
        ),
      },
      {
        path: "/story",
        element: (
          <PageWrapper
            route={
              <Locked condition={HUNT_HAS_STARTED}>
                <Story />
              </Locked>
            }
          />
        ),
      },
      {
        path: "/markdown-test",
        element: (
          <PageWrapper
            route={
              <Locked condition={IS_ADMIN}>
                <MarkdownTest />
              </Locked>
            }
          />
        ),
      },
      // unhappy routes redirect to EventPage.
      {
        path: "/majorcase",
        element: <PageWrapper route={<Redirect to={"/eventpage"} />} />,
      },
      {
        path: "/minorcase",
        element: <PageWrapper route={<Redirect to={"/eventpage"} />} />,
      },
      {
        path: "/puzzle",
        element: <PageWrapper route={<Redirect to={"/eventpage"} />} />,
      },

      {
        path: "/minorcase/:slug",
        element: <PageWrapper route={<MinorCasePage />} />,
      },
      {
        path: "/puzzle/:slug",
        element: <PageWrapper route={<PuzzlePage />} />,
      },
      {
        path: "/majorcase/social-deduction",
        element: (
          <PageWrapper
            route={
              <Locked condition={IS_MAJOR_CASE_UNLOCKED(MajorCaseEnum.SOCIAL_DEDUCTION)}>
                <MajorCaseWrapper>
                  <SocialDeduction />
                </MajorCaseWrapper>
              </Locked>
            }
          />
        ),
      },
      {
        path: "/majorcase/colored-thread",
        element: (
          <PageWrapper
            route={
              <Locked condition={IS_MAJOR_CASE_UNLOCKED(MajorCaseEnum.COLORED_THREAD)}>
                <MajorCaseWrapper>
                  <ColoredThread />
                </MajorCaseWrapper>
              </Locked>
            }
          />
        ),
      },
      {
        path: "/majorcase/data",
        element: (
          <PageWrapper
            route={
              <Locked condition={IS_MAJOR_CASE_UNLOCKED(MajorCaseEnum.DATA)}>
                <MajorCaseWrapper>
                  <Data />
                </MajorCaseWrapper>
              </Locked>
            }
          />
        ),
      },
      {
        path: "/solveadmin",
        element: (
          <PageWrapper
            route={
              <Locked condition={IS_ADMIN}>
                <AdminPanel />
              </Locked>
            }
          />
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeContextProvider>
        <RouterProvider router={router} />
      </ThemeContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
