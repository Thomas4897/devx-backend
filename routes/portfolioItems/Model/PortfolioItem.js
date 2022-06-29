const mongoose = require("mongoose");

const portfolioItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    userId: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String, required: true },
    title: { type: String, required: true },
    rating: { type: String, required: true },
    description: { type: String, required: true },
    author: {
      authorName: { type: String, required: true },
      authorImage: { type: String, required: true, default: () => "none"},
    }


  },
  { timestamps: true }
);

module.exports = mongoose.model("portfolioItem", portfolioItemSchema);