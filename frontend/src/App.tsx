import { BookImage, Code, PencilRuler } from "lucide-react";
import SearchBox from "./components/SearchBox";

import {
  Music,
  Video,
  Mic,
  ShoppingCart,
  Briefcase,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./components/ui/button";

const services = [
  {
    name: "Programming & Tech",
    icon: Code,
  },
  {
    name: "Graphics & Design",
    icon: PencilRuler,
  },
  {
    name: "Digital Marketing",
    icon: BookImage,
  },
  {
    name: "Music & Audio",
    icon: Music,
  },
  {
    name: "Video & Animation",
    icon: Video,
  },
  {
    name: "Voice Over",
    icon: Mic,
  },
  {
    name: "E-Commerce",
    icon: ShoppingCart,
  },
  {
    name: "Business",
    icon: Briefcase,
  },
  {
    name: "Lifestyle",
    icon: Globe,
  },
];
export default function Home() {
  return (
    <div className="">
      <div className="py-16 text-center bg-[linear-gradient(180deg,#003912_36.72%,#19aa64_141.43%)] flex flex-col items-center text-white">
        <div className="max-w-[60%]">
          <p className="text-2xl font-semibold">
            Hire expert freelancers for any job, online
          </p>
        </div>
        <div className="w-[70%] my-5 max-w-[500px]">
          <SearchBox />
        </div>
        <div>
          <Button asChild>
            <Link to="/gigs">Go To All services</Link>
          </Button>
        </div>
      </div>
      <div className="py-5">
        <div className="flex flex-col items-center">
          <p className="text-2xl font-semibold">Popular Services</p>
          <div className="grid grid-cols-3 gap-5 mt-5 sm:grid-cols-4 md:grid-cols-5 xl:flex overflow-x-hidden max-w-screen">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div className="flex flex-col items-center gap-3 w-24 ">
                  <div
                    key={service.name}
                    className="flex flex-col items-center justify-center p-5 border border-gray-200 rounded-md w-24 h-24 "
                  >
                    <Icon size={30} />
                  </div>
                  <p className="text-md font-semibold">{service.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
