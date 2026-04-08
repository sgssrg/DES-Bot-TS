import express from "express";
import type { Request, Response } from "express";
const app = express();
app.use(express.json());

import { getLogger } from "./pino.log.js";
const logger = getLogger(import.meta);

// Function to update bot ready status
let botReady: boolean = false;
function setBotReady(status: boolean) {
  botReady = status;
}

const PORT = process.env.PORT || 3000;
app.get("/", (req: Request, res: Response) => {
  res.send({
    message: `DES-1405 Bot is ${botReady ? "ready" : "not ready"} and ${!botReady ? "not" : "is"} running!`,
    isRunning: botReady,
  });
});
app.listen(Number(PORT), "0.0.0.0", () => {
  logger.info(
    `Discord Bot (DES-1405) server running on http://${process.env.HOST || "localhost"}:${PORT}`,
  );
});

export { setBotReady };
