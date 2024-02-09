import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./Login/LoginPage.tsx";
import RegisterPage from "./Register/RegisterPage.tsx";
import Homepage from "./Home/HomePage.tsx";

export const pages = [
  { path: "/login", label: "LoginPage", element: <LoginPage /> },
  { path: "register", label: "RegisterPage", element: <RegisterPage /> },
  { path: "/", label: "HomePage", element: <Homepage /> },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: pages,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
