import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./index.css";
import Landing from "./routes/Landing";
import SocialDeduction from "./routes/major_cases/SocialDeduction";

const router = createBrowserRouter([
  {
    path: "/social-deduction",
    element: <SocialDeduction />
  },
  {
    path: "/landing",
    element: <Landing />
  }
  
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Navbar />
    <RouterProvider router={router} />
  </React.StrictMode>
);
