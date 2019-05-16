const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    author: {
      type: String,
      required: true,
    },
    message: {
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
    date: {
      type: Date,
      default: Date.now,
      index: {
        unique: true
      }
    },
  });

  const Message = mongoose.model("Message", messageSchema);

  module.exports = Message;