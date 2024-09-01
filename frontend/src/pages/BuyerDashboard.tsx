import useQueryFetcher from "@/lib/reactQueryFetcher";

import { OrdersBuyerProps } from "@/types/types";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function BuyerDashboard() {
  const url = "orders/allordersbuyer";

  const { isLoading, error, data } = useQueryFetcher({
    url,
    queryKey: "orders",
    method: "GET",
  }) as { isLoading: boolean; error: Error; data: OrdersBuyerProps[] };
  if (isLoading) return "Loading...";
  if (error) return "An error has occurred: " + error.message;
  return (
    <div className="container max-w-[90%]">
      <div className="flex flex-col gap-5 items-center py-5">
        <h1 className="text-2xl font-semibold">Buyer Dashboard</h1>
        {data.map((order: OrdersBuyerProps) => (
          <Link
            to={`/orders/${order._id}`}
            key={order._id}
            className="flex flex-row items-center border p-2 py-2 "
          >
            <div>Title: {order.gigId.title}</div>
            <div>
              <img src={order.gigId.cover} alt="" className="w-40" />
            </div>
            <div>Description: {order.gigId.desc}</div>
            <div>Price: ${order.gigId.price}</div>
            <div>{order.isCompleted ? "Completed" : "Not Completed"}</div>
            {/* Add more fields as needed */}
            <Link to={`/messages/${order.sellerId}`}>
              <Mail size={25} />
            </Link>
          </Link>
        ))}
        {data.length === 0 && <div>No orders found</div>}
      </div>
    </div>
  );
}
