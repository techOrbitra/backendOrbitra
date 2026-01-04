import jwt from "jsonwebtoken";

export const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      name: admin.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};
