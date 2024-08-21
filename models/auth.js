import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: String },
  age: { type: Number },
  dob: { type: Date },
  liveIn: { type: String },
  joinedOn: { type: Date, default: Date.now },
  profileURL: { type: String}, 
});

export default mongoose.model("User", userSchema);
