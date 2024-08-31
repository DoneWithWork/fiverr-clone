import SideBar from "./SideBar";

import { LoginPopUp } from "./LoginPopUp";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import SearchBox from "./SearchBox";
import { FetchHelper } from "@/lib/fetchHelper";

export default function Navbar() {
  const { user, mode, updateMode } = useUserStore();
  const [earning, setEarning] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  function SwitchStatus() {
    if (mode === "seller") {
      updateMode("buyer");
    } else {
      updateMode("seller");
    }
  }
  const [active, setActive] = useState(false);
  useEffect(() => {
    console.log(location.pathname);
    if (user === null) {
      if (
        location.pathname === "/register" ||
        location.pathname === "/login" ||
        location.pathname === "/" ||
        location.pathname === "/gigs" ||
        location.pathname === "/gig"
      ) {
        return;
      } else {
        return navigate("/");
      }
    }
    //get total revenue
    const totalRevenue = async () => {
      const data = await FetchHelper("orders/totalEarnings", "GET");
      return data;
    };
    totalRevenue().then((data) => {
      console.log(data);
      if (!data) {
        setEarning(0);
      } else {
        setEarning(data.earnings);
      }
    });
    // if (mode === "buyer") {
    //   navigate("/buyer-dashboard");
    // }
    // if (mode === "seller" && user) {
    //   navigate("/seller-dashboard");
    // }
    function isActive() {
      console.log(active);
      return window.scrollY > 0 ? setActive(true) : setActive(false);
    }
    window.addEventListener("scroll", isActive);
    return () => window.removeEventListener("scroll", isActive);
  }, [user, navigate, mode, location.pathname, active]);

  return (
    <nav
      className={cn(
        `w-full shadow-sm sticky top-0 z-10 transition-colors  ${
          active ? "bg-white" : "bg-[#003912]"
        }`
      )}
    >
      {/* display diff nav if signed in  */}
      <div className="px-4 py-3 w-full flex items-center flex-row justify-between ">
        <div className="flex flex-row items-center gap-2">
          <SideBar />

          <Link to={"/"}>
            <h1 className="text-3xl font-extrabold text-center">
              <span className="text-gray-500">fiverr</span>
              <span className="text-green-500 ">.</span>
            </h1>
          </Link>
        </div>
        {location.pathname !== "/" && mode !== "seller" && (
          <div className="max-w-96 w-full hidden sm:block">
            <SearchBox />
          </div>
        )}
        <div className="row hidden sm:flex">
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
          <div className="hidden sm:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <img
                  src={user?.imageUrl}
                  alt=""
                  className="max-w-10 max-h-10 rounded-full border-2"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="hidden sm:block">
            <p className="text-white font-semibold border-2 py-1 px-3 rounded-md">
              ${earning}
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
