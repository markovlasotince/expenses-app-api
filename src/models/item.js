const mongoose = require("mongoose");
// const validator = require("validator");

const itemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      trim: true,
      required: true
    },
    price: {
      type: Number,
      required: true,
      default: 0
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    hashtag: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    }
  },
  {
    timestamps: true
  }
);

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
