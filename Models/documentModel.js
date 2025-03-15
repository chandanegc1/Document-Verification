import mongoose from "mongoose";
import { DOCUMENT_STATUS } from "../utils/constants.js";

const documentSchema = new mongoose.Schema(
  {
    documentName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    avatar: {
      type: String,
    },
    avatarPublicId: {
      type: String,
    },
    status: {
      type: String,
      enum: [DOCUMENT_STATUS.PENDING, DOCUMENT_STATUS.APPROVED, DOCUMENT_STATUS.REJECTED],
      default: DOCUMENT_STATUS.PENDING,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);
export default Document;
