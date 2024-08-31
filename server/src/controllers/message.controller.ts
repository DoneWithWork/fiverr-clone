import asyncHandler from "express-async-handler";
import MessageModel from "../models/Message.model";
import { IUserRequest } from "./gig.controller";
import ConversationModel from "../models/Conversation.model";

export const createMessage = asyncHandler(async (req: IUserRequest, res) => {
  const newMessage = new MessageModel({
    conversationId: req.body.conversationId,
    userId: req.userId,
    desc: req.body.desc,
  });
  const savedMessage = await newMessage.save();
  await ConversationModel.findByIdAndUpdate(
    req.body.conversationId, // Find the conversation by ID
    {
      $set: {
        lastMessage: req.body.desc, // Update the lastMessage with the new message content
        readBy: [
          {
            userId: req.userId, // The ID of the sender
            read: true, // Mark the message as read by the sender
          },
          {
            userId: req.body.receiverId, // The ID of the other participant
            read: false, // Mark the message as unread by the receiver
          },
        ],
      },
    },
    {
      new: true, // Return the updated conversation
    }
  );
  res.status(201).json(savedMessage);
});

export const getMessages = asyncHandler(async (req, res) => {
  const messages = await MessageModel.find({
    conversationId: req.params.id,
  });
  if (!messages) {
    res.status(404).json({ message: "Messages not found" });
  }
  res.status(200).json(messages);
});
