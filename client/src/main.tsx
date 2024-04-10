import axios from "axios";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PageWrapper } from "./components/PageWrapper";
import "./index.css";
import Archive from "./routes/Archive";
import Club from "./routes/Club";
import Contact from "./routes/Contact";
import Credits from "./routes/Credits";
import ErrorPage from "./routes/ErrorPage";
import InfoPage from "./routes/InfoPage";
import Landing from "./routes/Landing";
import Leaderboard from "./routes/Leaderboard";
import SocialDeduction from "./routes/major_cases/SocialDeduction";
import MyTeamPage from "./routes/MyTeamPage";
import RegisterForm from "./routes/Register";
import TeamPage from "./routes/TeamPage";

declare const CSRF_TOKEN: string;
try {
  axios.defaults.headers.common["X-CSRFToken"] = CSRF_TOKEN;
} catch (e) {
  console.error("Error setting CSRF token in axios headers");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
    },
  },
});

const router = createBrowserRouter([
  {
    errorElement: (
      <PageWrapper bg_color={"#02031d"} navbar_color={"#0f0d2e82"} route={<ErrorPage />} />
    ),
    children: [
      {
        path: "/social-deduction",
        element: (
          <PageWrapper
            bg_color={"#1c160d"}
            navbar_color={"#1c110d96"}
            route={<SocialDeduction />}
          />
        ),
      },
      {
        path: "/",
        element: (
          <PageWrapper bg_color={"#02031d"} navbar_color={"#0f0d2e82"} route={<Landing />} />
        ),
      },
      {
        path: "/info",
        element: (
          <PageWrapper bg_color={"#02031d"} navbar_color={"#0f0d2e82"} route={<InfoPage />} />
        ),
      },
      {
        path: "/credits",
        element: (
          <PageWrapper bg_color={"#02031d"} navbar_color={"#0f0d2e82"} route={<Credits />} />
        ),
      },
      {
        path: "/club",
        element: <PageWrapper bg_color={"#02031d"} navbar_color={"#0f0d2e82"} route={<Club />} />,
      },
      {
        path: "/contact",
        element: (
          <PageWrapper bg_color={"#02031d"} navbar_color={"#0f0d2e82"} route={<Contact />} />
        ),
      },
      {
        path: "/leaderboard",
        element: (
          <PageWrapper bg_color={"#02031d"} navbar_color={"#0f0d2e82"} route={<Leaderboard />} />
        ),
      },
      {
        path: "/my-team",
        element: (
          <PageWrapper bg_color={"#02031d"} navbar_color={"#0f0d2e82"} route={<MyTeamPage />} />
        ),
      },
      {
        path: "/team/:teamId",
        element: (
          <PageWrapper bg_color={"#02031d"} navbar_color={"#0f0d2e82"} route={<TeamPage />} />
        ),
      },
      {
        path: "/archive",
        element: (
          <PageWrapper bg_color={"#02031d"} navbar_color={"#0f0d2e82"} route={<Archive />} />
        ),
      },
      {
        path: "/register",
        element: (
          <PageWrapper bg_color={"#02031d"} navbar_color={"#0f0d2e82"} route={<RegisterForm />} />
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
