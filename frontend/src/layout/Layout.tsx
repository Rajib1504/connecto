
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex min-h-0 w-full flex-1 flex-col">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
