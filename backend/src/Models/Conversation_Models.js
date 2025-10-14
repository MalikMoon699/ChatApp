import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "message",
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
