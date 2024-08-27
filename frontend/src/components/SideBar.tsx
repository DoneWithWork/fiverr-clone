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

export default function SideBar() {
  const { clearStore, user } = useUserStore();
  function logOut() {
    clearStore();
  }
  return (
    <Sheet>
      <SheetTrigger>
        <Menu size={24} />
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          {user ? (
            <Button className="w-full" onClick={logOut} variant={"destructive"}>
              Log Out
            </Button>
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
