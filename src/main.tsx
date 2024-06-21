import React from "react";
import ReactDOM from "react-dom/client";
//import App from "./App.tsx";
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
import { TestPage } from "./components/TestPage.tsx";
import QuestionPage from "./components/QuestionPage.tsx";

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

      {
        path: "exam",
        element: <QuestionPage />,
      },
    ],
  },
]);

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
