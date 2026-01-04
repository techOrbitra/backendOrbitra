import express from "express";
import multer from "multer";
import { verifyAuth } from "../middleware/auth.js";
import {
  createBlog,
  getBlogs,
  getBlogById,
  deleteBlog,
  updateBlog,
  createMultipleBlogs,
} from "../controllers/blogController.js";

const router = express.Router();


// ✅ Serverless-safe multer
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 5MB
});


// CREATE BLOG
router.post("/create", verifyAuth, upload.single("image"), createBlog);

// BULK CREATE BLOGS
router.post("/bulk-create", verifyAuth, upload.any(), createMultipleBlogs);

// GET ALL
router.get("/getall", getBlogs);

// GET BY ID
router.get("/getbyid/:id", getBlogById);

// DELETE
router.delete("/delete/:id", verifyAuth, deleteBlog);

// UPDATE BLOG (form-data)
router.put("/update/:id", verifyAuth, upload.single("image"), updateBlog);

export default router;
