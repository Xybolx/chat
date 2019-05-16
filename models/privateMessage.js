const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const privateMessageSchema = new Schema({
    author: {
      type: String,
      required: true,
    },
    privateMessage: {
      type: String,
      required: true
    },
    userAvatar: {
      type: String,
      required: true
    },
    userColor: {
      type: String,
      required: true
    },
    receiver: {
        type: String,
        required: true
    },
    date: {
      type: Date,
      default: Date.now,
      index: {
        unique: true
      }
    },
  });

  const PrivateMessage = mongoose.model("PrivateMessage", privateMessageSchema);

  module.exports = PrivateMessage;