import mongoose from "mongoose";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";

const jobSchema = mongoose.Schema(
  {
    documentName: String,
    number: String,
    avatar: String,
    avatarPublicId: String,
    status: {
      type: String,
      enum: [JOB_STATUS.PENDING, JOB_STATUS.APPROVED, JOB_STATUS.REJECTED],
      default: JOB_STATUS.PENDING,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Doc = mongoose.model("Doc", jobSchema);
export default Doc;
