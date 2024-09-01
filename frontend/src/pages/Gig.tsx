import { ErrorToast } from "@/components/toasts";
import { GigType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { Mail } from "lucide-react";

export default function Gig() {
  const { id } = useParams();
  const { user } = useUserStore();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  const { isPending, error, data } = useQuery<GigType>({
    queryKey: ["repoData", id],
    staleTime: 1000 * 60 * 5,
    queryFn: () =>
      fetch(`${import.meta.env.VITE_BACKEND_URL}/gigs/${id}`)
        .then((res) => {
          console.log(res);
          return res.json();
        })
        .catch((error) => {
          console.error(error);
          ErrorToast({ message: "An error occurred while fetching the gig" });
        }),
  });
  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;
  if (data) {
    console.log(data);
  }
  //fetch the gig with the id
  return (
    <div className="container mt-10 max-w-[1200px] ">
      <p>{data.cat}</p>
      <div className="flex flex-row items-center gap-5">
        <Link to={`/user/${user?._id}`} className="font-semibold">
          {data.userId.username}
        </Link>
        <img src={data.userId.imageUrl} alt="" className="w-8 h-8 rounded-xl" />
      </div>
      {data.userId._id === user?._id && (
        <div className="flex flex-row items-center gap-5">
          <Button className="bg-blue-500 text-white">Edit</Button>
        </div>
      )}
      <p className="font-semibold text-2xl">{data.title}</p>
      <p className="text-xl">{data.desc}</p>
      <img
        src={data.cover}
        className="w-full max-w-[500px] object-cover  max-h-[300px]"
        alt="cover image"
      />
      {user?._id !== data.userId._id && (
        <Button asChild className="my-2">
          <Link
            to={`/messages/${data.userId._id}`}
            className="flex flex-row items-center gap-2 "
          >
            Message Seller <Mail size={20} />
          </Link>
        </Button>
      )}
      <div className="my-10">
        <h2 className="font-semibold">Features offered</h2>
        {data.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </div>
      <div className="embla">
        <p>Sample Work</p>
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {data.images.map((image) => (
              <div key={image} className="embla__slide">
                <img
                  src={image}
                  alt=""
                  className="w-full max-w-[500px] object-cover  max-h-[300px] border-2 border-black rounded-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-row items-center gap-5 mt-3 mb-3">
          <Button className="embla__prev" onClick={scrollPrev}>
            Prev
          </Button>
          <Button className="embla__next" onClick={scrollNext}>
            Next
          </Button>
        </div>
        <Button asChild>
          <Link to={`/pay/${data._id}`}>Order This Gig</Link>
        </Button>
      </div>
    </div>
  );
}
