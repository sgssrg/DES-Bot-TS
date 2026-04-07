import { getLogger } from "../lib/pino.log.js";
import type { Message } from "discord.js";
const logger = getLogger(import.meta);
const fetchReferencedMessage = async (message: Message) => {
  try {
    if (message?.reference?.messageId) {
      const refMessage: Message = await message.channel.messages.fetch(
        message.reference.messageId,
      );
      if (refMessage?.content) {
        const safeContent = refMessage.content?.toString() ?? "<no content>";
        logger.trace(
          `Referenced message content: ${JSON.stringify(safeContent)}`,
        );
      } else {
        logger.warn("Referenced message has no text content");
      }
      return refMessage;
    }
  } catch (error) {
    logger.error("Error" + JSON.stringify(error));
  }
};
export default fetchReferencedMessage;
