import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    about: { type: String },
    tags: { type: [String] },
    joinedOn: { type: Date, default: Date.now },
    friends: { type: [String], default: [] },
    gender:{type: String},
    profileURL: { type: String }, // Update from profileUrl to profileURL
});

export default mongoose.model("User", userSchema);
