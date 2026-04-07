import fetchReferencedMessage from "../../utils/fetchReferencedMessage.js";
import { getLogger } from "../../lib/pino.log.js";

const logger = getLogger(import.meta);
import axios from "axios";
import { Message } from "discord.js";

import { LibreT } from "../../lib/axios.js";

const LibreTranslate = async (message: Message, mode: number) => {
  // logs the message ID of the referenced message, if it exists
  logger.info(message?.reference?.messageId);

  // validating for command !trans for the translation function to be triggered
  logger.trace(message.content.split(" ")[0]);

  switch (mode) {
    case 0:
      try {
        logger.info("Case 0 is Triggered");
        let detectOriginalReply = await fetchReferencedMessage(message);
        if (detectOriginalReply) {
          let safeContent =
            detectOriginalReply.content?.trim().replaceAll(/^"|"$/g, "") ?? "";
          logger.trace(`Cleaned content: ${safeContent}`);
          const detectedLang = await LibreT.post("/detect", {
            q: detectOriginalReply.content,
          });
          logger.trace(detectedLang.data);
          const langJSON = await LibreT.get("/languages");
          const langList = langJSON.data;
          const matchedLang = langList.find(
            (lang: any) => lang.code === detectedLang.data[0].language,
          );

          detectOriginalReply.reply(
            `${matchedLang.name} (${detectedLang.data[0].language}) with confidence ${detectedLang.data[0].confidence}`,
          );
        }
      } catch (err) {
        logger.info("Case 0 is Failed");
        logger.error("Error in fetching referenced message content:" + err);
        message.reply(
          `Sorry, I couldn't fetch the original message for language detection.
            ${err}`,
        );
      }
      break;

    case 1:
      // referencing to the original text
      logger.info("Case 1 is Triggered");
      try {
        let targetLang = "en"; // default target language is English
        if (message.content.split(" ").length === 2) {
          let langParams = message.content.split(" ")[1];
          targetLang = langParams;
        }

        let toTranslateMessage = await fetchReferencedMessage(message);
        if (toTranslateMessage) {
          let safeContent =
            toTranslateMessage.content?.trim().replace(/^"|"$/g, "") ?? "";
          logger.trace(`Cleaned content: ${safeContent}`);
          const translatedText = await LibreT.post("/translate", {
            q: safeContent,
            source: "auto",
            target: targetLang,
            format: "text",
          });

          toTranslateMessage.reply(
            `${toTranslateMessage.author}: "${translatedText.data.translatedText}"`,
          );
        }
      } catch (err) {
        logger.error("Case 1 is Failed");
        logger.error("Error in fetching referenced message content:" + err);
        message.reply(
          `Sorry, I couldn't fetch the original message for translation.,
          Reason: ${err}`,
        );
      }
      break;
  }
};
export default LibreTranslate;
