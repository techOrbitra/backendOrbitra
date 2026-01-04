import express from "express";
import {
  createAdmin,
  loginAdmin,
  updatePassword,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/create", createAdmin);
router.post("/login", loginAdmin);
router.put("/update-password", updatePassword);

export default router;
