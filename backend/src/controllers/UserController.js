const UserModel = require("../models/UserModel");
const userModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const mailUtil = require("../utils/MailUtil");

const multer = require("multer");
const cloudinaryUtil = require("../utils/CloudinaryUtil");

const upload = multer({ storage: multer.memoryStorage() }).single("profilePic");

const signup = async (req, res) => {
  try {
    // console.log("Request Body:", req.body);
    const { fullName, username, email, password, role } = req.body;

    // Check if fullName is provided
    if (!fullName) {
      return res.status(400).json({ message: "Full name is required" });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create new user
    const newUser = new UserModel({
      fullName,
      username,
      email,
      password: hashedPassword,
      role: role || "petOwner",
    });

    const savedUser = await newUser.save();
    await mailUtil.sendingMail(
      savedUser.email,
      "welcome to petcircle",
      "this is welcome mail"
    );
    res.status(201).json({
      message: "User created successfully",
      data: savedUser,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate key error: Full name or email already exists",
      });
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Return user data (without password)
    const userData = { ...user._doc };
    delete userData.password;

    res.status(200).json({
      message: "Login successful",
      data: userData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password").populate("pets"); // Exclude password field
    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

//get user by id
const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
      .select("-password")
      .populate("pets"); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

//update profile pic
// const updateProfile = async (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) return res.status(500).json({ message: err.message });

//     try {
//       const { fullName, bio } = req.body;
//       const updateData = { fullName, bio };

//       // If an image is uploaded, upload it to Cloudinary
//       if (req.file) {
//         const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(
//           req.file
//         );
//         updateData.profilePic = cloudinaryResponse.secure_url;
//       }

//       const updatedUser = await UserModel.findByIdAndUpdate(
//         req.params.id,
//         updateData,
//         { new: true }
//       );
//       if (!updatedUser)
//         return res.status(404).json({ message: "User not found" });

//       res
//         .status(200)
//         .json({ message: "Profile updated successfully", data: updatedUser });
//     } catch (error) {
//       res.status(500).json({ message: "Error updating profile", error });
//     }
//   });
// };

const updateProfile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err)
      return res.status(500).json({ message: "Multer Error: " + err.message });

    try {
      console.log("Request Body:", req.body);
      console.log("Uploaded File:", req.file); // Check if file is received

      const { fullName, bio } = req.body;
      const updateData = { fullName, bio };

      // ✅ Upload image to Cloudinary only if a file is present
      if (req.file) {
        const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(
          req.file.buffer
        );
        updateData.profilePic = cloudinaryResponse.secure_url;
      } else {
        console.log(" No file uploaded");
      }

      // ✅ Ensure at least one field is updated
      if (!fullName && !bio && !req.file) {
        return res
          .status(400)
          .json({ message: "At least one field must be updated" });
      }

      // ✅ Update user in database
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
      if (!updatedUser)
        return res.status(404).json({ message: "User not found" });

      res
        .status(200)
        .json({ message: "Profile updated successfully", data: updatedUser });
    } catch (error) {
      console.error("Profile Update Error:", error);
      res.status(500).json({ message: "Error updating profile", error });
    }
  });
};
module.exports = {
  signup,
  loginUser,
  getAllUsers,
  getUserById,
  updateProfile,
};
