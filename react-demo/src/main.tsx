import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./routes/Root";
import RouteTwo from "./routes/RouteTwo";

// import { context } from "./context";
// console.log(context);

const router = createBrowserRouter([
  {
    path: "/react",
    element: <Root />,
  },
  {
    path: "/route-two",
    element: <RouteTwo />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
