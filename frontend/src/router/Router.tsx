import { createBrowserRouter } from "react-router";
import Layout from "@/layout/Layout";
import { SignIn } from "@/pages/SignIn";
import { SignUp } from "@/pages/SignUp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
]);

export default router;
