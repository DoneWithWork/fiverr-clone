import { useUserStore } from "@/store/userStore";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";

export default function SearchBox() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { setSearchState } = useUserStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  console.log(search);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        queryClient.invalidateQueries({ queryKey: ["gigs"] });
        if (search.trim() !== "") {
          queryClient.setQueryData(["gigs", search], undefined);
          setSearchState(false);
          navigate(`/gigs?search=${encodeURIComponent(search.trim())}`);
        }
      }}
    >
      <Input
        type="text"
        placeholder="Enter Search..."
        className="text-black"
        onFocus={() => {
          if (pathname === "/") {
            return;
          }
          setSearchState(true);
        }}
        onBlur={() => setSearchState(false)}
        onChange={(e) => {
          console.log(e.target.value);

          setSearch(e.target.value);
        }}
      />
    </form>
  );
}
