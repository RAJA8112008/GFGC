import jwt from "jsonwebtoken";

export const generateToken = (id) => {
  const jwtSecret = process.env.JWT_SECRET || "gfghub_secret";

  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};