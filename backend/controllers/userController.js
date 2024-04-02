// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public

//Handle asynchronous request instead of try catch block. this will wrap around each controller function and handle any errors.
import asyncHandler from "express-async-handler";

const authUser = asyncHandler((req, res) => {
  res.json({ message: "Success" });
});

export { authUser };
