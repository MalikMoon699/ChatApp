import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  customId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile_img: { type: String },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
