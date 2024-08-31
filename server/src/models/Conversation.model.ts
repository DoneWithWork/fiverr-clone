import mongoose from "mongoose";
const { Schema } = mongoose;

const ConversationSchema = new Schema(
  {
    participantIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    readBy: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        read: {
          type: Boolean,
          default: false,
        },
      },
    ],
    lastMessage: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Conversation", ConversationSchema);
