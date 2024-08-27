import asyncHandler from "express-async-handler";
import { GigModel } from "../models/Gig.mode";
import { UserModel } from "../models/User.model";
import { Request, Response } from "express";
interface IUserRequest extends Request {
  userId?: string;
  isSeller?: boolean;
}
export const getGigs = asyncHandler(async (req, res) => {
  const q = req.query;

  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gt: q.min }),
        ...(q.max && { $lt: q.max }),
      },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };
  const gigs = await GigModel.find(filters);
  res.status(200).json(gigs);
});
export const getGigById = asyncHandler(
  async (req: IUserRequest, res: Response) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Gig id is required" });
      return;
    }
    const gig = await GigModel.findById(id);
    if (!gig) {
      res.status(404).json({ message: "Gig not found" });
      return;
    }
    res.status(200).json(gig);
  }
);
export const deleteGig = asyncHandler(
  async (req: IUserRequest, res: Response) => {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      res.status(401).json({ message: "you cannot delete gig" });
      return;
    }
    const gig = await GigModel.findOneAndDelete({ userId: req.userId });
    if (!gig) {
      res.status(404).json({ message: "Gig not found" });
      return;
    }
    console.log("Gig deleted");
    res.status(200).json({ message: "Gig deleted" });
  }
);
export const editGig = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, price, desc, category, imageUrl } = req.body as {
    title: string;
    price: number;
    desc: string;
    category: string;
    imageUrl: string;
  };
  if (!title || !price || !desc || !category || !imageUrl) {
    res.status(400).json({
      message: "Title, price, desc, category, and imageUrl are required",
    });
    return;
  }
  const gig = await GigModel.findByIdAndUpdate(
    id,
    { title, price, desc, category, imageUrl },
    { new: true }
  );
  if (!gig) {
    res.status(404).json({ message: "Gig not found" });
    return;
  }
  res.status(200).json(gig);
});
