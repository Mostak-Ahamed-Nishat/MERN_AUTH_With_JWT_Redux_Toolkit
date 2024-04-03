//Handle asynchronous request instead of try catch block. this will wrap around each controller function and handle any errors.
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs"
import User from "./../models/userModel.js"
import generateToken from "../utils/generateToken.js";




// @desc    Auth user (login) & get token 
// @route   POST /api/users/auth
// @access  Public

const authUser = asyncHandler((req, res) => {
  const {
    email,
    password
  } = req.body;
});


// @desc    Register a new user
// @route   POST /api/users
// @access  Public

const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password
  } = req.body;




  // Check if the user is already registered with the email address
  const isUserExist = await User.findOne({
    email
  });

  // If the user is already registered with the email address, send an error message
  if (isUserExist) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Encrypt password using bcrypt
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashPassword = await bcrypt.hash(password, salt);

  // Create a new user account
  const user = await User.create({
    name,
    email,
    password: hashPassword
  });

  //IF the user created successfully
  if (user) {
    //Generate JWT token
    generateToken(res, user._id)
    //Send the success message to the client
    res.status(201).json({
      message: "Registration successful",
      user
    });
  } else {
    res.status(400);
    throw new Error('Registration failed');
  }

});



// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.send('logout user');
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  res.send('get profile');
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  res.send('update profile');
});


export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile
};