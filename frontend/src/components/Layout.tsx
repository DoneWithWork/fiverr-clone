import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout() {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Footer />
      <ToastContainer />
    </main>
  );
}
