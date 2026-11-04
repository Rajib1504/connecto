import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router/dom";
import { Toaster } from "react-hot-toast";
import Router from "./router/Router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={Router}></RouterProvider>
    <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
  </StrictMode>,
);
