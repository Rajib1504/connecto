import http from "http";
import app from "./src/app";
import { testConnection } from "./src/db";

const server = http.createServer(app);
const PORT = process.env.PORT || 3000


const start = async () => {
  // db connection 
  await testConnection();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

//catch error
start().catch(error => {
  console.error("fail to start server:", error)
  process.exit(1);
})