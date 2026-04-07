import express from "express";
import type { Request, Response } from "express";
import { getLogger } from "./pino.log.js";
let botReady = false;
const app = express();
app.use(express.json());

const logger = getLogger(import.meta);

// Function to update bot ready status
function setBotReady(status: boolean) {
  botReady = status;
}

const PORT = process.env.PORT || 3000;
app.get("/", (req: Request, res: Response) => {
  res.send(
    `DES-1405 Bot is ${botReady ? "ready" : "not ready"} and ${!botReady ? "not" : "is"} running!`,
  );
});
app.listen(Number(PORT), "0.0.0.0", () => {
  logger.info(
    `Discord Bot (DES-1405) server running on http://${process.env.HOST || "localhost"}:${PORT}`,
  );
});

export { setBotReady };
