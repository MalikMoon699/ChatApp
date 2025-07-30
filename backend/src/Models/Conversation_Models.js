// Conversation_Models.js
import mongoose from "mongoose";
import User from "./Users_Models.js";
import Message from "./Message_Models.js";

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Message,
        default: [],
      },
    ],
    lastMessageTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Conversation =
  mongoose.models.conversation ||
  mongoose.model("conversation", conversationSchema);
export default Conversation;
