import { StatusCodes } from "http-status-codes";
import { comparePassword, hashPassword } from "../utils/PasswordUtils.js";
import User from "../Models/UserModel.js";
import Hr from "../Models/HRmodel.js";
import { UnauthenticatedError } from "../CustomError/customError.js";
import { createJWT } from "../utils/tokenUtils.js";
import { generateEmail, sendEmailToEmployee } from "../utils/emailSender.js";

export const CDregister = async (req, res) => {
  const { email, employeeId, password, repassword } = req.body;
  const hrId = req.params.id;
  const existingUserByEmail = await User.findOne({ email: email });
  const existingUserByEmployeeId = await User.findOne({
    employeeId: employeeId,
  });

  const hrData = await Hr.findOne({ _id: hrId });
  const trueDocslink = `${req.protocol}://${req.get("host")}/login`;

  if (!hrId && !hrData) throw new UnauthenticatedError("Access Denied");
  if (existingUserByEmail || existingUserByEmployeeId)
    throw new UnauthenticatedError(
      "User already exists with provided email or employee ID"
    );

  if (password !== repassword)
    throw new UnauthenticatedError("passwords do not match");

  const hashedPassword = await hashPassword(password);
  const user = await User.create({ ...req.body, password: hashedPassword });
  const msgData = {
    employeeName: "sir/ma'am",
    employeeID: employeeId,
    password: password,
    companyName: hrData.companyName,
    loginLink: trueDocslink,
    hrName: hrData.name,
    hrEmail: hrData.email,
    hrContact: hrData.companyName + ", " + hrData.location,
  };
  const message = generateEmail(msgData);
  let emailStatus = false;
  if (user) {
    emailStatus = await sendEmailToEmployee(email, message, hrData.companyName);
  }
  res.status(StatusCodes.CREATED).json({
    msg: emailStatus
      ? "Credential send to the candidate email"
      : "Email not send..",
  });
};

export const HRregister = async (req, res) => {
  const {
    name,
    email,
    employeeId,
    companyName,
    location,
    password,
    repassword,
  } = req.body;

  const existingUserByEmail = await Hr.findOne({ email });
  const existingUserByEmployeeId = await Hr.findOne({ employeeId });

  if (existingUserByEmail || existingUserByEmployeeId) {
    throw new UnauthenticatedError(
      "User already exists with provided email or employee ID"
    );
  }

  if (password !== repassword) {
    throw new UnauthenticatedError("passwords do not match");
  }

  const hashedPassword = await hashPassword(password);
  const user = await Hr.create({ ...req.body, password: hashedPassword });

  res.status(StatusCodes.CREATED).json({
    msg: "Admin Registration sucessfully",
  });
};

export const CDlogin = async (req, res) => {
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
    .json({ msg: "user logged in", role: user.role, _id: user._id });
};
export const HRlogin = async (req, res) => {
  const employeeId = await Hr.findOne({ employeeId: req.body.email });
  const userEmail = await Hr.findOne({ email: req.body.email });
  const user = employeeId ? employeeId : userEmail;
  if (!user) throw new UnauthenticatedError("invalid credentials");
  const isValidUser =
    user && (await comparePassword(req.body.password, user.password));
  if (!isValidUser) throw new UnauthenticatedError("invalid credentials");
  const token = createJWT({ userId: user._id, role: user.role });
  res.cookie("token", token, { httpOnly: true });
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "user logged in", role: user.role, _id: user._id });
};

export const logout = (_, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};
