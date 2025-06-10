import jwt from "jsonwebtoken";

const generateAccessToken = async (user) => {
  const token = jwt.sign({ username: user.username }, "abcd", {
    expiresIn: "15m",
  });
  return token;
};
const generateRefreshToken = async (user) => {
  const token = jwt.sign({ username: user.username }, "cdef", {
    expiresIn: "7d",
  });
  return token;
};

// const verifyAccessToken = (token) => {
//   return jwt.verify(token, process.env.JWT_SECRET);
// };

export { generateAccessToken, generateRefreshToken };
