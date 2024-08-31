import asyncHandler from "express-async-handler";
import { IUserRequest } from "./gig.controller";
import Order, { OrderModel } from "../models/Order.model";
import { Response } from "express";
import Gig, { GigModel } from "../models/Gig.model";
import exp from "constants";
import Stripe from "stripe";
export const intent = asyncHandler(async (req: IUserRequest, res: Response) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET!, {});
  const { id } = req.params;
  console.log("hi intent");
  const gig = await GigModel.findById(id);
  if (!gig) {
    res.status(404).json({ message: "Gig not found" });
    return;
  }
  const buyerId = req.userId;
  const sellerId = gig?.userId; //creater of gig is the seller

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: gig?.price! * 100,
    currency: "myr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });
  //create new order
  const order = await OrderModel.create({
    sellerId,
    buyerId,
    gigId: id,
    paymentIntent: paymentIntent.id,
  });
  res.status(200).json({ client_secret: paymentIntent.client_secret });
  return;
});
//return orders to seller
export const getOrdersSeller = asyncHandler(
  async (req: IUserRequest, res: Response) => {
    if (!req.isSeller) {
      res.status(401).json({ message: "You are not a seller" });
      return;
    }
    const orders = await OrderModel.find({ sellerId: req.userId }).populate({
      path: "gigId",
    });
    res.status(200).json(orders);
    return;
  }
);
//only seller can complete gig
export const completeGig = asyncHandler(async (req: IUserRequest, res) => {
  const { id } = req.params;
  if (!req.isSeller) {
    res.status(401).json({ message: "You are not a seller" });
    return;
  }
  const order = await OrderModel.findByIdAndUpdate(
    id,
    {
      completed: true,
    },
    { new: true }
  ).lean();
  if (!order) {
    res.status(404).json({ message: "Order not found" });
    return;
  }
  //increase sales by 1 in gigModel
  const gig = await GigModel.findByIdAndUpdate(
    order.gigId,
    {
      $inc: { sales: 1 },
    },
    {
      new: true,
    }
  );
  if (!gig) {
    res.status(404).json({ message: "Gig not found" });
    return;
  }
  res.status(200).json(order);
});

//only buyer can rate gig
export const rateGig = asyncHandler(async (req: IUserRequest, res) => {
  //we must be the buyer to rate the gig and only if gig is completed
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Order id is required" });
    return;
  }
  const { rating } = req.body as { rating: number };
  if (!rating) {
    res.status(400).json({ message: "Rating is required" });
    return;
  }
  const order = await OrderModel.findById(id);
  if (!order) {
    res.status(404).json({ message: "Order not found" });
    return;
  }
  if (order.buyerId.toString() !== req.userId) {
    res.status(401).json({ message: "You are not the buyer" });
    return;
  }
  if (!order.isCompleted) {
    res.status(400).json({ message: "Order is not completed" });
    return;
  }
  const ratedOrder = await OrderModel.findByIdAndUpdate(
    id,
    {
      rating,
    },
    { new: true }
  ).lean();
  //update total rating on the gigmodel
  const gig = await GigModel.findByIdAndUpdate(
    order.gigId,
    {
      $inc: { totalStars: rating, starNumber: 1 },
    },
    {
      new: true,
    }
  );
  if (!gig) {
    res.status(404).json({ message: "Gig not found" });
    return;
  }
  res.status(200).json(ratedOrder);
});

//only returns orders that belong to the buyer
export const getOrdersBuyer = asyncHandler(async (req: IUserRequest, res) => {
  const orders = await OrderModel.find({ buyerId: req.userId }).populate({
    path: "gigId",
  });
  res.status(200).json(orders);
  return;
});

//buyer/seller can get specific order
export const getOrder = asyncHandler(async (req: IUserRequest, res) => {
  const { id } = req.params;
  //check if user if a seller or buyer

  const order = await OrderModel.findById(id);
  if (!order) {
    res.status(404).json({ message: "Order not found" });
    return;
  }
  if (
    order.buyerId.toString() !== req.userId &&
    order.sellerId.toString() !== req.userId
  ) {
    res.status(401).json({ message: "You are not the buyer or seller" });
    return;
  }
  res.status(200).json(order);
});
export const confirmPayment = asyncHandler(async (req: IUserRequest, res) => {
  console.log("confirm payment");
  console.log(req.body);
  if (!req.body.payment_intent) {
    res.status(400).json({ message: "Payment intent is required" });
    return;
  }
  const order = await OrderModel.findOneAndUpdate(
    {
      paymentIntent: req.body.payment_intent,
    },
    {
      payed: true,
    },
    {
      new: true,
    }
  );
  if (!order) {
    res.status(404).json({ message: "Order not found" });
    return;
  }
  res.status(200).json({ message: "Order payed" });
  return;
});
export const totalEarnings = asyncHandler(async (req: IUserRequest, res) => {
  if (!req.isSeller) {
    res.status(401).json({ message: "You are not a seller" });
    return;
  }
  const orders: Order[] = await OrderModel.find({
    sellerId: req.userId,
  }).populate({
    path: "gigId",
    select: "price",
  });

  const earnings = orders.reduce((acc, order) => {
    if (order.payed && typeof order.gigId !== "string") {
      // Check if gigId is populated
      const gig = order.gigId as Gig;
      return acc + gig.price;
    }
    return acc;
  }, 0);
  res.status(200).json({ earnings });
  return;
});
