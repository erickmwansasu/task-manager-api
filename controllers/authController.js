const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleUserRegistration = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "User with this email address exist!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email: email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error has occured!",
    });
  }
};

const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account with this email!",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password!",
      });
    }

    const accessToken = jwt.sign(
      {
        userInfo: {
          email: email,
          roles: user.roles,
          fullName: user.fullName,
          department: user.department,
          phone: user.phone,
          id: user._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" },
    );

    const refreshToken = jwt.sign(
      { email: email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        email: user.email,
        roles: user.roles,
        fullName: user.fullName,
        department: user.department,
        id: user._id
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    const user = await User.findOne({ refreshToken });

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    try {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: "Refresh token expired, please log in again",
      });
    }

    const newAccessToken = jwt.sign(
      {
        userInfo: {
          email: user.email,
          roles: user.roles,
          fullName: user.fullName,
          id: user._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" },
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Access token refreshed",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const handleUserLogout = async (req, res) => {
  try {
    let refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    const user = await User.findOne({ refreshToken });

    if (user) {
      user.refreshToken = "";
      await user.save();
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  handleUserRegistration,
  handleUserLogin,
  refreshToken,
  handleUserLogout,
};
