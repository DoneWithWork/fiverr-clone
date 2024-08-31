import asyncHandler from "express-async-handler";
import ConversationModel from "../models/Conversation.model";
import { IUserRequest } from "./gig.controller";

export const getConversations = asyncHandler(async (req: IUserRequest, res) => {
  const conversations = await ConversationModel.find({
    participantIds: { $in: [req.userId] }, // Ensure userId is part of the array
  });

  res.status(200).json(conversations);
});

export const createConversation = asyncHandler(
  async (req: IUserRequest, res) => {
    if (req.userId === req.body.receiverId) {
      res
        .status(400)
        .json({ message: "You cannot create a conversation with yourself" });
      return;
    }
    let conversation = await ConversationModel.findOne({
      participantIds: {
        $all: [req.userId, req.body.receiverId],
      },
    });
    if (!conversation) {
      conversation = new ConversationModel({
        participantIds: [req.userId, req.body.receiverId],
        readBy: [
          {
            userId: req.userId,
            read: true,
          },
          {
            userId: req.body.receiverId,
            read: false,
          },
        ],
      });
      await conversation.save();
    }
    res.status(201).json(conversation);
  }
);

export const getSingleConversation = asyncHandler(
  async (req: IUserRequest, res) => {
    const conversation = await ConversationModel.findOne({
      id: req.params.id,
    });
    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" });
    }
    res.status(200).json(conversation);
  }
);

// Update the conversation with the new message content
// Mark the message as read by the sender and unread by the receiver
export const updateConversation = asyncHandler(
  async (req: IUserRequest, res) => {
    const { messageContent, senderId } = req.body;

    // Update the conversation
    const updatedConversation = await ConversationModel.findOneAndUpdate(
      {
        id: req.params.id,
      },
      {
        $set: {
          lastMessage: messageContent, // Update the lastMessage with the new message content
          readBy: [
            {
              userId: senderId,
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

    if (!updatedConversation) {
      res.status(404).json({ message: "Conversation not found" });
    }

    res.status(200).json({ updatedConversation });
  }
);
export const readConversation = asyncHandler(async (req: IUserRequest, res) => {
  // Update the conversation to mark the message as read by the receiver
  const updatedConversation = await ConversationModel.findOneAndUpdate(
    {
      id: req.params.id,
    },
    {
      $set: {
        readBy: [
          {
            userId: req.userId,
            read: true,
          },
        ],
      },
    },
    {
      new: true,
    }
  );
  if (!updatedConversation) {
    res.status(404).json({ message: "Conversation not found" });
  }
  res.status(200).json({ updatedConversation });
});
