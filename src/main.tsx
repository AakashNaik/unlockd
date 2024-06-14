import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from "./routes/route";
import { ErrorPage } from "./components/ErrorPage.tsx";
import { ScorePage } from "./components/ScorePage.tsx";
import {TestPage} from "./components/TestPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "myscore",
        element: <ScorePage />,
      },
      
        {
          path: "test",
          element: <TestPage />,
        },
    ],
  },
]);

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
);
