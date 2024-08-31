import express from "express";
import cors from "cors";
import helmet from "helmet";
import ErrorHandlerMiddleware from "./middlewares/ErrorHandler.middleware";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import compression from "compression";
import mongoose from "mongoose";
import authRouter from "./routes/auth.route";
import gigRouter from "./routes/gig.route";
import orderRouter from "./routes/order.route";
import conversationRouter from "./routes/conversation.route";
import messageRouter from "./routes/message.route";
dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(
  cors({
    origin: [process.env.CLIENT_URL!, "http://localhost:4173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/auth", authRouter);
app.use("/gigs", gigRouter);
app.use("/orders", orderRouter);
app.use("/messages", messageRouter);
app.use("/conversations", conversationRouter);
app
  .get("*", (req, res) => {
    res.status(404).send("Not Found");
  })
  .post("*", (req, res) => {
    res.status(404).send("Not Found");
  });

app.use(ErrorHandlerMiddleware);
try {
  mongoose.connect(process.env.MONGO_URI!);
  console.log("Connected to the database");
  app.listen(3001, () => {
    console.log("Server is running on port 3000");
  });
} catch (error) {
  console.error("Error connecting to the database: ", error);
}

// Graceful shutdown
const SIGNALS = ["SIGINT", "SIGTERM", "SIGQUIT"];
SIGNALS.forEach((signal) => {
  process.on(signal, async () => {
    console.log(`Received ${signal}`);
    await mongoose.connection.close();
    process.exit(0);
  });
});
