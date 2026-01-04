import express from "express";
import { verifyAuth } from "../middleware/auth.js";
import {
  subscribeEmail,
  getAllSubscribers,
  deleteSubscriber,
} from "../controllers/subscriptionController.js";

const router = express.Router();

// PUBLIC
router.post("/subscribe", subscribeEmail);

// ADMIN
router.get("/", verifyAuth, getAllSubscribers);
router.delete("/:id", verifyAuth, deleteSubscriber);

export default router;
