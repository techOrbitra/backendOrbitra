import express from "express";
import { verifyAuth } from "../middleware/auth.js";
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} from "../controllers/contactController.js";

const router = express.Router();

/* PUBLIC */
router.post("/", createContact);

/* ADMIN */
router.get("/", verifyAuth, getAllContacts);
router.get("/:id", verifyAuth, getContactById);
router.put("/:id", verifyAuth, updateContact);
router.delete("/:id", verifyAuth, deleteContact);

export default router;
