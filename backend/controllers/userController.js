//Handle asynchronous request instead of try catch block. this will wrap around each controller function and handle any errors.
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs"
import User from "./../models/userModel.js"
import generateToken from "../utils/generateToken.js";

// @desc    Auth user (login) & get token 
// @route   POST /api/users/auth
// @access  Public

const authUser = asyncHandler(async (req, res, next) => {
  const {
    email,
    password
  } = req.body;

  //Check if the user is has account with this email
  const user = await User.findOne({
    email
  });

  if (user && (await user.matchPassword(password))) {
    //If authenticate user generate a token
    generateToken(res, user._id);
    //Return a response to the client
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
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
  const userExists = await User.findOne({
    email
  });

  //If the user is already registered
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  //Create the user 
  const user = await User.create({
    name,
    email,
    password,
  });

  //IF the user data created successfully
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }

});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  //Destroy the http cookie
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    message: 'Logged out successfully'
  });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  //get the user profile by checking user id
  const user = await User.findById(req.user._id);
  //If the user is valid, update the user profile
  if (user) {
    //if user want to update name or email
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile
};