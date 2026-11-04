import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";

const AuthGuard = ({ guestOnly = false }: { guestOnly?: boolean }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (guestOnly && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!guestOnly && !isAuthenticated) {
    return <Navigate to="/signIn" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
