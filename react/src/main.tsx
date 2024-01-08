import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import SocialDeduction from "./routes/major_cases/SocialDeduction";
import Database from "./routes/major_cases/Database";

const router = createBrowserRouter([
  {
    path: "/social-deduction",
    element: <SocialDeduction />,
  },
  {
    path: "/data-mc",
    element: <Database />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
