import Blog from "../models/Blog.js";
import cloudinary from "../config/cloudinary.js";

/* -------------------------------
   Cloudinary upload helper
-------------------------------- */
const uploadToCloudinary = async (file, folder = "blog_images") => {
  const b64 = Buffer.from(file.buffer).toString("base64");
  const dataURI = `data:${file.mimetype};base64,${b64}`;

  return await cloudinary.uploader.upload(dataURI, { folder });
};

/* -------------------------------
   Extract Cloudinary public_id
-------------------------------- */
const extractPublicId = (imageUrl) => {
  let part = imageUrl.split("/upload/")[1];
  part = part.substring(0, part.lastIndexOf("."));
  const segments = part.split("/");
  if (segments[0].startsWith("v")) segments.shift();
  return segments.join("/");
};

/* ----------------------------------------------------
   CREATE BLOG  (form-data)
----------------------------------------------------- */
export const createBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    let imageUrl = null;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    // Upload image if exists
    if (req.file) {
      const upload = await uploadToCloudinary(req.file);
      imageUrl = upload.secure_url;
    }

    const blog = await Blog.create({
      title,
      content,
      category: category || "",
      imageUrl,
    });

    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ----------------------------------------------------
   GET ALL BLOGS
----------------------------------------------------- */
export const getBlogs = async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json({ success: true, blogs });
};

/* ----------------------------------------------------
   GET BLOG BY ID
----------------------------------------------------- */
export const getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog)
    return res.status(404).json({ success: false, message: "Blog not found" });

  res.json({ success: true, blog });
};

/* ----------------------------------------------------
   DELETE BLOG
----------------------------------------------------- */
export const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog)
    return res.status(404).json({ success: false, message: "Not found" });

  // delete cloudinary image
  if (blog.imageUrl) {
    const publicId = extractPublicId(blog.imageUrl);
    await cloudinary.uploader.destroy(publicId);
  }

  await Blog.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: "Blog & image deleted" });
};

/* ----------------------------------------------------
   UPDATE BLOG (form-data)
----------------------------------------------------- */

export const updateBlog = async (req, res) => {
  try {
    const id = req.params.id;

    const { title, content, category } = req.body;

    let updatedData = {
      title,
      content,
      category: category || "",
    };

    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    // If new image uploaded → delete old + upload new
    if (req.file) {
      if (blog.imageUrl) {
        const publicId = extractPublicId(blog.imageUrl);
        await cloudinary.uploader.destroy(publicId);
      }

      const upload = await uploadToCloudinary(req.file);
      updatedData.imageUrl = upload.secure_url;
    }

    const blog = await Blog.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/* ----------------------------------------------------
   BULK CREATE BLOGS  (Multiple blogs + images)
----------------------------------------------------- */

export const createMultipleBlogs = async (req, res) => {
  try {
    const blogsJson = req.body.blogs;

    if (!blogsJson) {
      return res.status(400).json({
        success: false,
        message: "Blogs array missing",
      });
    }

    let blogs = [];

    // Parse JSON array from form-data
    try {
      blogs = JSON.parse(blogsJson);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid blogs JSON",
      });
    }

    if (!Array.isArray(blogs) || blogs.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Blogs must be a non-empty array",
      });
    }

    const savedBlogs = [];

    // Map uploaded images (image0, image1, image2…)
    const filesMap = {};
    req.files.forEach((file) => {
      filesMap[file.fieldname] = file;
    });

    // Loop through blogs
    for (let i = 0; i < blogs.length; i++) {
      const { title, content } = blogs[i];

      if (!title || !content) continue;

      let imageUrl = null;

      const imageFile = filesMap[`image${i}`];

      // Upload image if exists
      if (imageFile) {
        const upload = await uploadToCloudinary(imageFile);
        imageUrl = upload.secure_url;
      }

      const blog = await Blog.create({
        title,
        content,
        imageUrl,
      });

      savedBlogs.push(blog);
    }

    res.json({
      success: true,
      message: "Bulk blogs created successfully",
      blogs: savedBlogs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
