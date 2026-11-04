
import type { Server } from "socket.io";
import { verifyToken } from "../utils/jwt.js";

export const initializeSocket = (io: Server) => {
  // 1. Authenticate socket connection
  io.use((socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;


      if (!cookieHeader) {
        return next(new Error("Authentication required"));
      }

      const token = cookieHeader
        .split(";")
        .map((item) => item.trim())
        .find((item) => item.startsWith("token="))
        ?.slice("token=".length);


      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = verifyToken(token);

      socket.data.userId = decoded.userId;

      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  // 2. Handle authenticated connection
  io.on("connection", (socket) => {
    const userId = socket.data.userId;

    // Join personal room
    socket.join(`user:${userId}`);

    console.log(`User ${userId} connected:`, socket.id);

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);
    });
  });
 
};
