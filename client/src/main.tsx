import {
  HUNT_HAS_STARTED,
  IS_ADMIN,
  IS_MAJOR_CASE_UNLOCKED,
  Locked,
} from "./components/LockedContent";
import { PageWrapper } from "./components/PageWrapper";
import MajorCaseWrapper from "./components/major_cases/MajorCaseWrapper";
import { AuthContextProvider } from "./hooks/useAuth";
import { DjangoContextProvider } from "./hooks/useDjangoContext";
import { ThemeContextProvider } from "./hooks/useTheme";
import AdminPanel from "./routes/Admin";
import Archive from "./routes/Archive";
import Club from "./routes/Club";
import Contact from "./routes/Contact";
import Credits from "./routes/Credits";
import ErrorPage from "./routes/ErrorPage";
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
import TeamPage from "./routes/TeamPage";
import ColoredThread from "./routes/major_cases/ColoredThread";
import Data from "./routes/major_cases/Data";
import SocialDeduction from "./routes/major_cases/SocialDeduction";
import "./styles/index.css";
import "./styles/puzzlestyle-data.css";
import "./styles/puzzlestyle-red-thread.css";
import "./styles/puzzlestyle-soc-deduction.css";
import { MajorCaseEnum } from "./utils/constants";
import axios from "axios";
import Cookies from "js-cookie";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  HUNT_HAS_STARTED,
  IS_ADMIN,
  IS_MAJOR_CASE_UNLOCKED,
  Locked,
} from "./components/LockedContent";
import { PageWrapper } from "./components/PageWrapper";
import MajorCaseWrapper from "./components/major_cases/MajorCaseWrapper";
import { AuthContextProvider } from "./hooks/useAuth";
import { DjangoContextProvider } from "./hooks/useDjangoContext";
import { ThemeContextProvider } from "./hooks/useTheme";
import AdminPanel from "./routes/Admin";
import Archive from "./routes/Archive";
import Club from "./routes/Club";
import Contact from "./routes/Contact";
import Credits from "./routes/Credits";
import ErrorPage from "./routes/ErrorPage";
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
import TeamPage from "./routes/TeamPage";
import ColoredThread from "./routes/major_cases/ColoredThread";
import Data from "./routes/major_cases/Data";
import SocialDeduction from "./routes/major_cases/SocialDeduction";
import "./styles/index.css";
import "./styles/puzzlestyle-data.css";
import "./styles/puzzlestyle-red-thread.css";
import "./styles/puzzlestyle-soc-deduction.css";
import { MajorCaseEnum } from "./utils/constants";
import axios from "axios";
import Cookies from "js-cookie";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

try {
  axios.defaults.headers.common["X-CSRFToken"] = Cookies.get("csrftoken");
} catch (e) {
  console.error("Error setting CSRF token in axios headers");
}

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
        path: "/team/:team_id",
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
        path: "/minorcase/:slug",
        element: <PageWrapper route={<MinorCasePage />} />,
      },
      {
        path: "/puzzle/:slug",
        element: <PageWrapper route={<PuzzlePage />} />,
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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DjangoContextProvider>
      <AuthContextProvider>
        <ThemeContextProvider>
          <RouterProvider router={router} />
        </ThemeContextProvider>
      </AuthContextProvider>
    </DjangoContextProvider>
  </React.StrictMode>,
);
