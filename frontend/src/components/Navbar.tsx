import SideBar from "./SideBar";

import { LoginPopUp } from "./LoginPopUp";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { Button } from "./ui/button";
import { useEffect } from "react";

export default function Navbar() {
  const { user, mode, updateMode } = useUserStore();
  const navigate = useNavigate();
  function SwitchStatus() {
    if (mode === "seller") {
      updateMode("buyer");
    } else {
      updateMode("seller");
    }
  }
  useEffect(() => {
    if (user === null) return navigate("/");
    if (mode === "buyer") {
      navigate("/buyer-dashboard");
    }
    if (mode === "seller") {
      navigate("/seller-dashboard");
    }
  }, [user, navigate, mode]);
  return (
    <nav className="w-full border-b-[0.5px] shadow-sm border-gray-300 ">
      {/* display diff nav if signed in  */}
      <div className="px-4 py-3 w-full flex items-center flex-row justify-between ">
        <SideBar />

        <Link to={"/"}>
          <h1 className="text-3xl font-extrabold text-center">
            <span className="text-gray-600">fiverr</span>
            <span className="text-green-500 ">.</span>
          </h1>
        </Link>

        {!user ? (
          <div className="flex flex-row items-center gap-5">
            <Link to={"/register"} className="text-gray-400">
              Join
            </Link>
            <LoginPopUp />
          </div>
        ) : (
          <div>
            {mode === "seller" ? (
              <Button onClick={SwitchStatus}>Switch To Buying</Button>
            ) : (
              <Button onClick={SwitchStatus}>Switch To Selling</Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
