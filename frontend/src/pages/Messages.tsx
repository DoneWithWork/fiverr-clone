import useQueryFetcher from "@/lib/reactQueryFetcher";
import { useUserStore } from "@/store/userStore";
import { Link } from "react-router-dom";
type ConversationProps = {
  _id: string;
  participantIds: string[];
  readBy: ReadByEntry[];
  lastMessage: string;
  updatedAt: Date;
};
type ReadByEntry = {
  userId: string;
  read: boolean;
};
import en from "javascript-time-ago/locale/en";
import TimeAgo from "javascript-time-ago";
import { Button } from "@/components/ui/button";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

//list all conversations user has
export default function Messages() {
  const url = "conversations/";
  const { user } = useUserStore();
  const { isLoading, error, data } = useQueryFetcher({
    url,
    queryKey: "orders",
    method: "GET",
  }) as { isLoading: boolean; error: Error; data: ConversationProps[] };
  if (isLoading) return "Loading...";
  if (error) return "An error has occurred: " + error.message;
  //need to mutate the data to toggle read status
  return (
    <div className="container max-w-[1200px]">
      <h1 className="text-center text-2xl font-semibold py-5">Messages</h1>
      <table className="">
        <thead>
          <tr>
            <th>Seller</th>
            <th>Last Message</th>
            <th>Last Updated</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((conversation) => {
              const sellerId = conversation.participantIds.find(
                (id) => id !== user!._id
              );
              return (
                <tr key={conversation._id}>
                  <td>
                    <Link
                      to={`/messages/${sellerId}`}
                      className="underline text-blue-500"
                    >
                      {sellerId}
                    </Link>
                  </td>
                  <td>{conversation.lastMessage}</td>
                  <td>{timeAgo.format(new Date(conversation.updatedAt))}</td>
                  <td>
                    {/* //already read? */}
                    {conversation.readBy.find(
                      (entry) => entry.userId === user!._id
                    )?.read == true ? (
                      <p>Read</p>
                    ) : (
                      <Button>Mark as read</Button>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
