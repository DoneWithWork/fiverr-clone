import { Request, Response, NextFunction } from "express";

async function ErrorHandlerMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }
  console.log("-----------Error Handler Middleware-----------");
  console.log("Error: ", err.message);
  res.status(500).send("Internal Server Error");
}

export default ErrorHandlerMiddleware;
