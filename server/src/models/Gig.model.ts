import mongoose, { Document } from "mongoose";
import { Schema } from "mongoose";

const GigSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId, // Correcting the nesting issue
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    totalStars: {
      type: Number,
      default: 0,
    },
    starNumber: {
      type: Number,
      default: 0,
    },
    cat: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: false,
    },

    deliveryTime: {
      type: Number,
      required: true,
    },
    revisionNumber: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
      required: false,
    },
    sales: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const GigModel = mongoose.model("Gig", GigSchema);

interface Gig extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  desc: string;
  totalStars: number;
  starNumber: number;
  cat: string;
  price: number;
  cover: string;
  images?: string[];
  deliveryTime: number;
  revisionNumber: number;
  features?: string[];
  sales: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default Gig;
