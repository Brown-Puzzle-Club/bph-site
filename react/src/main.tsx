import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import SocialDeduction from "./routes/major_cases/SocialDeduction";
import EventPage from "./routes/major_cases/EventPage";

const router = createBrowserRouter([
  {
    path: "/social-deduction",
    element: <SocialDeduction />
  },
  {
    path: "/eventpage",
    element: <EventPage />

  }
  
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
