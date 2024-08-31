import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";

const queryClient = new QueryClient();

export default function Layout() {
  const { searching } = useUserStore();
  return (
    <main>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <div className="relative">
          <div
            className={cn(
              `absolute top-0 left-0 w-full h-full bg-black/40 z-10   ${
                searching ? "block opacity-100" : "hidden"
              }`
            )}
          ></div>
          <div className="min-h-screen relative">
            <Outlet />
          </div>
          <Footer />
        </div>
        <ToastContainer />
      </QueryClientProvider>
    </main>
  );
}
