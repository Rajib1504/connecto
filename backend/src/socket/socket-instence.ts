import type { Server } from "socket.io";

let io: Server;

export const setSocketServer = (socketServer: Server) => {
  io = socketServer;
};

export const getSocketServer = () => {
  return io;
};