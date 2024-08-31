import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId, // Correcting the nesting issue
      ref: "Conversation",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId, // Correcting the nesting issue
      ref: "User",
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Message", MessageSchema);
