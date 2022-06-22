const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    favorites: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);