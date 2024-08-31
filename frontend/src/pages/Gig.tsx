import { ErrorToast } from "@/components/toasts";
import { GigType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";

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
      <div className="my-10">
        {data.features.map((feature) => (
          <p key={feature}>{feature}</p>
        ))}
      </div>
      <div className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {data.images.map((image) => (
              <div key={image} className="embla__slide">
                <img
                  src={image}
                  alt=""
                  className="w-full max-w-[500px] object-cover  max-h-[300px]"
                />
              </div>
            ))}
          </div>
        </div>
        <Button asChild>
          <Link to={`/pay/${data._id}`}>Order This Gig</Link>
        </Button>
        <div className="flex flex-row items-center gap-5 mt-3">
          <Button className="embla__prev" onClick={scrollPrev}>
            Prev
          </Button>
          <Button className="embla__next" onClick={scrollNext}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
