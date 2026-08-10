import { Server } from "socket.io";
import Message from "../models/Message.js";

export const connectToSocket = async (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true
    }
  });

  const connections = {};  // room -> [socketIds]

  io.on('connection', async (socket) => {

    //WebRTC - Room join
    socket.on('join-call', (path) => {
      if (connections[path] === undefined) {
        connections[path] = [];
      }
      connections[path].push(socket.id);

      
      connections[path].forEach(id => {
        io.to(id).emit('user-joined', socket.id, connections[path]);
      });
    });

    //WebRTC - Signal (SDP/ICE)
    socket.on('signal', (toId, message) => {
      io.to(toId).emit('signal', socket.id, message);
    });

    // Chat message
    socket.on('chat-message', (data, sender) => {
      connections[Object.keys(connections).find(key => 
        connections[key].includes(socket.id)
      )]?.forEach(id => {
        io.to(id).emit('chat-message', data, sender, socket.id);
      });
    });

    //Disconnect
    socket.on('disconnect', () => {
      Object.keys(connections).forEach(path => {
        connections[path] = connections[path].filter(id => id !== socket.id);
        connections[path].forEach(id => {
          io.to(id).emit('user-left', socket.id);
        });
      });
    });

  });

  return io;
};