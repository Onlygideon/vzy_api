import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import env from "../config/env.js";
import User from "../models/User.js";
import { isEmpty } from "../utils/helpers.js";
import logFunctions from "../utils/logger.js";

const signUp = async (req, res) => {
  try {
    const userDetails = req.body;

    const checkUser = await User.findOne({
      $or: [
        { email: String(userDetails.email).toLowerCase() },
        { username: userDetails.username },
      ],
    });
    if (checkUser) {
      return res.status(400).json({
        status: false,
        message: "User with details already exist",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userDetails.password, salt);
    userDetails.password = hashedPassword;

    const createUser = await User.create(userDetails);
    if (createUser) {
      return res.status(201).json({
        status: true,
        message: "User Created Successfully",
        data: createUser,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "User not created",
      });
    }
  } catch (err) {
    logFunctions.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({
        status: false,
        message: "User with details already exists",
      });
    }
    return res.status(500).json({
      status: false,
      message: `Internal server error occured`,
    });
  }
};

const login = async (req, res) => {
  try {
    const loginDetails = req.body;

    const checkUser = await User.findOne({
      email: String(loginDetails.email).toLowerCase(),
    });
    if (!checkUser) {
      return res.status(400).json({
        status: false,
        message: "Invalid email address",
      });
    }

    const compare = await bcrypt.compare(
      loginDetails.password,
      checkUser.password
    );
    if (compare) {
      const token = jwt.sign(
        {
          id: checkUser.id,
        },
        env().JWT_SECRET,
        { expiresIn: "1m" }
      );

      return res.status(200).json({
        status: true,
        message: "User logged in Successfully!",
        data: { user: checkUser, token },
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Invalid email or password",
      });
    }
  } catch (err) {
    logFunctions.error(err.message);
    return res.status(500).json({
      status: false,
      message: `Internal server error occured`,
    });
  }
};

const updateUser = async (req, res, user) => {
  try {
    const updateDetails = req.body;

    if (isEmpty(updateDetails)) {
      return res.status(400).json({
        status: false,
        message: "Update Details cannot be empty",
      });
    }

    const checkUser = await User.findById(user.id);
    if (!checkUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }

    const updateUser = await User.findByIdAndUpdate(
      user.id,
      {
        $set: updateDetails,
      },
      { new: true }
    );
    if (updateUser) {
      return res.status(201).json({
        status: true,
        message: "User Updated Successfully",
        data: updateUser,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "User not updated",
      });
    }
  } catch (err) {
    logFunctions.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({
        status: false,
        message: "User with details already exists",
      });
    }
    return res.status(500).json({
      status: false,
      message: `Internal server error occured`,
    });
  }
};

export { signUp, login, updateUser };
