import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  content: String,
    clientOffset: { type: String, unique: true }, 
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Message", messageSchema);