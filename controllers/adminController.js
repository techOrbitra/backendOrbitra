import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/jwt.js";

/* CREATE ADMIN */
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });

    const exists = await Admin.findOne({ email });
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const admin = await Admin.create({ name, email, password: hashed });

    res.json({
      success: true,
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* LOGIN ADMIN */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });

    const admin = await Admin.findOne({ email });
    if (!admin)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const token = generateToken(admin);

    res.json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* UPDATE PASSWORD */
export const updatePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });

    admin.password = await bcrypt.hash(password, 10);
    await admin.save();

    res.json({ success: true, message: "Password updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
