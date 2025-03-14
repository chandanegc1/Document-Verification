import { StatusCodes } from "http-status-codes";
import { comparePassword, hashPassword } from "../utils/PasswordUtils.js";
import User from "../Models/UserModel.js";
import Hr from "../Models/HRmodel.js";
import { UnauthenticatedError } from "../CustomError/customError.js";
import { createJWT } from "../utils/tokenUtils.js";
import {
  generateEmail,
  generateOTP,
  otpMsg,
  sendEmailToEmployee,
} from "../utils/emailSender.js";
import jwt from "jsonwebtoken";

// Store OTPs temporarily
const otpStore = {};

export const sendOtp = async (req, res) => {
  const { email } = req.params;
  try {
    const hr = await Hr.findOne({ email: email });
    if (hr) {
      if (hr) throw new UnauthenticatedError("Email edalready register");
    }
    const otp = generateOTP();
    otpStore[email] = await hashPassword(otp);
    setTimeout(() => {
      delete otpStore[email];
      console.log(`OTP for ${email} deleted after 5 minutes.`);
    }, 300000);

    const emailSubject = `Your TrueDocs OTP – ${otp}`;
    const senderEmail = `"TrueDocs Team" <${process.env.NODEMAILER_USER}>`;
    const message = otpMsg(otp);

    const emailStatus = await sendEmailToEmployee(
      senderEmail,
      email,
      emailSubject,
      message
    );

    if (emailStatus) {
      return res
        .status(StatusCodes.CREATED)
        .json({ msg: "OTP sent successfully." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Failed to send OTP." });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;
    if (!otpStore[email]) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "OTP expired or not found." });
    }

    const isOtpValid = await comparePassword(otp, otpStore[email]);
    if (!isOtpValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid OTP." });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    delete otpStore[email];

    return res.json({ msg: "OTP verified successfully.", token });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "OTP verification failed." });
  }
};

export const registerCandidate = async (req, res) => {
  const { email, employeeId, password, repassword } = req.body;
  const hrId = req.params.id;

  const hr = await Hr.findById(hrId);
  if (!hr) throw new UnauthenticatedError("Access denied. HR not found.");

  if (await User.findOne({ $or: [{ email }] })) {
    throw new UnauthenticatedError(
      "User already exists with the provided email or employee ID."
    );
  }

  if (password !== repassword) {
    throw new UnauthenticatedError("Passwords do not match.");
  }

  const hashedPassword = await hashPassword(password);
  await User.create({ ...req.body, password: hashedPassword });

  const emailData = {
    employeeName: "Candidate",
    employeeID: employeeId,
    password,
    companyName: hr.companyName,
    loginLink: `${req.protocol}://${req.get("host")}/login`,
    hrName: hr.name,
    hrEmail: hr.email,
    hrContact: `${hr.companyName}, ${hr.location}`,
  };

  const emailSubject = `Your TrueDocs Credentials for Document Submission – ${hr.companyName}`;
  const senderEmail = `"HR Team - ${hr.companyName}" <${process.env.NODEMAILER_USER}>`;
  const message = generateEmail(emailData);

  const emailStatus = await sendEmailToEmployee(
    senderEmail,
    email,
    emailSubject,
    message
  );

  return res.status(StatusCodes.CREATED).json({
    msg: emailStatus
      ? "Credentials sent to the candidate's email."
      : "Failed to send credentials email.",
  });
};

export const registerHR = async (req, res) => {
  const { email, employeeId, password, repassword } = req.body;

  if (await Hr.findOne({ $or: [{ email }, { employeeId }] })) {
    throw new UnauthenticatedError(
      "HR already exists with the provided email or employee ID."
    );
  }

  if (password !== repassword) {
    throw new UnauthenticatedError("Passwords do not match.");
  }

  await Hr.create({ ...req.body, password: await hashPassword(password) });

  return res
    .status(StatusCodes.CREATED)
    .json({ msg: "HR registered successfully." });
};

export const loginCandidate = async (req, res) => {
  const user = await User.findOne({
    $or: [{ email: req.body.email }, { employeeId: req.body.email }],
  });
  if (!user || !(await comparePassword(req.body.password, user.password))) {
    throw new UnauthenticatedError("Invalid credentials.");
  }
  const token = createJWT({ userId: user._id, role: user.role });
  res.cookie("token", token, { httpOnly: true });
  return res
    .status(StatusCodes.OK)
    .json({ msg: "Login successful.", role: user.role, _id: user._id });
};

export const loginHR = async (req, res) => {
  const user = await Hr.findOne({
    $or: [{ email: req.body.email }, { employeeId: req.body.email }],
  });
  if (!user || !(await comparePassword(req.body.password, user.password))) {
    throw new UnauthenticatedError("Invalid credentials.");
  }
  const token = createJWT({ userId: user._id, role: user.role });
  res.cookie("token", token, { httpOnly: true });
  return res
    .status(StatusCodes.OK)
    .json({ msg: "Login successful.", role: user.role, _id: user._id });
};

export const logoutUser = (_, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  return res
    .status(StatusCodes.OK)
    .json({ msg: "User logged out successfully." });
};
