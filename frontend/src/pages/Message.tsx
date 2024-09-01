import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FetchHelper } from "@/lib/fetchHelper";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

type MessageProp = {
  conversationId: string;
  userId: string;
  desc: string;
};
export default function IndividualMessage() {
  //create a conversation if it doesn't exist
  //get all messages in a conversation
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const [conversationId, setConversationId] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null); // Ref to track the bottom of the message list

  useEffect(() => {
    //check if conversation exists

    const conversation = async () => {
      const data = await FetchHelper(`conversations`, "POST", {
        receiverId: id,
      });
      console.log(data);
      setConversationId(data._id);
    };
    conversation();
  }, [id]);
  const { isLoading, error, data } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const data = await FetchHelper(`messages/${conversationId}`, "GET");
      return data;
    },
    refetchInterval: 2000, // Poll every second
    enabled: conversationId !== "",
  }) as { isLoading: boolean; error: Error; data: MessageProp[] };

  const mutation = useMutation({
    mutationFn: async ({
      desc,
      conversationId,
    }: {
      desc: string;
      conversationId: string;
    }) => {
      return FetchHelper(`messages`, "POST", {
        desc,
        conversationId,
        receiverId: id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    },
  });
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const desc = formData.get("desc") as string;
    console.log(desc);
    mutation.mutate({ desc, conversationId });
    //reset form
    e.currentTarget.reset();
  };
  useEffect(() => {
    // Scroll to the bottom whenever data changes (i.e., new messages)
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);
  if (isLoading) return "Loading...";
  if (error) return "An error has occurred: " + error.message;
  return (
    <div className="container py-2 max-w-[80%] ">
      {isLoading && <div>Loading...</div>}
      <p>You are talking to {id}</p>
      {!isLoading && (!data || data.length === 0) && <div>No messages</div>}
      <div className="flex flex-col gap-3 max-h-[500px]  sm:max-h-[600px] overflow-scroll overflow-x-hidden ">
        {data &&
          data.length > 0 &&
          data.map((message: MessageProp, index) => (
            <div
              key={index}
              className={cn(
                "rounded-bl-xl px-4 py-2 rounded-br-xl",
                user?._id === message.userId
                  ? "self-end bg-purple-400 rounded-tl-xl"
                  : "self-start bg-purple-500 rounded-tr-xl"
              )}
            >
              {message.desc}
            </div>
          ))}
        {/* This div will always be at the bottom */}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={onSubmit} className="mt-5 ">
        <div className="row">
          <Input type="text" name="desc" placeholder="Enter your text..." />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  );
}
