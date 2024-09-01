import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "./ui/button";

import { useUserStore } from "@/store/userStore";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function UserCard() {
  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user != null && user.isSeller == false) {
      navigate("/buyer-dashboard");
    }
  }, [user, navigate]);
  if (!user) return <p className="text-2xl">Loading user</p>;
  return (
    <Card className="mt-10">
      <div className="flex flex-row items-center px-5 py-5 space-x-5 flex-wrap">
        <div>
          <div className="flex flex-row items-center text-sm border-[1px] rounded-3xl text-green-500 border-green-500 px-3 ">
            <span className=" mr-1 font-bold text-xl">·</span>
            <span className="font-semibold">Online</span>
          </div>
        </div>

        {user.imageUrl && (
          <img
            src={user.imageUrl}
            alt="profile"
            className="w-16 h-16 rounded-full"
          />
        )}

        <div>
          <p className="text-gray-700 font-semibold">{user.username}</p>
        </div>
      </div>
      <CardContent>
        <div className="flex flex-row justify-between items-center mt-5">
          <p className="text-gray-500">My Level</p>
          <p className="text-gray-500">New Seller</p>
        </div>
        <hr className="my-3"></hr>
        <div className="w-full">
          <p>Rating</p>
          <Button className="w-full my-5">See Earnings</Button>
        </div>
        <div>
          <Button asChild>
            <Link to={"/newgig"}>Create New Gig</Link>
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <p>
          Earned in {""}
          {new Intl.DateTimeFormat("en-US", { month: "long" }).format(
            Date.now()
          )}{" "}
          $100
        </p>
      </CardFooter>
    </Card>
  );
}
