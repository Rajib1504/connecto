import http from "http";
import app from "./src/app";
import { testConnection } from "./src/db";
import { Server } from 'socket.io'
import { initializeSocket } from "./src/socket";
import { setSocketServer } from "./src/socket/socket-instence";

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});
const PORT = process.env.PORT || 3000


const start = async () => {
  // db connection 
  await testConnection();
  //socket connection
  setSocketServer(io);
  initializeSocket(io);


  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

//catch error
start().catch(error => {
  console.error("fail to start server:", error)
  process.exit(1);
})