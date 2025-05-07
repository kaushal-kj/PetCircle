const UserModel = require("../models/UserModel");
const userModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const mailUtil = require("../utils/MailUtil");

const multer = require("multer");
const cloudinaryUtil = require("../utils/CloudinaryUtil");
const ExpertModel = require("../models/ExpertModel");
//using jwt for forgot password
const jwt = require("jsonwebtoken");
const MessageModel = require("../models/MessageModel");
const secret = "secret";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Store uploaded files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "profilePic") {
    // Accept image files only for profilePic
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/webp"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error("Only JPEG/PNG/WEBP images are allowed for profile picture"),
        false
      );
    }
  } else if (file.fieldname === "expertiseCertificate") {
    // Accept only PDF for expertiseCertificate
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed for certificate"), false);
    }
  } else {
    cb(new Error("Invalid file field"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).fields([
  { name: "profilePic", maxCount: 1 },
  { name: "expertiseCertificate", maxCount: 1 },
]);

//signup
const signup = async (req, res) => {
  try {
    // console.log("Request Body:", req.body);
    const {
      fullName,
      username,
      email,
      password,
      role,
      expertise,
      phoneNumber,
    } = req.body;

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
      phoneNumber,
      password: hashedPassword,
      role: role || "petOwner",
    });

    //  If role is "expert", create an Expert Profile and link it
    if (role === "expert") {
      if (!expertise) {
        return res.status(400).json({ message: "expertise is required" });
      }

      const newExpert = new ExpertModel({
        user: newUser._id,
        expertise,
      });

      const savedExpert = await newExpert.save();
      newUser.expertProfile = savedExpert._id; // Link expert profile to user
    }

    const savedUser = await newUser.save();
    const mailContent = `<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Welcome to PetCircle</title>
  <style>
    body {
      font-family: "Arial", sans-serif;
      background-color: #f8f8f8;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      background-color: #ffffff;
      margin: 20px auto;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      font-size: 22px;
      font-weight: bold;
      text-align: center;
      color: #444;
      padding-bottom: 10px;
      border-bottom: 2px solid #eee;
    }
    .message {
      font-size: 16px;
      color: #555;
      line-height: 1.6;
      padding: 20px 0;
    }
    .highlight {
      font-weight: bold;
      color: #ff7f50;
    }
    .button {
      display: block;
      width: 180px;
      margin: 20px auto;
      padding: 12px;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      color: white;
      background-color: #ff7f50;
      border-radius: 5px;
      text-decoration: none;
    }
    .button:hover {
      background-color: #e66a42;
    }
    .footer {
      text-align: center;
      font-size: 14px;
      color: #777;
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>

  <div class="container">
    <div class="header">Welcome to PetCircle! 🐾</div>
    
    <div class="message">
      <p>Dear <span class="highlight">${username}</span>,</p>
      <p>We're excited to welcome you to <b>PetCircle</b>, a thriving community for pet lovers, owners, and experts.</p>
      <p>Here, you can:</p>
      <ul>
        <li>Connect with fellow pet owners and share experiences.</li>
        <li>Get expert advice on pet health, nutrition, and training.</li>
        <li>Adopt and rehome pets responsibly.</li>
        <li>Join communities tailored to your interests and pet needs.</li>
      </ul>
      <p>Our goal is to make pet parenting easier, more joyful, and more connected.</p>
      <p>We can’t wait to see you in action!</p>

      <a href="#" class="button">Get Started</a>
    </div>

    <div class="footer">
      <p>Best wishes,</p>
      <p><b>The PetCircle Team</b></p>
    </div>
  </div>

</body>
</html>
`;
    await mailUtil.sendingMail(
      savedUser.email,
      "welcome to petcircle",
      mailContent
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
    const user = await UserModel.findOne({ email }).populate("expertProfile");
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
      requiresCertificateUpload:
        user.role === "expert" && !user.expertProfile?.expertiseCertificate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ role: { $ne: "admin" } })
      .select("-password")
      .populate("pets")
      .populate(
        "expertProfile",
        "expertise bio expertiseCertificate isVerified consultations"
      ); // Exclude password field
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
      .populate("pets")
      .populate(
        "expertProfile",
        "expertise bio expertiseCertificate isVerified consultations"
      ); // Exclude password field
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
const updateProfile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err)
      return res.status(500).json({ message: "Multer Error: " + err.message });

    try {
      console.log("Request Body:", req.body);
      console.log("Uploaded Files:", req.files);

      const { fullName, bio, expertise } = req.body;
      const updateData = { fullName, bio, expertise };

      //  Upload Profile Picture
      if (req.files?.profilePic) {
        const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(
          req.files.profilePic[0]
        );
        updateData.profilePic = cloudinaryResponse.secure_url;
      }

      //  Upload Expertise Certificate (Only for Experts)
      let certificateUrl = "";
      if (req.files?.expertiseCertificate) {
        const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(
          req.files.expertiseCertificate[0],
          "raw"
        );
        certificateUrl = cloudinaryResponse.secure_url;
      }

      //  Ensure at least one field is updated
      if (
        !fullName &&
        !bio &&
        !expertise &&
        !req.files?.profilePic &&
        !req.files?.expertiseCertificate
      ) {
        return res
          .status(400)
          .json({ message: "At least one field must be updated" });
      }

      //  Update User Profile
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      ).populate("expertProfile");

      if (!updatedUser)
        return res.status(404).json({ message: "User not found" });

      //  Update Expert Profile (Only If User is an Expert)
      if (updatedUser.role === "expert" && certificateUrl) {
        const updatedExpert = await ExpertModel.findOneAndUpdate(
          { user: req.params.id },
          { expertiseCertificate: certificateUrl },
          { new: true }
        );

        if (!updatedExpert)
          return res.status(404).json({ message: "Expert profile not found" });

        // Add updated expert profile details to the response
        updatedUser.expertProfile = updatedExpert;
      }

      res
        .status(200)
        .json({ message: "Profile updated successfully", data: updatedUser });
    } catch (error) {
      console.error("Profile Update Error:", error);
      res.status(500).json({ message: "Error updating profile", error });
    }
  });
};

//forget password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
    const foundUser = await userModel.findOne({ email });
    if (!foundUser) {
      return res
        .status(404)
        .json({ message: "User not found, please register first." });
    }
    // Generate a token with user ID and email only (avoid sending the full user object)
    const token = jwt.sign(
      { _id: foundUser._id, email: foundUser.email },
      secret,
      { expiresIn: "1h" }
    );
    console.log(token);

    const url = `http://localhost:5173/resetpassword/${token}`;
    const mailContent = `<html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }
          .message {
            font-size: 16px;
            color: #555;
            margin-top: 10px;
          }
          .button {
            display: block;
            width: 200px;
            margin: 20px auto;
            padding: 10px;
            background-color: #007BFF;
            color: white;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 14px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">Password Reset Request</div>
          <p class="message">
            Hello ${foundUser.email},<br><br>
            We received a request to reset your password. Click the button below to set a new password:
          </p>
          <a href="${url}" class="button">Reset Password</a>
          <p class="message">
            If you did not request a password reset, please ignore this email. This link is valid for 1 hour.
          </p>
          <div class="footer">
            &copy; ${new Date().getFullYear()} PetCircle | All rights reserved.
          </div>
        </div>
      </body>
      </html>`;

    // Send email
    await mailUtil.sendingMail(foundUser.email, "Reset Password", mailContent);

    res.json({ message: "Reset password link sent to email." });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

//reset password
const resetpassword = async (req, res) => {
  try {
    const { token, password: newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and password are required." });
    }

    // Verify token
    const userFromToken = jwt.verify(token, secret);

    // Hash new password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    // Update user password in the database
    const updatedUser = await userModel.findByIdAndUpdate(
      userFromToken._id,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

//Follow a User
const followUser = async (req, res) => {
  try {
    const { userId, followId } = req.body;

    if (!userId || !followId) {
      return res
        .status(400)
        .json({ message: "User ID and Follow ID are required" });
    }

    const user = await UserModel.findById(userId);
    const followUser = await UserModel.findById(followId);

    if (!user || !followUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.following.includes(followId)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // Add follow relationship
    user.following.push(followId);
    followUser.followers.push(userId);

    await user.save();
    await followUser.save();

    res.json({ message: "User followed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error following user", error: error.message });
  }
};

//Unfollow a User
const unfollowUser = async (req, res) => {
  try {
    const { userId, unfollowId } = req.body;

    if (!userId || !unfollowId) {
      return res
        .status(400)
        .json({ message: "User ID and Unfollow ID are required" });
    }

    const user = await UserModel.findById(userId);
    const unfollowUser = await UserModel.findById(unfollowId);

    if (!user || !unfollowUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove follow relationship
    user.following = user.following.filter(
      (id) => id.toString() !== unfollowId
    );
    unfollowUser.followers = unfollowUser.followers.filter(
      (id) => id.toString() !== userId
    );

    await user.save();
    await unfollowUser.save();

    res.json({ message: "User unfollowed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error unfollowing user", error: error.message });
  }
};

//Get Followers List
const getFollowers = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).populate(
      "followers",
      "fullName profilePic role expertProfile"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ followers: user.followers });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching followers", error: error.message });
  }
};

//Get Following List
const getFollowing = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).populate(
      "following",
      "fullName profilePic role expertProfile"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ following: user.following });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching following", error: error.message });
  }
};

// Fetch users with last message and last seen
const getUsersWithChatMeta = async (req, res) => {
  try {
    const { currentUserId } = req.query;
    const users = await UserModel.find({ _id: { $ne: currentUserId } });

    const usersWithMeta = await Promise.all(
      users.map(async (user) => {
        const lastMsg = await MessageModel.findOne({
          $or: [
            { senderId: currentUserId, receiverId: user._id },
            { senderId: user._id, receiverId: currentUserId },
          ],
        })
          .sort({ createdAt: -1 })
          .lean();

        return {
          ...user.toObject(),
          lastMessage: lastMsg?.message || "",
          lastMessageTime: lastMsg?.createdAt || null,
          lastMessageSender: lastMsg?.senderId?.toString(), // add this line
          lastSeen: lastMsg?.seen, // or customize as needed
        };
      })
    );

    res.json({ success: true, data: usersWithMeta });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching users", err });
  }
};
module.exports = {
  signup,
  loginUser,
  getAllUsers,
  getUserById,
  updateProfile,
  forgotPassword,
  resetpassword,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getUsersWithChatMeta,
};
