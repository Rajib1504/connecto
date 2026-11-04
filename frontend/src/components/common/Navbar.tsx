
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  MessageCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await logout();

      toast.success("Logged out successfully");
      navigate("/signIn", { replace: true });
    } catch {
      toast.error("Unable to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const userInitial = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <MessageCircle className="size-5" />
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground">
              ChatFlow
            </span>
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground">
              CONNECT IN REAL TIME
            </span>
          </div>
        </Link>

        {/* Desktop User Section */}
        <div className="hidden items-center gap-4 sm:flex">
          <div className="flex items-center gap-3">
            <div className="relative flex size-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
              {userInitial}

              <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-green-500" />
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                {user?.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {user?.email}
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-border" />

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="size-4" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </Button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t bg-background px-4 py-4 sm:hidden">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
              {userInitial}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {user?.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>

          <Button
            variant="destructive"
            size="default"
            className="w-full"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="size-4" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
