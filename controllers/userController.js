import { StatusCodes } from "http-status-codes";
import User from "../Models/UserModel.js";
import Job from "../Models/DocModel.js";
import Hr from "../Models/HRmodel.js";
import cloudinary from "cloudinary";
import { promises as fs } from "fs";

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};
export const getCurrentHr = async (req, res) => {
  const user = await Hr.findOne({ _id: req.user.userId });
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};
export const getAlltUsers = async (req, res) => {
  try {
    // Fetch all users and all jobs in one go
    const [users, jobs] = await Promise.all([
      User.find(),
      Job.find({}, "createdBy status"), // Fetch only necessary fields
    ]);

    // Create a map of jobs grouped by user ID
    const jobsByUser = {};
    jobs.forEach((job) => {
      if (!jobsByUser[job.createdBy]) jobsByUser[job.createdBy] = [];
      jobsByUser[job.createdBy].push(job);
    });

    // Process users and determine their status
    const updatedUsers = users.map((user) => {
      const userJobs = jobsByUser[user._id] || [];
      const hasEnoughJobs = userJobs.length >= 4;
      const allApproved = userJobs.every((job) => job.status === "approved");
      return { ...user.toObject(), status: hasEnoughJobs && allApproved };
    });

    res.status(200).json({ user: updatedUsers });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
export const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments();
  const jobs = await Job.countDocuments();
  res.status(StatusCodes.OK).json({ users, jobs });
};
export const updateCD = async (req, res) => {
  const newUser = { ...req.body };
  delete newUser.password;
  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path);
    await fs.unlink(req.file.path);
    newUser.avatar = response.secure_url;
    newUser.avatarPublicId = response.public_id;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.userId, newUser);
  if (req.file && updatedUser.avatarPublicId)
    await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicId);
  res.status(StatusCodes.OK).json({ msg: "update user" });
};
export const updateHR = async (req, res) => {
  const newUser = { ...req.body };
  delete newUser.password;
  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path);
    await fs.unlink(req.file.path);
    newUser.avatar = response.secure_url;
    newUser.avatarPublicId = response.public_id;
  }

  const updatedUser = await Hr.findByIdAndUpdate(req.user.userId, newUser);
  if (req.file && updatedUser.avatarPublicId)
    await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicId);
  res.status(StatusCodes.OK).json({ msg: "update user" });
};
export const updateDocStatus = async (req, res) => {
  const { id } = req.params;
  const { jobStatus } = req.body;
  const updatedJob = await User.findByIdAndUpdate(
    id,
    { status: jobStatus },
    { new: true }
  );
  res.status(StatusCodes.OK).json({ updatedJob });
};
