import { StatusCodes } from "http-status-codes";
import User from "../models/userModel.js";
import Job from "../models/documentModel.js";
import Hr from "../models/hrModel.js";
import cloudinary from "cloudinary";
import { promises as fs } from "fs";

// Utility function to remove passwords from responses
const removePassword = (user) => {
  if (!user) return null;
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

// Get current logged-in user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).lean();
    console.log(user)
    if (!user) return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
    delete user.password;
    res.status(StatusCodes.OK).json({ user: user });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server Error", error });
  }
};

// Get current HR user
export const getCurrentHR = async (req, res) => {
  try {
    const hr = await Hr.findById(req.user.userId);
    if (!hr) return res.status(StatusCodes.NOT_FOUND).json({ msg: "HR not found" });
    delete hr.password;
    res.status(StatusCodes.OK).json({ user: hr });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server Error", error });
  }
};

// Get all users with job approval status
export const getAllUsers = async (req, res) => {
  try {
    const [users, jobs] = await Promise.all([
      User.find().lean(),
      Job.find({}, "createdBy status").lean(),
    ]);

    // Create a map of jobs grouped by user ID
    const jobsByUser = jobs.reduce((acc, job) => {
      if (!acc[job.createdBy]) acc[job.createdBy] = [];
      acc[job.createdBy].push(job);
      return acc;
    }, {});

    // Determine user status
    const updatedUsers = users.map((user) => {
      const userJobs = jobsByUser[user._id] || [];
      const hasEnoughJobs = userJobs.length >= 4;
      const allApproved = userJobs.every((job) => job.status === "approved");
      return { ...user, status: hasEnoughJobs && allApproved };
    });

    res.status(StatusCodes.OK).json({ users: updatedUsers });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server Error", error });
  }
};

// Get application statistics
export const getApplicationStats = async (req, res) => {
  try {
    const [users, jobs] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
    ]);

    res.status(StatusCodes.OK).json({ users, jobs });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server Error", error });
  }
};

// Utility function to update user (Candidate or HR)
const updateUser = async (Model, userId, data, file) => {
  if (file) {
    const response = await cloudinary.v2.uploader.upload(file.path);
    await fs.unlink(file.path); // Delete local file

    data.avatar = response.secure_url;
    data.avatarPublicId = response.public_id;
  }

  const updatedUser = await Model.findByIdAndUpdate(userId, data, { new: true }).lean();

  // Remove previous avatar from Cloudinary if it exists
  if (file && updatedUser?.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicId);
  }

  return updatedUser;
};

// Update Candidate
export const updateCandidate = async (req, res) => {
  try {
    const newUser = { ...req.body };
    delete newUser.password;

    const updatedUser = await updateUser(User, req.user.userId, newUser, req.file);
    res.status(StatusCodes.OK).json({ msg: "User updated", user: removePassword(updatedUser) });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server Error", error });
  }
};

// Update HR
export const updateHR = async (req, res) => {
  try {
    const newUser = { ...req.body };
    delete newUser.password;

    const updatedUser = await updateUser(Hr, req.user.userId, newUser, req.file);
    res.status(StatusCodes.OK).json({ msg: "HR updated", user: removePassword(updatedUser) });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server Error", error });
  }
};

// Update Document Status
export const updateDocStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { jobStatus } = req.body;

    const updatedJob = await User.findByIdAndUpdate(
      id,
      { status: jobStatus },
      { new: true }
    ).lean();

    if (!updatedJob) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Job not found" });
    }

    res.status(StatusCodes.OK).json({ msg: "Job status updated", updatedJob });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server Error", error });
  }
};
