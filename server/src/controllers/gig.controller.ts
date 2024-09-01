import asyncHandler from "express-async-handler";
import { GigModel } from "../models/Gig.model";
import { UserModel } from "../models/User.model";
import { Request, Response } from "express";
export interface IUserRequest extends Request {
  userId?: string;
  isSeller?: boolean;
}
export const getGigs = asyncHandler(async (req, res) => {
  const q = req.query;
  console.log(q);
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
  const gigs = await GigModel.find(filters).populate({
    path: "userId",
    select: "-password -email -phone",
  });
  res.status(200).json(gigs);
});
export const getGigById = asyncHandler(
  async (req: IUserRequest, res: Response) => {
    const { id } = req.params;
    console.log("hit");
    if (!id) {
      res.status(400).json({ message: "Gig id is required" });
      return;
    }
    const gig = await GigModel.findById(id).populate({
      path: "userId",
      select: "-password -email -phone",
    });
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
export const NewGig = asyncHandler(async (req: IUserRequest, res: Response) => {
  const {
    title,
    price,
    description,
    category,
    images,
    coverImage,
    deliveryTime,
    revisions,
    features,
    published,
  } = req.body as {
    title: string;
    price: number;
    description: string;
    category: string;
    images: Array<string>;
    coverImage: string;
    deliveryTime: number;
    revisions: number;
    features: Array<string>;
    published: boolean;
  };
  console.log(req.body);
  if (
    !title ||
    !price ||
    !description ||
    !category ||
    !coverImage ||
    !deliveryTime ||
    !revisions ||
    !features
  ) {
    res.status(400).json({
      message:
        "Title, price, description, category, cover image, delivery time, and revision number are required",
    });
    return;
  }
  const user = await UserModel.findById(req.userId);
  if (!user) {
    res.status(401).json({ message: "you cannot create gig" });
    return;
  }
  if (!user.isSeller) {
    res.status(401).json({ message: "you cannot create gig" });
    return;
  }
  const gig = await GigModel.create({
    userId: req.userId,
    title,
    price,
    desc: description,
    cat: category,
    cover: coverImage,
    images,
    deliveryTime,
    revisionNumber: revisions,
    published,
    features,
  });
  res.status(201).json(gig);
});

export const getUserWithGig = asyncHandler(
  async (req: IUserRequest, res: Response) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "User id is required" });
      return;
    }
    //find all gigs of a user
    const user = await UserModel.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const gigs = await GigModel.find({ userId: id });
    //put gigs in user object
    res.status(200).json({ user, gigs });
    return;
  }
);

export const getGigForSeller = asyncHandler(
  async (req: IUserRequest, res: Response) => {
    const user = await UserModel.findById(req.userId);
    console.log("hit gig seller");
    if (!user) {
      res.status(401).json({ message: "you cannot get gig" });
      return;
    }
    if (!user.isSeller) {
      res.status(401).json({ message: "you cannot get gig" });
      return;
    }
    const gigs = await GigModel.find({ userId: req.userId }).populate({
      path: "userId",
    });
    res.status(200).json(gigs);
    return;
  }
);
