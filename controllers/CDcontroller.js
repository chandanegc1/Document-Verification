import CD from "../Models/CDmodel.js";
import { comparePassword, hashPassword } from "../utils/PasswordUtils.js";

export const registerEmployee = async (req, res) => {
  const { employeeId, email } = req.body;
  console.log(req.body);
  try {
    const existingUser = await CD.findOne({ employeeId });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;
    const newUser = new CD({ employeeId, email,password:req.body.password });
    await newUser.save();
    res.status(201).json({ msg: "Employee registered" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const loginEmployee = async (req, res) => {
  const { employeeId, password } = req.body;
  try {
    const user = await CD.findOne({ employeeId });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const isValidUser = await comparePassword(password, user.password);
    if (!isValidUser) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const token = createJWT({ userId: user._id });
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ msg: "User logged in" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
