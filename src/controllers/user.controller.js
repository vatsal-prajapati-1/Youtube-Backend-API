import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  const { email, fullName, password, username } = req.body;
  console.log("email", email);
  res.status(200).json({
    message: "hey from the server!",
  });
});

export default registerUser;
