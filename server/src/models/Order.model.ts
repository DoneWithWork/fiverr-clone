import mongoose, { Document } from "mongoose";
import { Schema } from "mongoose";
import Gig from "./Gig.model";

const OrderSchema = new Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gigId: {
      type: Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
    },
    rating: {
      type: Number,
      required: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    payed: {
      type: Boolean,
      default: false,
    },
    paymentIntent: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const OrderModel = mongoose.model("Order", OrderSchema);

interface Order extends Document {
  sellerId: mongoose.Types.ObjectId;
  buyerId: mongoose.Types.ObjectId;
  gigId: mongoose.Types.ObjectId | Gig; // This can be updated to `Gig | mongoose.Types.ObjectId` if you want to accommodate populated documents
  rating?: number | null; // Allowing null as well
  isCompleted: boolean;
  payed: boolean;
  paymentIntent: string;
  createdAt: Date;
  updatedAt: Date;
}

export default Order;
