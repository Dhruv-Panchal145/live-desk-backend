import { Server } from "socket.io";
import Message from "../models/Message.js";

export const connectToSocket = async (server) => {
  const io = new Server(server, {
     cors:{
          origin:"*",
          methods: ["GET","POST"],
          allowedHeaders: ["*"],
          credentials: true
     }
  });

  io.on('connection', async (socket) => {
    const lastReceivedAt = socket.handshake.auth.serverOffset
      ? new Date(socket.handshake.auth.serverOffset)
      : null;
 
    if (lastReceivedAt) {
      const missedMessages = await Message.find({
        createdAt: { $gt: lastReceivedAt }
      }).sort({ createdAt: 1 });

      missedMessages.forEach((msg) => {
        socket.emit('chat message', msg.content, msg.createdAt.toISOString());
      });
    }

    socket.on('chat message', async (msg, clientOffset, callback) => {
      try {
        const newMsg = await Message.create({ content: msg, clientOffset });
        io.emit('chat message', newMsg.content, newMsg.createdAt.toISOString());
        callback();
      } catch (e) {
        if (e.code === 11000) {
          callback();
        }
      }
    });
  });

  return io;
};