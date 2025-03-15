import "express-async-errors";
import express from "express";
import mongoose from "mongoose";
import jobRouter from "./Router/docRouter.js";
import errorHandlerMiddleware from "./Middleware/ErrorHandler.js";
import authRouter from "./Router/authRouter.js";
import cookieParser from "cookie-parser";
import userRouter from "./Router/userRouter.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
const app = express();

//midleware
app.use(cookieParser());
app.use(express.json());

// Router
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use(errorHandlerMiddleware);

app.use(express.static("./client/dist"));
console.log(process.env.API_KEY)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

try {
  mongoose.connect(
    process.env.NODE_ENV === "development"
      ? process.env.LOCAL_DB_URL
      : process.env.DB_URL
  );
  app.listen(process.env.PORT, () => {
    console.log("server running.... 5100");
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
