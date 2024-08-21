import express from "express";
import auth from "../middleware/auth.js";
import { upload } from "../middleware/image.js";
import Image from "../models/image.js";

const router = express.Router();

import { uploadImage } from "../controllers/image.js";

router.post("/upload", auth, upload.single("image"), uploadImage);

router.get("/:userId/predictions", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("userId:", userId); // Add this line to check if userId is correct
    const image = await Image.findOne({ userId });
    console.log("image:", image); // Add this line to check if image is found
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.status(200).json({ prediction: image.prediction });
  } catch (error) {
    console.error("Error fetching prediction:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
