import useQueryFetcher from "@/lib/reactQueryFetcher";
import { OrdersBuyerProps } from "@/types/types";
import { Link } from "react-router-dom";

export default function OrderSeller() {
  const url = "orders/allordersseller";
  const { isLoading, error, data } = useQueryFetcher({
    url,
    queryKey: "orders",
    method: "GET",
  }) as { isLoading: boolean; error: Error; data: OrdersBuyerProps[] };
  if (isLoading) return "Loading...";
  if (error) return "An error has occurred: " + error.message;
  if (data.length === 0) return "No orders found";
  return (
    <div className="container max-w-[90%]">
      <div className="flex flex-col gap-5 items-center py-5">
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
          </Link>
        ))}
      </div>
    </div>
  );
}
