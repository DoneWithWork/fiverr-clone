import asyncHandler from "express-async-handler";

import { UserModel } from "../models/User.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export const Login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Login HIt");
    const { username, password } = req.body as {
      username: string;
      password: string;
    };
    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }
    const user = await UserModel.findOne({ username });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const isValidPassword = bcrypt.compareSync(password, user!.password);
    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const token = jwt.sign({ id: user!._id }, process.env.JWT_SECRET!);
    res.cookie("accessToken", token, {
      httpOnly: true,

      secure: process.env.NODE_ENV === "production",
    });
    const { password: userPassword, ...userWithoutPassword } = user!.toObject();
    console.log("Successfull login");
    res.status(200).send(userWithoutPassword);
    return;
  }
);

export const Register = asyncHandler(async (req: Request, res: Response) => {
  const {
    username,
    email,
    password,
    country,
    imageUrl,
    isSeller,
    description,
    phone,
  } = req.body as {
    username: string;
    email: string;
    password: string;
    country: string;
    imageUrl: string;
    isSeller: boolean;
    description: string;
    phone: string;
  };
  if (
    !username ||
    !email ||
    !password ||
    !country ||
    !imageUrl ||
    !isSeller ||
    !description ||
    !phone
  ) {
    res
      .status(400)
      .json({ message: "Username, email, and password are required" });
  }
  const user = await UserModel.create({
    username,
    email,
    password: bcrypt.hashSync(password, 10),
    country,
    imageUrl,
    desc: description,
    phone,
    isSeller,
  });
  if (!user) {
    res.status(400).json({ message: "User not created" });
  }
  res.status(201).json({ message: "User created" });
});
export const Logout = async (req: Request, res: Response) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .send("User has been logged out.");
};
