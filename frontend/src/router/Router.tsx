import { createBrowserRouter } from "react-router";
import Layout from "@/layout/Layout";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import AuthGuard from "@/components/authGuard";
import ChatDashboard from "@/pages/ChatDashboard";

const router = createBrowserRouter([
  {
    element: <AuthGuard />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            index: true,
            element: <ChatDashboard />,
          },
        ],
      },
    ],
  },
  {
    element: <AuthGuard guestOnly />,
    children: [
      {
        path: "/signIn",
        element: <SignIn />,
      },
      {
        path: "/signUp",
        element: <SignUp />,
      },
    ],
  },
]);

export default router;
