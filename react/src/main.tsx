import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./routes/Root";
import SocialDeduction from "./routes/major_cases/SocialDeduction";

const router = createBrowserRouter([
  {
    path: "/react",
    element: <Root />,
  },
  {
    path: "/social-deduction",
    element: <SocialDeduction />
  }
  
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
