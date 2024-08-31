import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useUserStore } from "@/store/userStore";

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
    title: "Orders",
    link: "/orders",
    seller: false,
  },
  {
    title: "Gigs",
    link: "/gigs",
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
  const { clearStore, user, mode, updateMode } = useUserStore();
  function logOut() {
    clearStore();
  }
  function SwitchStatus() {
    if (mode === "seller") {
      updateMode("buyer");
    } else {
      updateMode("seller");
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
                (user.isSeller && item.seller) ||
                (!user.isSeller && !item.seller) ? (
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
                <Button onClick={SwitchStatus} className="w-full my-4">
                  Switch To Buying
                </Button>
              ) : (
                <Button onClick={SwitchStatus} className="w-full my-4">
                  Switch To Selling
                </Button>
              )}

              <Button
                className="w-full"
                onClick={logOut}
                variant={"destructive"}
              >
                Log Out
              </Button>
            </div>
          ) : (
            <>
              <SheetClose asChild>
                <Button>
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
