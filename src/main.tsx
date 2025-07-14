import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import CustomProvider from "./redux/Provider.tsx";
import { Login } from "./Pages/Auth";
import { HomePage } from "./Pages/Home";
import Layout from "./Pages/Home/Layout.tsx";
import { SignUp } from "./Pages/Auth/SigUP.tsx";
import {
  IsAuthOrRedirect,
  IsNotAuthOrRedirect,
} from "./Components/Guards/IsAuth.tsx";

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        element: (
          <IsAuthOrRedirect>
            <HomePage />
          </IsAuthOrRedirect>
        ),
        index: true,
      },
      {
        element: <HomePage />,
        index: true,
      },

      {
        path: "auth",
        children: [
          {
            path: "login",
            element: (
              <IsNotAuthOrRedirect>
                {" "}
                <Login />
              </IsNotAuthOrRedirect>
            ),
          },

          {
            path: "signup",
            element: (
              <IsNotAuthOrRedirect>
                <SignUp />
              </IsNotAuthOrRedirect>
            ),
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CustomProvider>
      <RouterProvider router={router} />
    </CustomProvider>
  </StrictMode>
);
