import http from "node:http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { initSocket } from "./sockets/index.js";

await connectDB();
const httpServer = http.createServer(app);
initSocket(httpServer);
httpServer.listen(env.port, () => {
  console.log(`NexTalk server listening on port ${env.port}`);
});
