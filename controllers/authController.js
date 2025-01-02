import { StatusCodes } from "http-status-codes";
import {
  comparePassword,
  hashPassword,
  verifyEmail,
} from "../utils/PasswordUtils.js";
import User from "../Models/UserModel.js";
import { UnauthenticatedError } from "../CustomError/customError.js";
import { createJWT } from "../utils/tokenUtils.js";

export const register = async (req, res) => {
  const existingUserByEmail =req.body.email? await User.findOne({ email: req.body.email }):null;
  const existingUserByEmployeeId = await User.findOne({
    employeeId: req.body.employeeId,
  });
  if (existingUserByEmail || existingUserByEmployeeId) {
    throw new UnauthenticatedError(
      "User already exists with provided email or employee ID"
    );
  }
  if(req.body.password !== req.body.repassword){
    throw new UnauthenticatedError("passwords do not match");
  }

  let role = false;
  if (
    req.body.email &&
    req.body.employeeId &&
    verifyEmail(req.body.email)
  ) {
    req.body.role = "admin";
    role = true;
  }
  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;
  const user = await User.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({
      msg: role ? "Admin Registration sucessfully" : "user created",
      user,
    });
};

export const login = async (req, res) => {
  const employeeId = await User.findOne({ employeeId: req.body.email });
  const userEmail = await User.findOne({ email: req.body.email });
  const user = employeeId ? employeeId : userEmail;
  if (!user) throw new UnauthenticatedError("invalid credentials");
  const isValidUser =
    user && (await comparePassword(req.body.password, user.password));
  if (!isValidUser) throw new UnauthenticatedError("invalid credentials");
  const token = createJWT({ userId: user._id, role: user.role });
  res.cookie("token", token, { httpOnly: true });
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "user logged in", role: user.role });
};

export const logout = (_, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};
