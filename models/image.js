import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    imageUrl: { type: String },
    prediction: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Image", ImageSchema);
