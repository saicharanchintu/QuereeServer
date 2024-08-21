import mongoose from "mongoose";
import User from "../models/auth.js";

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    const allUserDetails = [];
    allUsers.forEach((user) => {
      allUserDetails.push({
        _id: user._id,
        name: user.name,
        gender: user.gender,
        age: user.age,
        dob: user.dob,
        liveIn: user.liveIn,
        joinedOn: user.joinedOn,
        friends: user.friends,
        profileURL: user.profileURL,
      });
    });
    res.status(200).json(allUserDetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addDisplayPicture = async (req, res) => {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).send("Invalid user ID");
  }

  try {
    // Assuming req.body.profilePicture contains the URL or data for the new profile picture
    const newProfilePicture = req.body.profilePicture;

    if (!newProfilePicture) {
      return res.status(400).send("No profile picture data provided");
    }

    // Update the user's profileURL in the database
    await User.findByIdAndUpdate(userId, {
      $set: { profileURL: newProfilePicture },
    });

    res.status(200).send("Profile picture updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};


export const updateProfile = async (req, res) => {
  const userId = req.params.id;
  const { name, gender, age, dob, liveIn, profilePicture } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).send("Invalid user ID");
  }

  try {
    // Update profile information
    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      { $set: { name, gender, age, dob, liveIn } },
      { new: true }
    );

    // Handle profile picture update
    if (profilePicture) {
      // Assuming profilePicture contains the URL or data for the new profile picture
      await User.findByIdAndUpdate(userId, {
        $set: { profileURL: profilePicture },
      });
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
