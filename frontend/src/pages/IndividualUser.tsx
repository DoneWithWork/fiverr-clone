import { Button } from "@/components/ui/button";
import useQueryFetcher from "@/lib/reactQueryFetcher";
import { GigType, User } from "@/types/types";
import { useParams } from "react-router-dom";

interface SingleUserProps {
  user: User;
  gigs: GigType[];
}
export default function SingleUser() {
  const { id } = useParams();
  const url = `gigs/getuser/${id}`;

  const { isLoading, error, data } = useQueryFetcher({
    url,
    queryKey: ["user", id!],
    method: "GET",
  }) as { isLoading: boolean; error: Error; data: SingleUserProps };
  if (isLoading) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="container max-w-[90%] py-5 flex flex-col ">
      <div className="row my-5 justify-between">
        <div className="row">
          <img
            src={data.user.imageUrl}
            alt=""
            className="w-28 border-2 rounded-full"
          />
          <div>
            <p> {data.user.username}</p>
            <p>{data.user.desc}</p>
            <p className="italic text-gray-500 font-semibold">offline</p>
          </div>
        </div>
        <Button>Contact Me</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {data.gigs.map((gig: GigType) => (
          <div key={gig._id} className="border p-2">
            <img src={gig.cover} alt="" className="w-full" />
            <p>{gig.title}</p>
            <p>{gig.desc}</p>
            <p>{gig.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
