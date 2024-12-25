import { StatusCodes } from "http-status-codes";
import User from "../Models/UserModel.js";
import Job from "../Models/DocModel.js";
import cloudinary from "cloudinary";
import { promises as fs } from "fs";

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

export const getAlltUsers = async (req, res) => {
  const user = await User.find();
  for (let i = 0; i < user.length; i++) {
    const jobs = await Job.find({ createdBy: user[i]._id });
    user[i].status = true;
    if (jobs.length === 0 || jobs.length < 4) {
      user[i].status = false;
    }
    for (let j = 0; j < jobs.length; j++) {
      if (jobs[j].status !== "approved") {
        user[i].status = false;
      }
    }
  }
  res.status(StatusCodes.OK).json({ user: user });
};

export const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments();
  const jobs = await Job.countDocuments();
  res.status(StatusCodes.OK).json({ users, jobs });
};

export const updateUser = async (req, res) => {
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
