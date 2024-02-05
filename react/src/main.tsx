import axios from 'axios';
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PageWrapper } from "./components/PageWrapper";
import { AuthContextProvider } from './hooks/useAuth';
import { DjangoContextProvider } from './hooks/useDjangoContext';
import "./index.css";
import Club from "./routes/Club";
import Contact from "./routes/Contact";
import Credits from "./routes/Credits";
import InfoPage from "./routes/InfoPage";
import Landing from "./routes/Landing";
import Leaderboard from './routes/Leaderboard';
import SocialDeduction from "./routes/major_cases/SocialDeduction";
import TeamPage from './routes/TeamPage';

declare const CSRF_TOKEN: string;
axios.defaults.headers.common['X-CSRFToken'] = CSRF_TOKEN;

const router = createBrowserRouter([
  {
    path: "/social-deduction",
    element: <PageWrapper bg_color={"#1c160d"} navbar_color={"#1c110d96"} route={<SocialDeduction />} />
  },
  {
    path: "/landing",
    element: <PageWrapper bg_color={"#02031d"} navbar_color={"#0f0d2e82"} route={<Landing />} />
  },
  {
    path: "/info",
    element: <PageWrapper bg_color={"#02031d"} navbar_color={"#0f0d2e82"} route={<InfoPage />} />
  },
  {
    path: "/credits",
    element: <PageWrapper bg_color={"#02031d"} navbar_color={"#0f0d2e82"} route={<Credits />} />
  },
  {
    path: "/club",
    element: <PageWrapper bg_color={"#02031d"} navbar_color={"#0f0d2e82"} route={<Club />} />
  },
  {
    path: "/contact",
    element: <PageWrapper bg_color={"#02031d"} navbar_color={"#0f0d2e82"} route={<Contact />} />
  },
  {
    path: "/leaderboard",
    element: <PageWrapper bg_color={"#02031d"} navbar_color={"#0f0d2e82"} route={<Leaderboard />} />
  },
  {
    path: "/my-team",
    element: <PageWrapper bg_color={"#02031d"} navbar_color={"#0f0d2e82"} route={<TeamPage />} />
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DjangoContextProvider>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </DjangoContextProvider>
  </React.StrictMode>
);
