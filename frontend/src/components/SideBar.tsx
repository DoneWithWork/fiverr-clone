import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { FetchHelper } from "@/lib/fetchHelper";
import SearchBox from "./SearchBox";

const menuOption = [
  {
    title: "Dashboard",
    link: "/seller-dashboard",
    seller: true,
  },

  {
    title: "Messages",
    link: "/messages",
    seller: false,
  },
  {
    title: "Messages",
    link: "/messages",
    seller: true,
  },
  {
    title: "Orders",
    link: "/orders",
    seller: false,
  },
  {
    title: "My Gigs",
    link: "/mygigs",
    seller: true,
  },
  {
    title: "Orders",
    link: "/seller-dashboard/orders",
    seller: true,
  },
  {
    title: "New Gig",
    link: "/newgig",
    seller: true,
  },
] as const;
export default function SideBar() {
  const { clearStore, user, mode, updateMode, updateUser } = useUserStore();
  const navigate = useNavigate();
  function deleteCookie(name: string) {
    document.cookie =
      name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  async function logOut() {
    clearStore();
    deleteCookie("accessToken");

    await FetchHelper("auth/logout", "POST");
    navigate("/");
  }
  async function SwitchStatus() {
    console.log(mode);
    if (mode === "seller") {
      updateMode("buyer");
      await FetchHelper("auth/updatemode", "POST", { mode: "buyer" });
      updateUser({
        ...user,
        mode: "buyer",
        _id: user?._id || "",
        username: user?.username || "", // Provide a default empty string if undefined
        email: user?.email || "", // Provide a default empty string if undefined
        country: user?.country || "", // Provide a default empty string if undefined
        imageUrl: user?.imageUrl || "", // Provide a default empty string if undefined
        phone: user?.phone || "", // Provide a default empty string if undefined
        desc: user?.desc || "", // Provide a default empty string if undefined
        isSeller: user?.isSeller || false, // Provide a default value if undefined
      });
    } else {
      updateMode("seller");
      await FetchHelper("auth/updatemode", "POST", { mode: "seller" });
      updateUser({
        ...user,
        mode: "seller",
        _id: user?._id || "",
        username: user?.username || "", // Provide a default empty string if undefined
        email: user?.email || "", // Provide a default empty string if undefined
        country: user?.country || "", // Provide a default empty string if undefined
        imageUrl: user?.imageUrl || "", // Provide a default empty string if undefined
        phone: user?.phone || "", // Provide a default empty string if undefined
        desc: user?.desc || "", // Provide a default empty string if undefined
        isSeller: user?.isSeller || false, // Provide a default value if undefined
      });
    }
  }
  return (
    <Sheet>
      <SheetTrigger>
        <Menu size={24} />
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          {user ? (
            <div>
              <div className="flex flex-row items-center gap-5 mb-10">
                <img
                  src={user.imageUrl}
                  className="w-12 h-12 rounded-full border-2"
                  alt=""
                />
                <div className="text-left">
                  <p className="font-semibold">{user.username}</p>
                  <p>{user.email}</p>
                </div>
              </div>
              {menuOption.map((item, index) =>
                //if user is seller and item is seller or user is buyer and item is buyer
                (mode == "seller" && item.seller) ||
                (mode == "buyer" && !item.seller) ? (
                  <div key={index} className="text-left">
                    <SheetClose asChild>
                      <Link
                        to={item.link}
                        className="font-semibold text-gray-600"
                      >
                        {item.title}
                      </Link>
                    </SheetClose>
                    <hr className="w-full border-[0.5px] my-5" />
                  </div>
                ) : null
              )}

              {mode === "seller" ? (
                <SheetClose asChild>
                  <Link to="/buyer-dashboard">
                    <Button onClick={SwitchStatus} className="w-full my-5">
                      Switch To Buying
                    </Button>
                  </Link>
                </SheetClose>
              ) : (
                <>
                  <SearchBox />
                  <SheetClose asChild>
                    <Link to="/seller-dashboard">
                      <Button onClick={SwitchStatus} className="w-full my-5">
                        Switch To Selling
                      </Button>
                    </Link>
                  </SheetClose>
                </>
              )}

              <SheetClose asChild>
                <Button
                  className="w-full"
                  onClick={logOut}
                  variant={"destructive"}
                >
                  Log Out
                </Button>
              </SheetClose>
            </div>
          ) : (
            <>
              <SheetClose asChild>
                <Button asChild>
                  <Link to="/register">Join Fiverr</Link>
                </Button>
              </SheetClose>

              <div className="space-y-6 py-10 text-left">
                <p className="font-bold">Sign In</p>
                <div>
                  <p className="font-bold">General</p>
                </div>
              </div>
            </>
          )}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
