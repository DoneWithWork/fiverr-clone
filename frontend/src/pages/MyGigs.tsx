import { GigType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function MyGigs() {
  const { isPending, error, data } = useQuery({
    queryKey: ["sellergigs"],
    staleTime: 1000 * 60 * 5,
    queryFn: () =>
      fetch(`${import.meta.env.VITE_BACKEND_URL}/gigs/seller/getgigseller`, {
        credentials: "include",
      }).then((res) => res.json()),
  });
  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;
  console.log(data);
  //fetch the gig with the id
  return (
    <div className=" container">
      <h1 className="text-2xl font-semibold text-center py-5">Your Gigs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 py-10 container">
        {data.length === 0 && <p>No gigs found</p>}
        {data.map((gig: GigType) => (
          <div className="container ">
            <Link className="" to={`/gig/${gig._id}`}>
              <img
                src={gig.cover}
                alt=""
                className="rounded-xl w-full h-48 object-cover md:h-60"
              />
              <div className="flex flex-row items-center gap-3 my-3">
                <img
                  src={gig.userId.imageUrl}
                  alt=""
                  className="w-8 h-8 rounded-full border-2"
                />
                <p className="font-bold">{gig.userId.username}</p>
              </div>
              <p className="my-2 text-xl hover:underline">I will {gig.desc}</p>

              <p>{gig.cat}</p>
              <p className="font-bold">
                From <span className="text-md">${gig.price}</span>
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
